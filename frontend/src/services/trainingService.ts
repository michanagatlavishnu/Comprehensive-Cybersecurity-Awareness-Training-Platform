import api from "./api";
import type {
  Course,
  Lesson,
  Module,
  LearningProgress,
  Certificate,
  TrainingResource,
} from "../types/training.types";
import type { QuizHistoryItem, QuizResult } from "../types/quiz.types";

/* =========================================================
   COURSES
========================================================= */

const BASE = "";

const toCourse = (module: any): Course => ({
  id: module.id,
  title: module.title,
  description: module.description,

  thumbnail:
    module.thumbnail ||
    "https://placehold.co/600x400/0F172A/10B981?text=CyberAware",

  category: module.category,

  level:
    module.difficulty === "Beginner"
      ? "Beginner"
      : module.difficulty === "Intermediate"
      ? "Intermediate"
      : "Advanced",

  duration: `${module.estimated_minutes || 0} mins`,

  instructor: "CyberAware Security Team",

  xp_reward: module.xp_reward || 0,

  // ✅ BACKEND FIELD
  lessons_count: module.total_lessons || 0,

  modules_count: 1,

  enrolled_users: module.enrolled_users || 0,

  rating: module.rating || 5,

  progress: module.progress || 0,

  completed: module.completed || false,

  tags: module.tags || [],
});

const toLesson = (lesson: any): Lesson => ({
  id: lesson.id,
  module_id: lesson.module_id,
  title: lesson.title,
  description: lesson.short_description ?? "",
  video_url: lesson.content?.video_url ?? "",
  thumbnail: lesson.content?.cover_image ?? "",
  duration: `${lesson.estimated_minutes} min`,
  xp_reward: lesson.xp_reward,
  progress: lesson.progress ?? 0,
  watch_time: lesson.watch_time ?? 0,
  completed: lesson.completed ?? false,
  transcript: lesson.content?.markdown,
});

