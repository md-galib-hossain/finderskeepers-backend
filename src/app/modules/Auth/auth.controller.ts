import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Controller function to handle user login
const loginUser = catchAsync(async (req: Request, res: Response) => {
  // Calling loginUser function from AuthServices to authenticate user login
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;

  // Setting the refresh token in the response cookie
  res.cookie("refreshToken", refreshToken, {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Cookie accessible only via HTTP(S) headers
  });

  // Sending success response with user data and access token
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: result?.accessToken,
    },
  });
});

// Controller function to handle token refresh
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  // Extracting refresh token from the request cookies
  const { refreshToken } = req.cookies;

  // Calling refreshToken function from AuthServices to refresh access token
  const result = await AuthServices.refreshToken(refreshToken);

  // Sending success response with new access token
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successful",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.changePasswordIntoDB(req.user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);
const forgotPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    await AuthServices.forgotPassword(req.body);
    // const { refreshToken } = result;
    // res.cookie("refreshToken", refreshToken, {
    //   secure: false,
    //   httpOnly: true,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check your email inbox",
      data: null,
      // data: {
      //   accessToken: result?.accessToken,
      //   needPasswordChange: result?.needPasswordChange,
      // },
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const token = req.headers.authorization || "";

    await AuthServices.resetPassword(token, req.body);
    // const { refreshToken } = result;
    // res.cookie("refreshToken", refreshToken, {
    //   secure: false,
    //   httpOnly: true,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset",
      data: null,
      // data: {
      //   accessToken: result?.accessToken,
      //   needPasswordChange: result?.needPasswordChange,
      // },
    });
  }
);

// Exporting the authentication controller
export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
