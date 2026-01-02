import { z } from 'zod';

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const usernameRegex = /^(?![0-9])[A-Za-z0-9_]+$/;

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      usernameRegex,
      'Username can only contain letters, numbers, and underscores, and cannot start with a number',
    ),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .regex(
      passwordRegex,
      'Password must be at least 6 characters, with 1 number, 1 lowercase, and 1 uppercase',
    ),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
