import { IsString, Length } from 'class-validator';

export class CreateTweetDto {
  @IsString()
  @Length(1, 280)
  raw: string;

  @IsString()
  mentionsString: string;
}

export type Mention = {
  type: '@' | '#';
  value: string;
  start: number;
  end: number;
};
