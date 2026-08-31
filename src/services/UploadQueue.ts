import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mutex } from 'async-mutex';

const QUEUE_KEY = 'upload_queue';

// A job is given up on after this many failed attempts, so one the server will
// never accept cannot sit in the queue — and keep taking the uplink — forever.
export const MAX_UPLOAD_ATTEMPTS = 5;

export interface UploadJob {
  id: string;
  fileUri: string;
  uploadUrl: string;
  attachTo: string[];
  createdAt: string;
  attempts?: number;
}

function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

/**
 * Every mutation below is a read-modify-write of a single AsyncStorage key,
 * and the queue is touched from three places — app start, each task
 * completion, and the OS background task. Interleaving them dropped jobs, so
 * they are serialized.
 */
const mutex = new Mutex();

async function read(): Promise<UploadJob[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function write(jobs: UploadJob[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(jobs));
}

async function getPending(): Promise<UploadJob[]> {
  return read();
}

async function enqueue(
  jobs: Omit<UploadJob, 'id' | 'createdAt'>[],
): Promise<void> {
  await mutex.runExclusive(async () => {
    const existing = await read();
    const newJobs: UploadJob[] = jobs.map(job => ({
      ...job,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));

    await write([...existing, ...newJobs]);
  });
}

async function markDone(id: string): Promise<void> {
  await mutex.runExclusive(async () => {
    const existing = await read();
    await write(existing.filter(job => job.id !== id));
  });
}

/**
 * Records a failed attempt on a job that is worth retrying.
 *
 * @returns `true` when the job has run out of attempts and was dropped,
 *          `false` when it stays queued for a later retry.
 */
async function recordFailedAttempt(id: string): Promise<boolean> {
  return mutex.runExclusive(async () => {
    const existing = await read();
    const job = existing.find(j => j.id === id);

    if (!job) {
      return true;
    }

    const attempts = (job.attempts ?? 0) + 1;

    if (attempts >= MAX_UPLOAD_ATTEMPTS) {
      await write(existing.filter(j => j.id !== id));
      return true;
    }

    await write(
      existing.map(j => (j.id === id ? { ...j, attempts } : j)),
    );

    return false;
  });
}

export default { enqueue, getPending, markDone, recordFailedAttempt };
