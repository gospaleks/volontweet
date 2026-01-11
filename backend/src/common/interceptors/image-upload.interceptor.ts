import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

export const ImageUploadInterceptor = (options?: {
  fieldName?: string;
  maxSizeMb?: number;
}) => {
  const fieldName = options?.fieldName ?? 'image';
  const maxSizeMb = options?.maxSizeMb ?? 5;

  return FileInterceptor(fieldName, {
    limits: {
      fileSize: maxSizeMb * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
        return cb(
          new BadRequestException(
            'Only image files (jpg, jpeg, png, webp, gif) are allowed',
          ),
          false,
        );
      }
      cb(null, true);
    },
  });
};
