"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { Button } from "@cogzy/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cogzy/ui/components/card";
import { Input } from "@cogzy/ui/components/input";
import { Label } from "@cogzy/ui/components/label";
import { signUp } from "@/server/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <LoaderCircle className="animate-spin" /> : "Create Account"}
    </Button>
  );
}

interface SignUpFormProps {
  invitationId?: string;
}

export function SignUpForm({ invitationId }: SignUpFormProps) {
  const signUpWithInvitation = signUp.bind(null, invitationId);
  const [state, formAction] = useActionState(signUpWithInvitation, null);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-transparent text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Create an Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            {invitationId
              ? "Create an account to accept your invitation."
              : "Enter your details to get started."}
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="full-name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href={
                  invitationId
                    ? `/signin?invitationId=${invitationId}`
                    : "/signin"
                }
                className="font-semibold"
              >
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
