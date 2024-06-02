import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { LostItemServices } from "./lostItem.service";
import { lostItemFilterableFields } from "./lostItem.constant";
import { TAuthUser } from "../../interface/interface";

// Controller function to create a new found item
const createLostItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extracting authorization token from request headers
    const token = req.headers.authorization;

    // Checking if authorization token is missing
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found!');
    }
console.log(req.body)
    // Calling service function to create found item into database
    const result = await LostItemServices.createLostItemIntoDB(req.body, token);

    // Sending response with success message and created data
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Lost item reported successfully",
      data: result,
    });
  }
);

// Controller function to get found items with optional filters and pagination
const getLostItems = catchAsync(async (req, res) => {
  const query = {...req.query}
  if(query.category){
    query.category = {name : query.category}
  }
  
  const filters = pick(query, lostItemFilterableFields);
  
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log({filters})

  // Calling service function to get found items from database
  const result = await LostItemServices.getLostItemsfromDB(filters, options);

  // Sending response with found items data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lost items retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});


const getMyLostItems = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await LostItemServices.getMyLostItemsFromDB(
      user as TAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " My Lost Items retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const softDeleteMyLostItem = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const {id} = req.params
    const user = req.user;
    const result = await LostItemServices.softDeleteMyLostItem(
      user as TAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " My Lost Item is deleted successfully!",
     
      data: result,
    });
  }
);
const markAsFoundMyLostItem = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const {id} = req.params
    const user = req.user;
    const result = await LostItemServices.markAsFoundMyLostItemIntoDB(
      user as TAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " Marked as found successfully!",
     
      data: result,
    });
  }
);
const updateLostItem = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await LostItemServices.updateLostItemIntoDB(
     
      req.body, user as TAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost Item updated successfully!",
      data: result,
    });
  }
);

// Exporting controller functions
export const LostItemController = {
  createLostItem,
  getLostItems,getMyLostItems,softDeleteMyLostItem,markAsFoundMyLostItem,updateLostItem
};
