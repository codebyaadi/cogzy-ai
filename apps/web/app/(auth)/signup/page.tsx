import { SignUpForm } from "../_components/signup-form";

interface SignUpPageProps {
  searchParams: Promise<{
    invitationId?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { invitationId } = await searchParams;

  return <SignUpForm invitationId={invitationId} />;
}
