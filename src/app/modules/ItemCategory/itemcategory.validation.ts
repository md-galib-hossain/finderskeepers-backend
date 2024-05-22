import { z } from "zod";

const createItemCategory = z.object({
  body: z.object({
    name: z.string({
      required_error: "name field is required",
    }),
  }),
});

export const itemCategoryValidations = { createItemCategory };
