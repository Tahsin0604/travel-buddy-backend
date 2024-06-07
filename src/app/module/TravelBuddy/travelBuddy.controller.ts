import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import prisma from '../../utils/prismaInit';
import { TravelBuddyServices } from './travelBuddy.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import pick from '../../utils/pick';

const sendRequest = catchAsync(async (req: Request, res: Response) => {
  const tripId = req.params.tripId;

  const userId = req?.user?.id;
  const data = req.body;
  data.tripId = tripId;
  data.userId = userId;
  const result = await TravelBuddyServices.sendRequestToBuddy(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Travel buddy request sent successfully',
    data: result,
  });
});

const getTravelBuddies = catchAsync(async (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const options = pick(req.query, ['page', 'limit']);
  await prisma.trip.findUniqueOrThrow({
    where: {
      id: tripId,
    },
  });

  const result = await TravelBuddyServices.getTravelBuddiesForATrip(
    tripId,
    options,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Potential travel buddies retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllTripRequest = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['page', 'limit']);
  const result = await TravelBuddyServices.getAllTripRequest(
    req?.user?.id,
    options,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All trip request retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTravelBuddy = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelBuddyServices.getSingleTravelBuddyForATrip(
    req.params.tripId,
    req?.user?.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Travel Buddy Status retrieved successfully',
    data: result,
  });
});

const respondRequest = catchAsync(async (req: Request, res: Response) => {
  const buddyId = req.params.buddyId;

  await prisma.travelBuddy.findUniqueOrThrow({
    where: {
      id: buddyId,
    },
  });

  const result = await TravelBuddyServices.respondBuddyRequest(
    buddyId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Travel buddy request responded successfully',
    data: result,
  });
});

export const TravelBuddyController = {
  sendRequest,
  getTravelBuddies,
  getAllTripRequest,
  respondRequest,
  getSingleTravelBuddy,
};
