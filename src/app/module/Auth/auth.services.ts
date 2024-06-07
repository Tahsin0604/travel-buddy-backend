import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { comparePass, hashPass } from '../../utils/bcryptUtils';
import prisma from '../../utils/prismaInit';
import { createToken, verifyJwt } from '../../utils/jwtUtils';
import config from '../../config';
import { User, UserStatus } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

const loginUser = async (data: Partial<User>) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: data.email as string,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const passwordMatched = await comparePass(
    data.password as string,
    isUserExists.password,
  );

  if (!passwordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Passwords do not match');
  }

  const jwtData = {
    id: isUserExists.id,
    name: isUserExists.name,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = createToken(
    jwtData,
    config.jwt.accessSecret as string,
    config.jwt.accessExpire as string,
  );

  const refreshToken = createToken(
    jwtData,
    config.jwt.refreshSecret as string,
    config.jwt.refreshExpire as string,
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyJwt(token, config.jwt.refreshSecret as string);
  } catch (err) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }
  const user = verifiedToken as JwtPayload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = createToken(
    {
      id: isUserExists.id,
      name: isUserExists.name,
      email: isUserExists.email,
      role: isUserExists.role,
    },
    config.jwt.accessSecret as string,
    config.jwt.accessExpire as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await comparePass(oldPassword, isUserExist.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  const hashPassword = await hashPass(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
