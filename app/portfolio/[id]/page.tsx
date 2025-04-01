"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Portfolio } from "@/app/types/portfolio";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ModernMinimalTemplate from "@/app/templates/1/page";
import CreativeProfessionalTemplate from "@/app/templates/2/page";
import TechFocusedTemplate from "@/app/templates/3/page";
import CreativeArtistTemplate from "@/app/templates/4/page";
import BusinessProfessionalTemplate from "@/app/templates/5/page";
import ResumeStyleTemplate from "@/app/templates/6/page";

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolios/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }
        const data = await response.json();
        setPortfolio(data.portfolio);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPortfolio();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || "Portfolio not found"}</div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (portfolio.template) {
      case "modern-minimal":
        return <ModernMinimalTemplate portfolio={portfolio} />;
      case "creative-professional":
        return <CreativeProfessionalTemplate portfolio={portfolio} />;
      case "tech-focused":
        return <TechFocusedTemplate portfolio={portfolio} />;
      case "creative-artist":
        return <CreativeArtistTemplate portfolio={portfolio} />;
      case "business-professional":
        return <BusinessProfessionalTemplate portfolio={portfolio} />;
      case "resume-style":
        return <ResumeStyleTemplate portfolio={portfolio} />;
      default:
        return <ModernMinimalTemplate portfolio={portfolio} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      {renderTemplate()}
    </div>
  );
} 