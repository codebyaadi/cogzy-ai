import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@cogzy/auth/server";
import { acceptInvitation } from "@/server/organization";
import { Button } from "@cogzy/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cogzy/ui/components/card";

async function AcceptButton({ invitationId }: { invitationId: string }) {
  "use server";
  return (
    <form
      action={async () => {
        "use server";
        await acceptInvitation(invitationId);
      }}
    >
      <Button type="submit" className="w-full">
        Accept Invitation
      </Button>
    </form>
  );
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // --- Logic as per your request ---
  // Only try to fetch details if the user is logged in.
  if (session?.user) {
    try {
      const invitationDetails = await auth.api.getInvitation({
        query: { id: invitationId },
        headers: await headers(),
      });

      const { email: invitedEmail } = invitationDetails;

      // Logged in with the CORRECT email
      if (session.user.email === invitedEmail) {
        return (
          <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Join {invitationDetails.organizationName}</CardTitle>
                <CardDescription>
                  You're invited as {session.user.email}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AcceptButton invitationId={invitationId} />
              </CardContent>
            </Card>
          </div>
        );
      }
      // Logged in with the WRONG email
      else {
        return (
          <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Wrong Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This invitation is for <strong>{invitedEmail}</strong>, but
                  you are logged in as <strong>{session.user.email}</strong>.
                </p>
                <p>Please log out and click the invitation link again.</p>
              </CardContent>
            </Card>
          </div>
        );
      }
    } catch (error) {
      // This will catch errors if the invitation is invalid for a logged-in user.
      return (
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Invitation Invalid</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This invitation link is either invalid or has expired.</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // --- Logged-out user flow ---
  // We do NOT call the API. The user sees a generic message.
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>You've been invited to join an organization!</CardTitle>
          <CardDescription>
            To accept the invitation, please sign in or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild>
            <Link href={`/signin?invitationId=${invitationId}`}>
              Sign In to Accept
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/signup?invitationId=${invitationId}`}>
              Create Account to Accept
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
