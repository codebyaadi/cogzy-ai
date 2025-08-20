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
import { Input } from "@cogzy/ui/components/input"; // Assuming you have an Input component
import { Label } from "@cogzy/ui/components/label"; // Assuming you have a Label component
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Log in to access your documents.
          </CardDescription>
        </CardHeader>
        <form action={signIn}>
          <CardContent className="grid gap-4">
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-white text-black hover:bg-slate-200">
              Log In
            </Button>
            <div className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-white hover:underline"
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
