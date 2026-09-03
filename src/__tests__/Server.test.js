import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Server from '../Server';

jest.mock('axios');

const STORAGE_KEY = '@CoopCycle.servers';
const CITIES = [{ city: 'Paris', coopcycle_url: 'https://paris.example.org' }];
const REMOTE_CITIES = [
  { city: 'Lyon', coopcycle_url: 'https://lyon.example.org' },
];

describe('Server.loadAll', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('fetches & caches the list when nothing is cached', async () => {
    axios.get.mockResolvedValue({ data: REMOTE_CITIES });

    expect(await Server.loadAll()).toEqual(REMOTE_CITIES);
    expect(axios.get).toHaveBeenCalledTimes(1);

    const cached = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    expect(cached.data).toEqual(REMOTE_CITIES);
    expect(typeof cached.fetchedAt).toBe('number');
  });

  it('busts the platform HTTP cache once a day', async () => {
    axios.get.mockResolvedValue({ data: REMOTE_CITIES });

    await Server.loadAll();

    expect(axios.get).toHaveBeenCalledWith(
      'https://coopcycle.org/coopcycle.json',
      expect.objectContaining({
        params: { d: new Date().toISOString().slice(0, 10) },
      }),
    );
  });

  it('does not hit the network when the cache is fresh', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: CITIES, fetchedAt: Date.now() }),
    );

    expect(await Server.loadAll()).toEqual(CITIES);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('refreshes the list when the cache has expired', async () => {
    axios.get.mockResolvedValue({ data: REMOTE_CITIES });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data: CITIES,
        fetchedAt: Date.now() - 25 * 60 * 60 * 1000,
      }),
    );

    expect(await Server.loadAll()).toEqual(REMOTE_CITIES);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('refreshes data stored in the legacy format', async () => {
    axios.get.mockResolvedValue({ data: REMOTE_CITIES });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(CITIES));

    expect(await Server.loadAll()).toEqual(REMOTE_CITIES);
  });

  it('falls back on the cached data when the server is unreachable', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: CITIES, fetchedAt: Date.now() - 25 * 60 * 60 * 1000 }),
    );

    expect(await Server.loadAll()).toEqual(CITIES);
    // The cache must not be overwritten with an empty list
    expect(JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)).data).toEqual(
      CITIES,
    );
  });

  it('falls back on the cached data when the server returns garbage', async () => {
    axios.get.mockResolvedValue({ data: {} });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(CITIES));

    expect(await Server.loadAll()).toEqual(CITIES);
  });

  it('returns an empty list when there is no cache & no network', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    expect(await Server.loadAll()).toEqual([]);
  });
});
