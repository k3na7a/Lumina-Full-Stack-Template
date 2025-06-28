import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { megabyte } from 'src/library/constants/size.constants';

export function ImageUploadPipe({
  maxSize = 10 * megabyte,
  fileType = /\.(jpg|jpeg|png|gif)$/,
  fileIsRequired = true,
}: {
  maxSize?: number;
  fileType?: RegExp;
  fileIsRequired?: boolean;
}) {
  return new ParseFilePipe({
    fileIsRequired,
    validators: [
      new MaxFileSizeValidator({ maxSize }),
      new FileTypeValidator({ fileType }),
    ],
  });
}
