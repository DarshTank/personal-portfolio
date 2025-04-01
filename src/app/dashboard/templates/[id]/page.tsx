"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { templates } from "../data/templates";

// Sample portfolio data for preview
const samplePortfolio = {
  title: "John Doe",
  description: "Full Stack Developer",
  sections: [
    {
      type: "about",
      title: "About Me",
      content: "A passionate developer with experience in modern web technologies."
    },
    {
      type: "education",
      title: "Education",
      content: [
        {
          school: "University of Technology",
          degree: "Bachelor of Computer Science",
          field: "Computer Science",
          startDate: "2018",
          endDate: "2022"
        }
      ]
    },
    {
      type: "skills",
      title: "Skills",
      content: ["React", "Node.js", "TypeScript", "Next.js", "MongoDB"]
    },
    {
      type: "projects",
      title: "Projects",
      content: [
        {
          title: "E-commerce Platform",
          description: "A modern e-commerce solution built with Next.js",
          technologies: ["Next.js", "MongoDB", "Stripe"],
          link: "https://example.com",
          github: "https://github.com/example"
        }
      ]
    }
  ],
  resumeUrl: "#",
  email: "john@example.com",
  phone: "+1234567890",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe"
};

export default function TemplatePreview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [Template, setTemplate] = useState<any>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Import the template component directly using the ID
        const TemplateComponent = dynamic(() => import(`../${params.id}/page`), {
          loading: () => (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ),
        });
        setTemplate(() => TemplateComponent);
      } catch (error) {
        console.error("Error loading template:", error);
      }
    };

    loadTemplate();
  }, [params.id]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/templates")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Templates</span>
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/portfolios/create", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        template: params.id,
                      }),
                    });

                    if (!response.ok) {
                      throw new Error("Failed to create portfolio");
                    }

                    const data = await response.json();
                    router.push(`/dashboard/portfolio/${data.id}/edit`);
                  } catch (error) {
                    console.error("Error creating portfolio:", error);
                  }
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Template Preview */}
      <div className="pt-16">
        {Template && <Template portfolio={samplePortfolio} isPreview={true} />}
      </div>
    </div>
  );
}
