import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { itemCategoryController } from "./item.controller";
import { itemValidations } from "./item.validation";

const router = express.Router();

router.post(
  "/found-items",
  validateRequest(itemValidations.createItem),
  itemCategoryController.createFoundItem
);
router.get("/found-items", itemCategoryController.getFoundItems);
// router.get("/users", userController.getUsers);

export const itemRoutes = router;
