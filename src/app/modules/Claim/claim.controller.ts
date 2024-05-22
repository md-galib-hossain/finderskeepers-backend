import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { claimService } from "./claim.service";
import { claimFilterableFields } from "./claim.constant";
import pick from "../../utils/pick";

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

// Controller function to get claims with optional filters and pagination
const getClaims = catchAsync(async (req, res) => {
  // Extracting filters and options from request query
  const filters = pick(req.query, claimFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  // Calling service function to get claims from database
  const result = await claimService.getClaimsfromDB(filters, options);

  // Sending response with claims data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims retrieved successfully",
    meta: result?.meta,
    data: result?.data,
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
