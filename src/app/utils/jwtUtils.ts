import jwt from 'jsonwebtoken';

type TPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
};
export const createToken = (
  payload: TPayload,
  secret: string,
  expire: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: expire });
};

export const verifyJwt = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
