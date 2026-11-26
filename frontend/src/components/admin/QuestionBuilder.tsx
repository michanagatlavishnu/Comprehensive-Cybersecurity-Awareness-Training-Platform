import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  Save,
  Pencil,
} from "lucide-react";

import quizService from "../../services/admin/quizService";
import type {
  QuizQuestion,
  CreateQuestionPayload,
} from "../../types/quiz.types";

interface Props {
  quizId: string;
}

const EMPTY_QUESTION: CreateQuestionPayload = {
  title: "",
  question_type: "single_choice",
  points: 5,
  order: 1,
  explanation: "",
  options: [
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ],
};

export default function QuestionBuilder({ quizId }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<CreateQuestionPayload>(EMPTY_QUESTION);
  const [editingId, setEditingId] = useState<string | null>(null);

  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuestions(quizId);
      data.sort((a, b) => a.order - b.order);
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [quizId]);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_QUESTION,
      order: questions.length + 1,
    });
  };

  // =====================================================
  // OPTIONS
  // =====================================================

  const updateOption = (index: number, text: string) => {
    const updated = [...form.options];
    updated[index].text = text;
    setForm({ ...form, options: updated });
  };

  const selectCorrectOption = (index: number) => {
    const updated = form.options.map((option, i) => ({
      ...option,
      is_correct: i === index,
    }));
    setForm({ ...form, options: updated });
  };

  // =====================================================
  // SAVE QUESTION
  // =====================================================

 const saveQuestion = async () => {
  if (!form.title.trim()) {
    alert("Question is required.");
    return;
  }

  if (form.options.some((option) => !option.text.trim())) {
    alert("Please fill all four options.");
    return;
  }

  try {
    if (editingId) {
      await quizService.updateQuestion(editingId, form);
    } else {
      await quizService.createQuestion(quizId, {
        ...form,
        order: questions.length + 1,
      });
    }

    // Refresh question list immediately
    const updatedQuestions = await quizService.getQuestions(quizId);
    updatedQuestions.sort((a, b) => a.order - b.order);
    setQuestions(updatedQuestions);

    // Clear form for next question
    setEditingId(null);
    setForm({
      ...EMPTY_QUESTION,
      order: updatedQuestions.length + 1,
    });
  } catch (error) {
    console.error(error);
    alert("Failed to save question.");
  }
};

  // =====================================================
  // EDIT QUESTION
  // =====================================================

  const editQuestion = (question: QuizQuestion) => {
    setEditingId(question.id);

    setForm({
      title: question.title || (question as any).question || "",
      question_type: "single_choice",
      options: question.options,
      points: question.points,
      order: question.order,
      explanation: question.explanation || "",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Delete this question?")) return;

    await quizService.deleteQuestion(questionId);
    await loadQuestions();
  };

  // =====================================================
  // ORDERING
  // =====================================================

  const moveQuestion = async (index: number, direction: number) => {
    const updated = [...questions];
    const target = index + direction;

    if (target < 0 || target >= updated.length) return;

    [updated[index], updated[target]] = [updated[target], updated[index]];

    const payload = updated.map((question, idx) => ({
      question_id: question.id,
      order: idx + 1,
    }));

    setQuestions(
      updated.map((question, idx) => ({
        ...question,
        order: idx + 1,
      }))
    );

    await quizService.reorderQuestions(quizId, payload);
  };

  // =====================================================

  return (
    <div className="space-y-8">
      {/* Builder Form */}
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          {editingId ? "Edit Question" : "Create New Question"}
        </h2>

        {/* Question Input */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-300">
            Question
          </label>
          <textarea
            rows={3}
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="What is phishing?"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Options Input */}
        <div className="space-y-4">
          {form.options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => selectCorrectOption(index)}
              >
                <CheckCircle2
                  size={24}
                  className={
                    option.is_correct
                      ? "text-emerald-400"
                      : "text-slate-600"
                  }
                />
              </button>

              <input
                value={option.text}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-emerald-500"
              />
            </div>
          ))}
        </div>

        {/* Points & Order */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Points
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) =>
                setForm({
                  ...form,
                  points: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({
                  ...form,
                  order: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6">
          <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
            <HelpCircle size={16} />
            Explanation (Shown After Quiz)
          </label>
          <textarea
            rows={3}
            value={form.explanation}
            onChange={(e) =>
              setForm({
                ...form,
                explanation: e.target.value,
              })
            }
            placeholder="Explain why this answer is correct..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={saveQuestion}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            <Save size={18} />
            {editingId ? "Update Question" : "Save Question"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-xl bg-slate-700 px-6 py-3 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Question List */}
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Quiz Questions ({questions.length})
          </h2>

          
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-400">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No questions added yet.
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((question, questionIndex) => (
              <div
                key={question.id}
                className="rounded-2xl border border-slate-700 bg-slate-950 p-5"
              >
                {/* Replaced Question Heading Block */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Question {questionIndex + 1}
                    </h3>

                    <p className="mt-2 text-base text-slate-200">
                      {(question as any).question || question.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    

                    <button
                      onClick={() => editQuestion(question)}
                      className="rounded-lg bg-cyan-600 p-2 text-white hover:bg-cyan-500"
                      title="Edit Question"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Replaced Options Display Block */}
                <div className="mt-5 space-y-3">
                  {question.options.map((option: any, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${
                        option.is_correct
                          ? "border-green-500 bg-green-500/10"
                          : "border-slate-700 bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">
                          {String.fromCharCode(65 + index)}. {option.text}
                        </span>

                        {option.is_correct && (
                          <span className="rounded bg-green-600 px-2 py-1 text-xs text-white">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Question Explanation */}
                {question.explanation && (
                  <div className="mt-5 rounded-xl bg-slate-900 p-4 text-sm text-slate-300">
                    <span className="font-semibold text-emerald-400">
                      Explanation:
                    </span>
                    <p className="mt-2">{question.explanation}</p>
                  </div>
                )}

                {/* Footer Info */}
                <div className="mt-4 flex justify-between text-sm text-slate-400">
                  <span>{question.points} Points</span>
                  <span>Order #{question.order}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}