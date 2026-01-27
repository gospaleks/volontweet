import { z } from 'zod';

export const tweetCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(280, 'Comment content must be at most 280 characters'),
});

export type TweetCommentSchemaType = z.infer<typeof tweetCommentSchema>;
