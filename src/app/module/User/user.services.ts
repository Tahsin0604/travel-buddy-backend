/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRole } from '@prisma/client';
import { hashPass } from '../../utils/bcryptUtils';
import prisma from '../../utils/prismaInit';

const createUserIntoDB = async (data: any) => {
  const userData = {
    name: data.name,
    email: data.email,
    password: await hashPass(data.password),
    role: UserRole.USER,
    needPasswordChange: false,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUser = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const profileData = {
      userId: createUser.id,
      dateOfBirth: data.profile.dateOfBirth,
    };

    await transactionClient.userProfile.create({
      data: profileData,
    });
    return createUser;
  });

  return result;
};

const createAdminIntoDB = async (data: any) => {
  const userData = {
    name: data.name,
    email: data.email,
    password: await hashPass(data.password),
    role: UserRole.ADMIN,
    needPasswordChange: true,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUser = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const profileData = {
      userId: createUser.id,
      dateOfBirth: data.profile.dateOfBirth,
    };

    await transactionClient.userProfile.create({
      data: profileData,
    });
    return createUser;
  });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  createAdminIntoDB,
};
