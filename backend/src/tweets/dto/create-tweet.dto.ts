export class CreateTweetDto {
  raw: string;
  mentions: Mention[];
}

type Mention = {
  type: '@' | '#';
  value: string;
  start: number;
  end: number;
};
