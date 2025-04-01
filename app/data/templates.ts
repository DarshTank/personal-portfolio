import { Portfolio } from "../types/portfolio";
import { Template } from "../types/template";
import ModernMinimalTemplate from "../templates/1/page";
import TechFocusedTemplate from "../templates/3/page";

export const templates: Template[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "A clean and professional portfolio template with a modern design.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "1",
      userId: "1",
      username: "johndoe",
      fullname: "John Doe",
      role: "Software Developer",
      brandTitle: "Portfolio",
      about: "I am a passionate software developer with expertise in web development.",
      email: "john@example.com",
      template: "modern-minimal",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "Bachelor of Computer Science",
              institution: "University of Technology",
              year: "2020",
              grade: "3.8 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "React", level: 90 },
            { name: "TypeScript", level: 85 },
            { name: "Node.js", level: 80 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Portfolio Website",
              description: "A modern portfolio website built with Next.js and TypeScript.",
              technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
            },
          ],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A minimalist portfolio template focusing on content and simplicity.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "2",
      userId: "2",
      username: "janesmith",
      fullname: "Jane Smith",
      role: "UI/UX Designer",
      brandTitle: "Design Portfolio",
      about: "I create beautiful and intuitive user experiences through thoughtful design.",
      email: "jane@example.com",
      template: "minimal",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "Master of Design",
              institution: "Design Institute",
              year: "2021",
              grade: "4.0 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "UI Design", level: 95 },
            { name: "UX Research", level: 90 },
            { name: "Prototyping", level: 85 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Mobile App Design",
              description: "A complete mobile app design system and user flow",
              technologies: ["Figma", "Adobe XD", "Prototyping"],
              github: "https://github.com/janesmith/design",
            },
          ],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "A bold and artistic portfolio template for creative professionals.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "3",
      userId: "3",
      username: "alexj",
      fullname: "Alex Johnson",
      role: "Creative Director",
      brandTitle: "Creative Portfolio",
      about: "I bring ideas to life through creative direction and visual storytelling.",
      email: "alex@example.com",
      template: "creative",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "Bachelor of Fine Arts",
              institution: "Art School",
              year: "2019",
              grade: "3.9 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "Creative Direction", level: 95 },
            { name: "Brand Strategy", level: 90 },
            { name: "Visual Design", level: 85 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Brand Campaign",
              description: "A comprehensive brand campaign for a tech startup",
              technologies: ["Branding", "Strategy", "Design"],
              github: "https://github.com/alexj/campaign",
            },
          ],
        },
      ],
    },
    component: TechFocusedTemplate,
  },
  {
    id: "professional",
    name: "Professional",
    description: "A corporate-style portfolio template for business professionals.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "4",
      userId: "4",
      username: "sarahw",
      fullname: "Sarah Wilson",
      role: "Business Analyst",
      brandTitle: "Professional Portfolio",
      about: "I help businesses make data-driven decisions through analysis and strategy.",
      email: "sarah@example.com",
      template: "professional",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "MBA",
              institution: "Business School",
              year: "2021",
              grade: "3.7 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "Data Analysis", level: 95 },
            { name: "Business Strategy", level: 90 },
            { name: "Project Management", level: 85 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Market Analysis",
              description: "Comprehensive market analysis for a Fortune 500 company",
              technologies: ["Data Analysis", "Strategy", "Research"],
              github: "https://github.com/sarahw/analysis",
            },
          ],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
  {
    id: "developer",
    name: "Developer",
    description: "A technical portfolio template perfect for developers.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "5",
      userId: "5",
      username: "mikec",
      fullname: "Mike Chen",
      role: "Full Stack Developer",
      brandTitle: "Developer Portfolio",
      about: "I build scalable web applications using modern technologies.",
      email: "mike@example.com",
      template: "developer",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "Computer Science",
              institution: "Tech University",
              year: "2020",
              grade: "3.8 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "Frontend", level: 95 },
            { name: "Backend", level: 90 },
            { name: "DevOps", level: 85 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Cloud Platform",
              description: "A cloud-native platform for microservices",
              technologies: ["React", "Node.js", "AWS"],
              github: "https://github.com/mikec/cloud",
            },
          ],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
  {
    id: "resume",
    name: "Resume",
    description: "A clean and organized portfolio template focused on experience.",
    image: "https://placehold.co/600x400",
    preview: {
      _id: "6",
      userId: "6",
      username: "emilyb",
      fullname: "Emily Brown",
      role: "Product Manager",
      brandTitle: "Professional Resume",
      about: "I lead product development teams to create successful products.",
      email: "emily@example.com",
      template: "resume",
      isPublished: true,
      lastUpdated: new Date(),
      sections: [
        {
          type: "education",
          content: [
            {
              degree: "Product Management",
              institution: "Business School",
              year: "2021",
              grade: "3.9 GPA",
            },
          ],
        },
        {
          type: "skills",
          content: [
            { name: "Product Management", level: 95 },
            { name: "Agile", level: 90 },
            { name: "User Research", level: 85 },
          ],
        },
        {
          type: "projects",
          content: [
            {
              title: "Product Launch",
              description: "Successfully launched a new product line",
              technologies: ["Product Strategy", "Agile", "User Research"],
              github: "https://github.com/emilyb/product",
            },
          ],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
]; 