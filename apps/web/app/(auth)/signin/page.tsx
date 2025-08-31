import { SignInForm } from "../_components/signin-form";

interface SignInPageProps {
  searchParams: Promise<{
    invitationId?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { invitationId } = await searchParams;

  return <SignInForm invitationId={invitationId} />;
}
