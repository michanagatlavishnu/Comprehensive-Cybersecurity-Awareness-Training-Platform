import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import trainingService from "../services/trainingService";

export default function useTrainingProgress() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const saveProgress = async (
    lessonId: string,
    progress: number,
    watchTime: number
  ) => {
    try {
      setSaving(true);

      return await trainingService.updateLessonProgress(
        lessonId,
        progress,
        watchTime
      );
    } finally {
      setSaving(false);
    }
  };

  const completeLesson = async (lessonId: string) => {
    try {
      setSaving(true);

      await trainingService.markLessonComplete(lessonId);
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-progress"] });
      await queryClient.invalidateQueries({ queryKey: ["training", "courses"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-courses"] });
    } finally {
      setSaving(false);
    }
  };

  return {
    saveProgress,
    completeLesson,
    saving,
  };
}