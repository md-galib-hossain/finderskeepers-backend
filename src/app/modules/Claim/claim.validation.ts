import { z } from "zod";

const createClaim = z.object({
  body: z.object({
    foundItemId: z.string({
      required_error: "foundItemId field is required",
    }),
    lostItemId: z.string({
      required_error: "lostItemId field is required",
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
    foundItemId: z.string().optional(),
    lostItemId: z.string().optional(),
    distinguishingFeatures: z.string().optional(),
    lostDate: z.string().optional(),
    sttatus : z.enum(["PENDING","APPROVED","REJECTED"]).optional()
  }),
});

export const claimValidations = { createClaim,updateClaim };
