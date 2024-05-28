import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LostItemController } from "./lostItem.controller";
import { LostItemValidations } from "./lostItem.validation";
import { fileUploader } from "../../utils/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/lost-items",
  validateRequest(LostItemValidations.createItem),
  LostItemController.createLostItem
);
router.get("/lost-items", LostItemController.getLostItems);
router.delete(
  "/lost-items/:id",
  auth(UserRole.USER),
  LostItemController.softDeleteMyLostItem
);
router.patch(
  "/lost-items/:id",
  auth(UserRole.USER),
  LostItemController.markAsFoundMyLostItem
);
router.patch(
  "/lost-items",
  auth(UserRole.USER),
  validateRequest(LostItemValidations.updateItem),
  LostItemController.updateLostItem
);
router.get(
  "/my-lostitems",
  auth(UserRole.USER),
  LostItemController.getMyLostItems
);
// router.get("/users", userController.getUsers);

export const LostItemRoutes = router;
