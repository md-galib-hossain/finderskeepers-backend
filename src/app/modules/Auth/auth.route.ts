import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.post(
  "/login",
  validateRequest(authValidations.loginUser),
  AuthController.loginUser
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/change-password", auth(UserRole.USER,UserRole.ADMIN,UserRole.SUPERADMIN),AuthController.changePassword);
router.post(
  "/forgot-password",

  AuthController.forgotPassword
);
router.post(
  "/reset-password",

  AuthController.resetPassword
);

export const AuthRoutes = router;
