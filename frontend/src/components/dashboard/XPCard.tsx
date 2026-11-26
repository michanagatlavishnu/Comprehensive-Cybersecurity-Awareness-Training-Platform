import {
  Award,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Props {
  totalXP: number;
  currentLevel: number;
}

export default function XPCard({
  totalXP,
  currentLevel,
}: Props) {
  // XP required per level
  const xpForCurrentLevel = currentLevel * 500;
  const xpForNextLevel = (currentLevel + 1) * 500;

  const currentXP = totalXP - xpForCurrentLevel;
  const requiredXP = xpForNextLevel - xpForCurrentLevel;

  const progress = Math.max(
    0,
    Math.min((currentXP / requiredXP) * 100, 100)
  );

  const nextLevelXP = Math.max(0, xpForNextLevel - totalXP);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-violet-950/60 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-cyan-400">
            Experience System
          </p>

          <h2 className="text-2xl font-black text-white">
            XP & Level Progress
          </h2>
        </div>

        <Sparkles className="text-cyan-300" size={28} />
      </div>

      {/* XP Ring */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-52 w-52">
          <svg
            viewBox="0 0 220 220"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <defs>
              <linearGradient id="xpGradient">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            <circle
              cx="110"
              cy="110"
              r="92"
              stroke="#1E293B"
              strokeWidth="14"
              fill="none"
            />

            <circle
              cx="110"
              cy="110"
              r="92"
              stroke="url(#xpGradient)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={578}
              strokeDashoffset={578 - (578 * progress) / 100}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Zap className="mb-2 text-cyan-300" size={28} />

            <h1 className="text-4xl font-black text-white">
              {currentLevel}
            </h1>

            <p className="text-xs uppercase tracking-[3px] text-slate-400">
              Current Level
            </p>

            <p className="mt-3 text-xl font-bold text-cyan-300">
              {totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
          {nextLevelXP} XP needed for Level {currentLevel + 1}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>Progress to Level {currentLevel + 1}</span>

          <span>{progress.toFixed(0)}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{xpForCurrentLevel} XP</span>

          <span>{xpForNextLevel} XP</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <XPStat
          icon={TrendingUp}
          title="Weekly XP"
          value="+360"
          color="text-emerald-400"
        />

        <XPStat
          icon={Award}
          title="Achievements"
          value="18"
          color="text-yellow-400"
        />

        <XPStat
          icon={Star}
          title="Current Rank"
          value="#27"
          color="text-violet-400"
        />

        <XPStat
          icon={Trophy}
          title="Certificates"
          value="3"
          color="text-orange-400"
        />
      </div>

      {/* Daily Goal */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-300">Daily XP Goal</p>

            <h3 className="text-2xl font-bold text-white">
              180 / 250 XP
            </h3>
          </div>

          <Zap className="text-cyan-300" size={26} />
        </div>

        <div className="h-2 rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            style={{ width: "72%" }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Complete one AI quiz or finish one training lesson to reach today's XP target.
        </p>
      </div>

      {/* Weekly Streak */}
      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-300">Weekly Learning Streak</p>

            <h3 className="text-2xl font-black text-white">
              12 Days 🔥
            </h3>
          </div>

          <Award className="text-violet-300" size={28} />
        </div>

        <div className="flex justify-between text-xs text-slate-400">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div
              key={day + index}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-500/30 font-semibold text-white"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* XP Tips */}
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5">
        <div className="mb-3 flex items-center gap-3">
          <Sparkles className="text-emerald-400" />

          <h4 className="font-bold text-emerald-300">
            AI XP Booster Suggestions
          </h4>
        </div>

        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Finish Password Security Lab (+40 XP)</li>
          <li>• Complete AI Generated Quiz (+80 XP)</li>
          <li>• Report a phishing email (+25 XP)</li>
          <li>• Watch today's awareness video (+20 XP)</li>
          <li>• Complete one policy acknowledgement (+15 XP)</li>
        </ul>
      </div>
    </div>
  );
}

function XPStat({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
      <Icon className={`${color} mb-3`} size={22} />

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h4 className={`mt-1 text-xl font-black ${color}`}>
        {value}
      </h4>
    </div>
  );
}