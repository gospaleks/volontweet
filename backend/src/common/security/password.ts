import { genSalt, hash } from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(
  password: string,
  rounds = DEFAULT_SALT_ROUNDS,
): Promise<string> {
  const salt = await genSalt(rounds);
  return hash(password, salt);
}
