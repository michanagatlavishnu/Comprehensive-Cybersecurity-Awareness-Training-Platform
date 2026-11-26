import { useEffect, useState } from "react";
import {
  X,
  Save,
  Clock,
  Trophy,
  Target,
  Loader2,
  BookOpen,
} from "lucide-react";

import type {
  Quiz,
  QuizDifficulty,
  CreateQuizPayload,
} from "../../types/quiz.types";
interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  short_description: string;
  estimated_minutes: number;
  xp_reward: number;
}
interface Props {
  open: boolean;
  moduleId: string;

  // NEW
  lessons: Lesson[];

  editingQuiz: Quiz | null;
  onClose: () => void;
  onSave: (payload: CreateQuizPayload) => Promise<void>;
}

const DEFAULT_FORM: CreateQuizPayload = {
  module_id: "",
  lesson_id: "",
  title: "",
  description: "",
  difficulty: "beginner",
  time_limit_minutes: 15,
  passing_score: 70,
  xp_reward: 100,
};

export default function QuizModal({
  open,
  moduleId,
  lessons,
  editingQuiz,
  onClose,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [selectedLessonId, setSelectedLessonId] = useState("");

  const selectedLesson = lessons.find(
    (lesson) => lesson.id === selectedLessonId
  );

  const [form, setForm] =
    useState<CreateQuizPayload>(DEFAULT_FORM);

 useEffect(() => {
  if (!open) return;

  if (editingQuiz) {
    setForm({
      module_id: moduleId,
      lesson_id: editingQuiz.lesson_id || "",
      title: editingQuiz.title,
      description: editingQuiz.description || "",
      difficulty: editingQuiz.difficulty,
      time_limit_minutes: editingQuiz.time_limit_minutes,
      passing_score: editingQuiz.passing_score,
      xp_reward: editingQuiz.xp_reward,
    });

    setSelectedLessonId(editingQuiz.lesson_id || "");
  } else {
    setForm({
      ...DEFAULT_FORM,
      module_id: moduleId,
      lesson_id: "",
    });

    setSelectedLessonId("");
  }
}, [editingQuiz, open, moduleId]);
useEffect(() => {
  if (!selectedLesson) return;

  setForm((prev) => ({
    ...prev,
    lesson_id: selectedLesson.id,
    title: `${selectedLesson.title} Quiz`,
    description: selectedLesson.short_description,
    time_limit_minutes: selectedLesson.estimated_minutes,
    xp_reward: selectedLesson.xp_reward,
  }));
}, [selectedLesson]);
  if (!open) return null;

  const updateField = (
    key: keyof CreateQuizPayload,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitQuiz = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (saving) return;

  if (!selectedLessonId) {
    alert("Please select a lesson.");
    return;
  }

  const payload: CreateQuizPayload = {
    ...form,
    module_id: moduleId,
    lesson_id: selectedLessonId,
  };

  console.log("SUBMIT QUIZ PAYLOAD:", payload);

  setSaving(true);

  try {
    await onSave(payload);
    onClose();
  } catch (error) {
    console.error("SAVE QUIZ ERROR:", error);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <form
        onSubmit={submitQuiz}
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {editingQuiz ? "Edit Quiz" : "Create Quiz"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Configure quiz settings for this training module.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        {/* Lesson Selection */}
<div>
  <label className="mb-2 block text-sm font-medium text-slate-300">
    Select Lesson *
  </label>

  <select
    value={selectedLessonId}
    onChange={(e) => setSelectedLessonId(e.target.value)}
    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none focus:border-violet-500"
  >
    <option value="">Choose Lesson</option>

    {lessons.map((lesson) => (
      <option key={lesson.id} value={lesson.id}>
        Lesson {lesson.lesson_number} — {lesson.title}
      </option>
    ))}
  </select>

  {selectedLesson && (
    <div className="mt-3 rounded-xl bg-violet-900/20 p-4 border border-violet-700">
      <p className="text-violet-300 text-sm font-semibold">
        Selected Lesson
      </p>

      <p className="mt-2 text-white font-semibold">
        {selectedLesson.title}
      </p>

      <p className="mt-1 text-slate-400 text-sm">
        {selectedLesson.short_description}
      </p>
    </div>
  )}
</div>
        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Quiz Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Quiz Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              placeholder="Phishing Awareness Quiz"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Quiz Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder="Short description of this quiz..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Difficulty Level
            </label>

            <div className="grid grid-cols-3 gap-3">
              {(
                ["beginner", "intermediate", "advanced"] as QuizDifficulty[]
              ).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    updateField("difficulty", level)
                  }
                  className={`rounded-xl border px-4 py-3 capitalize transition ${
                    form.difficulty === level
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : "border-slate-700 bg-slate-900 hover:border-slate-500"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Timer + XP */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Time Limit (Minutes)
              </label>

              <div className="relative">
                <Clock
                  className="absolute left-3 top-4 text-slate-500"
                  size={18}
                />

                <input
                  type="number"
                  min={1}
                  value={form.time_limit_minutes}
                  onChange={(e) =>
                    updateField(
                      "time_limit_minutes",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-4 pl-11 pr-4 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                XP Reward
              </label>

              <div className="relative">
                <Trophy
                  className="absolute left-3 top-4 text-yellow-500"
                  size={18}
                />

                <input
                  type="number"
                  min={0}
                  value={form.xp_reward}
                  onChange={(e) =>
                    updateField(
                      "xp_reward",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-4 pl-11 pr-4 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Passing Score */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Passing Percentage ({form.passing_score}%)
            </label>

            <input
              type="range"
              min={40}
              max={100}
              step={5}
              value={form.passing_score}
              onChange={(e) =>
                updateField(
                  "passing_score",
                  Number(e.target.value)
                )
              }
              className="w-full accent-emerald-500"
            />

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>40%</span>
              <span>60%</span>
              <span>70%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <div className="mb-4 flex items-center gap-3">
              <BookOpen className="text-emerald-500" />

              <h3 className="text-lg font-bold text-emerald-400">
                Quiz Preview
              </h3>
            </div>

            <h2 className="text-2xl font-bold">
              {form.title || "Quiz Title"}
            </h2>

            <p className="mt-2 text-slate-400">
              {form.description ||
                "Quiz description will appear here."}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Clock size={16} />

                  <span className="text-sm">Time Limit</span>
                </div>

                <p className="mt-2 text-xl font-bold">
                  {form.time_limit_minutes} Minutes
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Trophy size={16} />

                  <span className="text-sm">XP Reward</span>
                </div>

                <p className="mt-2 text-xl font-bold">
                  {form.xp_reward} XP
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Target size={16} />

                  <span className="text-sm">Passing Score</span>
                </div>

                <p className="mt-2 text-xl font-bold">
                  {form.passing_score}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-2 text-violet-400">
                  <BookOpen size={16} />

                  <span className="text-sm">Difficulty</span>
                </div>

                <p className="mt-2 text-xl font-bold capitalize">
                  {form.difficulty}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-700 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-6 py-3 font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Generating AI Quiz..." : "Save Quiz & Generate AI Questions" } 
          </button>
        </div>
      </form>
    </div>
  );
}