import type { Template } from "../types/template";
import ModernMinimalTemplate from "../templates/1/page";
import CreativeProfessionalTemplate from "../templates/2/page";
import TechFocusedTemplate from "../templates/3/page";
import CorporateProfessionalTemplate from "../templates/4/page";
import TechDeveloperTemplate from "../templates/5/page";
import ResumeStyleTemplate from "../templates/6/page";

export const templates: Template[] = [
  {
    id: "1",
    name: "Modern Minimal",
    description: "A clean and modern portfolio template with a minimalist design",
    image: "/templates/modern-minimal.png",
    preview: {
      fullname: "John Doe",
      role: "Full Stack Developer",
      about: "I'm a passionate full-stack developer with expertise in building modern web applications. I love creating clean, efficient, and user-friendly solutions.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      email: "john@example.com",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      skills: [
        { name: "React", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Node.js", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Tailwind CSS", level: 90 },
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "University of Technology",
          year: "2018-2022",
          grade: "3.8 GPA",
        },
      ],
      projects: [
        {
          title: "E-commerce Platform",
          description: "A full-stack e-commerce platform built with Next.js and MongoDB",
          github: "https://github.com/johndoe/ecommerce",
          image: "https://picsum.photos/800/600",
          technologies: ["Next.js", "MongoDB", "Tailwind CSS", "Stripe"],
        },
        {
          title: "Task Management App",
          description: "A collaborative task management application with real-time updates",
          github: "https://github.com/johndoe/taskmanager",
          image: "https://picsum.photos/800/601",
          technologies: ["React", "Firebase", "Material UI"],
        },
      ],
    },
    component: ModernMinimalTemplate,
  },
  {
    id: "2",
    name: "Creative Professional",
    description: "A creative portfolio template with a professional touch",
    image: "/templates/creative-professional.png",
    preview: {
      fullname: "Jane Smith",
      role: "UI/UX Designer",
      about: "I'm a creative UI/UX designer passionate about creating beautiful and intuitive user experiences. I focus on user-centered design principles and modern aesthetics.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      email: "jane@example.com",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith",
      skills: [
        { name: "UI Design", level: 95 },
        { name: "UX Research", level: 90 },
        { name: "Figma", level: 95 },
        { name: "Adobe XD", level: 90 },
        { name: "Prototyping", level: 85 },
        { name: "User Testing", level: 85 },
      ],
      education: [
        {
          degree: "Master of Design",
          institution: "Design Institute",
          year: "2019-2021",
          grade: "3.9 GPA",
        },
      ],
      projects: [
        {
          title: "E-commerce Redesign",
          description: "Complete redesign of an e-commerce platform focusing on user experience",
          github: "https://github.com/janesmith/ecommerce-redesign",
          image: "https://picsum.photos/800/602",
          technologies: ["Figma", "Adobe XD", "User Research"],
        },
      ],
    },
    component: CreativeProfessionalTemplate,
  },
  {
    id: "3",
    name: "Tech Focused",
    description: "A technical portfolio template focused on showcasing development skills",
    image: "/templates/tech-focused.png",
    preview: {
      fullname: "Alex Johnson",
      role: "Senior Software Engineer",
      about: "I'm a senior software engineer specializing in building scalable and efficient backend systems. With expertise in cloud architecture and distributed systems, I help companies build robust technical solutions.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      email: "alex@example.com",
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
      skills: [
        { name: "Backend Development", level: 95 },
        { name: "Cloud Architecture", level: 90 },
        { name: "Database Design", level: 85 },
        { name: "System Security", level: 90 },
        { name: "Performance Optimization", level: 85 },
        { name: "DevOps", level: 90 },
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "Tech University",
          year: "2019-2021",
          grade: "3.9 GPA",
        },
      ],
      projects: [
        {
          title: "Distributed Task Queue System",
          description: "A scalable task queue system built with Go and Redis, handling millions of tasks daily",
          github: "https://github.com/alexjohnson/task-queue",
          image: "https://picsum.photos/800/603",
          technologies: ["Go", "Redis", "Docker", "Kubernetes"],
        },
      ],
    },
    component: TechFocusedTemplate,
  },
  {
    id: "4",
    name: "Corporate Professional",
    description: "A professional portfolio template suitable for corporate settings",
    image: "/templates/corporate-professional.png",
    preview: {
      fullname: "Sarah Wilson",
      role: "Business Analyst",
      about: "I'm a business analyst with expertise in data analysis and process optimization. I help businesses make data-driven decisions.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      email: "sarah@example.com",
      github: "https://github.com/sarahwilson",
      linkedin: "https://linkedin.com/in/sarahwilson",
      twitter: "https://twitter.com/sarahwilson",
      skills: [
        { name: "Data Analysis", level: 95 },
        { name: "Process Optimization", level: 90 },
        { name: "SQL", level: 85 },
        { name: "Tableau", level: 90 },
        { name: "Business Intelligence", level: 85 },
        { name: "Project Management", level: 90 },
      ],
      education: [
        {
          degree: "Master of Business Administration",
          institution: "Business School",
          year: "2018-2020",
          grade: "3.9 GPA",
        },
      ],
      projects: [
        {
          title: "Business Process Optimization",
          description: "Analysis and optimization of business processes for a Fortune 500 company",
          github: "https://github.com/sarahwilson/process-optimization",
          image: "https://picsum.photos/800/604",
          technologies: ["Data Analysis", "Process Mapping", "SQL"],
        },
      ],
    },
    component: CorporateProfessionalTemplate,
  },
  {
    id: "5",
    name: "Tech Developer",
    description: "A technical portfolio template for developers",
    image: "/templates/tech-developer.png",
    preview: {
      fullname: "Mike Chen",
      role: "Senior Software Engineer",
      about: "I'm a senior software engineer with expertise in building scalable applications. I focus on clean code and best practices.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      email: "mike@example.com",
      github: "https://github.com/mikechen",
      linkedin: "https://linkedin.com/in/mikechen",
      twitter: "https://twitter.com/mikechen",
      skills: [
        { name: "System Design", level: 95 },
        { name: "Cloud Architecture", level: 90 },
        { name: "Kubernetes", level: 85 },
        { name: "Microservices", level: 90 },
        { name: "CI/CD", level: 85 },
        { name: "DevOps", level: 90 },
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "Tech University",
          year: "2016-2018",
          grade: "3.8 GPA",
        },
      ],
      projects: [
        {
          title: "Microservices Platform",
          description: "Design and implementation of a scalable microservices platform",
          github: "https://github.com/mikechen/microservices-platform",
          image: "https://picsum.photos/800/605",
          technologies: ["Kubernetes", "Docker", "Microservices"],
        },
      ],
    },
    component: TechDeveloperTemplate,
  },
  {
    id: "6",
    name: "Resume Style",
    description: "A clean and professional resume-style portfolio template",
    image: "/templates/resume-style.png",
    preview: {
      fullname: "Emily Brown",
      role: "Marketing Manager",
      about: "I'm a marketing manager with expertise in digital marketing and brand strategy. I help businesses grow their online presence.",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      email: "emily@example.com",
      github: "https://github.com/emilybrown",
      linkedin: "https://linkedin.com/in/emilybrown",
      twitter: "https://twitter.com/emilybrown",
      skills: [
        { name: "Digital Marketing", level: 95 },
        { name: "Brand Strategy", level: 90 },
        { name: "Content Marketing", level: 85 },
        { name: "SEO", level: 90 },
        { name: "Social Media", level: 85 },
        { name: "Analytics", level: 90 },
      ],
      education: [
        {
          degree: "Master of Marketing",
          institution: "Marketing Institute",
          year: "2017-2019",
          grade: "3.8 GPA",
        },
      ],
      projects: [
        {
          title: "Brand Campaign",
          description: "Successful brand campaign that increased engagement by 200%",
          github: "https://github.com/emilybrown/brand-campaign",
          image: "https://picsum.photos/800/606",
          technologies: ["Digital Marketing", "Brand Strategy", "Social Media"],
        },
      ],
    },
    component: ResumeStyleTemplate,
  },
]; 