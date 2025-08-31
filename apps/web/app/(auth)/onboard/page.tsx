import { createOrganization } from "@/server/organization";
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

export default function OnboardingPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Create Your Organization
          </CardTitle>
          <CardDescription className="text-slate-400">
            Let's get your team set up. What's the name of your organization?
          </CardDescription>
        </CardHeader>
        <form action={createOrganization}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                name="org-name"
                placeholder="Acme Inc."
                required
                className=""
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-white text-black hover:bg-slate-200">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
