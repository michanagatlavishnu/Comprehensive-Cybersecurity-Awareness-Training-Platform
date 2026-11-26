// ==========================================================
// CYBERAWARE LESSON SERVICE
// File: src/services/admin/lessonService.ts
// ==========================================================

import api from "../api";

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

  content: LessonContent;

  estimated_minutes: number;
  xp_reward: number;

  is_published: boolean;
  status: "draft" | "published";

  created_at: string;
  updated_at: string;
}

export interface CreateLessonPayload {
  lesson_number: number;
  title: string;
  short_description: string;

  estimated_minutes: number;
  xp_reward: number;

  content: LessonContent;
}

export interface UpdateLessonPayload
  extends Partial<CreateLessonPayload> {
  is_published?: boolean;
}

class LessonService {
  // ----------------------------------------------------------
  // ADMIN LESSONS
  // ----------------------------------------------------------

  async getLessons(moduleId: string): Promise<Lesson[]> {
    const res = await api.get(
      `/admin/modules/${moduleId}/lessons`
    );

    return res.data.data;
  }

  async getLesson(lessonId: string): Promise<Lesson> {
    const res = await api.get(`/admin/lessons/${lessonId}`);

    return res.data.data;
  }

 async createLesson(
  moduleId: string,
  payload: CreateLessonPayload
): Promise<Lesson> {
  const requestBody = {
    lesson_number: Number(payload.lesson_number),
    title: payload.title,
    short_description: payload.short_description,

    content: {
      markdown: "",
      html: "",
      video_url: payload.content.video_url,
      cover_image: null,
    },

    estimated_minutes: Number(payload.estimated_minutes),
    xp_reward: Number(payload.xp_reward),
  };

  console.log("POST URL:", `/admin/modules/${moduleId}/lessons`);
  console.log("REQUEST BODY:", requestBody);

  const response = await api.post(
    `/admin/modules/${moduleId}/lessons`,
    requestBody
  );

  return response.data.data;
}

  async updateLesson(
    lessonId: string,
    payload: UpdateLessonPayload
  ): Promise<Lesson> {
    const res = await api.put(
      `/admin/lessons/${lessonId}`,
      payload
    );

    return res.data.data;
  }

  async deleteLesson(lessonId: string) {
    const res = await api.delete(
      `/admin/lessons/${lessonId}`
    );

    return res.data;
  }

  async publishLesson(
    lessonId: string,
    publish: boolean
  ) {
    const res = await api.patch(
      `/admin/lessons/${lessonId}/publish`,
      {
        is_published: publish,
      }
    );

    return res.data.data;
  }

  async reorderLessons(
    lessons: {
      lesson_id: string;
      lesson_number: number;
    }[]
  ) {
    const res = await api.patch(
      `/admin/lessons/reorder`,
      {
        lessons,
      }
    );

    return res.data.data;
  }

  async syncYoutube(
    lessonId: string,
    url: string
  ) {
    const res = await api.post(
      `/admin/lessons/${lessonId}/youtube-sync`,
      {
        url,
      }
    );

    return res.data.data;
  }

  // ----------------------------------------------------------
  // EMPLOYEE LESSONS
  // ----------------------------------------------------------

  async employeeLessons(moduleId: string) {
    const res = await api.get(
      `/modules/${moduleId}/lessons`
    );

    return res.data.data;
  }

  async employeeLesson(lessonId: string) {
    const res = await api.get(`/lessons/${lessonId}`);

    return res.data.data;
  }

  async completeLesson(lessonId: string) {
    const res = await api.post(
      `/lessons/${lessonId}/complete`
    );

    return res.data.data;
  }

  async updateProgress(
    lessonId: string,
    progress: number,
    watch_time: number
  ) {
    const res = await api.post(
      `/lessons/${lessonId}/progress`,
      {
        progress,
        watch_time,
      }
    );

    return res.data.data;
  }

  async moduleProgress(moduleId: string) {
    const res = await api.get(
      `/modules/${moduleId}/progress`
    );

    return res.data.data;
  }
}


  

export default new LessonService();