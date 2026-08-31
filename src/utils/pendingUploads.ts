import * as FileSystem from 'expo-file-system/legacy';
import { v4 as uuid } from 'uuid';

const PENDING_UPLOADS_DIRECTORY = `${FileSystem.documentDirectory}pending_uploads/`;

/**
 * Copies a file into the app's document directory, and returns its new uri.
 *
 * Everything that produces a proof of delivery — the camera, the image
 * picker, the signature canvas, and `compressImage` on top of any of them —
 * hands back a path in the *cache* directory, which the OS may reclaim
 * whenever it is short on space. An upload is queued and retried over a much
 * longer period than that (it survives the app being killed), so the file it
 * points at has to live somewhere the system will not take away.
 */
export async function persistPendingUpload(
  uri: string,
  extension = 'jpg',
): Promise<string> {
  await FileSystem.makeDirectoryAsync(PENDING_UPLOADS_DIRECTORY, {
    intermediates: true,
  });

  const destination = `${PENDING_UPLOADS_DIRECTORY}${uuid()}.${extension}`;
  await FileSystem.copyAsync({ from: uri, to: destination });

  return destination;
}

/**
 * Best-effort deletion of an intermediate file we no longer need. Failing to
 * clean up a temporary file is never a reason to fail what the courier asked
 * for.
 */
export async function discardTemporaryFile(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (e) {
    console.warn('Could not delete temporary file', uri, e);
  }
}
