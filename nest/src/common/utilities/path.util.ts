import * as os from 'os';
import * as path from 'path';

export function getRootPath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    return path.parse(process.cwd()).root;
  }
  return '/';
}
