export interface LessonContent {
  markdown: string;
  html: string;
  video_url?: string;
  cover_image?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  lesson_number: number;
  title: string;
  short_description: string;
  estimated_minutes: number;
  xp_reward: number;
  status: "draft" | "published";
  is_published: boolean;
  content: LessonContent;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonPayload {
  lesson_number: number;
  title: string;
  short_description: string;

  content: LessonContent;

  estimated_minutes: number;
  xp_reward: number;
}

export interface UpdateLessonPayload
  extends Partial<CreateLessonPayload> {
  is_published?: boolean;
}