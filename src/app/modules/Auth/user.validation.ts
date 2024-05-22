import { z } from "zod";

const loginUser = z.object({
  body: z.object({
    email: z.string({
      required_error: "email field is required",
    }),
    password: z.string({
      required_error: "password field is required",
    }),
  }),
});

export const authValidations = { loginUser };
