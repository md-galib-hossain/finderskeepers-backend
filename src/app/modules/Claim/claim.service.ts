import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TClaim } from "./claim.interface";
import { Prisma, UserStatus } from "@prisma/client";
import { TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import { claimSearchableFields } from "./claim.constant";

// Function to create a claim into the database
const createClaimIntoDB = async (payload: TClaim, token: string) => {
  // Checking if there is already a claim with the same Found Item ID
  const checkExist = await prisma.claim.findFirst({
    where: {
      foundItemId: payload?.foundItemId,
      status : 'APPROVED'
    },
  });
  
  if (checkExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The founded item is already claimed"
    );
  }

  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded || decoded?.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Assigning the user ID to the payload
  payload.userId = decoded?.id;

  // Creating the claim in the database
  const result = await prisma.claim.create({
    data: payload,
    select: {
      id: true,
      userId: true,
      foundItemId: true,
      lostItemId: true,
      distinguishingFeatures: true,
      lostDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lostItem: true,
      founditem: true,

    },
  });

  return result;
};



// Function to update a claim in the database
const updateClaimIntoDB = async (
  token: string,
  id: string,
  payload: Partial<TClaim>
) => {
  // Checking if the claim with the specified ID exists
  await prisma.claim.findUniqueOrThrow({ where: { id: id } });

  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded || decoded?.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Updating the claim in the database
  const result = await prisma.claim.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};





const getClaimsfromDB = async (
  params: any,
  options: TPaginationOptions
) => {
  
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ClaimWhereInput[] = [];

  // Building search conditions
  if (params.searchTerm) {
    andConditions.push({
      OR: claimSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.ClaimWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetching found items from the database
  const result = await prisma.claim.findMany({
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
      status: true,
      distinguishingFeatures: true,
      lostDate: true,
      foundItemId: true,
      lostItemId: true,
      user: true,
      isDeleted: true,
      createdAt: true,
      founditem: true,
      lostItem: true,

      updatedAt: true,
    },
  });

  // Getting total count of found items for pagination
  const total = await prisma.claim.count({
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


// Exporting the service functions
export const claimService = {
  createClaimIntoDB,
  getClaimsfromDB,
  updateClaimIntoDB,
};
