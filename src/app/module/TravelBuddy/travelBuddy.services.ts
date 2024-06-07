/* eslint-disable @typescript-eslint/no-explicit-any */
import { TravelBuddy } from '@prisma/client';
import prisma from '../../utils/prismaInit';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { TPagination } from '../../interface/pagination';
import paginationUtils from '../../utils/paginationUtils';

const sendRequestToBuddy = async (data: TravelBuddy) => {
  await prisma.trip.findUniqueOrThrow({
    where: {
      id: data.tripId,
    },
  });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: data.userId,
    },
  });

  const buddyExists = await prisma.travelBuddy.findFirst({
    where: {
      tripId: data.tripId,
      userId: data.userId,
    },
  });
  if (buddyExists) {
    throw new AppError(httpStatus.CONFLICT, 'Already requested');
  }
  const result = await prisma.travelBuddy.create({
    data: data,
  });

  return result;
};

const getTravelBuddiesForATrip = async (
  tripId: string,
  options: TPagination,
) => {
  const { page, limit, skip } = paginationUtils(options);

  const result = await prisma.travelBuddy.findMany({
    where: {
      tripId: tripId,
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userName: true,
      useEmail: true,
      contactNumber: true,
      status: true,
      userId: true,
      user: {
        include: {
          profile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.travelBuddy.count({
    where: {
      tripId: tripId,
    },
  });

  return {
    meta: {
      page: page,
      limit: limit,
      total: total,
    },
    data: result,
  };
};

const getAllTripRequest = async (userId: string, options: TPagination) => {
  const { page, limit, skip } = paginationUtils(options);

  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.travelBuddy.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      tripId: true,
      trip: {
        select: {
          images: true,
          description: true,
          budget: true,
          destination: true,
          endDate: true,
          startDate: true,
          tripTitle: true,
          userId: true,
          itinerary: true,
          tripType: true,
          user: {
            select: {
              name: true,
              profile: {
                select: { profilePhoto: true },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.travelBuddy.count({
    where: {
      userId: userId,
      isDeleted: false,
    },
  });

  return {
    meta: {
      page: page,
      limit: limit,
      total: total,
    },
    data: result,
  };
};

const getSingleTravelBuddyForATrip = async (tripId: string, userId: string) => {
  const result = await prisma.travelBuddy.findFirst({
    where: {
      tripId: tripId,
      userId: userId,
    },
    select: {
      status: true,
    },
  });

  if (!result) {
    return { status: false };
  }
  return result;
};

const respondBuddyRequest = async (buddyId: string, data: any) => {
  if (data?.tripId) {
    await prisma.trip.findUniqueOrThrow({
      where: {
        id: data?.tripId,
      },
    });
  }
  const result = await prisma.travelBuddy.update({
    where: {
      id: buddyId,
    },
    data: data,
  });

  return result;
};

export const TravelBuddyServices = {
  sendRequestToBuddy,
  getTravelBuddiesForATrip,
  getAllTripRequest,
  getSingleTravelBuddyForATrip,
  respondBuddyRequest,
};
