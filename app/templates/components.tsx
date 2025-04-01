import ModernMinimalTemplate from "./1/page";

export const templateComponents = {
  "modern-minimal": ModernMinimalTemplate,
  // Add other templates here as they are created
} as const;

export type TemplateId = keyof typeof templateComponents; 