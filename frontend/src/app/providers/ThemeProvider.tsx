import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="cyberaware-theme"
    >
      {children}
    </NextThemeProvider>
  );
}