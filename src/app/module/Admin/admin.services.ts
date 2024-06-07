/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPagination } from '../../interface/pagination';
import paginationUtils from '../../utils/paginationUtils';
import prisma from '../../utils/prismaInit';
import { TTripFilterRequest } from '../Trip/trip.interface';
import { searchableFields, sortableFields } from './admin.constant';

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
    where: { ...whereInput },
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

const getAllUsersFromDB = async (
  params: { searchTerm?: string | undefined },
  options: TPagination,
) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationUtils(options);
  let sortName;
  if (sortableFields.includes(sortBy)) {
    sortName = sortBy;
  } else {
    sortName = 'createdAt';
  }
  const { searchTerm } = params;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  const whereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: { role: 'USER', ...whereInput },
    skip,
    take: limit,
    orderBy: { [sortName]: sortOrder },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      profile: {
        select: {
          dateOfBirth: true,
          profilePhoto: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: { role: 'USER', ...whereInput },
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

export const AdminServices = {
  getAllTripsFromDB,
  getAllUsersFromDB,
};
