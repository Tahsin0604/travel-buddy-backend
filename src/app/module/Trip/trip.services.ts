/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPagination } from '../../interface/pagination';
import paginationUtils from '../../utils/paginationUtils';
import prisma from '../../utils/prismaInit';
import { searchableFields, sortableFields } from './trip.constant';
import { TTripFilterRequest } from './trip.interface';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const createTripIntoDB = async (data: any) => {
  const result = await prisma.trip.create({
    data: data,
  });

  return result;
};

const updateTripIntoDB = async (
  id: string,
  userId: string,
  data: Record<string, any>,
) => {
  const tripExists = await prisma.trip.findUnique({
    where: {
      id: id,
      userId: userId,
    },
  });
  if (!tripExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not Found!');
  }
  const result = await prisma.trip.update({
    where: {
      id: id,
    },
    data: data,
  });

  return result;
};

const deleteTripFromDB = async (id: string) => {
  const tripExists = await prisma.trip.findUnique({
    where: {
      id: id,
    },
  });
  if (!tripExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Trip Not Found!');
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.trip.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.travelBuddy.updateMany({
      where: {
        tripId: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return {
      id: id,
      message: `Trip deleted successfully`,
    };
  });

  return result;
};

const getAllTripsFromDB = async (
  params: TTripFilterRequest,
  options: TPagination,
) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationUtils(options);
  let sortName;
  if (sortableFields.includes(sortBy)) {
    sortName = sortBy;
  } else {
    sortName = 'createdAt';
  }
  const { searchTerm, ...filtrateData } = params;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filtrateData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtrateData).map((field) => {
        if (field === 'minBudget') {
          return {
            budget: {
              gte: Number((filtrateData as any)[field]),
            },
          };
        }
        if (field === 'maxBudget') {
          return {
            budget: {
              lte: Number((filtrateData as any)[field]),
            },
          };
        }

        if (field === 'startDate') {
          return {
            startDate: {
              gte: (filtrateData as any)[field],
            },
          };
        }
        if (field === 'endDate') {
          return {
            endDate: {
              lte: (filtrateData as any)[field],
            },
          };
        }
        return {
          [field]: {
            equals: (filtrateData as any)[field],
          },
        };
      }),
    });
  }

  const whereInput = { AND: andConditions };

  const result = await prisma.trip.findMany({
    where: { isDeleted: false, ...whereInput },
    skip,
    take: limit,
    orderBy: { [sortName]: sortOrder },
    include: {
      user: {
        select: {
          name: true,
          profile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.trip.count({
    where: { isDeleted: false, ...whereInput },
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

const getDetailsTripFromDB = async (id: string) => {
  const result = await prisma.trip.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      },
    },
  });

  return {
    data: result,
  };
};

const getAllMYTripsFromDB = async (
  userId: string,
  params: TTripFilterRequest,
  options: TPagination,
) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationUtils(options);

  let sortName;
  if (sortableFields.includes(sortBy)) {
    sortName = sortBy;
  } else {
    sortName = 'createdAt';
  }

  const { searchTerm, ...filtrateData } = params;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filtrateData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtrateData).map((field) => {
        if (field === 'minBudget') {
          return {
            budget: {
              gte: Number((filtrateData as any)[field]),
            },
          };
        }
        if (field === 'maxBudget') {
          return {
            budget: {
              lte: Number((filtrateData as any)[field]),
            },
          };
        }
        return {
          [field]: {
            equals: (filtrateData as any)[field],
          },
        };
      }),
    });
  }

  const whereInput = { AND: andConditions };

  const result = await prisma.trip.findMany({
    where: {
      userId: userId,
      isDeleted: false,
      ...whereInput,
    },
    skip,
    take: limit,
    orderBy: { [sortName]: sortOrder },
    include: {
      user: {
        select: {
          name: true,
          profile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.trip.count({
    where: {
      userId: userId,
      ...whereInput,
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

export const TripServices = {
  createTripIntoDB,
  getAllTripsFromDB,
  getDetailsTripFromDB,
  getAllMYTripsFromDB,
  updateTripIntoDB,
  deleteTripFromDB,
};
