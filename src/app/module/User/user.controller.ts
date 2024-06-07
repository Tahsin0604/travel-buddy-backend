import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserServices.createUserIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User registered successfully',
      data: result,
    });
  },
);
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserServices.createAdminIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Admin registered successfully',
      data: result,
    });
  },
);

export const UserController = {
  createUser,
  createAdmin,
};
