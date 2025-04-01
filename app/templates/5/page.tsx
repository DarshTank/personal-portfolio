"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, Twitter, Briefcase, ChartBar, Target, Users, Award, Calendar, Building2, Download, Eye, ArrowLeft, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Portfolio, Section, Education, Skill, Project } from "@/app/types/portfolio";
import { TemplateProps } from "@/app/types/template";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BusinessProfessionalTemplate({ portfolio, isPreview = false }: TemplateProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");

  const handleResumeDownload = () => {
    if (portfolio.resumeUrl) {
      window.open(portfolio.resumeUrl, "_blank");
    }
  };

  // Get sections from the portfolio
  const educationSection = portfolio.sections.find(section => section.type === "education");
  const skillsSection = portfolio.sections.find(section => section.type === "skills");
  const projectsSection = portfolio.sections.find(section => section.type === "projects");
  const aboutSection = portfolio.sections.find(section => section.type === "about");

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
                    localStorage.setItem("selectedTemplate", "business-professional");
                    router.push("/dashboard/create");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4" />
                  Use Template
                </button>
              )}
              {portfolio.resumeUrl && (
                <button
                  onClick={handleResumeDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-900/20 dark:to-gray-900/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={portfolio.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"}
              alt={portfolio.fullname}
              className="w-40 h-40 mx-auto rounded-full border-4 border-blue-500 shadow-lg"
            />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-600">
            {portfolio.fullname}
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">{portfolio.role}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 mb-8"
          >
            {portfolio.github && (
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            {portfolio.linkedin && (
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
            {portfolio.twitter && (
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href={portfolio.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href={`mailto:${portfolio.email}`}>
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-600">
              About Me
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {aboutSection?.content || portfolio.about}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Education Section */}
      {educationSection && (
        <section className="py-20 bg-blue-50 dark:bg-blue-900/10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="container mx-auto px-4"
          >
            <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-600">
                Education
              </h2>
              <div className="grid gap-8">
                {isArray(educationSection.content) ? (
                  educationSection.content.map((edu: Education, index: number) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                          <GraduationCap className="w-8 h-8 text-blue-500 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold">{edu.degree}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className="flex items-start gap-4">
                        <GraduationCap className="w-8 h-8 text-blue-500 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold">{educationSection.content.degree}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{educationSection.content.institution}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Skills Section */}
      {skillsSection && (
        <section className="py-20">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="container mx-auto px-4"
          >
            <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-600">
                Professional Expertise
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {isArray(skillsSection.content) ? (
                  skillsSection.content.map((skill: Skill, index: number) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <ChartBar className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                        <h3 className="text-lg font-semibold">{skill.name}</h3>
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <ChartBar className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                      <h3 className="text-lg font-semibold">{skillsSection.content.name}</h3>
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${skillsSection.content.level}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skillsSection.content.level}%</span>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projectsSection && (
        <section className="py-20 bg-blue-50 dark:bg-blue-900/10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="container mx-auto px-4"
          >
            <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-600">
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {isArray(projectsSection.content) ? (
                  projectsSection.content.map((project: Project, index: number) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={project.image || "https://picsum.photos/800/600"}
                            alt={project.title}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          {project.github && (
                            <Button variant="outline" className="rounded-full" asChild>
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on GitHub
                              </a>
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={projectsSection.content.image || "https://picsum.photos/800/600"}
                          alt={projectsSection.content.title}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{projectsSection.content.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{projectsSection.content.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {projectsSection.content.technologies.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {projectsSection.content.github && (
                          <Button variant="outline" className="rounded-full" asChild>
                            <a
                              href={projectsSection.content.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}
    </div>
  );
} 