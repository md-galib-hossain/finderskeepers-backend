import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import AppError from "../../errors/AppError";

// Controller function to handle user registration
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }
);

// Controller function to get users with optional filters and pagination
const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getUsersfromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Controller function to get the current user's profile
const getMyProfile = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
  }
  const result = await userService.getMyProfilefromDB(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

// Controller function to update the current user's profile
const updateMyProfile = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
  }
  const result = await userService.updateMyProfileIntoDB(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  getMyProfile,
  updateMyProfile,
};
