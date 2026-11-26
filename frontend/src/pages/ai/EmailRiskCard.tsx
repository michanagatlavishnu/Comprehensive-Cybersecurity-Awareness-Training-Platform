import {
  AlertTriangle,
  ShieldCheck,
  Globe,
  MailWarning,
  CheckCircle2,
  CircleAlert,
  BadgeCheck,
} from "lucide-react";

export type RiskLevel =
  | "safe"
  | "low"
  | "medium"
  | "high"
  | "critical";

interface EmailRiskCardProps {
  title: string;
  value: string;
  risk: RiskLevel;
  description: string;
  confidence?: number;
  indicator?: string;
  recommendation?: string;
}

const riskStyles = {
  safe: {
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    progress: "from-emerald-400 to-green-500",
    icon: ShieldCheck,
    label: "SAFE",
  },

  low: {
    text: "text-cyan-300",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    progress: "from-cyan-400 to-blue-500",
    icon: Globe,
    label: "LOW",
  },

  medium: {
    text: "text-yellow-300",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    progress: "from-yellow-400 to-orange-500",
    icon: CircleAlert,
    label: "MEDIUM",
  },

  high: {
    text: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    progress: "from-orange-400 to-red-500",
    icon: MailWarning,
    label: "HIGH",
  },

  critical: {
    text: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    progress: "from-red-500 to-red-700",
    icon: AlertTriangle,
    label: "CRITICAL",
  },
};

export default function EmailRiskCard({
  title,
  value,
  risk,
  description,
  confidence = 95,
  indicator = "AI Security Indicator",
  recommendation = "Verify sender authenticity before interacting with this email.",
}: EmailRiskCardProps) {
  const style = riskStyles[risk];
  const Icon = style.icon;

  return (
    <div
      className={`rounded-3xl border ${style.border} bg-slate-900/70 p-6 transition hover:border-cyan-500/40`}
    >
      {/* Header */}

      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${style.bg} p-3`}>
            <Icon className={style.text} size={24} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[2px] text-slate-500">
              {title}
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">{value}</h3>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
      </div>

      {/* Description */}

      <p className="leading-7 text-slate-400">{description}</p>

      {/* Indicator */}

      <div className="mt-6 rounded-2xl bg-slate-950 p-4">
        <div className="mb-3 flex items-center gap-2">
          <BadgeCheck className="text-cyan-400" size={18} />

          <p className="text-xs uppercase tracking-[2px] text-cyan-300">
            {indicator}
          </p>
        </div>

        <p className="text-sm text-slate-300">{recommendation}</p>
      </div>

      {/* Confidence */}

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">AI Confidence</span>

          <span className={style.text}>{confidence}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.progress}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Recommendation Box */}

      <div className={`mt-6 rounded-2xl ${style.bg} p-4`}>
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className={style.text} size={18} />

          <p className={`text-sm font-semibold ${style.text}`}>
            Recommended Action
          </p>
        </div>

        <p className="text-sm leading-6 text-slate-300">{recommendation}</p>
      </div>
    </div>
  );
}