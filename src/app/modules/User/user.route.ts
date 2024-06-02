import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post(
  "/user/register",
  validateRequest(userValidations.createUser),
  userController.createUser
);
router.get("/users",auth(UserRole.ADMIN,UserRole.SUPERADMIN), userController.getUsers);
router.get("/users/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN), userController.getSingleUser);
router.patch("/users/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN), userController.updateUserStatus);
router.get("/my-profile", userController.getMyProfile);
router.patch("/my-profile",validateRequest(userValidations.updateUserProfile), userController.updateMyProfile);

export const userRoutes = router;
