/* ============================================================
   CYBERAWARE DASHBOARD TYPES
   Enterprise Security Awareness Platform
   React + TypeScript + FastAPI
============================================================ */

export type NotificationPriority = "low" | "medium" | "high";

export type ActivityType =
  | "lesson"
  | "quiz"
  | "certificate"
  | "badge"
  | "xp"
  | "phishing"
  | "incident";

/* ============================================================
   DASHBOARD OVERVIEW
============================================================ */

export interface DashboardOverview {
  awareness_score: number;
  learning_streak: number;
  total_xp: number;
  current_level: number;

  completed_modules: number;
  total_modules: number;

  completed_quizzes: number;
  phishing_reports: number;

  certificates: number;

  department: string;

  total_lessons?: number;
  completed_lessons?: number;

  pending_modules?: number;

  profile?: {
    name: string;
    email: string;
    role: string;
    department?: string | null;
    profile_image?: string | null;
  };
}

/* ============================================================
   WEEKLY ACTIVITY
============================================================ */

export interface WeeklyActivity {
  day: string;
  lessons: number;
  quizzes: number;
  xp: number;
}

/* ============================================================
   ACHIEVEMENTS
============================================================ */

export interface Achievement {
  id: string;

  title: string;

  description: string;

  icon: string;

  unlocked: boolean;

  unlocked_at?: string;

  xp_reward?: number;
}

/* ============================================================
   RECENT ACTIVITY TIMELINE
============================================================ */

export interface ActivityItem {
  id: string;

  type: ActivityType;

  title: string;

  description: string;

  created_at: string;

  xp?: number;
}

/* ============================================================
   NOTIFICATIONS
============================================================ */

export interface NotificationItem {
  id: string;

  title: string;

  message: string;

  priority: NotificationPriority;

  is_read: boolean;

  created_at: string;
}

/* ============================================================
   THREAT STATS
============================================================ */

export interface ThreatStats {
  phishing_detected: number;

  phishing_reported: number;

  phishing_clicked: number;

  incidents_reported: number;

  password_strength_score: number;

  simulated_attacks_completed: number;
}

/* ============================================================
   PROGRESS DATA
============================================================ */

export interface LearningProgress {
  total_modules: number;

  completed_modules: number;

  total_lessons: number;

  completed_lessons: number;

  completion_percentage: number;
}

/* ============================================================
   XP HISTORY
============================================================ */

export interface XPHistory {
  month: string;

  xp: number;
}

/* ============================================================
   AWARENESS HISTORY
============================================================ */

export interface AwarenessHistory {
  month: string;

  score: number;
}

/* ============================================================
   DASHBOARD RESPONSE
============================================================ */

export interface DashboardResponse {
  overview: DashboardOverview;

  weekly_activity: WeeklyActivity[];

  achievements: Achievement[];

  activity: ActivityItem[];

  notifications: NotificationItem[];

  threats?: ThreatStats;

  progress?: LearningProgress;

  xp_history?: XPHistory[];

  awareness_history?: AwarenessHistory[];
}

/* ============================================================
   QUICK ACTIONS
============================================================ */

export interface QuickAction {
  title: string;

  description: string;

  icon: string;

  color: string;

  route: string;
}

/* ============================================================
   KPI CARD
============================================================ */

export interface KPIData {
  title: string;

  value: number | string;

  subtitle?: string;

  icon: string;

  color: string;

  progress?: number;
}