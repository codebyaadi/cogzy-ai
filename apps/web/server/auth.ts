"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full-name") as string;

  await auth.api.signUpEmail({
    body: {
      name: fullName,
      email,
      password,
    },
  });

  redirect("/login");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/dashboard");
}
