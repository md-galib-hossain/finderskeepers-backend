import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";
import { verifyToken } from "../modules/Auth/auth.utils";
import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import prisma from "../utils/prisma";
import { UserStatus } from "@prisma/client";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req?.headers?.authorization;
      console.log({token})
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "you are unauthorized");
      }
      const verifiedUser = verifyToken(
        token,
        config.JWT.ACCESS_TOKEN_SECRET as Secret
      );

      console.log(verifiedUser)
      if(verifiedUser && await prisma.user.findUnique({where : { id : verifiedUser.id , status : UserStatus.INACTIVE}})){
        throw new AppError(httpStatus.UNAUTHORIZED, "you are unauthorized");

      }
      if (!verifiedUser || verifiedUser && roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "you are unauthorized");
      }
      req.user = verifiedUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};
export default auth;
