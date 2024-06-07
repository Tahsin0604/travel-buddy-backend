import bcrypt from 'bcrypt';
import config from '../config';

// await bcrypt.compare(password, hash);

export const hashPass = async (password: string) => {
  const hashed = await bcrypt.hash(password, Number(config.saltRounds));
  return hashed;
};

export const comparePass = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};
