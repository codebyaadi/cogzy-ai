"use server";

import { redirect } from "next/navigation";
import { auth } from "@cogzy/auth/server";
import { APIError } from "@cogzy/auth/types";
import { SignInSchema, SignUpSchema } from "@cogzy/validator/schema/auth";

type AuthFormState = { error?: string } | null;

export async function signUp(
  invitationId: string | undefined,
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.issues
      .map((issue) => issue.message)
      .join(", ");

    return { error };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: name,
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
