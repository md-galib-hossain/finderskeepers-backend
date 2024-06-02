import { z } from "zod";

const createItem = z.object({

  body : z.object({
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
  })
 
});

const updateItem = z.object({
  body: z.object({
   id: z.string({
     required_error: "Found item id field is required",
   }),
   categoryId: z.string().optional(),
   name: z.string().optional(),
   description: z.string().optional(),
   location: z.string().optional(),
  })
 });

export const FoundItemValidations = { createItem,updateItem };
