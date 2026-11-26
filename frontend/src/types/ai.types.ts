export interface PhishingAnalysis {
  threat_score: number;
  sender_score: number;
  url_score: number;
  language_score: number;
  urgency_score: number;
  summary: string;
  sender_domain: string;
  display_name: string;
  email_authentication: string;
  detected_indicators: string[];
  highlighted_phrases: string[];
  recommendations: string[];
  urls: {
    url: string;
    reputation: string;
  }[];
  mitre_attack: {
    id: string;
    title: string;
  }[];
}

export interface IncidentReport {
  executive_summary: string;
  severity: string;
  category: string;
  reported_time: string;
  department: string;
  impact_summary: string;
  root_cause: string;
  confidence: string;
  timeline: {
    time: string;
    event: string;
  }[];
  containment_steps: string[];
  mitigation_steps: string[];
  ioc: {
    label: string;
    value: string;
  }[];
}

export interface AIRecommendation {
  id: string;
  course: string;
  reason: string;
  level: string;
  xp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  score: number;
  xp: number;
}

export interface DashboardInsight {
  awareness_score: number;
  threats_blocked: number;
  learning_progress: number;
  xp_forecast: number;
  insights: string[];
}