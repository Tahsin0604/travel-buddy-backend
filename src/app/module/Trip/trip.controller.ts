import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { TripServices } from './trip.services';
import pick from '../../utils/pick';
import { filterableFields } from './trip.constant';

const createTrip = catchAsync(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
    userId: req?.user?.id,
  };
  const result = await TripServices.createTripIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Trip created successfully',
    data: result,
  });
});

const updateTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.updateTripIntoDB(
    req.params.tripId,
    req?.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trip updated successfully',
    data: result,
  });
});

const deleteTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.deleteTripFromDB(req.params.tripId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trip deleted successfully',
    data: result,
  });
});

const getFilterTrips = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, filterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await TripServices.getAllTripsFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trips retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getDetailsTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.getDetailsTripFromDB(req.params.tripId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trip details retrieved successfully',
    data: result.data,
  });
});

const getFilteredMyTrips = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, filterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await TripServices.getAllMYTripsFromDB(
    req.params.userId,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Trips retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const TripController = {
  createTrip,
  updateTrip,
  deleteTrip,
  getFilterTrips,
  getDetailsTrip,
  getFilteredMyTrips,
};
