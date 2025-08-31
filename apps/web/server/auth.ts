"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@cogzy/auth/server";
import { APIError } from "@cogzy/auth/types";

type AuthFormState = { error?: string } | null;

const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signUp(
  invitationId: string | undefined,
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = SignUpSchema.safeParse({
    fullName: formData.get("full-name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.fullName?.join(", ") ||
        validatedFields.error.flatten().fieldErrors.email?.join(", ") ||
        validatedFields.error.flatten().fieldErrors.password?.join(", "),
    };
  }

  const { fullName, email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: fullName,
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    console.error("Sign-up failed:", error);
    return { error: "An unexpected error occurred during sign-up." };
  }

  if (invitationId) {
    redirect(`/invitation/${invitationId}`);
  }

  redirect("/onboard");
}

const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function signIn(
  invitationId: string | undefined,
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Please enter a valid email and password.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    console.error("Sign-in failed:", error);
    return { error: "Invalid email or password." };
  }

  if (invitationId) {
    redirect(`/invitation/${invitationId}`);
  }

  redirect("/dashboard");
}
