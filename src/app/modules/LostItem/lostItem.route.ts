import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryController } from "./lostItem.controller";
import { itemValidations } from "./lostItem.validation";

const router = express.Router();


router.post(
  "/lost-items",
  validateRequest(itemValidations.createItem),
  itemCategoryController.createLostItem
);
router.get("/lost-items", itemCategoryController.getLostItems);
// router.get("/users", userController.getUsers);

export const LostItemRoutes = router;
