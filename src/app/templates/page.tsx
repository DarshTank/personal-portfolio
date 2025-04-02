"use client";

import { templates } from "../dashboard/templates/data/templates";
import Link from "next/link";
import Image from "next/image";
import MainNav from "@/components/main-nav";
import { PreviewModal } from "./components/PreviewModal";
import { useState } from "react";
import { Template } from "../dashboard/templates/data/templates";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Portfolio Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our professionally designed templates to showcase your work.
            Each template is fully customizable to match your style.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={item}
              className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground/80">
                    Key Features:
                  </h4>
                  <ul className="list-none space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="text-muted-foreground text-sm flex items-center"
                      >
                        <svg
                          className="w-4 h-4 text-primary mr-2 flex-shrink-0"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Preview
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/sign-in">
                      Use Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <PreviewModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}
