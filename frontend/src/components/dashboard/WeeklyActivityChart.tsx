import {
  Activity,
  BookOpen,
  BrainCircuit,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import type { WeeklyActivity } from "../../types/dashboard";

interface Props {
  data: WeeklyActivity[];
}

export default function WeeklyActivityChart({ data }: Props) {
  const totalXP = data.reduce((sum, item) => sum + item.xp, 0);

  const totalLessons = data.reduce(
    (sum, item) => sum + item.lessons,
    0
  );

  const totalQuizzes = data.reduce(
    (sum, item) => sum + item.quizzes,
    0
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-cyan-400">
            Analytics
          </p>

          <h2 className="text-2xl font-black text-white">
            Weekly Learning Activity
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Lessons completed, quizzes attempted, and XP earned over the last
            seven days.
          </p>
        </div>

        <Activity className="text-cyan-400" size={34} />
      </div>

      {/* KPI Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          icon={BookOpen}
          title="Lessons Completed"
          value={totalLessons}
          color="emerald"
        />

        <SummaryCard
          icon={BrainCircuit}
          title="Quizzes Attempted"
          value={totalQuizzes}
          color="violet"
        />

        <SummaryCard
          icon={Zap}
          title="Weekly XP Earned"
          value={totalXP}
          color="cyan"
        />
      </div>

      {/* Bar Chart */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-slate-800/40 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">
            Lessons vs Quizzes
          </h3>

          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            Last 7 Days
          </span>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                tickLine={false}
              />

              <YAxis stroke="#94A3B8" tickLine={false} />

              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1E293B",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Legend />

              <Bar
                dataKey="lessons"
                name="Lessons"
                fill="#22C55E"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="quizzes"
                name="Quizzes"
                fill="#8B5CF6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* XP Trend */}
      <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">
            XP Growth Trend
          </h3>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Weekly XP
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                tickLine={false}
              />

              <YAxis stroke="#94A3B8" tickLine={false} />

              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1E293B",
                  borderRadius: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="xp"
                stroke="#06B6D4"
                strokeWidth={4}
                dot={{ r: 5, fill: "#22D3EE" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 p-5">
        <div className="mb-4 flex items-center gap-3">
          <BrainCircuit className="text-emerald-400" />

          <h3 className="font-bold text-emerald-300">
            AI Weekly Insights
          </h3>
        </div>

        <ul className="space-y-3 text-sm text-slate-300">
          <li>✅ Highest learning activity occurred on Friday.</li>

          <li>📈 XP increased by more than 20% compared to Monday.</li>

          <li>🎯 Quiz participation remained consistent throughout the week.</li>

          <li>
            🚨 Completing weekend modules can improve weekly awareness score.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ======================================================
   KPI SUMMARY CARD
====================================================== */

function SummaryCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: number;
  color: "emerald" | "cyan" | "violet";
}) {
  const styles = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
    },
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${styles[color].bg}`}
      >
        <Icon className={styles[color].text} size={24} />
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className={`mt-2 text-2xl font-black ${styles[color].text}`}>
        {value}
      </h3>
    </div>
  );
}