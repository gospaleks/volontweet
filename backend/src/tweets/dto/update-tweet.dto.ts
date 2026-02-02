import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTweetDto {
  @IsString()
  raw: string;

  @IsString()
  mentionsString: string;

  @IsOptional()
  @IsBoolean()
  removeImage?: boolean;
}
