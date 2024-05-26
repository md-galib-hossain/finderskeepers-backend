import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryValidations } from "./itemcategory.validation";
import { itemCategoryController } from "./itemcategory.controller";

const router = express.Router();

router.post(
  "/item-categories",
  validateRequest(itemCategoryValidations.createItemCategory),
  itemCategoryController.createItemCategory
);
router.get("/item-categories", itemCategoryController.getCategories);

export const itemCategoryRoutes = router;
