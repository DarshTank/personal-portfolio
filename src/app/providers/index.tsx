"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AuthProvider } from "./session-provider";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

export { AuthProvider };
