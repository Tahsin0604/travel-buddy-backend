import dotenv from 'dotenv';
import path from 'path';
import { cwd } from 'process';

dotenv.config({ path: path.join(cwd(), '.env') });

export default {
  env: process.env.ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  saltRounds: process.env.SALTROUNDS,
  jwt: {
    accessSecret: process.env.ACCESS_SECRET,
    accessExpire: process.env.ACCESS_EXPIRE,
    refreshSecret: process.env.REFRESH_SECRET,
    refreshExpire: process.env.REFRESH_EXPIRE,
  },
};
