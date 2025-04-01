"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface PortfolioFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function PortfolioForm({ initialData, isEditing = false }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    fullname: initialData?.fullname || "",
    role: initialData?.role || "",
    brandTitle: initialData?.brandTitle || "",
    profileImage: initialData?.profileImage || "",
    about: initialData?.about || "",
    linkedin: initialData?.linkedin || "",
    github: initialData?.github || "",
    instagram: initialData?.instagram || "",
    twitter: initialData?.twitter || "",
    resumeUrl: initialData?.resumeUrl || "",
    skills: initialData?.skills || [{ content: "" }],
    education: initialData?.education || [
      {
        degree: "",
        institution: "",
        year: "",
        grade: "",
      },
    ],
    projects: initialData?.projects || [
      {
        title: "",
        description: "",
        github: "",
        image: "",
        technologies: [""],
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        isEditing ? `/api/portfolios/${initialData._id}` : "/api/portfolios",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        isEditing
          ? "Portfolio updated successfully!"
          : "Portfolio created successfully!"
      );
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload resume");
      }

      setFormData({ ...formData, resumeUrl: data.url });
      toast.success("Resume uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { content: "" }],
    });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          year: "",
          grade: "",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          title: "",
          description: "",
          github: "",
          image: "",
          technologies: [""],
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              required
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandTitle">Brand Title</Label>
            <Input
              id="brandTitle"
              required
              value={formData.brandTitle}
              onChange={(e) =>
                setFormData({ ...formData, brandTitle: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input
            id="profileImage"
            value={formData.profileImage}
            onChange={(e) =>
              setFormData({ ...formData, profileImage: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            required
            value={formData.about}
            onChange={(e) =>
              setFormData({ ...formData, about: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Social Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) =>
                setFormData({ ...formData, github: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Resume</h2>
        <div className="space-y-2">
          <Label htmlFor="resume">Upload Resume/CV</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
          {formData.resumeUrl && (
            <p className="text-sm text-muted-foreground">
              Current resume: {formData.resumeUrl}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Skills</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSkill}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={skill.content}
              onChange={(e) => {
                const newSkills = [...formData.skills];
                newSkills[index] = { content: e.target.value };
                setFormData({ ...formData, skills: newSkills });
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeSkill(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Education</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEducation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, degree: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, institution: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, year: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input
                  value={edu.grade}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, grade: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProject}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
        {formData.projects.map((project, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeProject(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index] = { ...project, title: e.target.value };
                    setFormData({ ...formData, projects: newProjects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index] = { ...project, description: e.target.value };
                    setFormData({ ...formData, projects: newProjects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={project.github}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index] = { ...project, github: e.target.value };
                    setFormData({ ...formData, projects: newProjects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Image URL</Label>
                <Input
                  value={project.image}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index] = { ...project, image: e.target.value };
                    setFormData({ ...formData, projects: newProjects });
                  }}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Technologies</Label>
                <Input
                  value={project.technologies.join(", ")}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index] = {
                      ...project,
                      technologies: e.target.value.split(",").map((tech) => tech.trim()),
                    };
                    setFormData({ ...formData, projects: newProjects });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
          ? "Update Portfolio"
          : "Create Portfolio"}
      </Button>
    </form>
  );
} 