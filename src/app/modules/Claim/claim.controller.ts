import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { claimService } from "./claim.service";

// Controller function to create a new claim
const createClaim = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extracting authorization token from request headers
    const token = req.headers.authorization;
    // Checking if authorization token is missing
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
    }
    // Calling service function to create a new claim in the database
    const result = await claimService.createClaimIntoDB(req.body, token);
    // Sending response with success message and created data
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Claim created successfully",
      data: result,
    });
  }
);

// Controller function to get all claims
const getClaims = catchAsync(async (req, res) => {
  // Extracting authorization token from request headers
  const token = req.headers.authorization;
  // Checking if authorization token is missing
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
  }
  // Calling service function to get all claims from the database
  const result = await claimService.getClaimsfromDB(token);
  // Sending response with retrieved claims data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims retrieved successfully",
    data: result,
  });
});

// Controller function to update a claim
const updateClaim = catchAsync(async (req, res) => {
  // Extracting claimId from request parameters
  const { claimId } = req.params;
  // Extracting authorization token from request headers
  const token = req.headers.authorization;
  // Checking if authorization token is missing
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
  }
  // Calling service function to update the claim in the database
  const result = await claimService.updateClaimIntoDB(token, claimId, req.body);
  // Sending response with success message and updated data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claim updated successfully",
    data: result,
  });
});

// Exporting the controller functions
export const claimController = {
  createClaim,
  getClaims,
  updateClaim
};
