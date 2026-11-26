import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  BookOpen,
  Clock3,
  Trophy,
  CheckCircle2,
  Lock,
  BrainCircuit,
  FileText,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import VideoPlayer from "../VideoPlayer";
import {
  useLessons,
  useModule,
  useCompleteLesson,
  useUpdateLessonProgress,
} from "../../../hooks/useTraining";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  progress?: number;
  completed: boolean;
  locked: boolean;
  video: string;
  xp: number;
}

const lessons: Lesson[] = [
  {
    id: "m1",
    title: "Introduction to Email Security",
    duration: "18 min",
    completed: true,
    locked: false,
    video: "/videos/email-security-1.mp4",
    xp: 15,
  },
  {
    id: "m2",
    title: "Understanding Phishing Emails",
    duration: "22 min",
    completed: true,
    locked: false,
    video: "/videos/email-security-2.mp4",
    xp: 20,
  },
  {
    id: "m3",
    title: "Spoofed Domains & Fake Senders",
    duration: "20 min",
    completed: false,
    locked: false,
    video: "/videos/email-security-3.mp4",
    xp: 20,
  },
  {
    id: "m4",
    title: "Malicious Attachments",
    duration: "24 min",
    completed: false,
    locked: false,
    video: "/videos/email-security-4.mp4",
    xp: 20,
  },
  {
    id: "m5",
    title: "QR Code Phishing (Quishing)",
    duration: "18 min",
    completed: false,
    locked: false,
    video: "/videos/email-security-5.mp4",
    xp: 20,
  },
  {
    id: "m6",
    title: "AI Generated Phishing Emails",
    duration: "25 min",
    completed: false,
    locked: false,
    video: "/videos/email-security-6.mp4",
    xp: 20,
  },
  {
    id: "m7",
    title: "Business Email Compromise",
    duration: "27 min",
    completed: false,
    locked: true,
    video: "/videos/email-security-7.mp4",
    xp: 20,
  },
  {
    id: "m8",
    title: "Enterprise Reporting Workflow",
    duration: "15 min",
    completed: false,
    locked: true,
    video: "/videos/email-security-8.mp4",
    xp: 15,
  },
];

const aiHighlights = [
  "Identify suspicious sender domains.",
  "Check URLs before clicking.",
  "Inspect email headers.",
  "Avoid opening unknown attachments.",
  "Report phishing using CyberAware.",
];

const resources = [
  {
    title: "Email Security Cheat Sheet.pdf",
    size: "2.3 MB",
  },
  {
    title: "Phishing Indicators.pdf",
    size: "1.8 MB",
  },
  {
    title: "NIST Email Checklist.pdf",
    size: "3.0 MB",
  },
  {
    title: "Incident Reporting Template.docx",
    size: "420 KB",
  },
];

