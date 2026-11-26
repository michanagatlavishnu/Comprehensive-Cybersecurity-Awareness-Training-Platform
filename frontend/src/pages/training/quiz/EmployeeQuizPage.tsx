import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import trainingService from "../../../services/trainingService";
import { trainingKeys } from "../../../hooks/useTraining";
import type { QuizResult } from "../../../types/quiz.types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../services/translationService";

type QuizData = {
  quiz: {
    id: string;
    title: string;
    description: string;
    passing_score: number;
    time_limit_minutes: number;
  };
  questions: Array<{
    id: string;
    question: string;
    options: string[];
  }>;
};

export default function EmployeeQuizPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [sourceQuiz, setSourceQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lessonId) return;

    const loadQuiz = async () => {
      try {
        const publishedQuiz = await trainingService.getLessonQuiz(lessonId);
        const quizData = await trainingService.takeEmployeeQuiz(publishedQuiz.id);
        setSourceQuiz(quizData);
        setQuiz(quizData);
      } catch (loadError: any) {
        setError(
          loadError?.response?.data?.detail ||
            t("completeLessonBeforeQuiz")
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId]);

  useEffect(() => {
    if (!sourceQuiz || language === "en") {
      setQuiz(sourceQuiz);
      return;
    }

    let cancelled = false;

    const translateQuiz = async () => {
      try {
        const [title, description, ...questionTexts] = await Promise.all([
          translateText(sourceQuiz.quiz.title, language),
          translateText(sourceQuiz.quiz.description, language),
          ...sourceQuiz.questions.flatMap((question) => [
            translateText(question.question, language),
            ...question.options.map((option) => translateText(option, language)),
          ]),
        ]);

        let textIndex = 0;
        const questions = sourceQuiz.questions.map((question) => {
          const translatedQuestion = questionTexts[textIndex++];
          const options = question.options.map(() => questionTexts[textIndex++]);
          return {
            ...question,
            question: translatedQuestion,
            options,
          };
        });

        if (!cancelled) {
          setQuiz({
            ...sourceQuiz,
            quiz: { ...sourceQuiz.quiz, title, description },
            questions,
          });
        }
      } catch {
        if (!cancelled) setQuiz(sourceQuiz);
      }
    };

    void translateQuiz();

    return () => {
      cancelled = true;
    };
  }, [language, sourceQuiz]);

  const submit = async () => {
    if (!quiz || Object.keys(answers).length !== quiz.questions.length) {
      setError(t("answerEveryQuestion"));
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = quiz.questions.map((question) => ({
        question_id: question.id,
        selected_option: Number(answers[question.id]),
      }));
      const quizResult = await trainingService.submitEmployeeQuiz(quiz.quiz.id, payload);
      setResult(quizResult);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: trainingKeys.progress }),
        queryClient.invalidateQueries({ queryKey: trainingKeys.certificates }),
        queryClient.invalidateQueries({ queryKey: ["training", "quiz-history"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    } catch (submitError: any) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.detail ||
          submitError?.response?.data?.errors?.[0]?.msg ||
          t("quizSubmissionFailed")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">{t("loadingQuiz")}</div>;
  }

  if (error && !quiz) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-cyan-300">
          <ArrowLeft size={18} /> {t("backToTraining")}
        </button>
        <div className="max-w-2xl rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
          {error}
        </div>
      </main>
    );
  }

  if (!quiz) return null;

  if (result) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center">
            <Trophy className="mx-auto mb-4 text-amber-300" size={42} />
            <h1 className="text-3xl font-black">{t("quizResults")}</h1>
            <p className="mt-3 text-5xl font-black text-emerald-300">{result.percentage}%</p>
            <p className="mt-2 text-slate-300">{result.passed ? t("passed") : t("notPassedYet")}</p>
            {result.passed && result.certificate_id && (
              <button
                onClick={() => navigate("/certificates")}
                className="mt-6 rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950"
              >
                {t("viewCertificate")}
              </button>
            )}
          </div>
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-bold">{t("answerReview")}</h2>
            <div className="space-y-3">
              {result.review.map((item, index) => (
                <div key={`${item.question}-${index}`} className="flex items-start gap-3 border-b border-white/10 py-3">
                  <CheckCircle2 className={item.correct ? "text-emerald-400" : "text-rose-400"} size={18} />
                  <div><p>{item.question}</p><p className="text-sm text-slate-400">{item.correct ? t("correct") : t("reviewAnswer")}</p></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-cyan-300">
          <ArrowLeft size={18} /> {t("backToTraining")}
        </button>
        <h1 className="text-3xl font-black">{quiz.quiz.title}</h1>
        <p className="mt-2 text-slate-400">{quiz.quiz.description}</p>
        <div className="mt-8 space-y-5">
          {quiz.questions.map((question, index) => (
            <section key={question.id} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="font-bold">{index + 1}. {question.question}</h2>
              <div className="mt-4 grid gap-3">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 hover:border-cyan-400/60">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
        {error && <p className="mt-5 text-rose-300">{error}</p>}
        <button onClick={submit} disabled={submitting} className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
          {submitting ? t("submitting") : t("submitQuiz")}
        </button>
      </div>
    </main>
  );
}