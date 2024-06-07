import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { UserProfileServices } from './userProfile.services';

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  const result = await UserProfileServices.getProfileFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;

  const result = await UserProfileServices.updateProfileIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile updated successfully',
    data: result,
  });
});

const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileServices.getUserProfileFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: result,
  });
});
export const UserProfileController = {
  getUserProfile,
  getUserDetails,
  updateUserProfile,
};
