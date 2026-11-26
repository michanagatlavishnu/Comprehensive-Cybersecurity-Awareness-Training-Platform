import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Search,
  Trophy,
  Clock,
  FileQuestion,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import quizService from "../../../services/admin/quizService";
import QuizModal from "../../../components/admin/QuizModal";
import QuestionBuilder from "../../../components/admin/QuestionBuilder";

import type {
  Quiz,
  CreateQuizPayload,
} from "../../../types/quiz.types";
type Lesson = {
  id: string;
  lesson_number: number;
  title: string;
  short_description: string;
  estimated_minutes: number;
  xp_reward: number;
};
export default function QuizManagementPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] =
    useState<Quiz | null>(null);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] =
    useState("all");

  const [expandedQuiz, setExpandedQuiz] =
    useState<string | null>(null);

  // ===========================================
  // LOAD QUIZZES
  // ===========================================

  const loadQuizzes = async () => {
    if (!moduleId) return;

    try {
      setLoading(true);

      const data =
        await quizService.getModuleQuizzes(moduleId);

      setQuizzes(data);
    } finally {
      setLoading(false);
    }
  };
const loadLessons = async () => {
  if (!moduleId) return;

  try {
    const data = await quizService.getModuleLessons(moduleId);
    setLessons(data);
  } catch (error) {
    console.error("Failed to load lessons", error);
  }
};
  useEffect(() => {
  loadQuizzes();
  loadLessons();
}, [moduleId]);

  // ===========================================
  // CREATE / UPDATE
  // ===========================================

  const saveQuiz = async (
    payload: CreateQuizPayload
  ) => {
    if (!moduleId) return;

    if (editingQuiz) {
      await quizService.updateQuiz(
        editingQuiz.id,
        payload
      );
    } else {
      await quizService.createQuiz({
        ...payload,
        module_id: moduleId,
      });
    }

    setShowModal(false);
    setEditingQuiz(null);

    await loadQuizzes();
  };

  // ===========================================
  // DELETE
  // ===========================================

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Delete this quiz?")) return;

    await quizService.deleteQuiz(quizId);

    await loadQuizzes();
  };




  // ===========================================
  // PUBLISH
  // ===========================================

  const togglePublish = async (quiz: Quiz) => {
  try {
    const publish = !quiz.is_published;

    await quizService.publishQuiz(quiz.id, publish);

    toast.success(
      publish
        ? "Quiz published successfully."
        : "Quiz unpublished successfully."
    );

    loadQuizzes();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update quiz status.");
  }
};

  // ===========================================
  // FILTERS
  // ===========================================

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        quiz.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "all"
          ? true
          : quiz.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [quizzes, search, difficulty]);

  // ===========================================
  // STATS
  // ===========================================

  const stats = useMemo(() => {
    return {
      total: quizzes.length,

      published: quizzes.filter(
        (q) => q.is_published
      ).length,

      draft: quizzes.filter(
        (q) => !q.is_published
      ).length,

      questions: quizzes.reduce(
        (sum, q) => sum + q.total_questions,
        0
      ),
    };
  }, [quizzes]);

  // ===========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl p-8">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate("/admin/courses")
              }
              className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-3xl font-bold">
                Quiz Management
              </h1>

              <p className="mt-1 text-slate-400">
                Create quizzes for this training
                course and manage all questions.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingQuiz(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500"
          >
            <Plus size={18} />
            Create Quiz
          </button>
        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-slate-400 text-sm">
              Total Quizzes
            </p>

            <div className="mt-3 flex items-center gap-3">
              <FileQuestion className="text-cyan-400" />

              <span className="text-3xl font-bold">
                {stats.total}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-slate-400 text-sm">
              Published
            </p>

            <div className="mt-3 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" />

              <span className="text-3xl font-bold text-emerald-400">
                {stats.published}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-slate-400 text-sm">
              Drafts
            </p>

            <div className="mt-3 flex items-center gap-3">
              <XCircle className="text-orange-400" />

              <span className="text-3xl font-bold text-orange-400">
                {stats.draft}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-slate-400 text-sm">
              Total Questions
            </p>

            <div className="mt-3 flex items-center gap-3">
              <Trophy className="text-yellow-400" />

              <span className="text-3xl font-bold text-yellow-400">
                {stats.questions}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Filter */}

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-4 top-4 text-slate-500"
              size={18}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search quizzes..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="all">
              All Difficulty
            </option>

            <option value="beginner">
              Beginner
            </option>

            <option value="intermediate">
              Intermediate
            </option>

            <option value="advanced">
              Advanced
            </option>
          </select>
        </div>

        {/* Quiz List */}

        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 py-20 text-center text-slate-400">
            Loading quizzes...
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">
            <FileQuestion
              className="mx-auto mb-4 text-slate-600"
              size={54}
            />

            <h2 className="text-2xl font-bold">
              No Quizzes Found
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first quiz for this
              course.
            </p>

            <button
              onClick={() => {
                setEditingQuiz(null);
                setShowModal(true);
              }}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500"
            >
              Create Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900"
              >
                <div className="p-6">
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                    <div className="flex-1">

                      <div className="mb-4 flex flex-wrap items-center gap-3">

                        <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    quiz.is_published
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400"
  }`}
>
  {quiz.is_published ? "Published" : "Draft"}
</span>

                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs capitalize text-cyan-400">
                          {quiz.difficulty}
                        </span>

                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-400">
                          {quiz.total_questions} Questions
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold">
                        {quiz.title}
                      </h2>

                      <p className="mt-3 text-slate-400">
                        {quiz.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-300">
                        <span className="flex items-center gap-2">
                          <Clock size={16} />
                          {quiz.time_limit_minutes} Minutes
                        </span>

                        <span className="flex items-center gap-2">
                          <Trophy size={16} />
                          {quiz.xp_reward} XP
                        </span>

                        <span className="flex items-center gap-2">
                          Passing Score:
                          <strong className="text-emerald-400">
                            {quiz.passing_score}%
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          togglePublish(quiz)
                        }
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                          quiz.is_published
                            ? "bg-orange-600 hover:bg-orange-500"
                            : "bg-emerald-600 hover:bg-emerald-500"
                        }`}
                      >
                        {quiz.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setShowModal(true);
                        }}
                        className="rounded-xl bg-cyan-600 p-2 hover:bg-cyan-500"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          deleteQuiz(quiz.id)
                        }
                        className="rounded-xl bg-red-600 p-2 hover:bg-red-500"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        onClick={() =>
                          setExpandedQuiz(
                            expandedQuiz === quiz.id
                              ? null
                              : quiz.id
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 hover:bg-violet-500"
                      >
                        Questions

                        {expandedQuiz === quiz.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                                {/* Question Builder */}

                {expandedQuiz === quiz.id && (
                  <div className="border-t border-slate-700 bg-slate-950 p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-emerald-400">
                          Manage Questions
                        </h3>

                        <p className="mt-1 text-slate-400">
                          Add, edit, delete and reorder questions for{" "}
                          <span className="font-semibold text-white">
                            {quiz.title}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedQuiz(null)}
                        className="rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
                      >
                        Close
                      </button>
                    </div>

                    <QuestionBuilder quizId={quiz.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Statistics */}

        {!loading && quizzes.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Quiz Overview
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-400 text-sm">
                  Average Passing Score
                </p>

                <p className="mt-3 text-3xl font-bold text-emerald-400">
                  {Math.round(
                    quizzes.reduce(
                      (sum, quiz) => sum + quiz.passing_score,
                      0
                    ) / quizzes.length
                  )}
                  %
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-400 text-sm">
                  Total XP Rewards
                </p>

                <p className="mt-3 text-3xl font-bold text-yellow-400">
                  {quizzes.reduce(
                    (sum, quiz) => sum + quiz.xp_reward,
                    0
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-400 text-sm">
                  Average Quiz Duration
                </p>

                <p className="mt-3 text-3xl font-bold text-cyan-400">
                  {Math.round(
                    quizzes.reduce(
                      (sum, quiz) =>
                        sum + quiz.time_limit_minutes,
                      0
                    ) / quizzes.length
                  )}{" "}
                  mins
                </p>
              </div>
            </div>

            {/* Difficulty Breakdown */}

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-slate-300">
                Difficulty Breakdown
              </h3>

              <div className="space-y-4">
                {["beginner", "intermediate", "advanced"].map(
                  (level) => {
                    const count = quizzes.filter(
                      (quiz) => quiz.difficulty === level
                    ).length;

                    const percentage =
                      quizzes.length === 0
                        ? 0
                        : (count / quizzes.length) * 100;

                    return (
                      <div key={level}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="capitalize text-slate-300">
                            {level}
                          </span>

                          <span className="text-slate-400">
                            {count} Quiz
                            {count !== 1 ? "zes" : ""}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                          <div
                            style={{
                              width: `${percentage}%`,
                            }}
                            className={`h-full rounded-full ${
                              level === "beginner"
                                ? "bg-emerald-500"
                                : level === "intermediate"
                                ? "bg-cyan-500"
                                : "bg-violet-500"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Modal */}

        <QuizModal
  open={showModal}
  moduleId={moduleId || ""}
  lessons={lessons}
  editingQuiz={editingQuiz}
  onClose={() => {
    setEditingQuiz(null);
    setShowModal(false);
  }}
  onSave={saveQuiz}
/>
      </div>
    </div>
  );
}