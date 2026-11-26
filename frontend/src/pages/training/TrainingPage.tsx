import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock3,
  Trophy,
  CheckCircle2,
  PlayCircle,
  Filter,
  Star,
  ShieldCheck,
} from "lucide-react";

import trainingService from "../../services/trainingService";
import type { Course } from "../../types/training.types";
import { useDashboard } from "../../hooks/useDashboard";
import { useTranslation } from "react-i18next";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { overview } = useDashboard();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await trainingService.getCourses();
      setCourses(data);
    } catch (e) {
      console.error("Failed to load modules", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || course.level === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [courses, search, difficulty]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-xl font-semibold">{t("loadingTrainingModules")}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HERO */}
      <section className="rounded-3xl border border-slate-700 bg-gradient-to-r from-cyan-600/20 via-blue-700/10 to-violet-700/20 p-8">

        <div className="flex flex-col justify-between gap-6 lg:flex-row">

          <div>
            <p className="text-xs uppercase tracking-[4px] text-cyan-400">
              CyberAware Learning Hub
            </p>

            <h1 className="mt-3 text-4xl font-black text-white">
              Security Awareness Training
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Learn cybersecurity concepts, complete lessons, earn XP,
              and strengthen your awareness score.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-[360px]">
            <SummaryCard
              label={t("xpEarned")}
              value={overview?.total_xp ?? 0}
              icon={Trophy}
              color="text-yellow-400"
            />

            <SummaryCard
              label={t("awarenessScore")}
              value={`${overview?.awareness_score ?? 0}%`}
              icon={ShieldCheck}
              color="text-emerald-400"
            />

            <SummaryCard
              label={t("completedModules")}
              value={`${overview?.completed_modules ?? 0}/${overview?.total_modules ?? 0}`}
              icon={CheckCircle2}
              color="text-blue-400"
            />

            <SummaryCard
              label={t("lessonsCompleted")}
              value={`${overview?.completed_lessons ?? 0}/${overview?.total_lessons ?? 0}`}
              icon={BookOpen}
              color="text-cyan-400"
            />

            <SummaryCard
              label={t("pendingQuizzes")}
              value={overview?.pending_quizzes ?? 0}
              icon={Trophy}
              color="text-amber-400"
            />

            <SummaryCard
              label={t("learningStreak")}
              value={`${overview?.learning_streak ?? 0} Days`}
              icon={Star}
              color="text-orange-400"
            />
          </div>

        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/50 p-5 md:flex-row md:items-center">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-3 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchTraining")}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
          <Filter size={18} className="text-cyan-400" />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-transparent text-white outline-none"
          >
            <option value="All">{t("allLevels")}</option>
            <option value="Beginner">{t("beginner")}</option>
            <option value="Intermediate">{t("intermediate")}</option>
            <option value="Advanced">{t("advanced")}</option>
          </select>
        </div>

      </section>

      {/* COURSE GRID */}
      <section className="grid gap-6 lg:grid-cols-2">

        {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 transition hover:border-cyan-500"
          >

            {/* Thumbnail */}
            <div className="relative h-56 bg-slate-800">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen size={64} className="text-cyan-400" />
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full bg-cyan-600 px-3 py-1 text-xs font-bold text-white">
                {course.level}
              </span>

              {course.completed && (
                <span className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                  Completed
                </span>
              )}
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">

              <h2 className="text-2xl font-bold text-white">
                {course.title}
              </h2>

              <p className="line-clamp-2 text-slate-300">
                {course.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">

                <StatItem
                  icon={Clock3}
                  label={course.duration}
                />

                <StatItem
                  icon={BookOpen}
                  label={`${course.lessons_count} Lessons`}
                />

                <StatItem
                  icon={Trophy}
                  label={`${course.xp_reward} XP`}
                />

                <StatItem
                  icon={Star}
                  label={course.category}
                />

              </div>

              {/* Progress */}
              <div>

                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>Progress</span>

                  <span>{course.progress}%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-cyan-500 transition-all"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>

              </div>

              {/* Continue */}
              <Link
                to={`/training/course-details/${course.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-500"
              >
                <PlayCircle size={20} />
                {course.progress > 0
                  ? "Continue Learning"
                  : "Start Learning"}
              </Link>

            </div>
          </article>
        ))}

      </section>

      {!filteredCourses.length && (
        <div className="rounded-2xl border border-slate-700 p-10 text-center text-slate-400">
          No training modules found.
        </div>
      )}

    </div>
  );
}

/* ---------------- SUMMARY CARD ---------------- */

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: any) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
      <Icon size={24} className={color} />

      <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <h3 className="mt-1 text-2xl font-black text-white">
        {value}
      </h3>
    </div>
  );
}

/* ---------------- COURSE STATS ---------------- */

function StatItem({
  icon: Icon,
  label,
}: any) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2">
      <Icon size={16} className="text-cyan-400" />
      <span>{label}</span>
    </div>
  );
}