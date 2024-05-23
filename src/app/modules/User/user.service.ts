import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { TUser, TUserProfile } from "./user.interface";
import { TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { generateUniqueUserName } from "./user.utils";

const createUserIntoDB = async (payload: TUser) => {
  const { profile, ...userData } = payload;
  //Hashing the password before creating user
  const hashedPassword: string = await bcrypt.hash(userData?.password, 10);
  //check if email already exists
  const checkUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (checkUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  //using transaction fo creating user & user profile both at once
  const result = await prisma.$transaction(async (transactionClient) => {
    const generatedUserName = await generateUniqueUserName({
      userName: payload.name,
      email: payload.email,
    });
    userData.password = hashedPassword;
    userData.userName = generatedUserName;
    console.log(userData)
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    profile.userId = createdUserData.id;
    const createdUserProfileData = await transactionClient.userProfile.create({
      data: profile,
    });
    return createdUserData;
  });
  // Selecting specific fields to return after user creation

  let user;
  if (result) {
    user = prisma.user.findUniqueOrThrow({
      where: {
        id: result?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
    userName : true
      },
    });
  }

  return user;
};

// Function to fetch users from the database with pagination and search

const getUsersfromDB = async (query: any, options: TPaginationOptions) => {
  //calculating paginations
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  // Building search conditions

  const { searchTerm, ...remainingQueries } = query;
  const andConditions: Prisma.UserWhereInput[] = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(remainingQueries).length > 0) {
    andConditions.push({
      AND: Object.keys(remainingQueries).map((key) => ({
        [key]: {
          equals: (remainingQueries as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  // Fetching users from the database

  const result = await prisma.user.findMany({
    // where : {
    //     name :{
    //         contains : query.searchTerm as string,
    //         mode: 'insensitive'
    //     }
    // }
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
    // include:{admin:true,patient:true,doctor:true}
  });

  // Getting total count of users for pagination

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Function to fetch current user's profile from the database

const getMyProfilefromDB = async (token: string) => {
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: decoded.id,
    },
    select: {
      id: true,
      userId: true,
      bio: true,
      age: true,
      createdAt: true,
      updatedAt: true,
      user: true,
    },
  });

  return result;
};
// Function to update current user's profile in the database

const updateMyProfileIntoDB = async (
  token: string,
  payload: Partial<TUserProfile>
) => {
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  await prisma.userProfile.findUniqueOrThrow({
    where: { userId: decoded?.id },
  });
  const result = await prisma.userProfile.update({
    where: {
      userId: decoded?.id,
    },
    data: payload,

    select: {
      id: true,
      userId: true,
      bio: true,
      age: true,
      createdAt: true,
      updatedAt: true,
      user: true,
    },
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  getUsersfromDB,
  getMyProfilefromDB,
  updateMyProfileIntoDB,
};
