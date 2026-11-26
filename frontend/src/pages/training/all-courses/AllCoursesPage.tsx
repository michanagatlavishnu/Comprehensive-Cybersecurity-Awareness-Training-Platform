import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  BookOpen,
  Clock3,
  Trophy,
  Star,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import trainingService from "../../../services/trainingService";
import { useDashboard } from "../../../hooks/useDashboard";
import type { Course } from "../../../types/training.types";
import { useTranslation } from "react-i18next";

export default function AllCoursesPage() {
  const { t } = useTranslation();
  const { overview } = useDashboard();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await trainingService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return ["All", ...new Set(courses.map((c) => c.category))];
  }, [courses]);

  const filteredCourses = courses.filter((course) => {
  const matchesSearch =
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.category.toLowerCase().includes(search.toLowerCase());

  const matchesDifficulty =
    difficulty === "All" ||
    course.level.toLowerCase() === difficulty.toLowerCase();

  return matchesSearch && matchesDifficulty;
});

  const featured =
  courses.find((course) => course.progress < 100) || courses[0];

// ================= Dashboard Stats =================
const stats = {
  totalCourses: courses.length,

  totalXP: courses.reduce(
    (sum, course) => sum + course.xp_reward,
    0
  ),

  completedModules: courses.filter(
    (course) => course.completed
  ).length,

  totalModules: courses.length,

  awarenessScore: overview?.awareness_score ?? 0,
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <BookOpen className="mx-auto mb-5 animate-pulse text-cyan-400" size={60} />
          <p className="text-xl font-semibold text-cyan-400">
            {t("loadingCourses")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 p-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <p className="text-xs uppercase tracking-[4px] text-cyan-400">
              {t("employeeLearningHub")}
            </p>

            <h1 className="mt-3 text-5xl font-black text-white leading-tight">
              {t("buildCyberSkills")}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              {t("learningHubIntro")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300 text-sm font-semibold">
                {courses.length} {t("courses")}
              </div>

              <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-300 text-sm font-semibold">
                {overview?.completed_modules ?? 0}/{overview?.total_modules ?? 0} {t("modulesCompleted")}
              </div>

              <div className="rounded-full bg-violet-500/10 px-4 py-2 text-violet-300 text-sm font-semibold">
                {t("awarenessScore")} {overview?.awareness_score ?? 0}%
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <Trophy className="text-yellow-400" size={34} />
              <p className="mt-4 text-3xl font-black text-white">
                {overview?.total_xp ?? 0}
              </p>
              <p className="text-sm text-slate-300">{t("totalXp")}</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <TrendingUp className="text-emerald-400" size={34} />
              <p className="mt-4 text-3xl font-black text-white">
                {overview?.learning_streak ?? 0}
              </p>
              <p className="text-sm text-slate-300">{t("dayStreak")}</p>
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
              <ShieldCheck className="text-violet-400" size={34} />
              <p className="mt-4 text-3xl font-black text-white">
                {overview?.awareness_score ?? 0}%
              </p>
              <p className="text-sm text-slate-300">{t("awarenessScore")}</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <BookOpen className="text-cyan-400" size={34} />
              <p className="mt-4 text-3xl font-black text-white">
                {overview?.completed_modules ?? 0}
              </p>
              <p className="text-sm text-slate-300">{t("completedModules")}</p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          SEARCH & FILTERS
      ========================================================= */}

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-3 text-slate-400"
              size={20}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchCourses")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
            />

          </div>

          <div className="flex items-center gap-3">

            <Filter className="text-cyan-400" size={20} />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="All">{t("allLevels")}</option>
              <option value="Beginner">{t("beginner")}</option>
              <option value="Intermediate">{t("intermediate")}</option>
              <option value="Advanced">{t("advanced")}</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

          </div>

        </div>

      </section>

      {/* =========================================================
          FEATURED COURSE
      ========================================================= */}

      {featured && (
        <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-900/30 via-slate-900 to-blue-900/30">

          <div className="grid gap-8 lg:grid-cols-2">

            <img
              src={
                featured.thumbnail ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400"
              }
              alt={featured.title}
              className="h-full min-h-[320px] w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400";
              }}
            />

            <div className="flex flex-col justify-center p-8">

              <span className="w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[2px] text-cyan-300">
                {t("featuredLearningModule")}
              </span>

              <h2 className="mt-5 text-3xl font-black text-white">
                {featured.title}
              </h2>

              <p className="mt-4 text-slate-300">
                {featured.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <Badge
                  icon={BookOpen}
                  text={`${featured.lessons_count} ${t("lessons")}`}
                />

                <Badge
                  icon={Clock3}
                  text={featured.duration}
                />

                <Badge
                  icon={Trophy}
                  text={`+${featured.xp_reward} XP`}
                />

                <DifficultyBadge level={featured.level} />

              </div>

              <div className="mt-8">

                <div className="mb-2 flex justify-between text-sm text-slate-400">
                  <span>{t("yourProgress")}</span>
                  <span>{featured.progress}%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-700">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${featured.progress}%` }}
                  />

                </div>

              </div>

              <button
  onClick={() => {
    console.log("Opening featured course:", featured.id);

    navigate(`course-details/${featured.id}`);
  }}
  className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
>
  {featured.progress > 0
    ? t("continueLearning")
    : t("startLearning")}

  <ArrowRight size={18} />
</button>

            </div>

          </div>

        </section>
      )}

      {/* =========================================================
          CONTINUE LEARNING
      ========================================================= */}

      <section className="space-y-5">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            {t("continueLearning")}
          </h2>

          <Link
            to="/training"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {t("viewAllCourses")} →
          </Link>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {courses
            .filter((course) => course.progress > 0 && course.progress < 100)
            .slice(0, 3)
            .map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <div className="mb-4 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />

                <h3 className="font-bold text-white">{course.title}</h3>

                <p className="mt-2 text-sm text-slate-400">
                  {course.progress}% {t("completed")}
                </p>

                <div className="mt-4 h-2 rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <Link
                  to={`/training/course-details/${course.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
                >
                  {t("continueLearning")}
                  <ArrowRight size={16} />
                </Link>

              </div>
            ))}

        </div>

      </section>

      {/* PART 2 STARTS FROM HERE */}
            {/* ================= COURSE GRID ================= */}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {t("availableTrainingModules")}
          </h2>

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            {filteredCourses.length} {t("coursesAvailable")}
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-16 text-center">
            <BookOpen className="mx-auto mb-5 text-slate-600" size={60} />

            <h3 className="text-xl font-bold text-white">
              {t("noTrainingModules")}
            </h3>

            <p className="mt-2 text-slate-400">
              {t("changeSearchFilter")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
  <CourseCard
    key={course.id}
    course={course}
    navigate={navigate}
  />
            ))}
          </div>
        )}
      </section>

      {/* ================= LEARNING INSIGHTS ================= */}

      <section className="grid gap-5 lg:grid-cols-4">
        <SummaryCard
  icon={BrainCircuit}
  value={String(stats.totalCourses)}
  label={t("availableCourses")}
  color="cyan"
/>

<SummaryCard
  icon={Trophy}
  value={String(stats.totalXP)}
  label={t("xpEarned")}
  color="yellow"
/>

<SummaryCard
  icon={CheckCircle2}
  value={`${stats.completedModules}/${stats.totalModules}`}
  label={t("modulesCompleted")}
  color="emerald"
/>

<SummaryCard
  icon={ShieldCheck}
  value={`${stats.awarenessScore}%`}
  label={t("awarenessScore")}
  color="violet"
/>
      </section>

      {/* ================= SECURITY RECOMMENDATION ================= */}

      <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-slate-900 to-cyan-500/10 p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[3px] text-violet-400">
              {t("aiRecommendation")}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {t("continueCyberJourney")}
            </h2>

            <p className="mt-4 text-slate-300">
              {t("recommendationIntro")} {" "}
              <span className="font-bold text-cyan-300">
                {overview?.awareness_score ?? 0}%
              </span>
              {t("recommendationOutro")}
            </p>
          </div>

          <Link
            to="/training"
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 font-semibold text-white transition hover:bg-violet-500"
          >
            {t("continueLearning")}

            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ===========================================================
   COURSE CARD
=========================================================== */

function CourseCard({
  course,
  navigate,
}: {
  course: Course;
  navigate: (path: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur transition duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="relative h-52 overflow-hidden">
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
          }
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <DifficultyBadge level={course.level} />
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          {course.category}
        </div>

        {course.progress > 0 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">
            {course.progress}% {t("completed")}
          </div>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="line-clamp-2 text-xl font-bold text-white">
            {course.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge icon={BookOpen} text={`${course.lessons_count} ${t("lessons")}`} />

          <Badge icon={Clock3} text={course.duration} />

          <Badge icon={Trophy} text={`+${course.xp_reward} XP`} />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>{t("progress")}</span>

            <span>{course.progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />

            <span>{course.rating || 5}</span>
          </div>

          <span>{course.instructor}</span>
        </div>

        <button
  onClick={() => {
    console.log("Opening course:", course.id);

    navigate(`/training/course-details/${course.id}`);
  }}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:opacity-90"
>
  {course.progress > 0 ? (
    <>
      {t("continueLearning")}
      <ArrowRight size={18} />
    </>
  ) : (
    <>
      {t("startLearning")}
      <PlayCircle size={18} />
    </>
  )}
</button>
      </div>
    </div>
  );
}

/* ===========================================================
   BADGE
=========================================================== */

function Badge({
  icon: Icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-slate-300">
      <Icon size={14} className="text-cyan-400" />

      {text}
    </div>
  );
}

/* ===========================================================
   SUMMARY CARD
=========================================================== */

function SummaryCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: any;
  value: string;
  label: string;
  color: "cyan" | "emerald" | "yellow" | "violet";
}) {
  const colors = {
    cyan: "from-cyan-500/20 to-cyan-700/10 text-cyan-300 border-cyan-500/20",
    emerald:
      "from-emerald-500/20 to-emerald-700/10 text-emerald-300 border-emerald-500/20",
    yellow:
      "from-yellow-500/20 to-yellow-700/10 text-yellow-300 border-yellow-500/20",
    violet:
      "from-violet-500/20 to-violet-700/10 text-violet-300 border-violet-500/20",
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-6 ${colors[color]}`}
    >
      <Icon size={34} />

      <p className="mt-5 text-3xl font-black text-white">{value}</p>

      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </div>
  );
}

/* ===========================================================
   DIFFICULTY BADGE
=========================================================== */

function DifficultyBadge({
  level,
}: {
  level: "Beginner" | "Intermediate" | "Advanced";
}) {
  const { t } = useTranslation();
  const labels = { Beginner: t("beginner"), Intermediate: t("intermediate"), Advanced: t("advanced") };
  const colors = {
    Beginner: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    Intermediate:
      "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    Advanced: "bg-red-500/20 text-red-300 border border-red-500/30",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${colors[level]}`}
    >
      {labels[level]}
    </span>
  );
}