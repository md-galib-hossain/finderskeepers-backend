import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryController } from "./foundItem.controller";
import { itemValidations } from "./foundItem.validation";

const router = express.Router();

router.post(
  "/found-items",
  validateRequest(itemValidations.createItem),
  itemCategoryController.createFoundItem
);
router.get("/found-items", itemCategoryController.getFoundItems);
// router.get("/users", userController.getUsers);

export const FoundItemRoutes = router;
