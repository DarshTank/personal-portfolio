"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Portfolio } from "@/app/types/portfolio";

export default function EditPortfolio({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolios/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        toast({
          title: "Error",
          description: "Failed to fetch portfolio",
          variant: "destructive",
        });
      }
    };

    fetchPortfolio();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolio) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/portfolios/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolio),
      });

      if (!response.ok) {
        throw new Error("Failed to update portfolio");
      }

      toast({
        title: "Success",
        description: "Portfolio updated successfully",
      });
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Portfolio Title</Label>
                <Input
                  id="title"
                  value={portfolio.title}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={portfolio.description}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sections</h2>
            <div className="space-y-4">
              {portfolio.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <Label>{section.title}</Label>
                  {typeof section.content === "string" ? (
                    <Textarea
                      value={section.content}
                      onChange={(e) => {
                        const newSections = [...portfolio.sections];
                        newSections[index] = {
                          ...section,
                          content: e.target.value,
                        };
                        setPortfolio({ ...portfolio, sections: newSections });
                      }}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      Complex content editor not implemented
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}