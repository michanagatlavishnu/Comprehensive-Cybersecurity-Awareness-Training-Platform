// =======================================================
// CYBERAWARE QUIZ SERVICE
// frontend/src/services/admin/quizService.ts
// =======================================================

import api from "../api";

import type {
  Quiz,
  QuizQuestion,
  QuizAnalytics,
  QuizHistoryItem,
  QuizResult,
  EmployeeQuiz,
  CreateQuizPayload,
  UpdateQuizPayload,
  CreateQuestionPayload,
  UpdateQuestionPayload,
  SubmitQuizPayload,
} from "../../types/quiz.types";

class QuizService {
  // =====================================================
  // QUIZ CRUD
  // =====================================================

  async getModuleQuizzes(moduleId: string): Promise<Quiz[]> {
    const res = await api.get(
      `/admin/modules/${moduleId}/quizzes`
    );

    return res.data.data;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    const res = await api.get("/admin/quizzes");

    return res.data.data;
  }

  async createQuiz(payload: CreateQuizPayload) {
  console.log("CREATE QUIZ PAYLOAD:", payload);

  try {
    const response = await api.post("/admin/quizzes", payload);
    return response.data.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("BACKEND ERROR:", error.response?.data);
    throw error;
  }
}

  async updateQuiz(
    quizId: string,
    payload: UpdateQuizPayload
  ): Promise<Quiz> {
    const res = await api.put(
      `/admin/quizzes/${quizId}`,
      payload
    );

    return res.data.data;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    await api.delete(`/admin/quizzes/${quizId}`);
  }

  async publishQuiz(
    quizId: string,
    publish: boolean
  ): Promise<Quiz> {
    const res = await api.patch(
      `/admin/quizzes/${quizId}/publish`,
      null,
      {
        params: {
          publish,
        },
      }
    );

    return res.data.data;
  }

  // =====================================================
  // QUESTIONS CRUD
  // =====================================================

  async getQuestions(
    quizId: string
  ): Promise<QuizQuestion[]> {
    const res = await api.get(
      `/admin/quizzes/${quizId}/questions`
    );

    return res.data.data;
  }

  async createQuestion(
    quizId: string,
    payload: CreateQuestionPayload
  ): Promise<QuizQuestion> {
    const res = await api.post(
      `/admin/quizzes/${quizId}/questions`,
      payload
    );

    return res.data.data;
  }

  async updateQuestion(
    questionId: string,
    payload: UpdateQuestionPayload
  ): Promise<QuizQuestion> {
    const res = await api.put(
      `/admin/questions/${questionId}`,
      payload
    );

    return res.data.data;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await api.delete(`/admin/questions/${questionId}`);
  }

  async reorderQuestions(
    quizId: string,
    questions: {
      question_id: string;
      order: number;
    }[]
  ): Promise<void> {
    await api.patch(`/admin/questions/reorder`, {
      quiz_id: quizId,
      questions,
    });
  }

  // =====================================================
  // EMPLOYEE QUIZ
  // =====================================================

  async takeQuiz(quizId: string): Promise<EmployeeQuiz> {
    const res = await api.get(
      `/quizzes/${quizId}/take`
    );

    return res.data.data;
  }

  
  async submitQuiz(
    quizId: string,
    payload: SubmitQuizPayload
  ): Promise<QuizResult> {
    const res = await api.post(
      `/quizzes/${quizId}/submit`,
      payload
    );

    return res.data.data;
  }

  async quizHistory(): Promise<QuizHistoryItem[]> {
    const res = await api.get("/quizzes/history");

    return res.data.data;
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  async analytics(): Promise<QuizAnalytics> {
    const res = await api.get(
      "/admin/quizzes/analytics"
    );

    return res.data.data;
  }

  async topPerformers() {
    const res = await api.get(
      "/admin/quizzes/top-performers"
    );

    return res.data.data;
  }

  async weakTopics() {
    const res = await api.get(
      "/admin/quizzes/weak-topics"
    );

    return res.data.data;
  }

  async departmentAnalytics() {
    const res = await api.get(
      "/admin/quizzes/department-analytics"
    );

    return res.data.data;
  }

  // =====================================================
  // AI GENERATED QUIZ
  // =====================================================

  // ============================================
// GENERATE AI QUIZ FROM MODULE
// ============================================

// ============================================
// GENERATE AI QUIZ (FINAL FIX)
// ============================================

async generateAIQuiz(
  moduleId: string,
  numberOfQuestions = 10,
  difficulty = "beginner",
  language = "en"
) {
  const response = await api.post(
    `/admin/modules/${moduleId}/generate-ai-quiz`,
    {
      module_id: moduleId,                    // REQUIRED
      number_of_questions: numberOfQuestions, // REQUIRED FIELD NAME
      difficulty,
      language,
      lesson_id: null,
    }
  );

  return response.data.data;
}
async getModuleLessons(moduleId: string) {
  const response = await api.get(
    `/admin/modules/${moduleId}/lessons`
  );

  return response.data.data;
}
  async regenerateAIQuestions(quizId: string) {
    const res = await api.post(
      `/admin/quizzes/${quizId}/regenerate`
    );

    return res.data.data;
  }


  async getModule(moduleId: string) {
  const response = await api.get(`/admin/modules/${moduleId}`);
  return response.data.data;
}
}

export default new QuizService();