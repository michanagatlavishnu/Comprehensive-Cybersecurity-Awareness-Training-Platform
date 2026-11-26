import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Zap,
  BrainCircuit,
  Trophy,
  Flame,
  Bell,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock3,
  CheckCircle2,
  ShieldAlert,
  MailWarning,
  LockKeyhole,
  FileWarning,
} from "lucide-react";
import { Link } from "react-router-dom";

import NotificationWidget from "../../components/dashboard/NotificationWidget";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";
import AchievementCards from "../../components/dashboard/AchievementCards";
import LearningStreakCard from "../../components/dashboard/LearningStreakCard";
import LeaderboardPreview from "../../components/dashboard/LeaderboardPreview";

import api from "../../services/api";

interface DashboardStats {
  awareness_score: number;
  total_xp: number;
  current_level: number;
  completed_modules: number;
  completed_quizzes: number;
  phishing_reports: number;
  learning_streak: number;
}

interface ThreatCard {
  title: string;
  value: string;
  color: string;
  icon: any;
}

const quickActions = [
  {
    title: "Continue Learning",
    description: "Resume your cybersecurity course.",
    icon: BookOpen,
    link: "/training/all-courses",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Take AI Quiz",
    description: "Earn XP by completing quizzes.",
    icon: BrainCircuit,
    link: "/quizzes/module-quiz",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Report Phishing",
    description: "Submit suspicious emails instantly.",
    icon: MailWarning,
    link: "/phishing/inbox",
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Password Lab",
    description: "Test password strength & MFA.",
    icon: LockKeyhole,
    link: "/password-lab/password-checker",
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "Incident Reporting",
    description: "Report cybersecurity incidents.",
    icon: FileWarning,
    link: "/incidents/report-incident",
    color: "from-pink-500 to-red-500",
  },
  {
    title: "Certificates",
    description: "View earned certificates.",
    icon: Trophy,
    link: "/certificates/my-certificates",
    color: "from-yellow-500 to-orange-500",
  },
];

