import { z } from "zod";

export const SignUpSchema = z.object({
  "full-name": z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  invitationId: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
  invitationId: z.string().optional(),
});
