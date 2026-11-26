import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Shield,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { overview, activities, loading } =
    useDashboard();

  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06111E] text-white">
        <div className="text-xl font-bold animate-pulse">
          {t("loadingDashboard")}
        </div>
      </div>
    );
  }

  const awareness = overview?.awareness_score ?? 0;
  const xp = overview?.total_xp ?? 0;
  const streak = overview?.learning_streak ?? 0;

  const completedModules = overview?.completed_modules ?? 0;
  const totalModules = overview?.total_modules ?? 0;

  const completedLessons = overview?.completed_lessons ?? 0;
  const totalLessons = overview?.total_lessons ?? 0;

  const pendingQuizzes = overview?.pending_quizzes ?? 0;
  const averageScore = overview?.average_score ?? 0;
  const currentLevel = overview?.current_level ?? 1;

  const moduleProgress =
    totalModules === 0 ? 0 : (completedModules / totalModules) * 100;

  return (
    <div className="min-h-screen bg-[#06111E] text-white">
      <div className="mx-auto max-w-7xl space-y-8 p-8">

        {/* ===================================================== */}
        {/* HERO SECTION */}
        {/* ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#081B2E] via-[#0E2944] to-[#123B55] p-8 shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[4px] text-cyan-400">
                {t("employeePortal")}
              </p>

              <h1 className="mt-3 text-4xl font-black lg:text-5xl">
                {t("welcomeBack")},
              </h1>

              <h2 className="text-3xl font-extrabold text-cyan-400">
                {user?.full_name}
              </h2>

              <p className="mt-4 max-w-2xl text-slate-300">
                {t("dashboardIntro")}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/training"
                  className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold transition hover:bg-cyan-500"
                >
                  {t("continueTraining")}
                </Link>

                <Link
                  to="/profile"
                  className="rounded-xl border border-cyan-500/40 px-6 py-3 hover:bg-cyan-500/10"
                >
                  {t("viewProfile")}
                </Link>
              </div>
            </div>

            {/* Employee Summary */}
            <div className="w-full rounded-3xl border border-cyan-400/30 bg-[#071320]/80 p-6 backdrop-blur lg:max-w-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-cyan-500/20 p-3">
                  <User className="text-cyan-400" size={24} />
                </div>

                <div>
                  <p className="text-sm text-slate-400">{t("department")}</p>
                    <h3 className="font-bold">
                    {overview?.profile?.department ?? user?.department ?? t("cyberSecurity")}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-5">

                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t("awarenessScore")}</span>
                    <span>{awareness}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-green-400"
                      style={{ width: `${awareness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t("learningProgress")}</span>
                    <span>{moduleProgress.toFixed(0)}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-cyan-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-widest text-cyan-300">
                    {t("currentLevel")}
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-cyan-400">
                    {currentLevel}
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    {xp} {t("xpEarned")}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* TOP STATS */}
        {/* ===================================================== */}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-600/20 to-[#08111E] p-5">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">
                {t("awarenessScore")}
              </span>

              <Shield className="text-green-400" />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {awareness}%
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              {t("awarenessUpdated")}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-600/20 to-[#08111E] p-5">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">
                {t("learningStreak")}
              </span>

              <Flame className="text-orange-400" />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {streak}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              {t("keepLearning")}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-600/20 to-[#08111E] p-5">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">
                {t("xpEarned")}
              </span>

              <Zap className="text-cyan-400" />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {xp}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              {t("earnXp")}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-[#08111E] p-5">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">
                {t("pendingQuizzes")}
              </span>

              <Target className="text-violet-400" />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {pendingQuizzes}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              {t("publishedQuizzes")}
            </p>
          </div>

        </section>

        {/* ===================================================== */}
        {/* QUICK ACTIONS */}
        {/* ===================================================== */}

        <section className="grid gap-5 lg:grid-cols-4">

          <Link
            to="/training"
            className="rounded-2xl border border-cyan-500/30 bg-[#091826] p-5 transition hover:border-cyan-400 hover:bg-[#0E2435]"
          >
            <BookOpen className="mb-4 text-cyan-400" size={30} />

            <h3 className="font-bold text-lg">{t("trainingModules")}</h3>

            <p className="mt-2 text-sm text-slate-400">
              {t("continueAssignedModules")}
            </p>
          </Link>

          <Link
            to="/training"
            className="rounded-2xl border border-violet-500/30 bg-[#091826] p-5 transition hover:border-violet-400 hover:bg-[#0E2435]"
          >
            <Brain className="mb-4 text-violet-400" size={30} />

            <h3 className="font-bold text-lg">{t("lessonQuizzes")}</h3>

            <p className="mt-2 text-sm text-slate-400">
              {t("attemptUnlockedQuizzes")}
            </p>
          </Link>

          <Link
            to="/phishing"
            className="rounded-2xl border border-orange-500/30 bg-[#091826] p-5 transition hover:border-orange-400 hover:bg-[#0E2435]"
          >
            <ShieldAlert className="mb-4 text-orange-400" size={30} />

            <h3 className="font-bold text-lg">
              {t("phishingSimulator")}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {t("practicePhishing")}
            </p>
          </Link>

          <Link
            to="/profile"
            className="rounded-2xl border border-green-500/30 bg-[#091826] p-5 transition hover:border-green-400 hover:bg-[#0E2435]"
          >
            <Trophy className="mb-4 text-green-400" size={30} />

            <h3 className="font-bold text-lg">
              {t("myProgress")}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {t("viewProgressDetails")}
            </p>
          </Link>

        </section>

        {/* ===================================================== */}
        {/* LEARNING PROGRESS */}
        {/* ===================================================== */}

        <section className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-[#091826] p-6 lg:col-span-2">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {t("learningProgress")}
              </h2>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                {completedModules}/{totalModules} {t("modulesCompleted")}
              </span>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span>{t("overallCompletion")}</span>
                <span>{moduleProgress.toFixed(0)}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-[#06111E] p-4">
                <p className="text-sm text-slate-400">
                  {t("lessonsCompleted")}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {completedLessons}/{totalLessons}
                </h3>
              </div>

              <div className="rounded-xl bg-[#06111E] p-4">
                <p className="text-sm text-slate-400">
                  {t("averageQuizScore")}
                </p>

                <h3 className="mt-2 text-2xl font-black text-green-400">
                  {averageScore}%
                </h3>
              </div>

              <div className="rounded-xl bg-[#06111E] p-4">
                <p className="text-sm text-slate-400">
                  {t("quizzesPassed")}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {overview?.quizzes_passed ?? 0}
                </h3>
              </div>

              <div className="rounded-xl bg-[#06111E] p-4">
                <p className="text-sm text-slate-400">
                  {t("pendingLessons")}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {overview?.pending_lessons ?? 0}
                </h3>
              </div>

            </div>
          </div>

          {/* Latest Badge */}
          <div className="rounded-2xl border border-slate-800 bg-[#091826] p-6">

            <div className="flex items-center gap-3">
              <Award className="text-yellow-400" />
              <h2 className="font-bold text-lg">{t("latestBadge")}</h2>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">

              <div className="rounded-full bg-yellow-500/20 p-6">
                <Star className="text-yellow-400" size={45} />
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {overview?.latest_badge ?? t("noBadgeYet")}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {t("unlockAchievements")}
              </p>

              <Link
                to="/badges"
                className="mt-6 rounded-lg bg-yellow-600 px-5 py-2 text-sm font-semibold hover:bg-yellow-500"
              >
                {t("viewBadges")}
              </Link>

            </div>
          </div>

        </section>

        {/* ===================================================== */}
        {/* RECENT ACTIVITY */}
        {/* ===================================================== */}

        <section className="rounded-2xl border border-slate-800 bg-[#091826] p-6">

          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />

            <h2 className="text-xl font-bold">
              {t("recentLearningActivity")}
            </h2>
          </div>

          {activities?.length ? (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-[#06111E] p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {activity.course_title
                        ? `${activity.course_title} | ${activity.lesson_title}`
                        : activity.lesson_title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {activity.status}
                    </p>
                  </div>

                  <div className="text-right">
                      {activity.score !== null && activity.score !== undefined ? (
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                        {activity.score}%
                      </span>
                    ) : activity.status === "Downloaded lesson PDF" ? (
                      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
                        {t("pdfDownloaded")}
                      </span>
                    ) : (
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
                          {t("lessonCompleted")}
                      </span>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(activity.completed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#06111E] p-6 text-center text-slate-400">
              {t("noLearningActivity")}
            </div>
          )}

        </section>

        {/* ===================================================== */}
        {/* FOOTER CTA */}
        {/* ===================================================== */}

        <section className="rounded-3xl bg-gradient-to-r from-cyan-700/20 via-blue-700/20 to-indigo-700/20 p-8 text-center">

          <Trophy className="mx-auto text-yellow-400" size={42} />

          <h2 className="mt-4 text-3xl font-black">
            {t("becomeCyberHero")}
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-slate-300">
            {t("cyberHeroDescription")}
          </p>

          <Link
            to="/training"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold hover:bg-cyan-500"
          >
            {t("continueLearning")}
            <ArrowRight size={18} />
          </Link>

        </section>

      </div>
    </div>
  );
}