const weeklyActivity = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 220 },
  { day: "Wed", xp: 160 },
  { day: "Thu", xp: 300 },
  { day: "Fri", xp: 180 },
  { day: "Sat", xp: 260 },
  { day: "Sun", xp: 140 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    awareness_score: 91,
    total_xp: 2840,
    current_level: 8,
    completed_modules: 18,
    completed_quizzes: 11,
    phishing_reports: 7,
    learning_streak: 12,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard/overview");
      setStats(response.data.data);
    } catch {
      // fallback demo values
    } finally {
      setLoading(false);
    }
  }

  const levelProgress = useMemo(() => {
    const currentLevelXP = stats.current_level * 500;
    const nextLevelXP = (stats.current_level + 1) * 500;
    return Math.round(
      ((stats.total_xp - currentLevelXP) /
        (nextLevelXP - currentLevelXP)) *
        100
    );
  }, [stats]);

  const threats: ThreatCard[] = [
    {
      title: "Blocked Phishing Emails",
      value: "124",
      color: "text-red-400",
      icon: MailWarning,
    },
    {
      title: "Suspicious Links Detected",
      value: "38",
      color: "text-orange-400",
      icon: AlertTriangle,
    },
    {
      title: "Password Risks Identified",
      value: "12",
      color: "text-yellow-400",
      icon: LockKeyhole,
    },
    {
      title: "Policies Acknowledged",
      value: "9/10",
      color: "text-cyan-400",
      icon: ShieldCheck,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-5">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <h2 className="text-xl font-semibold">Loading CyberAware Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-6 text-white">
      {/* ================= HEADER ================= */}
      <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 via-slate-900 to-violet-600/10 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-cyan-300">
              CyberAware Enterprise Platform
            </p>

            <h1 className="mt-2 text-4xl font-black lg:text-5xl">
              Welcome Back 👋
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Track your cybersecurity learning progress, awareness score,
              phishing simulations, AI recommendations and certifications from
              one enterprise dashboard.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-5">
            <ShieldCheck className="text-cyan-400" size={38} />

            <div>
              <p className="text-sm text-slate-400">Awareness Score</p>
              <h2 className="text-3xl font-black text-cyan-300">
                {stats.awareness_score}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total XP"
          value={stats.total_xp.toLocaleString()}
          icon={Zap}
          color="yellow"
        />

        <StatCard
          title="Current Level"
          value={`Level ${stats.current_level}`}
          icon={Trophy}
          color="cyan"
        />

        <StatCard
          title="Learning Streak"
          value={`${stats.learning_streak} Days`}
          icon={Flame}
          color="orange"
        />

        <StatCard
          title="Completed Modules"
          value={`${stats.completed_modules}`}
          icon={BookOpen}
          color="emerald"
        />
      </section>

      {/* ================= XP + AWARENESS ================= */}
      <section className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[2px] text-cyan-300">
                Level Progress
              </p>

              <h2 className="text-3xl font-black text-white">
                {stats.total_xp.toLocaleString()} XP
              </h2>
            </div>

            <TrendingUp className="text-cyan-400" size={30} />
          </div>

          <div className="mb-3 flex justify-between text-sm text-slate-400">
            <span>Progress to Level {stats.current_level + 1}</span>
            <span>{levelProgress}%</span>
          </div>

          <div className="h-4 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <SmallMetric
              label="Completed Quizzes"
              value={stats.completed_quizzes}
            />

            <SmallMetric
              label="Phishing Reports"
              value={stats.phishing_reports}
            />

            <SmallMetric label="Certificates Earned" value={2} />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-slate-900 p-6">
          <Target className="mb-4 text-emerald-400" size={34} />

          <p className="text-sm uppercase tracking-[3px] text-emerald-300">
            Weekly Goal
          </p>

          <h2 className="mt-3 text-5xl font-black text-white">82%</h2>

          <p className="mt-3 text-sm text-slate-400">
            Finish two more lessons this week to unlock +150 XP and the “Week Warrior” badge.
          </p>

          <div className="mt-6 h-3 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: "82%" }}
            />
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="text-violet-400" />
          <h2 className="text-2xl font-bold">Quick Actions</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-500/30"
            >
              <div
                className={`mb-5 inline-flex rounded-2xl bg-gradient-to-r p-3 ${item.color}`}
              >
                <item.icon className="text-white" size={24} />
              </div>

              <h3 className="text-xl font-bold">{item.title}</h3>

              <p className="mt-2 text-sm text-slate-400">{item.description}</p>

              <div className="mt-6 flex items-center gap-2 text-cyan-300 group-hover:text-cyan-200">
                <span className="text-sm font-semibold">Open</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= THREAT CARDS ================= */}
      <section className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <ShieldAlert className="text-red-400" />
          <h2 className="text-2xl font-bold">Threat Awareness Overview</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {threats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
            >
              <item.icon className={item.color} size={30} />

              <p className="mt-4 text-sm text-slate-400">{item.title}</p>

              <h3 className={`mt-2 text-3xl font-black ${item.color}`}>
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WEEKLY XP CHART ================= */}
      <section className="mb-10 rounded-3xl border border-violet-500/20 bg-slate-900/70 p-6">
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="text-violet-400" />
          <h2 className="text-2xl font-bold">Weekly Learning Activity</h2>
        </div>

        <div className="flex h-64 items-end justify-between gap-3">
          {weeklyActivity.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
              <div className="text-xs text-cyan-300">{item.xp}</div>

              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-violet-600 via-cyan-500 to-emerald-400 transition hover:opacity-90"
                style={{
                  height: `${item.xp / 3}px`,
                  minHeight: "40px",
                }}
              />

              <span className="text-xs text-slate-400">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PART 2 CONTINUES FROM HERE */}

            {/* ================= AI INSIGHTS ================= */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-slate-900 p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <BrainCircuit className="text-violet-400" size={30} />
            <h2 className="text-2xl font-bold">AI Security Insights</h2>
          </div>

          <div className="space-y-4">
            <InsightCard
              title="Password Security Recommendation"
              description="Your password security score improved by 14% after enabling MFA. Complete Password Lab Level 2 to unlock an additional 120 XP."
              color="emerald"
            />

            <InsightCard
              title="Phishing Awareness Alert"
              description="You successfully reported 7 phishing emails this month. Reporting 3 more unlocks the 'Phishing Hunter' achievement."
              color="red"
            />

            <InsightCard
              title="Learning Recommendation"
              description="Based on your quiz history, AI recommends Cloud Security and Social Engineering Fundamentals next."
              color="cyan"
            />

            <InsightCard
              title="Awareness Prediction"
              description="Maintaining your current streak for one week is projected to increase your awareness score to 94%."
              color="violet"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="text-yellow-300" size={26} />
            <h2 className="text-xl font-bold">Today's Summary</h2>
          </div>

          <div className="space-y-5">
            <TodayItem title="Pending Quiz" value="AI Security Basics" />

            <TodayItem title="Next Lesson" value="Cloud Security Essentials" />

            <TodayItem title="Phishing Simulation" value="1 Email Waiting" />

            <TodayItem title="Certificates Pending" value="2 Available Soon" />
          </div>
        </div>
      </section>

      {/* ================= LEARNING PROGRESS ================= */}
      <section className="mb-10 rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-6">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="text-emerald-400" size={28} />
          <h2 className="text-2xl font-bold">Learning Progress</h2>
        </div>

        <div className="space-y-6">
          {[
            ["Email Security Fundamentals", 100],
            ["Password Security Lab", 92],
            ["Social Engineering Awareness", 74],
            ["Cloud Security Essentials", 58],
            ["Data Privacy & GDPR", 42],
            ["Incident Response Basics", 28],
          ].map(([course, progress]) => (
            <div key={course}>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">{course}</span>
                <span className="text-sm text-cyan-300">{progress}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= NOTIFICATIONS + TIMELINE ================= */}
      <section className="mb-10 grid gap-6 xl:grid-cols-2">
        <NotificationWidget />

        <ActivityTimeline />
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section className="mb-10">
        <AchievementCards
          currentXP={stats.total_xp}
          currentLevel={stats.current_level}
        />
      </section>

      {/* ================= STREAK CALENDAR ================= */}
      <section className="mb-10">
        <LearningStreakCard
          currentStreak={stats.learning_streak}
          totalXP={stats.total_xp}
        />
      </section>

      {/* ================= LEADERBOARD ================= */}
      <section className="mb-10">
        <LeaderboardPreview currentUserId="4" />
      </section>

      {/* ================= SECURITY SCORE BREAKDOWN ================= */}
      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6">
        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="text-cyan-400" size={28} />
          <h2 className="text-2xl font-bold">
            Security Awareness Breakdown
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <BreakdownCard title="Email Security" score={96} color="emerald" />

          <BreakdownCard title="Password Hygiene" score={92} color="cyan" />

          <BreakdownCard title="Social Engineering" score={84} color="orange" />

          <BreakdownCard title="Data Privacy" score={88} color="violet" />
        </div>
      </section>

      {/* ================= RECENT SECURITY EVENTS ================= */}
      <section className="mb-10 rounded-3xl border border-red-500/20 bg-slate-900/70 p-6">
        <div className="mb-6 flex items-center gap-3">
          <ShieldAlert className="text-red-400" size={28} />
          <h2 className="text-2xl font-bold">Recent Security Events</h2>
        </div>

        <div className="space-y-4">
          <EventCard
            title="Phishing Email Detected"
            description="Finance Invoice Campaign blocked by AI."
            severity="High"
            time="10 minutes ago"
          />

          <EventCard
            title="Password Reused"
            description="Password Lab detected password reuse across two accounts."
            severity="Medium"
            time="Today"
          />

          <EventCard
            title="Policy Acknowledgement Pending"
            description="GDPR 2026 policy awaiting acknowledgement."
            severity="Low"
            time="Yesterday"
          />

          <EventCard
            title="Incident Report Submitted"
            description="USB Device Simulation completed successfully."
            severity="Resolved"
            time="2 Days Ago"
          />
        </div>
      </section>

      {/* ================= AI RECOMMENDATIONS ================= */}
      <section className="mb-10 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-emerald-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="text-violet-300" size={28} />
          <h2 className="text-2xl font-bold">
            AI Personalized Recommendations
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <RecommendationCard
            title="Cloud Security Essentials"
            description="Recommended because you scored below 80% in cloud-related quizzes."
          />

          <RecommendationCard
            title="QR Phishing Awareness Simulation"
            description="Practice recognizing QR-code phishing attacks using interactive simulations."
          />

          <RecommendationCard
            title="AI Quiz Challenge"
            description="Complete today's adaptive AI quiz to earn +90 XP bonus."
          />

          <RecommendationCard
            title="Incident Response Basics"
            description="Improve awareness score by completing one remaining lesson."
          />
        </div>
      </section>

      {/* ================= FOOTER CTA ================= */}
      <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 via-slate-900 to-violet-600/10 p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-cyan-300">
              CyberAware AI Coach
            </p>

            <h2 className="mt-2 text-3xl font-black">
              You're doing great!
            </h2>

            <p className="mt-3 max-w-xl text-slate-400">
              Complete one lesson and one AI quiz today to increase your awareness
              score and unlock the next achievement badge.
            </p>
          </div>

          <Link
            to="/training/all-courses"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Continue Learning
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   HELPER COMPONENTS
============================================================ */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: "yellow" | "cyan" | "orange" | "emerald";
}) {
  const styles = {
    yellow: "from-yellow-500/20 to-orange-500/10 text-yellow-300",
    cyan: "from-cyan-500/20 to-blue-500/10 text-cyan-300",
    orange: "from-orange-500/20 to-red-500/10 text-orange-300",
    emerald: "from-emerald-500/20 to-green-500/10 text-emerald-300",
  };

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${styles[color]} p-6`}>
      <Icon size={30} />

      <p className="mt-5 text-sm uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-black text-white">{value}</h2>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/60 p-4 text-center">
      <p className="text-xs uppercase tracking-[2px] text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-black text-cyan-300">{value}</h3>
    </div>
  );
}

function InsightCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: "emerald" | "red" | "cyan" | "violet";
}) {
  const colors = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    red: "border-red-500/20 bg-red-500/5 text-red-300",
    cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
    violet: "border-violet-500/20 bg-violet-500/5 text-violet-300",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="mb-3 flex items-center gap-3">
        <CheckCircle2 size={20} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <p className="text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

function TodayItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Clock3 className="text-yellow-300" size={18} />

      <div>
        <p className="text-xs uppercase tracking-[2px] text-slate-500">
          {title}
        </p>

        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  score,
  color,
}: {
  title: string;
  score: number;
  color: "emerald" | "cyan" | "orange" | "violet";
}) {
  const colors = {
    emerald: "from-emerald-400 to-green-500",
    cyan: "from-cyan-400 to-blue-500",
    orange: "from-orange-400 to-red-500",
    violet: "from-violet-400 to-purple-500",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <h3 className="mt-3 text-3xl font-black text-white">{score}%</h3>

      <div className="mt-4 h-2 rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({
  title,
  description,
  severity,
  time,
}: {
  title: string;
  description: string;
  severity: string;
  time: string;
}) {
  const badge =
    severity === "High"
      ? "bg-red-500/10 text-red-300"
      : severity === "Medium"
      ? "bg-yellow-500/10 text-yellow-300"
      : severity === "Resolved"
      ? "bg-emerald-500/10 text-emerald-300"
      : "bg-cyan-500/10 text-cyan-300";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
          {severity}
        </span>
      </div>

      <p className="text-sm text-slate-400">{description}</p>

      <p className="mt-3 text-xs uppercase tracking-[2px] text-slate-500">
        {time}
      </p>
    </div>
  );
}

function RecommendationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-cyan-500/30">
      <div className="mb-3 flex items-center gap-3">
        <Sparkles className="text-cyan-300" size={20} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <p className="text-sm leading-6 text-slate-400">{description}</p>

      <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20">
        Start Learning
        <ArrowRight size={16} />
      </button>
    </div>
  );
}