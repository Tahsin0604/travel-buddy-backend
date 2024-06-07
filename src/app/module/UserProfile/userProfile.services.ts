/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import AppError from '../../error/appError';
import prisma from '../../utils/prismaInit';

const getProfileFromDB = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
    },
  });

  const profileData = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: userData.id,
    },
  });

  return { ...userData, ...profileData };
};

const getUserProfileFromDB = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
    },
  });

  const profileData = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: userData.id,
    },
  });

  return { ...userData, ...profileData };
};

const updateProfileIntoDB = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const { profile, ...userData } = data;

  const userExist = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!userExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User does not  exists');
  }

  if (userData?.email && userData?.email !== userExist?.email) {
    const emailExist = await prisma.user.findUnique({
      where: {
        email: userData.email as string,
      },
    });

    if (emailExist) {
      throw new AppError(httpStatus.CONFLICT, 'Email already exists');
    }
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    let updatedData: Record<string, any> = { id };
    if (Object.keys(userData).length > 0) {
      const res = await transactionClient.user.update({
        where: {
          id: id,
        },
        data: userData,
        select: { email: true, name: true },
      });

      updatedData = { ...res };
    }
    if (profile) {
      const res = await transactionClient.userProfile.update({
        where: {
          userId: id,
        },
        data: profile,
        select: { bio: true, dateOfBirth: true, profilePhoto: true },
      });

      updatedData = { ...res };
    }
    return updatedData;
  });

  return result;
};

export const UserProfileServices = {
  getProfileFromDB,
  updateProfileIntoDB,
  getUserProfileFromDB,
};
