"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/app/types/portfolio";
import ModernMinimalTemplate from "@/app/dashboard/templates/1/page";
import CreativeProfessionalTemplate from "@/app/dashboard/templates/2/page";
import TechFocusedTemplate from "@/app/dashboard/templates/3/page";
import CorporateProfessionalTemplate from "@/app/dashboard/templates/4/page";
import TechDeveloperTemplate from "@/app/dashboard/templates/5/page";
import ResumeStyleTemplate from "@/app/dashboard/templates/6/page";
import { Loader2 } from "lucide-react";

const getTemplateComponent = (templateId: string) => {
  switch (templateId) {
    case "modern-minimal":
      return ModernMinimalTemplate;
    case "business-professional":
      return CreativeProfessionalTemplate;
    case "creative-professional":
      return TechFocusedTemplate;
    case "tech-focused":
      return CorporateProfessionalTemplate;
    case "creative-artist":
      return TechDeveloperTemplate;
    case "personal-brand":
      return ResumeStyleTemplate;
    default:
      return ModernMinimalTemplate;
  }
};

export default function PortfolioPreview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`/api/portfolios/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const data = await response.json();
        
        // Transform the data to match the expected format
        const transformedPortfolio = {
          ...data.portfolio,
          skills: data.portfolio.skills?.map((skill: any) => ({
            name: skill.name,
            level: skill.level || 0
          })) || [],
          education: data.portfolio.education?.map((edu: any) => ({
            degree: edu.degree,
            institution: edu.institution,
            year: `${edu.startDate} - ${edu.endDate}`,
            grade: edu.description
          })) || [],
          projects: data.portfolio.projects?.map((project: any) => ({
            title: project.title,
            description: project.description,
            technologies: project.technologies || [],
            link: project.link,
            image: project.image,
            startDate: project.startDate,
            endDate: project.endDate
          })) || []
        };

        setPortfolio(transformedPortfolio);
      } catch (error: any) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Portfolio not found</p>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(portfolio.template || "modern-minimal");

  return (
    <div className="w-full">
      <TemplateComponent portfolio={portfolio} isPreview={true} />
    </div>
  );
} 