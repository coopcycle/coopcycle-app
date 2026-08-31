import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { processUploadQueue } from '../taskActions';
import reducers from '../../reducers';
import { httpClientService } from '../../../services/httpClientService';
import UploadQueue from '../../../services/UploadQueue';

jest.useFakeTimers({ legacyFakeTimers: true });

const QUEUE_KEY = 'upload_queue';

const makeClient = () => ({
  put: jest.fn(),
  getToken: () => '123456',
  getBaseURL: () => 'https://test.coopcycle.org',
  uploadFileAsync: jest.fn(),
});

const makeStore = () => configureStore({ reducer: reducers });

const pendingJobs = async () =>
  JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');

describe('Redux | Tasks | Upload queue', () => {
  let alertSpy;

  beforeEach(async () => {
    await AsyncStorage.removeItem(QUEUE_KEY);
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('a failure the connection is to blame for keeps the job queued', async () => {
    const client = makeClient();
    // No response at all: offline, or the request timed out
    client.uploadFileAsync.mockResolvedValue(undefined);
    httpClientService.setTestClient(client);

    await UploadQueue.enqueue([
      { fileUri: 'file:///a.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
    ]);

    await makeStore().dispatch(processUploadQueue());

    const jobs = await pendingJobs();
    expect(jobs).toHaveLength(1);
    expect(jobs[0].attempts).toBe(1);
    // The photo is not lost, and the courier is not told anything went wrong:
    // the background task will try again.
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('a file the server refuses is dropped and reported', async () => {
    const client = makeClient();
    client.uploadFileAsync.mockResolvedValue({ status: 413 });
    httpClientService.setTestClient(client);

    await UploadQueue.enqueue([
      { fileUri: 'file:///a.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
    ]);

    await makeStore().dispatch(processUploadQueue());

    expect(await pendingJobs()).toHaveLength(0);
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  test('a job is given up on after repeated failures', async () => {
    const client = makeClient();
    client.uploadFileAsync.mockResolvedValue({ status: 503 });
    httpClientService.setTestClient(client);

    await UploadQueue.enqueue([
      { fileUri: 'file:///a.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
    ]);

    const store = makeStore();
    for (let i = 0; i < 5; i++) {
      await store.dispatch(processUploadQueue());
    }

    expect(await pendingJobs()).toHaveLength(0);
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  test('a failing connection stops the drain instead of working through the queue', async () => {
    const client = makeClient();
    client.uploadFileAsync.mockResolvedValue(undefined);
    httpClientService.setTestClient(client);

    await UploadQueue.enqueue([
      { fileUri: 'file:///a.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
      { fileUri: 'file:///b.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
      { fileUri: 'file:///c.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
    ]);

    await makeStore().dispatch(processUploadQueue());

    expect(client.uploadFileAsync).toHaveBeenCalledTimes(1);
    expect(await pendingJobs()).toHaveLength(3);
  });

  test('overlapping drains upload each file once', async () => {
    const client = makeClient();
    let resolveUpload;
    client.uploadFileAsync.mockReturnValue(
      new Promise(resolve => {
        resolveUpload = resolve;
      }),
    );
    httpClientService.setTestClient(client);

    await UploadQueue.enqueue([
      { fileUri: 'file:///a.jpg', uploadUrl: '/api/task_images', attachTo: ['/api/tasks/1'] },
    ]);

    const store = makeStore();
    // App start, a completion and the background task can all ask at once
    const first = store.dispatch(processUploadQueue());
    const second = store.dispatch(processUploadQueue());
    const third = store.dispatch(processUploadQueue());

    resolveUpload({ status: 200 });
    await Promise.all([first, second, third]);

    expect(client.uploadFileAsync).toHaveBeenCalledTimes(1);
    expect(await pendingJobs()).toHaveLength(0);
  });
});
