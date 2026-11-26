import { useMemo, useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  BrainCircuit,
  Award,
  Star,
} from "lucide-react";

export interface LeaderboardUser {
  id: string;
  name: string;
  department: string;
  xp: number;
  awarenessScore: number;
  streak: number;
  phishingReports: number;
  quizzesCompleted: number;
  avatar?: string;
  rankChange: "up" | "down" | "same";
}

interface Props {
  users?: LeaderboardUser[];
  currentUserId?: string;
}

const sampleUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    department: "Engineering",
    xp: 5280,
    awarenessScore: 98,
    streak: 31,
    phishingReports: 14,
    quizzesCompleted: 29,
    rankChange: "same",
  },
  {
    id: "2",
    name: "Priya Reddy",
    department: "Security Operations",
    xp: 4890,
    awarenessScore: 97,
    streak: 28,
    phishingReports: 16,
    quizzesCompleted: 27,
    rankChange: "up",
  },
  {
    id: "3",
    name: "Rahul Verma",
    department: "HR",
    xp: 4560,
    awarenessScore: 95,
    streak: 24,
    phishingReports: 10,
    quizzesCompleted: 25,
    rankChange: "up",
  },
  {
    id: "4",
    name: "Anil Kumar",
    department: "Engineering",
    xp: 2840,
    awarenessScore: 91,
    streak: 12,
    phishingReports: 7,
    quizzesCompleted: 18,
    rankChange: "up",
  },
  {
    id: "5",
    name: "Neha Gupta",
    department: "Finance",
    xp: 2635,
    awarenessScore: 89,
    streak: 10,
    phishingReports: 6,
    quizzesCompleted: 16,
    rankChange: "down",
  },
  {
    id: "6",
    name: "Karthik Rao",
    department: "Marketing",
    xp: 2415,
    awarenessScore: 88,
    streak: 9,
    phishingReports: 5,
    quizzesCompleted: 15,
    rankChange: "same",
  },
  {
    id: "7",
    name: "Sana Khan",
    department: "Sales",
    xp: 2290,
    awarenessScore: 87,
    streak: 8,
    phishingReports: 8,
    quizzesCompleted: 13,
    rankChange: "up",
  },
  {
    id: "8",
    name: "Rohan Singh",
    department: "Support",
    xp: 2150,
    awarenessScore: 84,
    streak: 7,
    phishingReports: 4,
    quizzesCompleted: 12,
    rankChange: "down",
  },
];

export default function LeaderboardPreview({
  users,
  currentUserId = "4",
}: Props) {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">(
    "weekly"
  );

  const leaderboard = useMemo(() => {
    const list = [...(users ?? sampleUsers)];
    return list.sort((a, b) => b.xp - a.xp);
  }, [users, period]);

  const currentUser = leaderboard.find((u) => u.id === currentUserId);
  const currentRank =
    leaderboard.findIndex((u) => u.id === currentUserId) + 1;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-yellow-400">
            Cyber Champions
          </p>

          <h2 className="text-3xl font-black text-white">
            Enterprise Leaderboard
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Top performers based on cybersecurity awareness, XP earned, phishing
            detection, quizzes, and learning consistency.
          </p>
        </div>

        <Trophy className="text-yellow-400" size={34} />
      </div>

      {/* Period Selector */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          ["weekly", "Weekly"],
          ["monthly", "Monthly"],
          ["alltime", "All Time"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setPeriod(value as any)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              period === value
                ? "bg-yellow-400 text-black"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="mb-10 grid gap-5 lg:grid-cols-3">
        <PodiumCard user={leaderboard[1]} position={2} />

        <PodiumCard user={leaderboard[0]} position={1} />

        <PodiumCard user={leaderboard[2]} position={3} />
      </div>

      {/* Current User Card */}
      {currentUser && (
        <div className="mb-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Star className="text-cyan-300" />

            <h3 className="text-xl font-bold text-white">
              Your Current Ranking
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MiniStat title="Current Rank" value={`#${currentRank}`} />

            <MiniStat title="Awareness Score" value={`${currentUser.awarenessScore}%`} />

            <MiniStat title="XP Earned" value={currentUser.xp.toLocaleString()} />

            <MiniStat title="Learning Streak" value={`${currentUser.streak} Days`} />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900/50 p-5">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Progress to Top 3</span>

              <span>
                {Math.round((currentUser.xp / leaderboard[2].xp) * 100)}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-yellow-400"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((currentUser.xp / leaderboard[2].xp) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-800/40 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            Employee Rankings
          </h3>

          <Users className="text-cyan-400" size={22} />
        </div>

        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <RankCard
              key={user.id}
              rank={index + 1}
              user={user}
              highlight={user.id === currentUserId}
            />
          ))}
        </div>
      </div>

      {/* Department Rankings */}
      <div className="mt-10 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Building2 className="text-violet-300" />

          <h3 className="text-xl font-bold text-white">
            Department Rankings
          </h3>
        </div>

        <DepartmentCard
          department="Engineering"
          score={97}
          employees={18}
          position={1}
        />

        <DepartmentCard
          department="Security Operations"
          score={95}
          employees={12}
          position={2}
        />

        <DepartmentCard
          department="HR"
          score={92}
          employees={10}
          position={3}
        />

        <DepartmentCard
          department="Finance"
          score={89}
          employees={9}
          position={4}
        />

        <DepartmentCard
          department="Marketing"
          score={87}
          employees={14}
          position={5}
        />
      </div>

      {/* AI Recognition */}
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <BrainCircuit className="text-emerald-300" />

          <h3 className="text-xl font-bold text-white">
            AI Recognition Awards
          </h3>
        </div>

        <Recognition
          icon={ShieldCheck}
          title="Best Phishing Defender"
          value="Priya Reddy • 16 phishing reports"
        />

        <Recognition
          icon={Flame}
          title="Longest Learning Streak"
          value="Aarav Sharma • 31 Days"
        />

        <Recognition
          icon={Award}
          title="Highest Awareness Score"
          value="Engineering Department • 97%"
        />

        <Recognition
          icon={Zap}
          title="Fastest XP Growth This Week"
          value="Anil Kumar • +420 XP"
        />
      </div>
    </section>
  );
}

