import { shell } from 'electron';
import { isAbsolute, join } from 'path';

/**
 * Opens a path or URL with the system's default app.
 * @param path The path or URL to open.
 */
export default async function open(path: string) {
  if (/^https?:\/\/./.test(path)) {
    await shell.openExternal(path);
  } else {
    let absolutePath = path;
    if (!isAbsolute(absolutePath)) {
      absolutePath = join(window.DIRNAME, path);
    }
    await shell.openPath(absolutePath);
  }
}
