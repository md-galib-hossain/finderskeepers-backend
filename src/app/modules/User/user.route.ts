import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidations.createUser),
  userController.createUser
);
router.get("/users", userController.getUsers);
router.get("/my-profile", userController.getMyProfile);
router.put("/my-profile",validateRequest(userValidations.updateUserProfile), userController.updateMyProfile);

export const userRoutes = router;
