"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { templates } from "../../../data/templates";
import { Template } from "../../../types/template";
import { Portfolio } from "../../../types/portfolio";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TemplatePreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const foundTemplate = templates.find((t: Template) => t.id === resolvedParams.id);
    if (!foundTemplate) {
      toast.error("Template not found");
      router.push("/templates");
      return;
    }
    setTemplate(foundTemplate);
    setIsLoading(false);
  }, [resolvedParams.id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Template not found</h2>
          <Button onClick={() => router.push("/templates")}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  const TemplateComponent = template.component;

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/templates")}
          className="rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-full overflow-auto">
        <TemplateComponent portfolio={template.preview} />
      </div>
    </div>
  );
} 