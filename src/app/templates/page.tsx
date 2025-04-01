"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import MainNav from "@/components/main-nav";

const templates = [
  {
    id: 1,
    name: "Modern Professional",
    description: "A clean and modern design perfect for professionals.",
    image: "/images/templates/modern.png",
  },
  {
    id: 2,
    name: "Creative Portfolio",
    description: "Showcase your creative work with this artistic template.",
    image: "/images/templates/creative.png",
  },
  {
    id: 3,
    name: "Minimal Resume",
    description: "A minimalist design focusing on your experience.",
    image: "/images/templates/minimal.png",
  },
  {
    id: 4,
    name: "Developer Portfolio",
    description: "Perfect for showcasing your coding projects.",
    image: "/images/templates/developer.png",
  },
  {
    id: 5,
    name: "Photography Portfolio",
    description: "Designed to highlight your visual work.",
    image: "/images/templates/photography.png",
  },
  {
    id: 6,
    name: "Business Card",
    description: "A professional template for business networking.",
    image: "/images/templates/business.png",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleTemplateSelect = (templateId: number) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a portfolio with this template.",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    router.push(`/dashboard/create?template=${templateId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Portfolio Templates
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates. Each template 
            is fully customizable to match your personal brand and showcase your work effectively.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="group overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5"
            >
              <div className="aspect-video relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 z-10" />
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-6 relative z-20">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{template.name}</h3>
                <p className="text-muted-foreground mb-6">
                  {template.description}
                </p>
                <Button
                  className="w-full bg-primary/90 hover:bg-primary transition-colors"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
