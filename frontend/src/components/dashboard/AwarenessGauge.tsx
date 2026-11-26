import { ShieldCheck, TrendingUp } from "lucide-react";

interface Props {
  score: number;
}

export default function AwarenessGauge({ score }: Props) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const status =
    score >= 90
      ? "Excellent"
      : score >= 75
        ? "Good"
        : score >= 60
          ? "Average"
          : "Needs Improvement";

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-emerald-400">
            Cyber Security
          </p>

          <h2 className="text-2xl font-black text-white">
            Awareness Score
          </h2>
        </div>

        <ShieldCheck className="text-emerald-400" size={28} />
      </div>

      <div className="flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <defs>
            <linearGradient id="awarenessGradient">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#1E293B"
            strokeWidth="14"
            fill="none"
          />

          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="url(#awarenessGradient)"
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
          />

          <text
            x="110"
            y="100"
            textAnchor="middle"
            fill="white"
            fontSize="34"
            fontWeight="bold"
          >
            {score}%
          </text>

          <text
            x="110"
            y="125"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="13"
          >
            Awareness Score
          </text>
        </svg>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-emerald-300">
          <TrendingUp size={18} />

          <span className="font-semibold">{status}</span>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          Your cybersecurity awareness reflects training completion,
          phishing simulations, quizzes, password practices,
          and incident reporting behavior.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <ScoreBar label="Training Completion" value={92} />

        <ScoreBar label="Quiz Performance" value={88} />

        <ScoreBar label="Phishing Awareness" value={95} />

        <ScoreBar label="Password Security" value={84} />
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-slate-300">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}