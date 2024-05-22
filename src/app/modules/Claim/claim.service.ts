import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TClaim } from "./claim.interface";

// Function to create a claim into the database
const createClaimIntoDB = async (payload: TClaim, token: string) => {
  // Checking if there is already a claim with the same Found Item ID
  const checkExist = await prisma.claim.findUnique({
    where: {
      foundItemId: payload?.foundItemId,
    },
  });
  if (checkExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "There is already a claim with the same Found Item ID"
    );
  }

  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
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
      distinguishingFeatures: true,
      lostDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Function to get all claims from the database
const getClaimsfromDB = async (token: string) => {
  // Verifying user authorization using the provided token
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized");
  }

  // Fetching all claims from the database
  const result = await prisma.claim.findMany();

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
  if (!decoded) {
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

// Exporting the service functions
export const claimService = {
  createClaimIntoDB,
  getClaimsfromDB,
  updateClaimIntoDB,
};
