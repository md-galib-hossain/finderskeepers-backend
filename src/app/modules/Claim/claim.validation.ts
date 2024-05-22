import { z } from "zod";

const createClaim = z.object({
  body: z.object({
    foundItemId: z.string({
      required_error: "foundItemId field is required",
    }),
    distinguishingFeatures: z.string({
      required_error: "distinguishingFeatures field is required",
    }),
    lostDate: z.string({
      required_error: "lostDate field is required",
    }),
  }),
});

const updateClaim = z.object({
  body: z.object({
    // foundItemId: z.string({
    //   required_error: "foundItemId field is required",
    // }),
    // distinguishingFeatures: z.string({
    //   required_error: "distinguishingFeatures field is required",
    // }),
    // lostDate: z.string({
    //   required_error: "lostDate field is required",
    // }),
    status: z.string({
      required_error: "lostDate field is required",
    }),
  }),
});

export const claimValidations = { createClaim,updateClaim };
