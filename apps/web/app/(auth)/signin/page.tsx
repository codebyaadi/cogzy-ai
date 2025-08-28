"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn } from "@/server/auth";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full ...">
      {pending ? <LoaderCircle className="animate-spin" /> : "Log In"}
    </Button>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  const [state, formAction] = useActionState(signIn, null);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl ...">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            {invitationId
              ? "Log in to accept your invitation."
              : "Log in to access your documents."}
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid gap-4">
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
            {/* Add the hidden input if invitationId exists */}
            {invitationId && (
              <input type="hidden" name="invitationId" value={invitationId} />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <div className="text-center text-sm ...">
              Don&apos;t have an account?{" "}
              <Link
                href={
                  invitationId
                    ? `/signup?invitationId=${invitationId}`
                    : "/signup"
                }
                className="font-semibold ..."
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
