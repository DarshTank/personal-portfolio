import { Portfolio } from "./portfolio";

export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  preview: Portfolio;
  component: React.ComponentType<{ portfolio: Portfolio; isPreview?: boolean }>;
}

export interface TemplateProps {
  portfolio: Portfolio;
  isPreview?: boolean;
} 