import { Injectable, Inject } from '@nestjs/common';

import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

import { CLOUDINARY } from './constants';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadImage(
    fileBuffer: Buffer,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            upload_preset: 'volontweet_preset',
            folder,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error('Cloudinary upload failed'));
            }

            resolve(result);
          },
        )
        .end(fileBuffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }
}
