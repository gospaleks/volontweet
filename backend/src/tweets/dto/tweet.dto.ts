export class TweetDto {
  id: string;
  createdAt: string;
  content: string;
  mentions: Mention[];
  imageUrl?: string;
  imagePublicId?: string;
}

type Mention = {
  type: '@' | '#';
  value: string;
  start: number;
  end: number;
};
