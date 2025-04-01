export interface Skill {
  name: string;
  level: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface Project {
  title: string;
  description: string;
  github?: string;
  image?: string;
  technologies: string[];
}

export type SectionType = "hero" | "about" | "skills" | "projects" | "experience" | "education" | "contact";

export interface Section {
  type: string;
  title: string;
  content: any;
}

export interface Portfolio {
  id?: string;
  userId: string;
  title: string;
  description: string;
  sections: Section[];
  template?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PortfolioFormData {
  username: string;
  fullname: string;
  role: string;
  brandTitle: string;
  email: string;
  about: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  resumeUrl?: string;
  profileImage?: string;
  template: string;
  sections: Section[];
}

export type PortfolioFormSection = Section;