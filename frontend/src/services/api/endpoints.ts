export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api/v1";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  DASHBOARD: {
    EMPLOYEE: "/dashboard/employee",
    ADMIN: "/dashboard/admin",
    WEEKLY_ACTIVITY: "/dashboard/weekly-activity",
    LEARNING_PROGRESS: "/dashboard/learning-progress",
    XP_HISTORY: "/dashboard/xp-history",
    QUIZ_ANALYTICS: "/dashboard/quiz-analytics",
    PHISHING_ANALYTICS: "/dashboard/phishing-analytics",
  },

  TRAINING: {
    MODULES: "/training/modules",
    MODULE_DETAILS: "/training/modules",
    LESSONS: "/training/lessons",
    COMPLETE_LESSON: "/training/complete-lesson",
    AI_SUMMARY: "/training/ai-summary",
    NOTES: "/training/notes",
  },

  QUIZ: {
    MODULE_QUIZ: "/quizzes/module",
    AI_GENERATE: "/quizzes/ai-generate",
    SUBMIT: "/quizzes/submit",
    HISTORY: "/quizzes/history",
    REVIEW: "/quizzes/review",
    LEADERBOARD: "/quizzes/leaderboard",
    ANALYTICS: "/quizzes/analytics",
  },

  PHISHING: {
    INBOX: "/phishing/inbox",
    EMAIL: "/phishing/email",
    CLICK: "/phishing/click",
    OPEN: "/phishing/open",
    SUBMIT_CREDENTIALS: "/phishing/submit",
    REPORT: "/phishing/report",
    CAMPAIGNS: "/phishing/campaigns",
    REPORTS: "/admin/phishing/reports",
    HEATMAP: "/admin/phishing/heatmap",
    WEAK_TOPICS: "/admin/phishing/weak-topics",
  },

  CERTIFICATE: {
    MY_CERTIFICATES: "/certificates/my",
    DOWNLOAD: "/certificates/download",
    VERIFY: "/certificates/verify",
  },

  NOTIFICATION: {
    LIST: "/notifications",
    READ: "/notifications/read",
    READ_ALL: "/notifications/read-all",
  },

  PROFILE: {
    UPDATE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    UPLOAD_IMAGE: "/users/profile-image",
  },

  AI: {
    CHAT: "/ai/chat",
    TRANSLATE: "/ai/translate",
    ANALYZE_PHISHING: "/ai/analyze-phishing",
    SECURITY_TIPS: "/ai/security-tips",
  },

  ADMIN: {
    USERS: "/admin/users",
    DEPARTMENTS: "/admin/departments",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    EMAIL_TEMPLATES: "/admin/email-templates",
  },
};

export default ENDPOINTS;