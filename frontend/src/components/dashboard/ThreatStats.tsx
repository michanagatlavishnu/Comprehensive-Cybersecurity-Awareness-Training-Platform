import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  LockKeyhole,
  Bug,
  MailWarning,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Activity,
  BrainCircuit,
} from "lucide-react";

interface Props {
  awarenessScore: number;
  phishingReports: number;
}

export default function ThreatStats({
  awarenessScore,
  phishingReports,
}: Props) {
  const threatLevel =
    awarenessScore >= 90
      ? "LOW"
      : awarenessScore >= 75
      ? "MEDIUM"
      : "HIGH";

  const riskColor =
    awarenessScore >= 90
      ? "emerald"
      : awarenessScore >= 75
      ? "amber"
      : "red";

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-red-400">
            Security Operations Center
          </p>

          <h2 className="text-2xl font-black text-white">
            Threat Intelligence
          </h2>
        </div>

        <ShieldAlert className="text-red-400" size={32} />
      </div>

      {/* Threat Level Banner */}
      <div
        className={`mb-8 rounded-3xl border p-5 ${
          riskColor === "emerald"
            ? "border-emerald-500/30 bg-emerald-500/10"
            : riskColor === "amber"
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-black text-white">
            Organization Threat Level
          </h3>

          <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              riskColor === "emerald"
                ? "bg-emerald-500 text-black"
                : riskColor === "amber"
                ? "bg-amber-400 text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {threatLevel}
          </span>
        </div>

        <p className="text-sm text-slate-300">
          Based on awareness score, phishing activity, incident reporting,
          password security, and AI learning behavior.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-4">
        <ThreatCard
          icon={MailWarning}
          title="Phishing Reports"
          value={phishingReports}
          color="emerald"
          subtitle="+3 this week"
        />

        <ThreatCard
          icon={ShieldX}
          title="Phishing Clicks"
          value={2}
          color="red"
          subtitle="-40% vs last week"
        />

        <ThreatCard
          icon={AlertTriangle}
          title="Incidents Reported"
          value={4}
          color="amber"
          subtitle="2 resolved"
        />

        <ThreatCard
          icon={LockKeyhole}
          title="Password Risk"
          value="18%"
          color="cyan"
          subtitle="82% secure passwords"
        />

        <ThreatCard
          icon={Bug}
          title="Suspicious Emails"
          value={11}
          color="violet"
          subtitle="Detected by AI"
        />

        <ThreatCard
          icon={ShieldCheck}
          title="Blocked Threats"
          value={27}
          color="emerald"
          subtitle="Last 30 days"
        />
      </div>

      {/* Risk Breakdown */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-800/60 p-5">
        <div className="mb-5 flex items-center gap-3">
          <Activity className="text-cyan-400" size={24} />

          <h3 className="text-lg font-bold text-white">
            Security Risk Breakdown
          </h3>
        </div>

        <RiskProgress
          label="Phishing Detection Ability"
          value={95}
          color="emerald"
        />

        <RiskProgress
          label="Password Hygiene"
          value={82}
          color="cyan"
        />

        <RiskProgress
          label="Social Engineering Awareness"
          value={87}
          color="violet"
        />

        <RiskProgress
          label="Incident Reporting Readiness"
          value={74}
          color="amber"
        />

        <RiskProgress
          label="Cloud Security Awareness"
          value={69}
          color="red"
        />
      </div>

      {/* Threat Timeline */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-800/60 p-5">
        <div className="mb-5 flex items-center gap-3">
          <TrendingUp className="text-emerald-400" />

          <h3 className="font-bold text-white">
            Recent Threat Activity
          </h3>
        </div>

        <TimelineItem
          color="emerald"
          title="Phishing email successfully reported."
          time="Today · 09:15 AM"
        />

        <TimelineItem
          color="amber"
          title="Password reused in Password Lab simulation."
          time="Yesterday · 07:20 PM"
        />

        <TimelineItem
          color="red"
          title="User clicked simulated phishing email."
          time="2 Days Ago"
        />

        <TimelineItem
          color="cyan"
          title="New ransomware awareness module assigned."
          time="3 Days Ago"
        />
      </div>

      {/* AI Threat Intelligence */}
      <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-violet-500/10 p-5">
        <div className="mb-4 flex items-center gap-3">
          <BrainCircuit className="text-cyan-300" />

          <h3 className="font-bold text-cyan-300">
            AI Threat Intelligence Summary
          </h3>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <Insight
            good
            text="Employees in Engineering have the highest phishing detection score this week."
          />

          <Insight
            text="Password reuse attempts decreased by 18% after Password Security Lab completion."
          />

          <Insight
            good
            text="No critical phishing campaigns were successfully compromised during the last simulation."
          />

          <Insight
            warning
            text="Cloud Security Awareness remains the weakest topic across the organization."
          />
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" />

          <h3 className="font-bold text-emerald-300">
            Recommended Security Actions
          </h3>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <Recommendation text="Complete Cloud Security Fundamentals training module." />

          <Recommendation text="Attempt today's AI-generated phishing awareness quiz." />

          <Recommendation text="Enable MFA for all critical enterprise accounts." />

          <Recommendation text="Report suspicious emails immediately using CyberAware." />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   THREAT KPI CARD
========================================================== */

function ThreatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  color: "emerald" | "red" | "amber" | "cyan" | "violet";
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    red: "bg-red-500/10 text-red-400",
    amber: "bg-amber-500/10 text-amber-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4 transition hover:border-cyan-500/30">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
      >
        <Icon size={24} />
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-black text-white">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

/* ==========================================================
   RISK BAR
========================================================== */

function RiskProgress({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "cyan" | "violet" | "amber" | "red";
}) {
  const bar = {
    emerald: "from-emerald-400 to-green-500",
    cyan: "from-cyan-400 to-sky-500",
    violet: "from-violet-400 to-purple-500",
    amber: "from-amber-400 to-orange-500",
    red: "from-red-400 to-pink-500",
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-sm text-slate-300">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar[color]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ==========================================================
   TIMELINE ITEM
========================================================== */

function TimelineItem({
  title,
  time,
  color,
}: {
  title: string;
  time: string;
  color: "emerald" | "amber" | "red" | "cyan";
}) {
  const dot = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    red: "bg-red-400",
    cyan: "bg-cyan-400",
  };

  return (
    <div className="mb-4 flex items-start gap-4">
      <div
        className={`mt-2 h-3 w-3 rounded-full ${dot[color]}`}
      />

      <div>
        <p className="text-sm font-medium text-white">{title}</p>

        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}

/* ==========================================================
   AI INSIGHTS
========================================================== */

function Insight({
  text,
  good,
  warning,
}: {
  text: string;
  good?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {good ? (
        <TrendingUp className="mt-1 text-emerald-400" size={18} />
      ) : warning ? (
        <AlertTriangle className="mt-1 text-amber-400" size={18} />
      ) : (
        <TrendingDown className="mt-1 text-cyan-400" size={18} />
      )}

      <p>{text}</p>
    </div>
  );
}

/* ==========================================================
   RECOMMENDATION ITEM
========================================================== */

function Recommendation({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-emerald-400" size={18} />

      <span>{text}</span>
    </div>
  );
}