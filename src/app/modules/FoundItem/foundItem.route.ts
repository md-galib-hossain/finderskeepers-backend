import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FoundItemController } from "./foundItem.controller";
import { FoundItemValidations } from "./foundItem.validation";
import { fileUploader } from "../../utils/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/found-items",
  validateRequest(FoundItemValidations.createItem),
  FoundItemController.createFoundItem
);
router.get("/found-items", FoundItemController.getFoundItems);
router.patch(
  "/found-items",
  auth(UserRole.USER),
  validateRequest(FoundItemValidations.updateItem),
  FoundItemController.updateFoundItem
);
router.patch(
  "/found-items/:id",
  auth(UserRole.USER),
  FoundItemController.markAsClaimedMyFoundItem
);
router.get(
  "/my-founditems",
  auth(UserRole.USER),
  FoundItemController.getMyFoundItems
);
// router.get("/users", userController.getUsers);

export const FoundItemRoutes = router;
