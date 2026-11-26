import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  PlayCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import trainingService from "../../../services/trainingService";
import type {
  Course,
  Lesson,
} from "../../../types/training.types";

import VideoPlayer from "../VideoPlayer";
import useTrainingProgress from "../../../hooks/useTrainingProgress";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";





export default function CourseDetailsPage() {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();

console.log("Course ID from URL:", courseId);

  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] = useState(true);
  const [aiNotes, setAiNotes] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const { saveProgress, completeLesson, saving } =
    useTrainingProgress();

  // ===========================================
  // Load Course + Lessons
  // ===========================================

  useEffect(() => {
  if (!courseId) return;

  loadCourse(courseId);
}, [courseId]);

const loadCourse = async (id: string) => {
  try {
    setLoading(true);

    console.log("Loading Course:", id);

    const courseData = await trainingService.getCourse(id);
    const lessonData = await trainingService.getLessons(id);

    setCourse(courseData);
    setLessons(lessonData || []);

    if (lessonData && lessonData.length > 0) {
      const firstLesson = await trainingService.getLesson(
        lessonData[0].id
      );
      setCurrentLesson(firstLesson);
    } else {
      setCurrentLesson(null);
    }
  } catch (err) {
    console.error("COURSE LOAD ERROR:", err);
    setCourse(null);
    setLessons([]);
    setCurrentLesson(null);
  } finally {
    setLoading(false);
  }
};

  const courseProgress = useMemo(() => {
    if (!lessons.length) return 0;

    const completed = lessons.filter(
      (lesson) => lesson.completed
    ).length;

    return Math.round(
      (completed / lessons.length) * 100
    );
  }, [lessons]);

  // ===========================================
  // Lesson Selection
  // ===========================================

 const selectLesson = async (lessonId: string) => {
  try {
    const lesson = await trainingService.getLesson(lessonId);

    if (lesson) {
      setCurrentLesson(lesson);
      setAiNotes("");
      setLessons((prev) =>
        prev.map((item) =>
          item.id === lesson.id
            ? {
                ...item,
                progress: lesson.completed ? 100 : lesson.progress,
                watch_time: lesson.watch_time,
                completed: lesson.completed,
              }
            : item
        )
      );
    }
  } catch (error) {
    console.error("Failed to load lesson:", error);
  }
};

  // ===========================================
  // Save Video Progress
  // ===========================================

  const onVideoProgress = async (
    progress: number,
    watchTime: number
  ) => {
    if (!currentLesson) return;

    const savedProgress = await saveProgress(
      currentLesson.id,
      progress,
      watchTime
    );

    const savedLessonProgress = savedProgress?.data ?? savedProgress;
    const savedProgressValue = Math.min(
      100,
      Math.max(0, Number(savedLessonProgress?.progress ?? progress))
    );
    const savedCompleted = Boolean(
      savedLessonProgress?.completed || savedProgressValue >= 100
    );

    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === currentLesson.id
          ? {
              ...lesson,
              progress: savedCompleted ? 100 : savedProgressValue,
              completed: savedCompleted,
            }
          : lesson
      )
    );

    setCurrentLesson((prev) =>
      prev
        ? {
            ...prev,
            progress: savedCompleted ? 100 : savedProgressValue,
            completed: savedCompleted,
          }
        : prev
    );

    if (savedProgressValue >= 95 && !currentLesson.completed) {
      await finishLesson();
    }
  };

  // ===========================================
  // Complete Lesson
  // ===========================================

  const finishLesson = async () => {
    if (!currentLesson) return;

    await completeLesson(currentLesson.id);

    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === currentLesson.id
          ? {
              ...lesson,
              completed: true,
              progress: 100,
            }
          : lesson
      )
    );

    setCurrentLesson((prev) =>
      prev
        ? {
            ...prev,
            completed: true,
            progress: 100,
          }
        : prev
    );
  };

  const downloadLessonPdf = async () => {
    if (!currentLesson || !course) return;

    setDownloadingPdf(true);

    let generatedNotes = aiNotes;
    if (!generatedNotes) {
      try {
        const result = await trainingService.getAINotes(currentLesson.id);
        generatedNotes = result?.content || "";
        setAiNotes(generatedNotes);
      } catch {
        generatedNotes = "AI notes could not be generated for this download.";
      }
    }

    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const columnGap = 8;
      const columnWidth = (pageWidth - margin * 2 - columnGap) / 2;

      const cleanPdfLine = (line: string) => {
        let cleaned = line
          .replace(/\u00a0/g, " ")
          .replace(/^\s*#{1,6}\s*/, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/__(.*?)__/g, "$1")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/[ \t]+/g, " ")
          .trim();

        // Groq can return letter-spaced words; join only real runs such as "D a y".
        const tokens = cleaned.split(" ");
        const normalized: string[] = [];
        let letters: string[] = [];
        let numbers: string[] = [];
        let foundSpacedRun = false;

        const flushLetters = () => {
          if (letters.length) {
            if (letters.length >= 2) foundSpacedRun = true;
            normalized.push(letters.join(""));
            letters = [];
          }
        };
        const flushNumbers = () => {
          if (numbers.length) {
            normalized.push(numbers.join(""));
            numbers = [];
          }
        };

        tokens.forEach((token) => {
          if (/^[A-Za-z]$/.test(token)) {
            flushNumbers();
            if (token === token.toUpperCase() && letters.length) flushLetters();
            letters.push(token);
          } else if (/^\d$/.test(token)) {
            flushLetters();
            numbers.push(token);
          } else {
            flushLetters();
            flushNumbers();
            normalized.push(token);
          }
        });
        flushLetters();
        flushNumbers();

        const normalizedText = foundSpacedRun ? normalized.join(" ") : cleaned;
        return normalizedText.replace(
          /\b(?:[A-Za-z]\s+){1,}[A-Za-z]\b/g,
          (word) => word.replace(/\s+/g, "")
        );
      };

      const textLines = (text: string, width: number, maxLines: number) => {
        const lines: string[] = [];
        text.split(/\r?\n/).forEach((rawLine) => {
          const line = cleanPdfLine(rawLine);
          if (!line || line === "---" || /^\|?\s*:?-+\s*(\|\s*:?-+\s*)+\|?$/.test(line)) {
            return;
          }

          const tableCells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
          const tableLine = tableCells.length > 1
            ? `${tableCells[0]}: ${tableCells.slice(1).join(" - ")}`
            : line;
          const isBullet = /^[-*]\s+/.test(tableLine);
          const body = isBullet ? tableLine.replace(/^[-*]\s+/, "") : tableLine;
          const wrapped = pdf.splitTextToSize(body, isBullet ? width - 6 : width);
          const safeLines = wrapped.flatMap((wrappedLine: string) =>
            wrappedLine.match(/.{1,58}(?:\s|$)|.{1,58}/g) || [wrappedLine]
          );
          safeLines.forEach((wrappedLine: string, index: number) => {
            if (lines.length < maxLines) {
              lines.push(isBullet && index === 0 ? `- ${wrappedLine.trim()}` : wrappedLine.trim());
            }
          });
        });
        if (lines.length === maxLines) lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -3)}...`;
        return lines;
      };

      const drawSection = (title: string, content: string, x: number, y: number, maxLines: number) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(15, 76, 129);
        pdf.text(title, x, y);
        y += 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(45, 55, 72);
        textLines(content, columnWidth - 10, maxLines).forEach((line) => {
          pdf.text(line, x + 5, y);
          y += 4.2;
        });
        return y + 4;
      };

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);
      pdf.setTextColor(15, 23, 42);
      const titleLines = pdf.splitTextToSize(course.title, pageWidth - margin * 2);
      titleLines.forEach((line: string) => {
        pdf.text(line, margin, 16);
      });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(90, 100, 115);
      pdf.text("CyberAware course lesson guide", margin, 23);
      pdf.setDrawColor(190, 205, 220);
      pdf.line(margin, 27, pageWidth - margin, 27);

      const lessonContent = currentLesson.transcript?.trim()
        || currentLesson.description.trim()
        || generatedNotes
        || `Study material for ${currentLesson.title}.`;
      const courseDetails = [
        `Course: ${course.title}`,
        `Category: ${course.category}`,
        `Level: ${course.level}`,
        `Course duration: ${course.duration}`,
        `Lesson: ${currentLesson.title}`,
        `Lesson duration: ${currentLesson.duration}`,
      ].join("\n");
      const checklist = [
        `Review the key concepts in ${currentLesson.title}.`,
        "Write down unfamiliar terms and their definitions.",
        "Test your understanding with the lesson quiz.",
        "Apply the lesson principles to a realistic security scenario.",
      ].map((item) => `- ${item}`).join("\n");

      pdf.setFillColor(247, 250, 252);
      pdf.roundedRect(margin, 31, columnWidth, pageHeight - 43, 3, 3, "F");
      pdf.roundedRect(margin + columnWidth + columnGap, 31, columnWidth, pageHeight - 43, 3, 3, "F");

      let leftY = 40;
      leftY = drawSection("Course Details", courseDetails, margin + 5, leftY, 7);
      leftY = drawSection("Lesson Content", lessonContent || "No lesson content is available.", margin + 5, leftY, 15);

      let rightY = 40;
      rightY = drawSection("Groq AI Study Notes", generatedNotes || "AI notes were not available for this download.", margin + columnWidth + columnGap + 5, rightY, 14);
      drawSection("Study Checklist", checklist, margin + columnWidth + columnGap + 5, Math.max(rightY, 112), 5);

      const courseFileName = course.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const lessonFileName = currentLesson.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      pdf.save(`${courseFileName}-${lessonFileName || "lesson"}.pdf`);
      await trainingService.recordDownloadActivity(course.title, currentLesson.title);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold text-cyan-400">
        Loading CyberAware Course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-400">
        Course not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">

      {/* ===================== Top Navigation ===================== */}

      <div className="flex items-center justify-between">
        <Link
          to="/training"
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft size={18} />
          Back to Training
        </Link>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          {course.category}
        </div>
      </div>

      {/* ===================== Hero ===================== */}

      <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950">

        <div className="grid lg:grid-cols-[1.5fr_320px]">

          {/* Left */}

          <div className="space-y-5 p-8">

            <div className="flex flex-wrap gap-3">

              <span className="rounded-full bg-cyan-500/20 px-4 py-1 text-sm text-cyan-300">
                {course.level}
              </span>

              <span className="rounded-full bg-yellow-500/20 px-4 py-1 text-sm text-yellow-300">
                {course.xp_reward} XP Reward
              </span>

              <span className="rounded-full bg-violet-500/20 px-4 py-1 text-sm text-violet-300">
                {course.lessons_count} Lessons
              </span>

            </div>

            <h1 className="text-4xl font-black text-white">
              {course.title}
            </h1>

            <p className="text-lg leading-8 text-slate-300">
              {course.description}
            </p>

            <div className="grid gap-5 pt-3 md:grid-cols-3">

              <div className="rounded-2xl bg-white/5 p-5">

                <Clock className="mb-3 text-cyan-400" />

                <p className="text-sm text-slate-400">
                  Duration
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {course.duration}
                </p>

              </div>

              <div className="rounded-2xl bg-white/5 p-5">

                <BookOpen className="mb-3 text-violet-400" />

                <p className="text-sm text-slate-400">
                  Lessons
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {course.lessons_count}
                </p>

              </div>

              <div className="rounded-2xl bg-white/5 p-5">

                <Trophy className="mb-3 text-yellow-400" />

                <p className="text-sm text-slate-400">
                  Course XP
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {course.xp_reward}
                </p>

              </div>

            </div>

          </div>

          {/* Right Progress Card */}

          <div className="border-l border-white/10 bg-black/30 p-8">

            <h3 className="mb-4 text-xl font-bold text-white">
              Overall Progress
            </h3>

            <div className="mb-3 flex items-end gap-2">

              <span className="text-5xl font-black text-cyan-400">
                {courseProgress}
              </span>

              <span className="pb-2 text-slate-400">
                %
              </span>

            </div>

            <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-700">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                style={{
                  width: `${courseProgress}%`,
                }}
              />

            </div>

            <p className="text-sm text-slate-300">
              Completed{" "}
              {
                lessons.filter(
                  (lesson) => lesson.completed
                ).length
              }
              {" / "}
              {lessons.length} lessons.
            </p>

            <div className="mt-8 rounded-2xl bg-cyan-500/10 p-5">

              <ShieldCheck className="mb-3 text-cyan-300" />

              <p className="text-sm text-slate-300">
                      Finish every lesson and pass each lesson quiz
                      to unlock your CyberAware Certificate.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===================== Main Grid ===================== */}

      <section className="grid gap-8 lg:grid-cols-[300px_1fr]">

        {/* Sidebar */}

        <aside className="space-y-4">

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">

            <h2 className="mb-5 text-xl font-bold text-white">
              Course Lessons
            </h2>

            {lessons.map((lesson, index) => {

              const active =
                lesson.id === currentLesson?.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() =>
                    selectLesson(lesson.id)
                  }
                  className={`mb-3 w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-cyan-700"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-cyan-400">
                        Lesson {index + 1}
                      </p>

                      <h4 className="mt-2 font-semibold text-white">
                        {lesson.title}
                      </h4>

                    </div>

                    {lesson.completed ? (
                      <CheckCircle2 className="text-emerald-400" />
                    ) : (
                      <PlayCircle className="text-slate-500" />
                    )}

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">

                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{
                        width: `${lesson.completed ? 100 : Math.min(100, Math.max(0, lesson.progress))}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    {lesson.completed ? 100 : Math.round(Math.min(100, Math.max(0, lesson.progress)))}% watched
                  </p>

                </button>
              );
            })}
          </div>
        </aside>

        {/* Lesson Content */}

        <div className="space-y-8">

          {currentLesson ? (
            <>

              {/* YouTube Player */}

              <VideoPlayer
                url={currentLesson.video_url}
                initialWatchTime={currentLesson.watch_time}
                 key={currentLesson.id}
                onProgress={onVideoProgress}
              />

              {/* Transcript */}

              {currentLesson.transcript?.trim() && (
                <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">

                <div className="mb-6 flex items-center gap-3">

                  <FileText className="text-cyan-400" />

                  <h3 className="text-2xl font-bold text-white">
                    Lesson Transcript
                  </h3>

                </div>

                  <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-8 text-slate-300">
                    {currentLesson.transcript}
                  </div>

                </section>
              )}

              {/* ================= Lesson Progress ================= */}

              <section className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Lesson Progress
                    </h3>

                    <p className="mt-2 text-slate-400">
                      Finish this lesson to earn XP and update your progress.
                    </p>
                  </div>

                  <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
                    {currentLesson.completed
                      ? "100% Completed"
                      : `${Math.round(Math.min(100, Math.max(0, currentLesson.progress)))}% Completed`}
                  </span>

                </div>

                <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-700">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                    style={{
                      width: `${currentLesson.completed ? 100 : Math.min(100, Math.max(0, currentLesson.progress))}%`,
                    }}
                  />

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <button
                    disabled={saving || currentLesson.completed}
                    onClick={() => {
                      if (currentLesson.progress < 95) {
                        window.alert("Watch at least 95% of this lesson before completing it.");
                        return;
                      }
                      void finishLesson();
                    }}
                    className={`rounded-2xl px-6 py-4 font-semibold transition ${
                      currentLesson.completed
                        ? "bg-emerald-700 text-white"
                        : "bg-emerald-500 text-black hover:bg-emerald-400"
                    }`}
                  >
                    {currentLesson.completed
                      ? t("lessonCompleted")
                      : t("completeLesson")}
                  </button>

                  {currentLesson.completed && (
                    <button
                      onClick={() => navigate(`/quiz/lesson/${currentLesson.id}`)}
                      className="rounded-2xl bg-cyan-500 px-6 py-4 font-semibold text-black transition hover:bg-cyan-400"
                    >
                      Take Lesson Quiz
                    </button>
                  )}

                </div>

              </section>

              {/* ================= Resources ================= */}

              <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">

                <div className="mb-6 flex items-center gap-3">

                  <BookOpen className="text-cyan-400" />

                  <h3 className="text-2xl font-bold text-white">
                    Lesson Resources
                  </h3>

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <p className="text-sm uppercase tracking-[3px] text-cyan-400">
                      Course PDF
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-white">
                      {currentLesson.title} Study Guide
                    </h4>

                    <p className="mt-2 text-sm text-slate-400">
                      Download this course lesson with its content, course details,
                      and Groq AI study notes.
                    </p>

                    <button
                      type="button"
                      onClick={downloadLessonPdf}
                      disabled={downloadingPdf}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Download size={16} />
                      {downloadingPdf ? t("preparingPdf") : t("downloadPdf")}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <p className="text-sm uppercase tracking-[3px] text-violet-400">
                      Quick Checklist
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-white">
                      Before Clicking Any Email Link
                    </h4>

                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                      <li>{t("hoverLinks")}</li>
                      <li>{t("checkSenderDomain")}</li>
                      <li>{t("lookForUrgency")}</li>
                      <li>{t("avoidUnexpectedAttachments")}</li>
                      <li>{t("reportSuspiciousEmails")}</li>
                    </ul>
                  </div>

                </div>

              </section>

              {/* ================= Security Tips ================= */}

              <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950 p-6">

                <div className="mb-6 flex items-center gap-3">

                  <ShieldCheck className="text-amber-400" />

                  <h3 className="text-2xl font-bold text-white">
                    Cyber Security Tips
                  </h3>

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {[
                    "Always verify URLs before entering credentials.",
                    "Enable Multi-Factor Authentication wherever possible.",
                    "Never share passwords over email or chat.",
                    "Keep browsers and operating systems updated.",
                    "Report suspicious emails to your security team.",
                    "Use password managers instead of reusing passwords.",
                  ].map((tip, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-black/20 p-4 text-slate-200"
                    >
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                        {index + 1}
                      </div>

                      {tip}
                    </div>
                  ))}

                </div>

              </section>

              {/* ================= Course Completion Card ================= */}

              {courseProgress === 100 && (
                <section className="rounded-3xl border border-emerald-500 bg-gradient-to-r from-emerald-700/20 to-cyan-700/20 p-8">

                  <div className="flex flex-col items-center text-center">

                    <Trophy size={64} className="mb-4 text-yellow-400" />

                    <h2 className="text-4xl font-black text-white">
                      Congratulations!
                    </h2>

                    <p className="mt-4 max-w-2xl text-lg text-slate-200">
                      You've successfully completed all lessons in this training
                      module. You're now eligible to take the AI-generated quiz
                      and earn your CyberAware certificate.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                      <Link
                        to="/training"
                        className="rounded-2xl border border-white/20 px-6 py-4 text-white hover:bg-white/10"
                      >
                        Back to Training
                      </Link>

                    </div>

                  </div>

                </section>
              )}

            </>
          ) : (
            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center">
              <BookOpen className="mx-auto mb-4 text-cyan-400" size={48} />

              <h2 className="text-2xl font-bold text-white">
                No Lessons Available
              </h2>

              <p className="mt-3 text-slate-400">
                This course doesn't have any published lessons yet.
              </p>

              <button
                onClick={() => navigate("/training")}
                className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Back to Training
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}