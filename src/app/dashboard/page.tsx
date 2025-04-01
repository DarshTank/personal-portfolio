"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/app/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const fetchPortfolios = async () => {
      try {
        const response = await fetch("/api/portfolios");
        if (!response.ok) {
          throw new Error("Failed to fetch portfolios");
        }

        const data = await response.json();
        setPortfolios(data.portfolios || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPortfolios();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio");
      }

      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete portfolio");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Portfolios</h1>
        <Button onClick={() => router.push("/create-portfolio")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Portfolio
        </Button>
      </div>

      {!portfolios || portfolios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-lg text-gray-600 mb-4">
              You haven&apos;t created any portfolios yet
            </p>
            <Button onClick={() => router.push("/create-portfolio")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id}>
              <CardHeader>
                <CardTitle>{portfolio.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {portfolio.description}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/portfolio/${portfolio.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/edit-portfolio/${portfolio.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(portfolio.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}