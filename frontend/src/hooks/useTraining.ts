import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import trainingService from "../services/trainingService";

/* =========================================================
   QUERY KEYS
========================================================= */

export const trainingKeys = {
  all: ["training"] as const,

  courses: ["training", "courses"] as const,

  course: (id: string) => ["training", "course", id] as const,

  modules: (courseId: string) =>
    ["training", "modules", courseId] as const,

  module: (id: string) => ["training", "module", id] as const,

  lessons: (moduleId: string) =>
    ["training", "lessons", moduleId] as const,

  lesson: (lessonId: string) =>
    ["training", "lesson", lessonId] as const,

  summary: (lessonId: string) =>
    ["training", "summary", lessonId] as const,

  notes: (lessonId: string) =>
    ["training", "notes", lessonId] as const,

  resources: ["training", "resources"] as const,

  progress: ["training", "progress"] as const,

  certificates: ["training", "certificates"] as const,

  achievements: ["training", "achievements"] as const,

  leaderboard: ["training", "leaderboard"] as const,

  recommendations: ["training", "recommendations"] as const,
};

/* =========================================================
   COURSES
========================================================= */

export const useCourses = () =>
  useQuery({
    queryKey: trainingKeys.courses,
    queryFn: trainingService.getCourses,
  });

export const useCourse = (courseId: string) =>
  useQuery({
    queryKey: trainingKeys.course(courseId),
    queryFn: () => trainingService.getCourse(courseId),
    enabled: !!courseId,
  });

export const useModules = (courseId: string) =>
  useQuery({
    queryKey: trainingKeys.modules(courseId),
    queryFn: () => trainingService.getModules(courseId),
    enabled: !!courseId,
  });

export const useModule = (moduleId: string) =>
  useQuery({
    queryKey: trainingKeys.module(moduleId),
    queryFn: () => trainingService.getModule(moduleId),
    enabled: !!moduleId,
  });

export const useLessons = (moduleId: string) =>
  useQuery({
    queryKey: trainingKeys.lessons(moduleId),
    queryFn: () => trainingService.getLessons(moduleId),
    enabled: !!moduleId,
  });

export const useLesson = (lessonId: string) =>
  useQuery({
    queryKey: trainingKeys.lesson(lessonId),
    queryFn: () => trainingService.getLesson(lessonId),
    enabled: !!lessonId,
  });

/* =========================================================
   AI SUMMARY
========================================================= */

export const useAISummary = (lessonId: string) =>
  useQuery({
    queryKey: trainingKeys.summary(lessonId),
    queryFn: () => trainingService.generateAISummary(lessonId),
    enabled: !!lessonId,
  });

/* =========================================================
   AI NOTES
========================================================= */

export const useAINotes = (lessonId: string) =>
  useQuery({
    queryKey: trainingKeys.notes(lessonId),
    queryFn: () => trainingService.getAINotes(lessonId),
    enabled: !!lessonId,
  });

/* =========================================================
   RESOURCES
========================================================= */

export const useResources = () =>
  useQuery({
    queryKey: trainingKeys.resources,
    queryFn: trainingService.getResources,
  });

/* =========================================================
   LEARNING PROGRESS
========================================================= */

export const useLearningProgress = () =>
  useQuery({
    queryKey: trainingKeys.progress,
    queryFn: trainingService.getLearningProgress,
  });

export const useAchievements = () =>
  useQuery({
    queryKey: trainingKeys.achievements,
    queryFn: trainingService.getAchievements,
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: trainingKeys.leaderboard,
    queryFn: trainingService.getLeaderboard,
  });

export const useCertificates = () =>
  useQuery({
    queryKey: trainingKeys.certificates,
    queryFn: trainingService.getCertificates,
  });

export const useQuizHistory = () =>
  useQuery({
    queryKey: ["training", "quiz-history"],
    queryFn: trainingService.getQuizHistory,
  });

export const useAIRecommendations = () =>
  useQuery({
    queryKey: trainingKeys.recommendations,
    queryFn: trainingService.getAIRecommendations,
  });

/* =========================================================
   MUTATIONS
========================================================= */

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingService.enrollCourse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.courses,
      });

      queryClient.invalidateQueries({
        queryKey: trainingKeys.progress,
      });
    },
  });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingService.markLessonComplete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.progress,
      });

      queryClient.invalidateQueries({
        queryKey: ["training", "lessons"],
      });

      queryClient.invalidateQueries({
        queryKey: trainingKeys.courses,
      });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-progress"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-courses"] });
    },
  });
};

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      progress,
      watchTime,
    }: {
      lessonId: string;
      progress: number;
      watchTime: number;
    }) =>
      trainingService.updateLessonProgress(
        lessonId,
        progress,
        watchTime
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.progress,
      });
    },
  });
};

export const useSaveAINotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      content,
    }: {
      lessonId: string;
      content: string;
    }) => trainingService.saveAINotes(lessonId, content),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.notes(variables.lessonId),
      });
    },
  });
};

export const useImproveAINotes = () =>
  useMutation({
    mutationFn: trainingService.improveAINotes,
  });

export const useGenerateFlashcards = () =>
  useMutation({
    mutationFn: trainingService.generateFlashcards,
  });

export const useGeneratePracticeQuestions = () =>
  useMutation({
    mutationFn: trainingService.generatePracticeQuestions,
  });

export const useGenerateRevisionNotes = () =>
  useMutation({
    mutationFn: trainingService.generateRevisionNotes,
  });

export const useGenerateInterviewQuestions = () =>
  useMutation({
    mutationFn: trainingService.generateInterviewQuestions,
  });

export const useGenerateStudyPlan = () =>
  useMutation({
    mutationFn: trainingService.generateStudyPlan,
  });

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      answers,
    }: {
      lessonId: string;
      answers: Record<string, string>;
    }) => trainingService.submitQuiz(lessonId, answers),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.progress,
      });

      queryClient.invalidateQueries({
        queryKey: trainingKeys.achievements,
      });
    },
  });
};

export const useSyncYouTubeVideo = () =>
  useMutation({
    mutationFn: ({ lessonId, url }: { lessonId: string; url: string }) =>
      trainingService.syncYouTubeVideo(lessonId, url),
  });