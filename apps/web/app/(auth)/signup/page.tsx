"use client";

import { Button } from "@cogzy/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cogzy/ui/components/card";
import { Checkbox } from "@cogzy/ui/components/checkbox";
import { Input } from "@cogzy/ui/components/input";
import { Label } from "@cogzy/ui/components/label";
import Link from "next/link";
import { signUp } from "@/server/auth";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-transparent text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Create an Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your details to get started with Cogzy AI.
          </CardDescription>
        </CardHeader>
        {/* The 'action' prop directly calls your server action on form submission */}
        <form action={signUp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="full-name"
                placeholder="John Doe"
                required
                className=""
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
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className=""
              />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" required />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-white hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-white hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full bg-white text-black hover:bg-slate-200"
              type="submit" // Ensure the button type is "submit" to trigger the form action
            >
              Create Account
            </Button>
            <div className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-white hover:underline"
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
