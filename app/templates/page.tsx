"use client";

import { useRouter } from "next/navigation";
import { templates } from "../data/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Template</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a template that best represents your professional journey. Each template is designed to showcase your skills and experience in a unique way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Responsive design</li>
                <li>• Easy to customize</li>
                <li>• Professional layout</li>
                <li>• Mobile-friendly</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Previewing template:', template.id);
                  router.push(`/templates/preview/${template.id}`);
                }}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => router.push("/dashboard/create")}
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}