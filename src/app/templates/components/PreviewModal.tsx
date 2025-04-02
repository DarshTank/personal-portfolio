import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Template } from "../../dashboard/templates/data/templates";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

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
      type: "experience",
      title: "Experience",
      content: [
        {
          company: "Tech Solutions Inc.",
          position: "Senior Developer",
          startDate: "2022",
          endDate: "Present",
          description: "Leading development of web applications using modern technologies."
        }
      ]
    },
    {
      type: "projects",
      title: "Projects",
      content: [
        {
          title: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform using Next.js and Node.js",
          link: "https://example.com"
        }
      ]
    },
    {
      type: "skills",
      title: "Skills",
      content: ["React", "TypeScript", "Node.js", "Next.js", "MongoDB"]
    }
  ]
};

export function PreviewModal({ template, isOpen, onClose }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "preview">("info");
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);

  useEffect(() => {
    if (template && activeTab === "preview") {
      // Dynamically import the template component
      const loadTemplate = async () => {
        try {
          const TemplateComponent = dynamic(
            () => import(`../../dashboard/templates/${template.id}/page`),
            {
              loading: () => <div>Loading template...</div>,
              ssr: false
            }
          );
          setTemplateComponent(() => TemplateComponent);
        } catch (error) {
          console.error("Error loading template:", error);
        }
      };
      loadTemplate();
    }
  }, [template, activeTab]);

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-background border-border">
        <div className="sticky top-0 bg-background/90 backdrop-blur-sm p-4 border-b border-border z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{template.name}</h2>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "info" ? "default" : "outline"}
              onClick={() => setActiveTab("info")}
            >
              Information
            </Button>
            <Button
              variant={activeTab === "preview" ? "default" : "outline"}
              onClick={() => setActiveTab("preview")}
            >
              Live Preview
            </Button>
          </div>
        </div>

        <div className="h-[calc(90vh-5rem)] overflow-auto">
          {activeTab === "info" ? (
            <div className="p-4 space-y-6">
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-muted-foreground"
                    >
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="relative h-full bg-background">
              {TemplateComponent && (
                <TemplateComponent portfolio={samplePortfolio} isPreview={true} />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
