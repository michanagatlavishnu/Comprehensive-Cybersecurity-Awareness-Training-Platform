import { useMutation, useQuery } from "@tanstack/react-query";
import aiService from "../services/aiService";

export const useAnalyzePhishingEmail = () =>
  useMutation({
    mutationFn: ({ email_content }: { email_content: string }) =>
      aiService.analyzePhishingEmail(email_content),
  });

export const useGenerateIncidentReport = () =>
  useMutation({
    mutationFn: (payload: {
      incident: string;
      severity: string;
      category: string;
      reporter: string;
      location: string;
    }) => aiService.generateIncidentReport(payload),
  });

export const useAIRecommendations = () =>
  useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: aiService.getRecommendations,
  });

export const useGenerateQuiz = () =>
  useMutation({
    mutationFn: (topic: string) => aiService.generateQuiz(topic),
  });

export const useDashboardInsights = () =>
  useQuery({
    queryKey: ["ai-dashboard"],
    queryFn: aiService.getDashboardInsights,
  });