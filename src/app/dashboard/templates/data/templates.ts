export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

export const templates: Template[] = [
  {
    id: "1",
    name: "Modern Minimal",
    description: "A clean and minimalist design perfect for professionals.",
    image: "/images/templates/template-1.jpg",
    features: ["Clean layout", "Minimalist design", "Easy navigation", "Mobile responsive"],
  },
  {
    id: "2",
    name: "Creative Portfolio",
    description: "Showcase your creative work with this bold and dynamic template.",
    image: "/images/templates/template-2.jpg",
    features: ["Grid gallery", "Animated transitions", "Project showcase", "Custom sections"],
  },
  {
    id: "3",
    name: "Tech Developer",
    description: "Perfect for developers to showcase their projects and skills.",
    image: "/images/templates/template-3.jpg",
    features: ["GitHub integration", "Code snippets", "Skills visualization", "Project timeline"],
  },
  {
    id: "4",
    name: "Business Professional",
    description: "A professional template for business executives and consultants.",
    image: "/images/templates/template-4.jpg",
    features: ["Experience timeline", "Testimonials", "Services section", "Contact form"],
  },
  {
    id: "5",
    name: "Creative Artist",
    description: "A vibrant and dynamic template for artists and designers.",
    image: "/images/templates/template-5.jpg",
    features: ["Gallery masonry", "Color customization", "Portfolio categories", "Art showcase"],
  },
  {
    id: "6",
    name: "Resume Style",
    description: "A professional resume-like template for job seekers.",
    image: "/images/templates/template-6.jpg",
    features: ["Clean resume layout", "Skills rating", "Work history", "Education timeline"],
  }
];