export default function ModulePlayerPage() {
  const { t } = useTranslation();
  const { moduleId } = useParams();

  const { data: module } = useModule(moduleId ?? "");
  const { data: apiLessons = [], isLoading } = useLessons(moduleId ?? "");
  const updateProgress = useUpdateLessonProgress();
  const completeLesson = useCompleteLesson();

  const lessons = apiLessons.map((item) => ({
    id: item.id,
    title: item.title,
    duration: item.duration,
    progress: item.progress ?? 0,
    watchTime: item.watch_time ?? 0,
    completed: item.completed,
    locked: false,
    video: item.video_url,
    xp: item.xp_reward,
  }));

  const initialLesson =
    lessons.findIndex((lesson) => lesson.id === moduleId) >= 0
      ? lessons.findIndex((lesson) => lesson.id === moduleId)
      : 0;

  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  const lesson = lessons[currentLesson];

  useEffect(() => {
    setProgress(Math.round(lesson?.completed ? 100 : lesson?.progress ?? 0));
  }, [lesson?.id, lesson?.completed, lesson?.progress]);

  const completion = useMemo(() => {
    const completed = lessons.filter((lesson) => lesson.completed).length;
    return Math.round((completed / lessons.length) * 100);
  }, [lessons]);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">{t("loadingTraining")}</div>;
  }

  if (!module || !lesson) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">{t("lessonNotFound")}</div>;
  }

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      const nextIndex = currentLesson + 1;
      setCurrentLesson(nextIndex);
      setProgress(Math.round(lessons[nextIndex].progress));
      setPlaying(false);
    }
  };

  const previousLesson = () => {
    if (currentLesson > 0) {
      const previousIndex = currentLesson - 1;
      setCurrentLesson(previousIndex);
      setProgress(Math.round(lessons[previousIndex].progress));
      setPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}

        <aside className="border-r border-white/10 bg-slate-900/70">
          <div className="sticky top-0 p-6">
            <Link
              to="/training/all-courses"
              className="mb-5 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
            >
              <ArrowLeft size={18} />
              {t("backToCourses")}
            </Link>

            <p className="text-xs uppercase tracking-[3px] text-cyan-400">
              CyberAware Learning
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {module.title}
            </h2>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span>{t("courseProgress")}</span>
                <span className="text-cyan-300">{completion}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {lessons.map((item, index) => (
                <button
                  key={item.id}
                  disabled={item.locked}
                  onClick={() => {
                    setCurrentLesson(index);
                    setProgress(Math.round(item.progress ?? 0));
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    currentLesson === index
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-slate-800/50 hover:border-cyan-500/30"
                  } ${item.locked ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {item.completed ? (
                      <CheckCircle2 className="mt-1 text-emerald-400" size={18} />
                    ) : item.locked ? (
                      <Lock className="mt-1 text-slate-500" size={18} />
                    ) : (
                      <PlayCircle className="mt-1 text-cyan-400" size={18} />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.title}</p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                        <span>{item.duration}</span>
                        <span>+{item.xp} XP</span>
                        <span>{Math.round(item.progress ?? 0)}% {t("watched")}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}

        <main className="p-6 lg:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[3px] text-cyan-400">
                {t("lessonOf", { current: currentLesson + 1, total: lessons.length })}
              </p>

              <h1 className="mt-2 text-4xl font-black">{lesson.title}</h1>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  {lesson.duration}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Trophy size={16} />
                  {lesson.xp} {t("xpReward")}
                </span>

                <span className="inline-flex items-center gap-2">
                  <BookOpen size={16} />
                  {t("enterpriseTraining")}
                </span>
              </div>
            </div>

            <button
              disabled={completeLesson.isPending || lesson.completed}
              onClick={() => {
                if (progress < 95) {
                  window.alert(t("watchNinetyFive"));
                  return;
                }
                completeLesson.mutate(lesson.id);
              }}
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {lesson.completed ? t("lessonCompleted") : t("completeLesson")}
            </button>
          </div>

          {/* Video Player */}

          <section className="mb-8 overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900 p-3">
            {lesson.video ? (
              <VideoPlayer
                key={lesson.id}
                url={lesson.video}
                initialWatchTime={lesson.watchTime}
                title={lesson.title}
                onProgress={(value, watchTime) => {
                  setProgress(Math.round(value));
                  updateProgress.mutate({
                    lessonId: lesson.id,
                    progress: value,
                    watchTime,
                  });
                }}
                onComplete={() => completeLesson.mutate(lesson.id)}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-slate-400">
                {t("noVideo")}
              </div>
            )}
          </section>

          {/* Navigation */}

          <section className="mb-8 flex flex-wrap justify-between gap-4">
            <button
              disabled={currentLesson === 0}
              onClick={previousLesson}
              className="rounded-full border border-white/10 bg-slate-900 px-5 py-3 disabled:opacity-40"
            >
              <ArrowLeft className="mr-2 inline" size={16} />
              Previous Lesson
            </button>

            <button
              disabled={currentLesson === lessons.length - 1}
              onClick={nextLesson}
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-semibold text-black disabled:opacity-40"
            >
              Next Lesson
              <ArrowRight className="ml-2 inline" size={16} />
            </button>
          </section>

          {/* Lesson Content */}

          <section className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="text-cyan-400" />
              <h2 className="text-2xl font-bold">{t("lessonOverview")}</h2>
            </div>

            <p className="leading-8 text-slate-300">
              In this lesson you'll understand how enterprise phishing attacks
              work, identify spoofed domains, inspect suspicious links, verify
              sender identity, analyze malicious attachments, and safely report
              phishing emails using CyberAware's incident reporting workflow.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {aiHighlights.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl bg-slate-800/60 p-4"
                >
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Actions */}

          <section className="mb-8 grid gap-5 md:grid-cols-3">
            <button className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6 text-left transition hover:bg-violet-500/20">
              <BrainCircuit className="mb-4 text-violet-300" size={28} />
              <h3 className="font-bold">{t("generateAiNotes")}</h3>
              <p className="mt-2 text-sm text-slate-300">
                Create personalized notes from this lesson.
              </p>
            </button>

            <button className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 text-left transition hover:bg-cyan-500/20">
              <Sparkles className="mb-4 text-cyan-300" size={28} />
              <h3 className="font-bold">{t("aiSummary")}</h3>
              <p className="mt-2 text-sm text-slate-300">
                Generate quick revision summary in seconds.
              </p>
            </button>

            <button className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-left transition hover:bg-emerald-500/20">
              <FileText className="mb-4 text-emerald-300" size={28} />
              <h3 className="font-bold">{t("practiceFlashcards")}</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI generates interactive revision flashcards.
              </p>
            </button>
          </section>

          {/* PERSONAL NOTES */}
                    {/* PERSONAL NOTES */}

          <section className="mb-8 rounded-3xl border border-violet-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <FileText className="text-violet-300" size={26} />
              <h2 className="text-2xl font-bold">{t("myNotes")}</h2>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              placeholder={t("personalNotesPlaceholder")}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 p-4 text-slate-200 outline-none focus:border-violet-400"
            />

            <div className="mt-5 flex flex-wrap gap-4">
              <button className="rounded-full bg-violet-500/20 px-5 py-2 text-violet-300 hover:bg-violet-500/30">
                Save Notes
              </button>

              <button className="rounded-full bg-cyan-500/20 px-5 py-2 text-cyan-300 hover:bg-cyan-500/30">
                AI Improve Notes
              </button>

              <button className="rounded-full bg-emerald-500/20 px-5 py-2 text-emerald-300 hover:bg-emerald-500/30">
                Export Notes
              </button>
            </div>
          </section>

          {/* AI SUMMARY */}

          <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <BrainCircuit className="text-cyan-300" size={28} />
              <h2 className="text-2xl font-bold">{t("aiLessonSummary")}</h2>
            </div>

            <p className="leading-8 text-slate-300">
              This lesson teaches how phishing emails impersonate trusted
              organizations. Always verify sender domains, inspect links before
              clicking, avoid unexpected attachments, and report suspicious emails
              through CyberAware instead of interacting with them.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Sender verification",
                "Safe attachment handling",
                "QR phishing detection",
                "Spoofed domain recognition",
                "Enterprise reporting workflow",
                "Business Email Compromise basics",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3"
                >
                  <CheckCircle2 className="text-cyan-300" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button className="mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black">
              Generate Detailed Summary
            </button>
          </section>

          {/* RESOURCES */}

          <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Download className="text-emerald-400" size={26} />
              <h2 className="text-2xl font-bold">{t("lessonResources")}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-2xl border border-white/10 bg-slate-800/50 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <FileText className="text-emerald-300" size={22} />
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-xs text-slate-400">{resource.size}</p>
                    </div>
                  </div>

                  <button className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* AI FLASHCARDS */}

          <section className="mb-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-slate-900 to-orange-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-yellow-300" size={26} />
              <h2 className="text-2xl font-bold">{t("aiFlashcards")}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  q: "What is phishing?",
                  a: "A social engineering attack where attackers trick users into revealing credentials or sensitive information.",
                },
                {
                  q: "What is Business Email Compromise?",
                  a: "Attackers impersonate executives or vendors to manipulate financial transactions.",
                },
                {
                  q: "What is spoofing?",
                  a: "Forging sender identity or domain to appear legitimate.",
                },
                {
                  q: "What is Quishing?",
                  a: "Using malicious QR codes that redirect victims to phishing websites.",
                },
              ].map((card) => (
                <div
                  key={card.q}
                  className="rounded-2xl border border-white/10 bg-slate-800/60 p-5"
                >
                  <p className="mb-3 text-xs uppercase tracking-[2px] text-yellow-300">
                    Question
                  </p>

                  <h3 className="font-semibold">{card.q}</h3>

                  <div className="my-4 border-t border-white/10" />

                  <p className="text-xs uppercase tracking-[2px] text-cyan-300">
                    Answer
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {card.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AI PRACTICE QUESTIONS */}

          <section className="mb-8 rounded-3xl border border-red-500/20 bg-slate-900/70 p-6">
            <div className="mb-6 flex items-center gap-3">
              <BrainCircuit className="text-red-400" size={26} />
              <h2 className="text-2xl font-bold">{t("aiPracticeQuestions")}</h2>
            </div>

            <div className="space-y-5">
              {[
                "An email from HR asks you to reset your password using an unfamiliar link. What should you do first?",
                "You receive an invoice attachment from an unknown sender. What indicators should you inspect?",
                "A QR code is printed on a meeting invitation. What security checks should you perform?",
                "Which email header fields help identify spoofed domains?",
              ].map((question, index) => (
                <div
                  key={question}
                  className="rounded-2xl border border-white/10 bg-slate-800/50 p-5"
                >
                  <p className="text-xs uppercase tracking-[2px] text-red-300">
                    Practice Question {index + 1}
                  </p>

                  <h3 className="mt-2 font-medium">{question}</h3>

                  <button className="mt-4 rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20">
                    Reveal AI Answer
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* XP REWARD */}

          <section className="mb-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 p-8 text-center">
            <Trophy className="mx-auto text-yellow-300" size={60} />

            <h2 className="mt-5 text-3xl font-black">
              Lesson Reward
            </h2>

            <p className="mt-3 text-slate-300">
              Complete this lesson to earn
            </p>

            <h3 className="mt-3 text-5xl font-black text-yellow-300">
              +{lesson.xp} XP
            </h3>

            <p className="mt-4 text-slate-400">
              XP contributes to your awareness level, leaderboard ranking, and certificate eligibility.
            </p>
          </section>

          {/* LESSON CHECKLIST */}

          <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle2 className="text-cyan-300" size={26} />
              <h2 className="text-2xl font-bold">{t("lessonCompletionChecklist")}</h2>
            </div>

            <div className="space-y-4">
              {[
                ["Watch complete lesson video", progress >= 90],
                ["Read AI lesson summary", true],
                ["Generate AI notes", notes.length > 0],
                ["Download learning resources", false],
                ["Complete AI practice questions", false],
              ].map(([title, done]) => (
                <div
                  key={String(title)}
                  className="flex items-center justify-between rounded-xl bg-slate-800/60 p-4"
                >
                  <span>{title}</span>

                  {done ? (
                    <CheckCircle2 className="text-emerald-400" />
                  ) : (
                    <Lock className="text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* NEXT LESSON CTA */}

          <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[3px] text-violet-300">
                  Next Lesson
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {currentLesson < lessons.length - 1
                    ? lessons[currentLesson + 1].title
                    : "Final Assessment"}
                </h2>

                <p className="mt-3 max-w-xl text-slate-400">
                  Continue to the next cybersecurity lesson and unlock additional XP, AI notes, flashcards, and practice questions.
                </p>
              </div>

              <button
                onClick={nextLesson}
                disabled={currentLesson === lessons.length - 1}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black disabled:opacity-50"
              >
                Continue Learning
                <ArrowRight className="ml-2 inline" size={18} />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ==========================================================
   HELPER COMPONENT
========================================================== */

function ShieldPlay({
  playing,
  setPlaying,
}: {
  playing: boolean;
  setPlaying: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => setPlaying(!playing)}
      className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500/20 backdrop-blur-lg transition hover:scale-105"
    >
      {playing ? (
        <PauseCircle className="text-cyan-300" size={70} />
      ) : (
        <PlayCircle className="text-cyan-300" size={70} />
      )}
    </button>
  );
}