import { ShieldAlert, TriangleAlert, ShieldCheck } from "lucide-react";

interface ThreatScoreMeterProps {
  score: number;
}

export default function ThreatScoreMeter({
  score,
}: ThreatScoreMeterProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  const circumference = 2 * Math.PI * 70;
  const offset =
    circumference - (normalizedScore / 100) * circumference;

  const getRisk = () => {
    if (normalizedScore >= 85)
      return {
        label: "Critical",
        color: "#EF4444",
        bg: "from-red-500 to-red-700",
        icon: TriangleAlert,
      };

    if (normalizedScore >= 70)
      return {
        label: "High",
        color: "#F97316",
        bg: "from-orange-400 to-red-500",
        icon: ShieldAlert,
      };

    if (normalizedScore >= 40)
      return {
        label: "Medium",
        color: "#FACC15",
        bg: "from-yellow-400 to-orange-500",
        icon: ShieldAlert,
      };

    return {
      label: "Safe",
      color: "#10B981",
      bg: "from-emerald-400 to-green-500",
      icon: ShieldCheck,
    };
  };

  const risk = getRisk();
  const RiskIcon = risk.icon;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Meter */}
      <div className="relative h-56 w-56">
        <svg
          className="-rotate-90 h-56 w-56"
          viewBox="0 0 180 180"
        >
          <circle
            cx="90"
            cy="90"
            r="70"
            stroke="#1E293B"
            strokeWidth="14"
            fill="transparent"
          />

          <circle
            cx="90"
            cy="90"
            r="70"
            stroke={risk.color}
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 1s ease-in-out, stroke 0.4s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <RiskIcon
            size={34}
            style={{ color: risk.color }}
          />

          <h2
            className="mt-2 text-5xl font-black"
            style={{ color: risk.color }}
          >
            {normalizedScore}
          </h2>

          <p className="mt-2 text-xs uppercase tracking-[3px] text-slate-400">
            Threat Score
          </p>
        </div>
      </div>

      {/* Risk Badge */}
      <div
        className={`mt-6 rounded-full bg-gradient-to-r ${risk.bg} px-6 py-2 text-sm font-bold text-white`}
      >
        {risk.label} Risk
      </div>

      {/* Confidence Meter */}
      <div className="mt-8 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>AI Confidence</span>
          <span>{normalizedScore}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${risk.bg}`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>

        <p className="mt-4 text-center text-xs leading-6 text-slate-500">
          Confidence is calculated using sender reputation, URL analysis,
          spoofing detection, urgency language, and phishing indicators.
        </p>
      </div>

      {/* Risk Legend */}
      <div className="mt-8 w-full rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">
        <h3 className="mb-4 text-center text-sm font-semibold text-cyan-300">
          Threat Severity Scale
        </h3>

        {[
          {
            label: "Critical",
            range: "85 – 100",
            color: "bg-red-500",
          },
          {
            label: "High",
            range: "70 – 84",
            color: "bg-orange-500",
          },
          {
            label: "Medium",
            range: "40 – 69",
            color: "bg-yellow-400",
          },
          {
            label: "Safe",
            range: "0 – 39",
            color: "bg-emerald-500",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="mb-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${item.color}`}
              />

              <span className="text-sm text-slate-300">
                {item.label}
              </span>
            </div>

            <span className="text-xs text-slate-500">
              {item.range}
            </span>
          </div>
        ))}
      </div>

      {/* Threat Summary */}
      <div className="mt-8 w-full rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-5">
        <h3 className="mb-3 text-center text-sm font-semibold text-violet-300">
          AI Threat Interpretation
        </h3>

        <p className="text-center text-sm leading-7 text-slate-300">
          {normalizedScore >= 85 &&
            "This email is highly likely to be a phishing or credential harvesting attack. Do not interact with links or attachments."}

          {normalizedScore >= 70 &&
            normalizedScore < 85 &&
            "Multiple phishing indicators detected. Verify sender authenticity and report the email before taking any action."}

          {normalizedScore >= 40 &&
            normalizedScore < 70 &&
            "This email contains suspicious characteristics. Exercise caution and inspect sender, links, and attachments carefully."}

          {normalizedScore < 40 &&
            "No major phishing indicators detected, but always verify unexpected requests before responding."}
        </p>
      </div>
    </div>
  );
}