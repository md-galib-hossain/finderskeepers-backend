import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { foundItemService } from "./item.service";
import { itemFilterableFields } from "./item.constant";

// Controller function to create a new found item
const createFoundItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extracting authorization token from request headers
    const token = req.headers.authorization;

    // Checking if authorization token is missing
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
    }

    // Calling service function to create found item into database
    const result = await foundItemService.createFoundItemIntoDB(req.body, token);

    // Sending response with success message and created data
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Found item reported successfully",
      data: result,
    });
  }
);

// Controller function to get found items with optional filters and pagination
const getFoundItems = catchAsync(async (req, res) => {
  // Extracting filters and options from request query
  const filters = pick(req.query, itemFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  // Calling service function to get found items from database
  const result = await foundItemService.getFoundItemsfromDB(filters, options);

  // Sending response with found items data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Found items retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Exporting controller functions
export const itemCategoryController = {
  createFoundItem,
  getFoundItems
};
