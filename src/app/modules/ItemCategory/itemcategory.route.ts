import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryValidations } from "./itemcategory.validation";
import { itemCategoryController } from "./itemcategory.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/item-categories",
  auth(UserRole.ADMIN,UserRole.SUPERADMIN),
  validateRequest(itemCategoryValidations.createItemCategory),
  itemCategoryController.createItemCategory
);
router.patch(
  "/item-categories/:id",
  auth(UserRole.ADMIN,UserRole.SUPERADMIN),
  itemCategoryController.updateCategory
);
router.post(
  "/item-categories",
  validateRequest(itemCategoryValidations.createItemCategory),
  itemCategoryController.createItemCategory
);
router.get("/item-categories", itemCategoryController.getCategories);

export const itemCategoryRoutes = router;
