import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { UserStatus } from "@prisma/client";

// Service function to create a new found item category into the database
const createItemCategoryIntoDB = async (payload: any, token: string) => {
  // Checking if the category already exists with the same name
  const checkExist = await prisma.itemCategory.findUnique({
    where: {
      name: payload.name,
    },
  });
  if (checkExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already exists with this name");
  }

  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded || decoded?.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Creating the found item category in the database
  const result = await prisma.itemCategory.create({
    data: payload,
  });

  return result;
};

// Exporting the service function
export const ItemCategoryService = {
  createItemCategoryIntoDB,
};
