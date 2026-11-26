// =======================================================
// CYBERAWARE QUIZ TYPES
// frontend/src/types/quiz.types.ts
// =======================================================

/* ---------------------------------- */
/* Quiz Difficulty */
/* ---------------------------------- */

export type QuizDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

/* ---------------------------------- */
/* Question Option */
/* ---------------------------------- */

export interface QuizOption {
  id?: string;
  text: string;
  is_correct: boolean;
}

/* ---------------------------------- */
/* Question Model */
/* ---------------------------------- */

export interface QuizQuestion {
  id: string;

  title: string;

  question_type: "single_choice";

  options: QuizOption[];

  points: number;

  order: number;

  explanation?: string;

  created_at?: string;

  updated_at?: string;
}

/* ---------------------------------- */
/* Quiz Model */
/* ---------------------------------- */

export interface Quiz {
  id: string;

  module_id: string;

  lesson_id?: string;

  title: string;

  description?: string;

  difficulty: QuizDifficulty;

  time_limit_minutes: number;

  passing_score: number;

  xp_reward: number;

  total_questions: number;

  is_published: boolean;

  ai_generated: boolean;

  generated_from?: string;

  language: string;

  created_by?: string;

  created_at: string;

  updated_at: string;
}

/* ---------------------------------- */
/* Create Quiz */
/* ---------------------------------- */

export interface CreateQuizPayload {
  module_id: string;

  title: string; lesson_id: string;

  description?: string;

  difficulty: QuizDifficulty;

  time_limit_minutes: number;

  passing_score: number;

  xp_reward: number;
}

/* ---------------------------------- */
/* Update Quiz */
/* ---------------------------------- */

export interface UpdateQuizPayload {
  title?: string;

  description?: string;

  difficulty?: QuizDifficulty;

  time_limit_minutes?: number;

  passing_score?: number;

  xp_reward?: number;

  is_published?: boolean;
}

/* ---------------------------------- */
/* Create Question */
/* ---------------------------------- */

export interface CreateQuestionPayload {
  title: string;

  question_type: "single_choice";

  options: QuizOption[];

  points: number;

  order: number;

  explanation?: string;
}

/* ---------------------------------- */
/* Update Question */
/* ---------------------------------- */

export interface UpdateQuestionPayload {
  title?: string;

  options?: QuizOption[];

  points?: number;

  order?: number;

  explanation?: string;
}

/* ---------------------------------- */
/* Publish Quiz */
/* ---------------------------------- */

export interface PublishQuizPayload {
  publish: boolean;
}

/* ---------------------------------- */
/* Quiz Preview */
/* ---------------------------------- */

export interface QuizPreview {
  quiz: Quiz;

  questions: QuizQuestion[];
}

/* ---------------------------------- */
/* Quiz Statistics */
/* ---------------------------------- */

export interface QuizStats {
  total_quizzes: number;

  published_quizzes: number;

  draft_quizzes: number;

  total_questions: number;

  total_xp: number;
}

/* ---------------------------------- */
/* Employee Quiz */
/* ---------------------------------- */

export interface EmployeeQuizQuestion {
  id: string;

  title: string;

  options: string[];

  order: number;

  points: number;
}

export interface EmployeeQuiz {
  attempt_id: string;

  quiz: {
    id: string;

    title: string;

    module: string;

    time_limit_minutes: number;

    passing_score: number;
  };

  questions: EmployeeQuizQuestion[];
}

/* ---------------------------------- */
/* Submit Quiz */
/* ---------------------------------- */

export interface SubmitAnswer {
  question_id: string;

  selected_option: number;
}

export interface SubmitQuizPayload {
  answers: SubmitAnswer[];
}

/* ---------------------------------- */
/* Quiz Result */
/* ---------------------------------- */

export interface QuizReviewItem {
  question: string;

  selected_answers: number[];

  correct_answers: number[];

  correct: boolean;

  points: number;
}

export interface QuizResult {
  attempt_id: string;

  score: number;

  max_score: number;

  percentage: number;

  passed: boolean;

  earned_xp: number;

  current_xp: number;

  current_level: number;

  awareness_score: number;

  certificate_id?: string | null;

  review: QuizReviewItem[];
}

/* ---------------------------------- */
/* Quiz History */
/* ---------------------------------- */

export interface QuizHistoryItem {
  attempt_id: string;

  quiz_id: string;

  quiz_title: string;

  lesson_id?: string | null;

  score: number;

  percentage: number;

  passed: boolean;

  completed_at: string;
}

/* ---------------------------------- */
/* Analytics */
/* ---------------------------------- */

export interface DepartmentAnalytics {
  department: string;

  average_score: number;

  users: number;

  attempts: number;
}

export interface WeakTopic {
  topic: string;

  average_score: number;

  attempts: number;

  difficulty: string;
}

export interface TopPerformer {
  rank: number;

  user_id: string;

  full_name: string;

  department: string;

  xp: number;

  average_score: number;

  quizzes_completed: number;
}

export interface QuizAnalytics {
  total_attempts: number;

  total_quizzes: number;

  active_users: number;

  average_score: number;

  pass_rate: number;

  highest_score: number;

  lowest_score: number;

  average_time_minutes: number;

  department_scores: DepartmentAnalytics[];

  weak_topics: WeakTopic[];

  top_performers: TopPerformer[];
}