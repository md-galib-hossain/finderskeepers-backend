import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LostItemController } from "./lostItem.controller";
import { LostItemValidations } from "./lostItem.validation";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();


router.post(
  "/lost-items",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = LostItemValidations.createItem.parse(
      JSON.parse(req.body.data)
    );
    return LostItemController.createLostItem(req, res, next);
  }
);
router.get("/lost-items", LostItemController.getLostItems);
// router.get("/users", userController.getUsers);

export const LostItemRoutes = router;
