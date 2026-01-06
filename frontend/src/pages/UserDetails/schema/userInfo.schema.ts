import { z } from 'zod';

export const userInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),

  bio: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return null;
    }
    return value;
  }, z.string().max(160, 'Bio must be at most 160 characters').nullable()),
});

export type UserInfoSchemaType = z.infer<typeof userInfoSchema>;
