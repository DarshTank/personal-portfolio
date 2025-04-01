"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Eye, Trash2, Github, Instagram, Linkedin, Twitter, Save, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PortfolioPreview } from "../../../../components/PortfolioPreview";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { Portfolio, PortfolioFormData, PortfolioFormSection, Section } from "../../../../types/portfolio";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import ModernMinimalTemplate from "../../../../templates/1/page";
import CreativeProfessionalTemplate from "../../../../templates/2/page";
import TechFocusedTemplate from "../../../../templates/3/page";
import CorporateProfessionalTemplate from "../../../../templates/4/page";
import TechDeveloperTemplate from "../../../../templates/5/page";
import ResumeStyleTemplate from "../../../../templates/6/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Skill {
  name: string;
  level: number;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function EditPortfolio() {
  const params = useParams();
  const portfolioId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [previewData, setPreviewData] = useState<Portfolio | null>(null);

  const form = useForm<PortfolioFormData>({
    defaultValues: {
      username: "",
      fullname: "",
      role: "",
      brandTitle: "",
      email: "",
      about: "",
      linkedin: "",
      github: "",
      instagram: "",
      twitter: "",
      resumeUrl: "",
      profileImage: "",
      template: "modern-minimal",
      sections: [
        {
          type: "about",
          content: "",
          order: 1,
          isVisible: true
        },
        {
          type: "education",
          content: [],
          order: 2,
          isVisible: true
        },
        {
          type: "skills",
          content: [],
          order: 3,
          isVisible: true
        },
        {
          type: "projects",
          content: [],
          order: 4,
          isVisible: true
        }
      ],
    },
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`/api/portfolios/${portfolioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const data = await response.json();
        setPortfolio(data.portfolio);
        
        // Initialize form with portfolio data
        form.reset({
          username: data.portfolio.username || "",
          fullname: data.portfolio.fullname || "",
          role: data.portfolio.role || "",
          brandTitle: data.portfolio.brandTitle || "",
          email: data.portfolio.email || "",
          about: data.portfolio.about || "",
          linkedin: data.portfolio.linkedin || "",
          github: data.portfolio.github || "",
          instagram: data.portfolio.instagram || "",
          twitter: data.portfolio.twitter || "",
          resumeUrl: data.portfolio.resumeUrl || "",
          profileImage: data.portfolio.profileImage || "",
          template: data.portfolio.template || "modern-minimal",
          sections: data.portfolio.sections || [
            {
              type: "about",
              content: data.portfolio.about || "",
              order: 1,
              isVisible: true
            },
            {
              type: "education",
              content: data.portfolio.education || [],
              order: 2,
              isVisible: true
            },
            {
              type: "skills",
              content: data.portfolio.skills || [],
              order: 3,
              isVisible: true
            },
            {
              type: "projects",
              content: data.portfolio.projects || [],
              order: 4,
              isVisible: true
            }
          ],
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load portfolio",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId, toast, form]);

  // Watch form values for live preview
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!portfolio) return;
      
      const updatedPortfolio = {
        ...portfolio,
        username: value.username || portfolio.username,
        fullname: value.fullname || portfolio.fullname,
        role: value.role || portfolio.role,
        brandTitle: value.brandTitle || portfolio.brandTitle,
        email: value.email || portfolio.email,
        about: value.about || portfolio.about,
        linkedin: value.linkedin || portfolio.linkedin,
        github: value.github || portfolio.github,
        instagram: value.instagram || portfolio.instagram,
        twitter: value.twitter || portfolio.twitter,
        resumeUrl: value.resumeUrl || portfolio.resumeUrl,
        profileImage: value.profileImage || portfolio.profileImage,
        template: value.template || portfolio.template,
        sections: (value.sections || portfolio.sections).filter((section): section is Section => section !== undefined),
      };
      setPortfolio(updatedPortfolio);
      setPreviewData(updatedPortfolio);
    });

    return () => subscription.unsubscribe();
  }, [form, portfolio]);

  const validateForm = (sectionType: string, content: any): boolean => {
    const newErrors: FormErrors = {};
    
    if (sectionType === "profile") {
      if (!content.fullname?.trim()) newErrors.fullname = "Full name is required";
      if (!content.role?.trim()) newErrors.role = "Role is required";
      if (!content.email?.trim()) newErrors.email = "Email is required";
      if (!content.about?.trim()) newErrors.about = "About section is required";
    } else if (sectionType === "education") {
      if (!Array.isArray(content)) {
        newErrors.education = "Education must be an array";
      } else {
        content.forEach((edu: Education, index: number) => {
          if (!edu.degree?.trim()) newErrors[`education.${index}.degree`] = "Degree is required";
          if (!edu.institution?.trim()) newErrors[`education.${index}.institution`] = "Institution is required";
          if (!edu.year?.trim()) newErrors[`education.${index}.year`] = "Year is required";
        });
      }
    } else if (sectionType === "skills") {
      if (!Array.isArray(content)) {
        newErrors.skills = "Skills must be an array";
      } else {
        content.forEach((skill: Skill, index: number) => {
          if (!skill.name?.trim()) newErrors[`skills.${index}.name`] = "Skill name is required";
          if (typeof skill.level !== "number" || skill.level < 0 || skill.level > 100) {
            newErrors[`skills.${index}.level`] = "Skill level must be between 0 and 100";
          }
        });
      }
    } else if (sectionType === "projects") {
      if (!Array.isArray(content)) {
        newErrors.projects = "Projects must be an array";
      } else {
        content.forEach((project: Project, index: number) => {
          if (!project.title?.trim()) newErrors[`projects.${index}.title`] = "Project title is required";
          if (!project.description?.trim()) newErrors[`projects.${index}.description`] = "Project description is required";
          if (!Array.isArray(project.technologies)) {
            newErrors[`projects.${index}.technologies`] = "Technologies must be an array";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSectionUpdate = async (sectionType: string, content: any) => {
    if (!validateForm(sectionType, content)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update the sections array with the new content
      const currentSections = form.getValues("sections");
      const updatedSections = currentSections.map(section => {
        if (section.type === sectionType) {
          return {
            ...section,
            content: content
          };
        }
        return section;
      });

      // Update form with new sections
      form.setValue("sections", updatedSections);

      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sections: updatedSections
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update portfolio");
      }

      const data = await response.json();
      setPortfolio(data.portfolio);
      toast({
        title: "Success",
        description: "Portfolio updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update portfolio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: PortfolioFormData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update portfolio");
      }

      const updatedData = await response.json();
      
      // Update both portfolio and preview data with the latest data from the server
      setPortfolio(updatedData.portfolio);
      setPreviewData(updatedData.portfolio);

      toast({
        title: "Success",
        description: "Portfolio updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update portfolio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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

  // Add file upload handlers
  const onProfileImageDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImageUploading(true);
    setUploadProgress(prev => ({ ...prev, profileImage: 0 }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "profile");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(prev => ({ ...prev, profileImage: progress }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            form.setValue("profileImage", data.url);
            toast({
              title: "Success",
              description: "Profile image uploaded successfully",
            });
            resolve(data);
          } else {
            reject(new Error("Failed to upload image"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Failed to upload image"));
        });

        xhr.open("POST", "/api/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setImageUploading(false);
      setUploadProgress(prev => ({ ...prev, profileImage: 0 }));
    }
  }, [form, toast]);

  const onResumeDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImageUploading(true);
    setUploadProgress(prev => ({ ...prev, resume: 0 }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(prev => ({ ...prev, resume: progress }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            form.setValue("resumeUrl", data.url);
            toast({
              title: "Success",
              description: "Resume uploaded successfully",
            });
            resolve(data);
          } else {
            reject(new Error("Failed to upload resume"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Failed to upload resume"));
        });

        xhr.open("POST", "/api/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload resume",
        variant: "destructive",
      });
      throw error;
    } finally {
      setImageUploading(false);
      setUploadProgress(prev => ({ ...prev, resume: 0 }));
    }
  }, [form, toast]);

  const profileImageDropzone = useDropzone({
    onDrop: onProfileImageDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  });

  const resumeDropzone = useDropzone({
    onDrop: onResumeDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Portfolio
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push(`/dashboard/portfolio/${portfolioId}/preview`)}
          >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
          <Button
            className="flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your role" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter about section" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Template</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="modern-minimal">Modern Minimal</SelectItem>
                            <SelectItem value="business-professional">Business Professional</SelectItem>
                            <SelectItem value="creative-professional">Creative Professional</SelectItem>
                            <SelectItem value="tech-focused">Tech Focused</SelectItem>
                            <SelectItem value="creative-artist">Creative Artist</SelectItem>
                            <SelectItem value="personal-brand">Personal Brand</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div
                                {...profileImageDropzone.getRootProps()}
                                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                              >
                                <input {...profileImageDropzone.getInputProps()} />
                                {field.value ? (
                                  <div className="relative">
                                    <img
                                      src={field.value}
                                      alt="Profile"
                                      className="w-32 h-32 mx-auto rounded-full object-cover"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-0 right-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        form.setValue("profileImage", "");
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                      Drag and drop an image, or click to select
                                    </p>
                                  </div>
                                )}
                              </div>
                              {uploadProgress.profileImage > 0 && (
                                <Progress value={uploadProgress.profileImage} />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div
                                {...resumeDropzone.getRootProps()}
                                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                              >
                                <input {...resumeDropzone.getInputProps()} />
                                {field.value ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">Resume uploaded</span>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        form.setValue("resumeUrl", "");
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                      Drag and drop a PDF resume, or click to select
                                    </p>
                                  </div>
                                )}
                              </div>
                              {uploadProgress.resume > 0 && (
                                <Progress value={uploadProgress.resume} />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter LinkedIn URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter GitHub URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Instagram URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Twitter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
                  <div className="space-y-4">
                    {form.watch("sections")?.filter(section => section.type === "education").map((section, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.degree`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Bachelor of Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.institution`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., University Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2020-2024" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.grade`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 3.8 GPA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const sections = form.getValues("sections");
                            form.setValue(
                              "sections",
                              sections.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const sections = form.getValues("sections");
                        form.setValue("sections", [
                          ...sections,
                          {
                            type: "education",
                            content: {
                              degree: "",
                              institution: "",
                              year: "",
                              grade: "",
                            },
                            isVisible: true,
                          },
                        ]);
                      }}
                    >
                      Add Education
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-4">
                    {form.watch("sections")?.filter(section => section.type === "skills").map((section, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., JavaScript" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.level`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skill Level (0-100)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    placeholder="e.g., 85" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const sections = form.getValues("sections");
                            form.setValue(
                              "sections",
                              sections.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const sections = form.getValues("sections");
                        form.setValue("sections", [
                          ...sections,
                          {
                            type: "skills",
                            content: {
                              name: "",
                              level: 0,
                            },
                            isVisible: true,
                          },
                        ]);
                      }}
                    >
                      Add Skill
                    </Button>
                  </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
                  <div className="space-y-4">
                    {form.watch("sections")?.filter(section => section.type === "projects").map((section, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., E-commerce Website" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your project..." 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.github`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://github.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.image`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`sections.${index}.content.technologies`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Technologies (comma-separated)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., React, Node.js, MongoDB" 
                                    onChange={(e) => {
                                      const technologies = e.target.value.split(',').map(tech => tech.trim());
                                      field.onChange(technologies);
                                    }}
                                    value={field.value?.join(', ') || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const sections = form.getValues("sections");
                            form.setValue(
                              "sections",
                              sections.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const sections = form.getValues("sections");
                        form.setValue("sections", [
                          ...sections,
                          {
                            type: "projects",
                            content: {
                              title: "",
                              description: "",
                              github: "",
                              image: "",
                              technologies: [],
                            },
                            isVisible: true,
                          },
                        ]);
                      }}
                    >
                      Add Project
                    </Button>
                  </div>
        </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  {/* Add section management UI here */}
                  <p className="text-gray-500">Section management coming soon...</p>
        </TabsContent>
      </Tabs>
            </form>
          </Form>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          {(previewData || portfolio) && (
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
              {getTemplateComponent((previewData || portfolio)?.template) && (
                <div className="w-full h-full">
                  {React.createElement(getTemplateComponent((previewData || portfolio)?.template), {
                    portfolio: previewData || portfolio,
                    isPreview: true,
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 