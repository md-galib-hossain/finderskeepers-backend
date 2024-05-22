import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { claimController } from "./claim.controller";
import { claimValidations } from "./claim.validation";

const router = express.Router();

router.post(
  "/claims",
  validateRequest(claimValidations.createClaim),
  claimController.createClaim
);
router.get("/claims", claimController.getClaims);
router.put(
  "/claims/:claimId",
  validateRequest(claimValidations.updateClaim),
  claimController.updateClaim
);
// router.get("/users", userController.getUsers);

export const claimRoutes = router;
