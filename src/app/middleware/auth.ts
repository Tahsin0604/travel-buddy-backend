import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/appError';
import httpStatus from 'http-status';
import { verifyJwt } from '../utils/jwtUtils';
import config from '../config';
import prisma from '../utils/prismaInit';
import { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }
    let decoded;
    try {
      decoded = verifyJwt(token, config.jwt.accessSecret as string);
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const { id, name, email, role } = decoded as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: id,
        name: name,
        email: email,
      },
    });

    if (!isUserExist) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden Access');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
