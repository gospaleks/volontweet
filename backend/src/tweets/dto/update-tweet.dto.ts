import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTweetDto {
  @IsString()
  raw: string;

  @IsString()
  mentionsString: string;

  @IsOptional()
  @IsString() // form is submited with multipart/form-data so files are of type string | Blob (convert to boolean later)
  removeImage?: string;
}
