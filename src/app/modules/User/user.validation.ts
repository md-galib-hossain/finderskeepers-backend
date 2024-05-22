import { z } from "zod";

const createUser = z.object({
  body: z.object({
    name: z.string({
      required_error: "name field is required",
    }),
    email: z.string({
      required_error: "email field is required",
    }),
    password: z.string({
      required_error: "password field is required",
    }),
    profile: z.object({
      bio: z.string({
        required_error: "bio field is required",
      }),

      age: z.number({
        required_error: "age field is required",
      }),
    }),
  }),
});

const updateUserProfile = z.object({
  body: z.object({
    bio: z.string().optional(),

    age: z.number().optional(),
  }),
});

export const userValidations = { createUser ,updateUserProfile};
