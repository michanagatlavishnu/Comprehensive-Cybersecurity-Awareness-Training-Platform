import { useState, type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ThemeProvider from "./providers/ThemeProvider";

import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },

          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}