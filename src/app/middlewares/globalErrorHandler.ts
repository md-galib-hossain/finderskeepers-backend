import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import AppError from "../errors/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //default values
  let statusCode = 500
  let success = false;
  let message = "Something went wrong!";
  let errorDetails = {};

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message;
    console.log(simplifiedError?.errorSources);
    errorDetails = { issues: simplifiedError?.errorSources };
    // errorDetails.issues = simplifiedError?.errorSources;
  }else if(err instanceof AppError){ //App error
    statusCode = err?.statusCode
    message = err?.message
    errorDetails = [{
      path : '',
      message: err?.message
    }]
  }else if(err instanceof Error){ //Error
    message = err?.message
    errorDetails = [{
      path : '',
      message: err?.message
    }]
  }
  return res.status(statusCode).json({
    success: false,
    message: message ,
    errorDetails: Object.keys(errorDetails).length ? errorDetails : err,
  });
};
export default globalErrorHandler;
