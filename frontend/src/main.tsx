import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App";

import ThemeProvider from "./app/providers/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import "./index.css";
import "./styles/globals.css";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />

              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: "#0F172A",
                    color: "#E2E8F0",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: "14px",
                    padding: "14px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#FFFFFF",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#FFFFFF",
                    },
                  },
                }}
              />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);