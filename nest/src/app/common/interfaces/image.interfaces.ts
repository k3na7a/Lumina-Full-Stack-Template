import { IMAGE_TYPE } from 'src/app/modules/media/enums/image-routes.enum';
import { BaseEntity } from './base.interface';

interface iImage extends BaseEntity {
  filename: string;
  type: IMAGE_TYPE;
  mimetype: string;
  size: number;

  width?: number;
  height?: number;
  altText?: string;

  uri: string;
}

export type { iImage };
