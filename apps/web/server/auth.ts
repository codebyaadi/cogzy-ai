"use server";

import { redirect } from "next/navigation";
import { auth } from "@cogzy/auth/server";
import { APIError } from "@cogzy/auth/types";

type AuthFormState = { error?: string; success?: boolean } | null;

export async function signUp(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full-name") as string;
  const invitationId = formData.get("invitationId") as string | null;

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
      console.log(error.message, error.status);
      return { error: error.message };
    }
    console.error("Sign-up failed:", error);
    return { error: "Sign Up failed." };
  }

  if (invitationId) {
    redirect(`/invitation/${invitationId}`);
  }

  redirect("/onboard");
}

export async function signIn(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const invitationId = formData.get("invitationId") as string | null;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
      return { error: error.message };
    }
    console.error("Sign-in failed:", error);
    return { error: "Invalid email or password." };
  }

  if (invitationId) {
    redirect(`/invitation/${invitationId}`);
  }

  redirect("/dashboard");
  return { success: true };
}
