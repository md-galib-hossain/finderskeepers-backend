import prisma from "../../utils/prisma";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "./auth.utils";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";
import emailSender from "../../utils/emailsender";
import { Secret } from "jsonwebtoken";

// Function to authenticate user login
const loginUser = async (payload: { email: string; password: string }) => {
  // Fetching user data from the database based on email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Comparing the provided password with the hashed password stored in the database
  const isCorrectPassword = await bcrypt.compare(
    payload?.password,
    userData.password
  );

  // If password is incorrect, throw an unauthorized error
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  // Generating access token and refresh token for the user
  const accessToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
      role: userData?.role,
    },
    config.JWT.ACCESS_TOKEN_SECRET!,
    config.JWT.ACCESS_TOKEN_EXPIRES_IN!
  );
  const refreshToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
      role: userData?.role,
    },
    config.JWT.REFRESH_TOKEN_SECRET!,
    config.JWT.REFRESH_TOKEN_EXPIRES_IN!
  );
  // Returning user data along with access token and refresh token
  return {
    // userData,
    accessToken,
    refreshToken,
  };
};

// Function to refresh access token using refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    // Verifying the refresh token
    decodedData = verifyToken(token, config.JWT.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    // If token verification fails, throw an unauthorized error
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  // Fetching user data from the database based on email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Generating a new access token
  const accessToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
    },
    config.JWT.ACCESS_TOKEN_SECRET!,
    config.JWT.ACCESS_TOKEN_EXPIRES_IN!
  );

  // Returning the new access token
  return {
    accessToken,
  };
};

//refresh token end
const changePasswordIntoDB = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );
  if (!isCorrectPassword) {
    throw new Error("password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload?.newPassword, 10);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });
  const resetPassToken = generateToken(
    { email: userData.email, role: userData.role },
    config.JWT.RESET_PASSWORD_TOKEN as Secret,
    config.JWT.RESET_PASSWORD_TOKEN_EXPIRES_IN as string
  );
  console.log(resetPassToken);
  const resetPassLink =
    config.JWT.RESET_PASSWORD_LINK +
    `?id=${userData?.id}&token=${resetPassToken}`;
  //http://localhost:5000/reset-pass
  console.log(resetPassLink);
  await emailSender(
    userData?.email,
    `
    <div>
      <p> Dear User,</p>
      <p> Your Password reset link 
      <a href=${resetPassLink}>
<button>Reset Password</button>
      </a>
      </p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload?.id,
      status: UserStatus.ACTIVE,
    },
  });
  const isValidToken = verifyToken(
    token,
    config.JWT.RESET_PASSWORD_TOKEN as string
  );
  console.log(isValidToken);
  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "invalid token");
  }

  const hashedPassword: string = await bcrypt.hash(payload?.password, 10);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "Password recovered successfully",
  };
};

// Exporting the authentication services
export const AuthServices = {
  loginUser,
  refreshToken,
  changePasswordIntoDB,
  forgotPassword,
  resetPassword,
};
