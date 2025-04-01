"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (you can implement your own auth check)
    const session = localStorage.getItem("session");
    setIsAuthenticated(!!session);
  }, []);

  const SignInPrompt = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed top-4 right-4">
          Sign In to Use Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In Required</DialogTitle>
          <DialogDescription>
            Please sign in or create an account to use this template.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen">
      {!isAuthenticated && <SignInPrompt />}
      {children}
    </div>
  );
} 