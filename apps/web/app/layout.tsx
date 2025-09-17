import "@cogzy/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@cogzy/ui/components/sonner";
import { fontOutfit } from "./fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontOutfit.variable} font-outfit antialiased `}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
