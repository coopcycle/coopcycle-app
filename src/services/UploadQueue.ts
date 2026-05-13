import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'upload_queue';

export interface UploadJob {
  id: string;
  fileUri: string;
  uploadUrl: string;
  attachTo: string[];
  createdAt: string;
}

function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

async function getPending(): Promise<UploadJob[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function enqueue(
  jobs: Omit<UploadJob, 'id' | 'createdAt'>[],
): Promise<void> {
  const existing = await getPending();
  const newJobs: UploadJob[] = jobs.map(job => ({
    ...job,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }));
  await AsyncStorage.setItem(
    QUEUE_KEY,
    JSON.stringify([...existing, ...newJobs]),
  );
}

async function markDone(id: string): Promise<void> {
  const existing = await getPending();
  await AsyncStorage.setItem(
    QUEUE_KEY,
    JSON.stringify(existing.filter(job => job.id !== id)),
  );
}

export default { enqueue, getPending, markDone };
