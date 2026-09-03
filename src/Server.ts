import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const STORAGE_KEY = '@CoopCycle.servers';
const REMOTE_URL = 'https://coopcycle.org/coopcycle.json';

// How long the cached list of cities is considered fresh
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day
// Don't block app startup for too long when the network is flaky
const REQUEST_TIMEOUT = 5000;

type City = { city: string; [key: string]: unknown };

type Cache = {
  data: City[];
  fetchedAt: number | null;
};

const EMPTY_CACHE: Cache = { data: [], fetchedAt: null };

// Data used to be stored as a bare array, without any timestamp.
// Such a payload is loaded as an already expired cache.
const parseCache = (raw: string | null): Cache => {
  if (!raw) {
    return EMPTY_CACHE;
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return { data: parsed, fetchedAt: null };
    }

    if (parsed && Array.isArray(parsed.data)) {
      return {
        data: parsed.data,
        fetchedAt:
          typeof parsed.fetchedAt === 'number' ? parsed.fetchedAt : null,
      };
    }
  } catch (e) {}

  return EMPTY_CACHE;
};

const load = async (): Promise<Cache> => {
  try {
    return parseCache(await AsyncStorage.getItem(STORAGE_KEY));
  } catch (e) {
    return EMPTY_CACHE;
  }
};

// The remote file is served with "Cache-Control: max-age=31536000", so the
// platform HTTP cache (NSURLCache on iOS, OkHttp on Android) would happily
// serve a year old response & never revalidate. Bucketing the URL per day
// gives us a fresh response once a day, while still letting the CDN cache it
// for every user of that day.
const cacheBuster = () => new Date().toISOString().slice(0, 10);

// Resolves with null when the server could not be reached,
// so that we can fall back on the cached data.
const fetchRemote = async (): Promise<City[] | null> => {
  try {
    const response = await axios.get(REMOTE_URL, {
      timeout: REQUEST_TIMEOUT,
      params: { d: cacheBuster() },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    return response.data;
  } catch (e) {
    return null;
  }
};

const save = async (data: City[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data, fetchedAt: Date.now() }),
    );
  } catch (e) {}
};

const isFresh = (cache: Cache): boolean =>
  cache.data.length > 0 &&
  cache.fetchedAt !== null &&
  // Guard against a clock going backwards
  Date.now() - cache.fetchedAt < CACHE_TTL &&
  cache.fetchedAt <= Date.now();

class Server {
  static async loadAll(): Promise<City[]> {
    const cache = await load();

    if (isFresh(cache)) {
      return cache.data;
    }

    const remoteData = await fetchRemote();

    if (!remoteData) {
      // Server is not reachable, keep using the previously loaded data
      return cache.data;
    }

    await save(remoteData);

    return remoteData;
  }
}

export default Server;
