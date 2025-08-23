import "@cogzy/ui/globals.css";
import { Providers } from "@/components/providers";
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
      </body>
    </html>
  );
}
