"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, Twitter, Download, Eye, ArrowLeft, GraduationCap, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Portfolio, Section, Education, Skill, Project } from "@/app/types/portfolio";
import { TemplateProps } from "@/app/types/template";

export default function ModernMinimalTemplate({ portfolio, isPreview = false }: TemplateProps) {
  const router = useRouter();

  // Add null check for portfolio
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No portfolio data available</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  const handleResumeDownload = () => {
    if (portfolio.resumeUrl) {
      window.open(portfolio.resumeUrl, "_blank");
    }
  };

  // Get sections from the portfolio with null checks
  const educationSection = portfolio.sections?.find(section => section.type === "education") || null;
  const skillsSection = portfolio.sections?.find(section => section.type === "skills") || null;
  const projectsSection = portfolio.sections?.find(section => section.type === "projects") || null;
  const aboutSection = portfolio.sections?.find(section => section.type === "about") || null;

  // Helper function to check if content is an array
  const isArray = (content: any): content is any[] => Array.isArray(content);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {isPreview && (
                <button
                  onClick={() => router.push("/templates")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isPreview && (
                <button
                  onClick={() => {
                    localStorage.setItem("selectedTemplate", "modern-minimal");
                    router.push("/dashboard/create");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4" />
                  Use Template
                </button>
              )}
              {portfolio.resumeUrl && (
                <Button
                  variant="ghost"
                  onClick={handleResumeDownload}
                  className="text-gray-300 hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <img
            src={portfolio.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
            alt={portfolio.fullname}
            className="w-40 h-40 mx-auto rounded-full border-4 border-blue-500 shadow-lg mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{portfolio.fullname}</h1>
          <p className="text-xl text-gray-400 mb-8">{portfolio.role}</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            {aboutSection?.content || portfolio.about}
          </p>
          <div className="flex justify-center gap-4">
            {portfolio.linkedin && (
              <a
                href={portfolio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {portfolio.github && (
              <a
                href={portfolio.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Github className="h-6 w-6" />
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={portfolio.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Twitter className="h-6 w-6" />
              </a>
            )}
            <a
              href={`mailto:${portfolio.email}`}
              className="text-gray-400 hover:text-white"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Education Section */}
      {educationSection && (
        <section className="py-16 px-4 bg-gray-800">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
            <div className="grid gap-8">
              {isArray(educationSection.content) ? (
                educationSection.content.map((edu: Education, index: number) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <GraduationCap className="w-8 h-8 text-blue-400 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                          <p className="text-gray-300 mb-2">{edu.institution}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{edu.year}</span>
                            {edu.grade && (
                              <>
                                <span>•</span>
                                <span>{edu.grade}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-700 border-gray-600">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-8 h-8 text-blue-400 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{educationSection.content.degree}</h3>
                        <p className="text-gray-300 mb-2">{educationSection.content.institution}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{educationSection.content.year}</span>
                          {educationSection.content.grade && (
                            <>
                              <span>•</span>
                              <span>{educationSection.content.grade}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skillsSection && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isArray(skillsSection.content) ? (
                skillsSection.content.map((skill: Skill, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{skillsSection.content.name}</span>
                    <span className="text-gray-400">{skillsSection.content.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${skillsSection.content.level}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projectsSection && (
        <section className="py-16 px-4 bg-gray-800">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
            <div className="grid gap-8">
              {isArray(projectsSection.content) ? (
                projectsSection.content.map((project: Project, index: number) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-gray-600 rounded-full text-sm text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-700 border-gray-600">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{projectsSection.content.title}</h3>
                    <p className="text-gray-300 mb-4">{projectsSection.content.description}</p>
                    {projectsSection.content.technologies && projectsSection.content.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {projectsSection.content.technologies.map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-gray-600 rounded-full text-sm text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {projectsSection.content.github && (
                      <a
                        href={projectsSection.content.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View on GitHub
                      </a>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 