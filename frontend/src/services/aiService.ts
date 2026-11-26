import api from "./api";
import type {
  PhishingAnalysis,
  IncidentReport,
  AIRecommendation,
  QuizResponse,
  DashboardInsight,
} from "../types/ai.types";

const BASE = "/ai";

const aiService = {
  analyzePhishingEmail: async (email_content: string): Promise<PhishingAnalysis> => {
    const res = await api.post(`${BASE}/phishing-analyze`, { email_content });
    return res.data.data;
  },

  generateIncidentReport: async (payload: {
    incident: string;
    severity: string;
    category: string;
    reporter: string;
    location: string;
  }): Promise<IncidentReport> => {
    const res = await api.post(`${BASE}/incident-report`, payload);
    return res.data.data;
  },

  getRecommendations: async (): Promise<AIRecommendation[]> => {
    const res = await api.get(`${BASE}/recommendations`);
    return res.data.data;
  },

  generateQuiz: async (topic: string): Promise<QuizResponse> => {
    const res = await api.post(`${BASE}/quiz`, { topic });
    return res.data.data;
  },

  getDashboardInsights: async (): Promise<DashboardInsight> => {
    const res = await api.get(`${BASE}/dashboard-insights`);
    return res.data.data;
  },
};

export default aiService;