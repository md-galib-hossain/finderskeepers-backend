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
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = FoundItemValidations.createItem.parse(
      JSON.parse(req.body.data)
    );
    return FoundItemController.createFoundItem(req, res, next);
  }
);
router.get("/found-items", FoundItemController.getFoundItems);
router.get('/my-founditems',
auth(UserRole.USER),
FoundItemController.getMyFoundItems)
// router.get("/users", userController.getUsers);

export const FoundItemRoutes = router;
