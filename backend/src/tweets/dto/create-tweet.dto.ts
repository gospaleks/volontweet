export class CreateTweetDto {
  raw: string;
  mentionsString: string;
}

export type Mention = {
  type: '@' | '#';
  value: string;
  start: number;
  end: number;
};
