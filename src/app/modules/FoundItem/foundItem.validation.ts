import { z } from "zod";

const createItem = z.object({
  body: z.object({
    categoryId: z.string({
      required_error: "categoryId field is required",
    }),
    name: z.string({
      required_error: "name field is required",
    }),
    description: z.string({
      required_error: "description field is required",
    }),
    location: z.string({
      required_error: "location field is required",
    }),
  }),
});

export const itemValidations = { createItem };
