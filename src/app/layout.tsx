"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthProvider from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Portfolio Maker</title>
        <meta name="description" content="Create and manage your professional portfolio" />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <header className="border-b">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-2xl font-bold">
                    Portfolio Maker
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/templates"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Templates
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Contact
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
            </header> */}

            <main>{children}</main>

            {/* <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2024 Portfolio Maker. All rights reserved.
                </p>
                <nav className="flex items-center gap-4 text-sm">
                  <Link
                    href="/privacy"
                    className="text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Terms
                  </Link>
                </nav>
              </div>
            </footer> */}

            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}