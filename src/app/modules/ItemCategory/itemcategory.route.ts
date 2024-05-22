import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryValidations } from "./itemcategory.validation";
import { itemCategoryController } from "./itemcategory.controller";

const router = express.Router();

router.post(
  "/found-item-categories",
  validateRequest(itemCategoryValidations.createItemCategory),
  itemCategoryController.createFoundItemCategory
);
// router.get("/users", userController.getUsers);

export const itemCategoryRoutes = router;
