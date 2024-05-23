import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { claimController } from "./claim.controller";
import { claimValidations } from "./claim.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/claims",
  validateRequest(claimValidations.createClaim),
  claimController.createClaim
);
router.get("/claims", claimController.getClaims);
router.get('/my-claims',
auth(UserRole.USER),
claimController.getMyClaims)
router.put(
  "/claims/:claimId",
  validateRequest(claimValidations.updateClaim),
  claimController.updateClaim
);
// router.get("/users", userController.getUsers);

export const claimRoutes = router;
