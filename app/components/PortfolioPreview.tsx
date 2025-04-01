"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portfolio } from "../types/portfolio";
import { FileText, Download, Menu, Github, Linkedin, Twitter, Mail, Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  templateId?: string;
  isPreview?: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export function PortfolioPreview({ portfolio, templateId = "modern", isPreview = false }: PortfolioPreviewProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId || "about");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleResumeDownload = () => {
    if (portfolio.resumeUrl) {
      window.open(portfolio.resumeUrl, "_blank");
    }
  };

  const getTemplateStyles = () => {
    switch (templateId) {
      case "modern":
        return {
          container: "bg-gray-900 text-white",
          nav: "bg-gray-900/90 backdrop-blur-sm border-b border-gray-800",
          section: "py-16 px-4 sm:px-6 lg:px-8",
          heading: "text-4xl font-bold text-white",
          subheading: "text-xl text-gray-300",
          card: "bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700",
          button: "bg-blue-600 text-white hover:bg-blue-700",
          skillBar: "bg-gray-700",
          skillFill: "bg-blue-500",
          tag: "bg-gray-700 text-gray-300",
        };
      case "minimal":
        return {
          container: "bg-black text-white",
          nav: "bg-black/90 backdrop-blur-sm border-b border-gray-900",
          section: "py-12 px-4 sm:px-6 lg:px-8",
          heading: "text-3xl font-light text-white",
          subheading: "text-lg text-gray-400",
          card: "bg-gray-900 shadow-sm rounded-none p-4 border border-gray-800",
          button: "bg-white text-black hover:bg-gray-100",
          skillBar: "bg-gray-800",
          skillFill: "bg-white",
          tag: "bg-gray-800 text-gray-300",
        };
      case "creative":
        return {
          container: "bg-gradient-to-br from-purple-900 to-pink-900 text-white",
          nav: "bg-black/90 backdrop-blur-sm border-b border-purple-800",
          section: "py-20 px-4 sm:px-6 lg:px-8",
          heading: "text-5xl font-bold text-white",
          subheading: "text-2xl text-purple-300",
          card: "bg-black/50 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-purple-800",
          button: "bg-purple-600 text-white hover:bg-purple-700",
          skillBar: "bg-purple-900/50",
          skillFill: "bg-purple-500",
          tag: "bg-purple-900/50 text-purple-200",
        };
      case "professional":
        return {
          container: "bg-slate-900 text-white",
          nav: "bg-slate-900/90 backdrop-blur-sm border-b border-slate-800",
          section: "py-16 px-4 sm:px-6 lg:px-8",
          heading: "text-3xl font-semibold text-white",
          subheading: "text-lg text-slate-300",
          card: "bg-slate-800 shadow-md rounded-lg p-6 border border-slate-700",
          button: "bg-slate-700 text-white hover:bg-slate-600",
          skillBar: "bg-slate-700",
          skillFill: "bg-slate-500",
          tag: "bg-slate-700 text-slate-300",
        };
      case "developer":
        return {
          container: "bg-gray-950 text-white",
          nav: "bg-gray-950/90 backdrop-blur-sm border-b border-gray-800",
          section: "py-16 px-4 sm:px-6 lg:px-8",
          heading: "text-4xl font-bold text-white",
          subheading: "text-xl text-gray-300",
          card: "bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-800",
          button: "bg-blue-600 text-white hover:bg-blue-700",
          skillBar: "bg-gray-800",
          skillFill: "bg-blue-500",
          tag: "bg-gray-800 text-gray-300",
        };
      case "resume":
        return {
          container: "bg-gray-900 text-white",
          nav: "bg-gray-900/95 backdrop-blur-sm border-b border-gray-800",
          section: "py-12 px-4 sm:px-6 lg:px-8",
          heading: "text-2xl font-bold text-white",
          subheading: "text-base text-gray-300",
          card: "bg-gray-800 shadow-sm rounded-none p-4 border-l-4 border-blue-500",
          button: "bg-blue-600 text-white hover:bg-blue-700",
          skillBar: "bg-gray-700",
          skillFill: "bg-blue-500",
          tag: "bg-gray-700 text-gray-300",
        };
      default:
        return {
          container: "bg-gray-900 text-white",
          nav: "bg-gray-900/90 backdrop-blur-sm border-b border-gray-800",
          section: "py-16 px-4 sm:px-6 lg:px-8",
          heading: "text-4xl font-bold text-white",
          subheading: "text-xl text-gray-300",
          card: "bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700",
          button: "bg-blue-600 text-white hover:bg-blue-700",
          skillBar: "bg-gray-700",
          skillFill: "bg-blue-500",
          tag: "bg-gray-700 text-gray-300",
        };
    }
  };

  const styles = getTemplateStyles();

  const educationSections = portfolio.sections.filter(
    (section) => section.type === "education"
  );
  const skillsSections = portfolio.sections.filter(
    (section) => section.type === "skills"
  );
  const projectsSections = portfolio.sections.filter(
    (section) => section.type === "projects"
  );

  return (
    <div className={`min-h-screen ${styles.container}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${styles.nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-800"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden md:flex space-x-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "text-blue-400 bg-gray-800"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPreview && (
                <button
                  onClick={() => router.push(`/dashboard/portfolio/new?template=${templateId}`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${styles.button}`}
                >
                  <Eye className="h-4 w-4" />
                  Use Template
                </button>
              )}
              {portfolio.resumeUrl && (
                <button
                  onClick={handleResumeDownload}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${styles.button}`}
                >
                  <Download className="h-4 w-4" />
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === section.id
                        ? "text-blue-400 bg-gray-800"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Content */}
      <div className="pt-16">
        {/* About Section */}
        <motion.section
          id="about"
          className={styles.section}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className={styles.heading}>{portfolio.fullname}</h1>
            <p className={styles.subheading}>{portfolio.role}</p>
            <div className={`mt-8 ${styles.card}`}>
              <p className="text-gray-300">{portfolio.about}</p>
            </div>
          </div>
        </motion.section>

        {/* Education Section */}
        {educationSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationSections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold">{section.content.degree}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.content.institution}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.content.year}
                      {section.content.grade && ` • ${section.content.grade}`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {skillsSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsSections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{section.content.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {section.content.level}%
                      </span>
                    </div>
                    <Progress value={section.content.level} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {projectsSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {projectsSections.map((section, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      {section.content.image && (
                        <img
                          src={section.content.image}
                          alt={section.content.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-semibold mb-2">{section.content.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {section.content.description}
                      </p>
                      {section.content.technologies && section.content.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {section.content.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {section.content.github && (
                        <a
                          href={section.content.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View on GitHub
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Section */}
        <motion.section
          id="contact"
          className={styles.section}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideIn}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className={styles.heading}>Contact</h2>
            <div className={`mt-8 ${styles.card}`}>
              <div className="flex flex-col items-center space-y-4">
                <a
                  href={`mailto:${portfolio.email}`}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  {portfolio.email}
                </a>
                <div className="flex space-x-4">
                  {portfolio.github && (
                    <a
                      href={portfolio.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {portfolio.linkedin && (
                    <a
                      href={portfolio.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {portfolio.twitter && (
                    <a
                      href={portfolio.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
} 