"use client";

import { useState } from "react";
import { templates } from "./data/templates";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      setSelectedTemplate(templateId);
      
      const response = await fetch("/api/portfolios/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: templateId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Portfolio created successfully! Redirecting to editor...",
      });

      router.push(`/dashboard/portfolio/${data.id}/edit`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create portfolio",
        variant: "destructive",
      });
    } finally {
      setSelectedTemplate(null);
    }
  };

  const handlePreview = (templateId: string) => {
    router.push(`/dashboard/templates/${templateId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Template</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select a template to start building your portfolio. You can customize it later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="relative h-48 group cursor-pointer" onClick={() => handlePreview(template.id)}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <div className="text-2xl font-bold text-white text-center p-4">
                  {template.name}
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {template.description}
              </p>
              <ul className="space-y-2">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg
                      className="h-4 w-4 mr-2 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handlePreview(template.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleTemplateSelect(template.id)}
                disabled={selectedTemplate !== null}
              >
                {selectedTemplate === template.id ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </div>
                ) : (
                  "Use this template"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}