/* ============================================================
   PODIUM CARD
============================================================ */

function PodiumCard({
  user,
  position,
}: {
  user: LeaderboardUser;
  position: number;
}) {
  const styles = {
    1: {
      bg: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-400/40",
      icon: Crown,
      text: "text-yellow-300",
    },
    2: {
      bg: "from-slate-300/10 to-slate-500/10",
      border: "border-slate-400/30",
      icon: Medal,
      text: "text-slate-300",
    },
    3: {
      bg: "from-orange-500/20 to-red-500/20",
      border: "border-orange-400/30",
      icon: Trophy,
      text: "text-orange-300",
    },
  };

  const style = styles[position as 1 | 2 | 3];

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br ${style.bg} ${style.border} p-6 text-center`}
    >
      <style.icon className={`mx-auto mb-4 ${style.text}`} size={34} />

      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-2xl font-black text-white">
        {user.name.charAt(0)}
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        Rank #{position}
      </p>

      <h3 className="mt-2 text-xl font-bold text-white">
        {user.name}
      </h3>

      <p className="text-sm text-slate-400">{user.department}</p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300">
        <Zap size={16} />
        {user.xp.toLocaleString()} XP
      </div>

      <div className="mt-4 flex justify-center gap-5 text-sm text-slate-300">
        <span>🔥 {user.streak}</span>

        <span>🛡️ {user.awarenessScore}%</span>
      </div>
    </div>
  );
}

/* ============================================================
   RANK CARD
============================================================ */

function RankCard({
  rank,
  user,
  highlight,
}: {
  rank: number;
  user: LeaderboardUser;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        highlight
          ? "border-cyan-500/30 bg-cyan-500/10"
          : "border-white/10 bg-slate-900/40"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-black text-cyan-300">
            #{rank}
          </div>

          <div>
            <h4 className="font-bold text-white">
              {user.name}
            </h4>

            <p className="text-sm text-slate-400">
              {user.department}
            </p>
          </div>

          {user.rankChange === "up" && (
            <ArrowUpRight className="text-emerald-400" size={18} />
          )}

          {user.rankChange === "down" && (
            <ArrowDownRight className="text-red-400" size={18} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
          <ScoreCard label="XP" value={user.xp.toLocaleString()} />

          <ScoreCard label="Awareness" value={`${user.awarenessScore}%`} />

          <ScoreCard label="Streak" value={`${user.streak}🔥`} />

          <ScoreCard label="Reports" value={`${user.phishingReports}`} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DEPARTMENT CARD
============================================================ */

function DepartmentCard({
  department,
  score,
  employees,
  position,
}: {
  department: string;
  score: number;
  employees: number;
  position: number;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-bold text-violet-300">
            #{position}
          </div>

          <h4 className="font-bold text-white">
            {department}
          </h4>
        </div>

        <span className="text-cyan-300 font-semibold">
          {employees} Employees
        </span>
      </div>

      <div className="mb-2 flex justify-between text-sm text-slate-300">
        <span>Awareness Score</span>

        <span>{score}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MINI STATS
============================================================ */

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/40 p-5 text-center">
      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h4 className="mt-2 text-2xl font-black text-cyan-300">
        {value}
      </h4>
    </div>
  );
}

/* ============================================================
   SCORE CARD
============================================================ */

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800/60 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="font-bold text-white">{value}</p>
    </div>
  );
}

/* ============================================================
   AI RECOGNITION CARD
============================================================ */

function Recognition({
  icon: Icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-4 rounded-2xl bg-slate-900/40 p-4">
      <div className="rounded-xl bg-emerald-500/10 p-3">
        <Icon className="text-emerald-400" size={22} />
      </div>

      <div>
        <p className="font-semibold text-white">{title}</p>

        <p className="text-sm text-slate-400">{value}</p>
      </div>
    </div>
  );
}