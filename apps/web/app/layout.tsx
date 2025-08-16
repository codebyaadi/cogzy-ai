import "@cogzy/ui/globals.css";
import { Providers } from "@/components/providers";
import { fontRecursive } from "./fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontRecursive.variable} font-recursive antialiased `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
