"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
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
      </div>
    );
  }

  return <div className="min-h-screen">{children}</div>;
}