const trainingService = {
  // ---------------- COURSES ----------------

  async getCourses(): Promise<Course[]> {
  const res = await api.get("/modules");

  console.log("TRAINING MODULES RESPONSE:", res.data);

  return res.data.data
    .filter((module: any) => module.is_published)
    .map(toCourse);
},

  async getCourse(courseId: string): Promise<Course> {
    const { data } = await api.get(`/modules/${courseId}`);
    return toCourse(data.data);
  },

  async enrollCourse(courseId: string) {
    const res = await api.post(`${BASE}/courses/${courseId}/enroll`);
    return res.data.data;
  },

  async searchCourses(keyword: string): Promise<Course[]> {
    const res = await api.get(`${BASE}/courses/search`, {
      params: { keyword },
    });
    return res.data.data;
  },

  // ---------------- MODULES ----------------

  // ---------------- MODULES ----------------

async getModules(courseId: string): Promise<Module[]> {
  const { data } = await api.get(`/modules/${courseId}`);

  return [
    {
      id: data.data.id,
      course_id: data.data.id,
      title: data.data.title,
      description: data.data.description,
      order: 1,
      lessons_count: data.data.total_lessons || 0,
      progress: data.data.progress || 0,
    },
  ];
},

  async getModule(moduleId: string): Promise<Module> {
    const res = await api.get(`/modules/${moduleId}`);
    const course = toCourse(res.data.data);
    return {
      id: course.id,
      course_id: course.id,
      title: course.title,
      description: course.description,
      order: 1,
      lessons_count: course.lessons_count,
      progress: course.progress,
    };
  },

  async getModuleProgress(moduleId: string) {
    const { data } = await api.get(`/modules/${moduleId}/progress`);
    return data.data;
  },

  // ---------------- LESSONS ----------------

  // ---------------- LESSONS ----------------

// ================= LESSONS =================

async getLessons(moduleId: string): Promise<Lesson[]> {
  const { data } = await api.get(`/modules/${moduleId}/lessons`);

  return data.data.map((lesson: any) => ({
    id: lesson.id,
    module_id: lesson.module_id,

    title: lesson.title,
    description: lesson.short_description ?? "",

    video_url: lesson.content?.video_url ?? "",
    thumbnail: lesson.content?.cover_image ?? "",

    duration: `${lesson.estimated_minutes} min`,
    xp_reward: lesson.xp_reward,

    progress: lesson.progress ?? 0,
    watch_time: lesson.watch_time ?? 0,
    completed: lesson.completed ?? false,

    transcript: lesson.content?.markdown ?? "",
  }));
},

  async getLesson(lessonId: string): Promise<Lesson> {
  const { data } = await api.get(`/lessons/${lessonId}`);

  const lesson = data.data;

  return {
    id: lesson.id,
    module_id: lesson.module_id,
    title: lesson.title,
    description:
      lesson.description || lesson.short_description || "",
    video_url:
      lesson.video_url ||
      lesson.content?.video_url ||
      "",
    thumbnail:
      lesson.thumbnail ||
      lesson.content?.cover_image ||
      "",
    duration: `${lesson.estimated_minutes || lesson.duration_minutes || 0} min`,
    xp_reward: lesson.xp_reward || 0,
    progress: lesson.progress || 0,
    watch_time: lesson.watch_time || 0,
    completed: lesson.completed || false,
    transcript:
      lesson.transcript ||
      lesson.markdown ||
      lesson.markdown_content ||
      lesson.content?.markdown ||
      "",
  };
},

  async markLessonComplete(lessonId: string) {
  const { data } = await api.post(`/lessons/${lessonId}/complete`);

  return data.data;
},

  async updateLessonProgress(
    lessonId: string,
    progress: number,
    watchTime: number
  ) {
    const { data } = await api.post(`/lessons/${lessonId}/progress`, {
      progress_percent: progress,
      watch_time_seconds: watchTime,
    });

    return data.data;
  },

  // ---------------- AI NOTES ----------------
async getAINotes(lessonId: string) {
  const res = await api.get(`/lessons/${lessonId}/ai-notes`);
  return res.data.data;
},
  

 async saveAINotes(
  lessonId: string,
  content: string
) {
  const res = await api.post("/ai-notes/save", {
    lesson_id: lessonId,
    content,
  });

  return res.data.data;
},

  async improveAINotes(content: string) {
  const res = await api.post("/ai-notes/improve", {
    content,
  });

  return res.data.data;
},

  async deleteAINote(noteId: string) {
    const res = await api.delete(`${BASE}/ai-notes/${noteId}`);
    return res.data.data;
  },

  // ---------------- QUIZZES ----------------

  async getModuleQuiz(moduleId: string) {
    const { data } = await api.get(`/modules/${moduleId}/quiz`);
    return data.data;
  },

  async getLessonQuiz(lessonId: string) {
    const { data } = await api.get(`/lessons/${lessonId}/quiz`);
    return data.data;
  },

  async takeEmployeeQuiz(quizId: string) {
    const { data } = await api.get(`/quizzes/${quizId}/take`);
    return data.data;
  },

  async submitEmployeeQuiz(
    quizId: string,
    answers: Array<{ question_id: string; selected_option: number }>
  ) {
    const { data } = await api.post(`/quizzes/${quizId}/submit`, {
      quiz_id: quizId,
      answers,
      duration_minutes: 0,
    });
    return data.data;
  },

 async getQuiz(lessonId: string) {
  const { data } = await api.get(`/lessons/${lessonId}/quiz`);

  return data.data;
},

  async submitQuiz(
    lessonId: string,
    answers: Record<string, string>
  ): Promise<QuizResult> {
    const res = await api.post(`${BASE}/quiz/${lessonId}/submit`, {
      answers,
    });

    return res.data.data;
  },

  async getQuizHistory(): Promise<QuizHistoryItem[]> {
    const res = await api.get(`${BASE}/quizzes/history`);
    return res.data.data;
  },

  async getPhishingInbox() {
    const res = await api.get(`${BASE}/phishing/inbox`);
    return res.data.data;
  },

  async startPhishingSimulation() {
    const res = await api.post(`${BASE}/phishing/simulation/start`);
    return res.data.data;
  },

  async getPhishingSimulationSummary() {
    const res = await api.get(`${BASE}/phishing/simulation/summary`);
    return res.data.data;
  },

  async openPhishingEmail(token: string) {
    const res = await api.get(`${BASE}/phishing/open/${token}`);
    return res.data.data;
  },

  async reportPhishingEmail(token: string) {
    const res = await api.post(`${BASE}/phishing/report/${token}`);
    return res.data.data;
  },

  async decidePhishingEmail(token: string, isPhishing: boolean) {
    const res = await api.post(`${BASE}/phishing/decision/${token}`, {
      is_phishing: isPhishing,
    });
    return res.data.data;
  },

  // ---------------- RESOURCES ----------------

  async getResources(): Promise<TrainingResource[]> {
    const res = await api.get(`${BASE}/resources`);
    return res.data.data;
  },

  async getLessonResources(lessonId: string): Promise<TrainingResource[]> {
    const res = await api.get(`${BASE}/resources/${lessonId}`);
    return res.data.data;
  },

  async downloadResource(resourceId: string) {
    const res = await api.get(`${BASE}/resources/${resourceId}/download`, {
      responseType: "blob",
    });

    return res.data;
  },

  async recordDownloadActivity(courseTitle: string, lessonTitle: string) {
    const res = await api.post("/dashboard/activity/record", {
      activity_type: "lesson_pdf_download",
      course_title: courseTitle,
      lesson_title: lessonTitle,
    });
    return res.data.data;
  },

  // ---------------- LEARNING PROGRESS ----------------

  async getLearningProgress(): Promise<LearningProgress> {
    const res = await api.get(`${BASE}/progress`);
    return res.data.data;
  },

  async getWeeklyProgress() {
    const res = await api.get(`${BASE}/progress/weekly`);
    return res.data.data;
  },

  async getMonthlyProgress() {
    const res = await api.get(`${BASE}/progress/monthly`);
    return res.data.data;
  },

  async getLearningTimeline() {
    const res = await api.get(`${BASE}/progress/timeline`);
    return res.data.data;
  },

  async getAchievements() {
    const res = await api.get(`${BASE}/achievements`);
    return res.data.data;
  },

  async getSkillProgress() {
    const res = await api.get(`${BASE}/skills`);
    return res.data.data;
  },

  async getLeaderboard() {
    const res = await api.get(`${BASE}/leaderboard`);
    return res.data.data;
  },

  // ---------------- CERTIFICATES ----------------

  async getCertificates(): Promise<Certificate[]> {
    const res = await api.get(`${BASE}/certificates`);
    return res.data.data;
  },

  async getCertificate(certificateId: string): Promise<Certificate> {
    const res = await api.get(`${BASE}/certificates/${certificateId}`);

    return res.data.data;
  },

  async downloadCertificate(certificateId: string) {
    const res = await api.get(
      `${BASE}/certificates/${certificateId}/download`,
      {
        responseType: "blob",
      }
    );

    return res.data;
  },

  async downloadCertificatePreview() {
    const res = await api.get(`${BASE}/certificates/sample/download`, {
      responseType: "blob",
    });
    return res.data;
  },

  // ---------------- XP ----------------

  async getXPHistory() {
    const res = await api.get(`${BASE}/xp/history`);
    return res.data.data;
  },

  async getStreak() {
    const res = await api.get(`${BASE}/xp/streak`);
    return res.data.data;
  },

  async getRewards() {
    const res = await api.get(`${BASE}/xp/rewards`);
    return res.data.data;
  },
};

export default trainingService;