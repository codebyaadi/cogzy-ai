import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black p-4 text-slate-50">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      {/* The children (login/signup card) will be rendered here */}
      <main className="w-full">{children}</main>
    </div>
  );
}
