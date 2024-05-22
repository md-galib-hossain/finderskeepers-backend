import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { foundItemCategoryService } from "./itemcategory.service";
import AppError from "../../errors/AppError";

// Controller function to create a new found item category
const createFoundItemCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extracting authorization token from request headers
    const token = req.headers.authorization;

    // Checking if authorization token is missing
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
    }

    // Calling service function to create found item category into database
    const result = await foundItemCategoryService.createFoundItemCategoryIntoDB(req.body, token);

    // Sending response with success message and created data
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Found item category created successfully",
      data: result,
    });
  }
);

// Exporting the controller functions
export const itemCategoryController = {
  createFoundItemCategory,
};
