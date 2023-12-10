import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/utils/ui";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased px-4",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="min-h-screen py-2">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
