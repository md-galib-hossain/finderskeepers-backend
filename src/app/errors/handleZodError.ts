import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError):TGenericErrorResponse => {
    const statusCode = 400;
    const errorMessages = err.issues.map((issue: ZodIssue) => issue.message).join('. ');

    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
      return {
        field: issue?.path[issue?.path?.length - 1],
        message: issue?.message,
      };
    });
    return {
      statusCode,
      message: errorMessages,
      errorSources,
    };
  };
  export default handleZodError