import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma, User, UserStatus } from "@prisma/client";
import { TAuthUser, TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TItem } from "./foundItem.interface";
import { founditemSearchableFields } from './foundItem.constant'
import { fileUploader } from "../../utils/fileUploader";

// Function to create a found item into the database
const createFoundItemIntoDB = async (payload: any, token: string) => {
 

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
 
  if (!decoded || decoded?.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Assigning the user ID to the payload
  payload.userId = decoded?.id;

  let result
  try{
    // if (file) {
    //   const image = await fileUploader.uploadToCloudinary(file);
    //   if (image) {
    //     payload.itemImg = image?.secure_url;
    //   }
    // }

     // Creating the found item in the database
   result = await prisma.foundItem.create({
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
      itemImg : true,
    },
  });


  }catch(err: any){
    console.log(err);
    throw Error(err);
  }
 

  return result;
};

// Function to get found items from the database with optional filters and pagination
const getFoundItemsfromDB = async (
  params: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.FoundItemWhereInput[] = [];

  // Building search conditions
  if (params.searchTerm) {
    andConditions.push({
      OR: founditemSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.FoundItemWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetching found items from the database
  const result = await prisma.foundItem.findMany({
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
  const total = await prisma.foundItem.count({
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

const getSingleFoundItem = async (id: string) => {
  const result = await prisma.foundItem.findUniqueOrThrow({
    where : {
      id : id,

    }
  })
   
  return result;
};

const getMyFoundItemsFromDB = async (
  user: TAuthUser,
  options: TPaginationOptions
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.foundItem.findMany({
    where: {
      userId: user?.id
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
     
      category: true,
     claim: true
    },
  });

  const total = await prisma.foundItem.count({
    where: {
 
        userId: user?.id
     
      },
  })
  return {
    meta : {
        total,
        page,
        limit
    },
    data : result
  };
};


const updateFoundItemIntoDB = async (payload: any, user: TAuthUser) => {
  // Verifying user authorization using the provided token

  // Checking if the item exists and belongs to the user, including claims
  const existingItem = await prisma.foundItem.findUnique({
    where: {
      id: payload.id,
      userId: user?.id,
    },
    include: {
      claim: true, // Include claims
    },
  });

  if (!existingItem) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Lost item not found or you are not authorized to update this item"
    );
  }

  const categoryExists = await prisma.itemCategory.findUnique({
    where: {
      id: payload.categoryId,
    },
  });
  if (!categoryExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "There is no category with this name"
    );
  }

  // Checking if the item is under claim or marked as "FOUND"
  const hasActiveClaim = existingItem.claim.some((claim) => !claim.isDeleted);
  if (existingItem.foundItemStatus === "FOUND" || hasActiveClaim) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update item that is under claim or marked as FOUND"
    );
  }

  // Updating the lost item in the database
  const updatedItem = await prisma.foundItem.update({
    where: {
      id: payload.id,
    },
    data: {
      ...payload,
    },
    select: {
      id: true,
      userId: true,
      categoryId: true,
      name: true,
      description: true,
      location: true,
      contactNo: true,
      itemImg: true,
      createdAt: true,
      updatedAt: true,
      user: true,
      category: true,
      claim:true
    },
  });

  return updatedItem;
};

const markAsClaimFoundItemIntoDB = async (user: TAuthUser, id: string) => {
  const result = await prisma.foundItem.update({
    where: {
      id: id,
      userId: user?.id,
      isDeleted : false
    },
    data: {
      foundItemStatus: "FOUND",
    },
  });
  return result;
};

export const foundItemService = {
  createFoundItemIntoDB,
  getFoundItemsfromDB,getSingleFoundItem,getMyFoundItemsFromDB,updateFoundItemIntoDB,markAsClaimFoundItemIntoDB
};
