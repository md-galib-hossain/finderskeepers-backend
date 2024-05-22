import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./user.validation";

const router = express.Router();
router.post(
  "/login",
  validateRequest(authValidations.loginUser),
  AuthController.loginUser
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/change-password", AuthController.changePassword);
router.post(
  "/forgot-password",

  AuthController.forgotPassword
);
router.post(
  "/reset-password",

  AuthController.resetPassword
);

export const AuthRoutes = router;
