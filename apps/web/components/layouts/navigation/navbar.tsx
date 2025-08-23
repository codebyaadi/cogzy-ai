import CogzyLogo from "@/components/logo";
import { Button } from "@cogzy/ui/components/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 border-b border-[#727DA1]/25 flex justify-center before:absolute before:inset-0 before:-z-10 bg-black">
      <nav className="flex h-16 mx-8 grow justify-between text-[13px] leading-[100%]">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex font-outfit justify-center items-center gap-1"
          >
            <CogzyLogo />
            <h1 className="text-base">Cogzy.</h1>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" className="font-medium">
            <Link href="/signin">Log In</Link>
          </Button>
          <Button variant="default" className="font-medium">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
