import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage: multer.StorageEngine = diskStorage({
  destination: './upload',
  filename: (
    _req: Record<string, any>,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file: Express.Multer.File) {
  return `${uuidv4()}${extname(file.originalname)}`;
}

export { storage };
