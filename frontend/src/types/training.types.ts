/* =========================================================
   TRAINING TYPES
   CyberAware Platform
========================================================= */

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructor: string;
  xp_reward: number;
  lessons_count: number;
  modules_count: number;
  enrolled_users: number;
  rating: number;
  progress: number;

  watch_time?: number;
  completed: boolean;
  tags: string[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;

  order: number;

  lessons_count: number;

  progress: number;

  difficulty?: "Beginner" | "Intermediate" | "Advanced";

  estimated_duration?: number;

  thumbnail?: string;

  xp_reward?: number;

  completed?: boolean;

  published?: boolean;
}

export interface Lesson {
  id: string;

  module_id: string;

  title: string;

  description: string;

  video_url: string;

  thumbnail: string;

  duration: string;

  xp_reward: number;

  progress: number;

  watch_time?: number;

  completed: boolean;

  transcript?: string;

  resources?: TrainingResource[];

  notes?: string;

  quiz_available?: boolean;

  quiz_id?: string;
}

export interface TrainingResource {
  id: string;
  lesson_id?: string;
  title: string;
  description: string;
  type: "pdf" | "guide" | "video" | "checklist" | "policy";
  file_url: string;
  size: string;
}

export interface AINote {
  id: string;
  lesson_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AISummary {
  lesson_id: string;
  summary: string;
  revision_notes: string[];
  flashcards: Flashcard[];
  interview_questions: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer?: string;
}

export interface QuizResult {
  score: number;
  total_questions: number;
  percentage: number;
  xp_earned: number;
  passed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface SkillProgress {
  skill: string;
  percentage: number;
}

export interface WeeklyProgress {
  day: string;
  hours: number;
}

export interface LearningTimeline {
  date: string;
  activity: string;
  xp: number;
}

export interface Certificate {
  id: string;
  course_name?: string;
  completion_percentage: number;
  issued: boolean;
  certificate_number?: string;
  issued_on?: string;
  score?: number;
  certificate_url?: string;
}

export interface LearningProgress {
  total_xp: number;
  streak_days: number;
  awareness_score: number;
  completed_courses: number;
  total_courses: number;
  completed_lessons: number;
  total_lessons: number;
  weekly_progress: WeeklyProgress[];
  timeline: LearningTimeline[];
  achievements: Achievement[];
  skills: SkillProgress[];
}

export interface AIRecommendation {
  course: string;
  reason: string;
}