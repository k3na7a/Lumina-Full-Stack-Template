import { IMAGE_TYPE } from '../constants/image-routes.constants';

interface createImage {
  file: Express.Multer.File;
  type: IMAGE_TYPE;
  altText?: string;
}

export type { createImage };
