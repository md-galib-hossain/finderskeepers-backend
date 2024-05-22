import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma, User } from "@prisma/client";
import { TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TItem } from "./lostItem.interface";
import { lostItemSearchableFields } from "./lostItem.constant";

// Function to create a found item into the database
const createLostItemIntoDB = async (payload: TItem, token: string) => {
  // Checking if the specified item category exists
  const checkExist = await prisma.itemCategory.findUnique({
    where: {
      id: payload?.categoryId,
    },
  });
  if (!checkExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "There is no Item category with this id"
    );
  }

  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Assigning the user ID to the payload
  payload.userId = decoded?.id;

  // Creating the found item in the database
  const result = await prisma.lostItem.create({
    data: payload,
    select: {
      id: true,
      userId: true,
      categoryId: true,
      name: true,
      description: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      user: true,
      category: true,
    },
  });

  return result;
};

// Function to get found items from the database with optional filters and pagination
const getLostItemsfromDB = async (
  params: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.LostItemWhereInput[] = [];

  // Building search conditions
  if (params.searchTerm) {
    andConditions.push({
      OR: lostItemSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Building filter conditions
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.LostItemWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetching found items from the database
  const result = await prisma.lostItem.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      user: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Getting total count of found items for pagination
  const total = await prisma.lostItem.count({
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

export const LostItemServices = {
  createLostItemIntoDB,
  getLostItemsfromDB,
};
