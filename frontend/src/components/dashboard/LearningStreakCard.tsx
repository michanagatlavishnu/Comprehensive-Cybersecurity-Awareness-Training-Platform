import { useMemo } from "react";
import {
  Flame,
  CalendarDays,
  Trophy,
  Target,
  Zap,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface HeatmapDay {
  date: string;
  level: number;
}

interface Props {
  currentStreak?: number;
  longestStreak?: number;
  activeDays?: number;
  totalXP?: number;
  heatmap?: HeatmapDay[];
}

function generateHeatmap(): HeatmapDay[] {
  const today = new Date();
  const days: HeatmapDay[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    days.push({
      date: d.toISOString().split("T")[0],
      level: Math.floor(Math.random() * 5),
    });
  }

  return days;
}

const heatColors = [
  "bg-slate-800",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-lime-400",
];

export default function LearningStreakCard({
  currentStreak = 12,
  longestStreak = 31,
  activeDays = 146,
  totalXP = 2840,
  heatmap,
}: Props) {
  const data = useMemo(() => heatmap ?? generateHeatmap(), [heatmap]);

  const weeklyGoal = Math.min(100, Math.round((currentStreak / 14) * 100));

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-orange-400">
            Consistency Tracker
          </p>

          <h2 className="text-3xl font-black text-white">
            Learning Streak Calendar
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Build daily cybersecurity habits and keep your awareness streak alive.
          </p>
        </div>

        <Flame className="text-orange-400" size={34} />
      </div>

      {/* Current Streak Hero */}
      <div className="mb-8 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-orange-300">
              Current Learning Streak
            </p>

            <h3 className="mt-2 text-6xl font-black text-white">
              {currentStreak}
              <span className="text-3xl text-orange-300"> Days</span>
            </h3>

            <p className="mt-3 text-sm text-slate-300">
              Complete one lesson, quiz, phishing report, or policy every day to maintain your streak.
            </p>
          </div>

          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-orange-400 bg-orange-500/10">
            <Flame className="text-orange-300" size={46} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          title="Active Days"
          value={activeDays}
          color="emerald"
        />

        <StatCard
          icon={Trophy}
          title="Longest Streak"
          value={`${longestStreak} Days`}
          color="yellow"
        />

        <StatCard
          icon={Zap}
          title="Total XP Earned"
          value={`${totalXP}`}
          color="cyan"
        />

        <StatCard
          icon={Target}
          title="Weekly Goal"
          value={`${weeklyGoal}%`}
          color="violet"
        />
      </div>

      {/* Heatmap */}
      <div className="rounded-3xl border border-white/10 bg-slate-800/40 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">365-Day Learning Heatmap</h3>

            <p className="text-xs text-slate-500">
              GitHub-style contribution calendar for cybersecurity learning.
            </p>
          </div>

          <CalendarDays className="text-emerald-400" size={22} />
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[820px] grid-flow-col grid-rows-7 gap-1">
            {data.map((day) => (
              <div
                key={day.date}
                title={`${day.date} • Activity Level ${day.level}`}
                className={`h-3 w-3 rounded-sm ${heatColors[day.level]} transition hover:scale-125 hover:ring-2 hover:ring-emerald-400`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>Less Activity</span>

          <div className="flex items-center gap-2">
            {heatColors.map((color, i) => (
              <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
            ))}
          </div>

          <span>More Activity</span>
        </div>
      </div>

      {/* Monthly Analytics */}
      <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <TrendingUp className="text-cyan-300" />

          <h3 className="text-xl font-bold text-white">
            Monthly Learning Analytics
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric title="Lessons Completed" value="18" />

          <Metric title="AI Quizzes Completed" value="11" />

          <Metric title="Phishing Simulations Passed" value="9" />

          <Metric title="Certificates Earned" value="2" />
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-slate-800/50 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Target className="text-emerald-400" />

          <h3 className="text-xl font-bold text-white">
            Weekly Consistency Goal
          </h3>
        </div>

        <div className="mb-3 flex justify-between text-sm text-slate-300">
          <span>Goal Completion</span>

          <span>{weeklyGoal}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 transition-all duration-700"
            style={{ width: `${weeklyGoal}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Finish 2 more activities this week to reach your learning consistency goal.
        </p>
      </div>

      {/* Streak Rewards */}
      <div className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Trophy className="text-yellow-300" />

          <h3 className="text-xl font-bold text-white">
            Upcoming Streak Rewards
          </h3>
        </div>

        <Reward title="15-Day Learning Streak" xp={150} progress={80} />

        <Reward title="20-Day Learning Streak" xp={250} progress={60} />

        <Reward title="30-Day Learning Streak" xp={500} progress={40} />

        <Reward title="60-Day Cyber Guardian Streak" xp={1000} progress={20} />
      </div>

      {/* AI Insights */}
      <div className="mt-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="text-violet-300" />

          <h3 className="text-xl font-bold text-white">
            AI Consistency Insights
          </h3>
        </div>

        <Insight text="Your most productive learning day is Wednesday." />

        <Insight text="You completed cybersecurity training on 6 consecutive weekdays." />

        <Insight text="Maintaining your streak for 3 more days will unlock the 'Week Warrior' badge." />

        <Insight text="Weekend learning activity is 42% lower than weekdays." />
      </div>
    </section>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function StatCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: string | number;
  color: "emerald" | "yellow" | "cyan" | "violet";
}) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={24} />
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-black text-white">
        {value}
      </h3>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-center">
      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-black text-cyan-300">
        {value}
      </h3>
    </div>
  );
}

function Reward({
  title,
  xp,
  progress,
}: {
  title: string;
  xp: number;
  progress: number;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="mb-2 flex justify-between">
        <h4 className="font-semibold text-white">{title}</h4>

        <span className="text-yellow-300 font-semibold">
          +{xp} XP
        </span>
      </div>

      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>Progress</span>

        <span>{progress}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Insight({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <CheckCircle2 className="mt-1 text-emerald-400" size={18} />

      <p className="text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}