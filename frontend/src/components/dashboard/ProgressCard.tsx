import {
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileCheck,
  ShieldAlert,
  Target,
  Trophy,
} from "lucide-react";

interface Props {
  completedModules: number;
  totalModules: number;
  completedQuizzes: number;
  certificates: number;
  phishingReports: number;
}

export default function ProgressCard({
  completedModules,
  totalModules,
  completedQuizzes,
  certificates,
  phishingReports,
}: Props) {
  const completion =
    totalModules === 0
      ? 0
      : Math.round((completedModules / totalModules) * 100);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-emerald-400">
            Learning Analytics
          </p>

          <h2 className="text-2xl font-black text-white">
            Learning Progress
          </h2>
        </div>

        <Target className="text-emerald-400" size={30} />
      </div>

      {/* Completion */}
      <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-300">
              Overall Completion
            </p>

            <h1 className="text-4xl font-black text-white">
              {completion}%
            </h1>
          </div>

          <CheckCircle2
            className="text-emerald-400"
            size={40}
          />
        </div>

        <div className="h-3 rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 transition-all duration-700"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-400">
          {completedModules} of {totalModules} cybersecurity modules completed.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <ProgressMetric
          icon={BookOpenCheck}
          title="Modules Completed"
          value={`${completedModules}/${totalModules}`}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />

        <ProgressMetric
          icon={BrainCircuit}
          title="AI Quizzes Passed"
          value={completedQuizzes.toString()}
          color="text-violet-400"
          bg="bg-violet-500/10"
        />

        <ProgressMetric
          icon={Trophy}
          title="Certificates Earned"
          value={certificates.toString()}
          color="text-yellow-400"
          bg="bg-yellow-500/10"
        />

        <ProgressMetric
          icon={ShieldAlert}
          title="Phishing Reports"
          value={phishingReports.toString()}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
        />
      </div>

      {/* Weekly Checklist */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/60 p-5">
        <div className="mb-4 flex items-center gap-3">
          <Clock3 className="text-cyan-300" size={22} />

          <h3 className="font-bold text-white">
            This Week's Cyber Goals
          </h3>
        </div>

        <Checklist label="Finish Social Engineering Module" checked />

        <Checklist label="Pass AI Phishing Quiz" checked />

        <Checklist label="Complete Password Security Lab" />

        <Checklist label="Acknowledge GDPR Policy Update" />

        <Checklist label="Report Suspicious Email Simulation" />
      </div>

      {/* Skill Progress */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
        <div className="mb-4 flex items-center gap-3">
          <FileCheck className="text-cyan-300" size={22} />

          <h3 className="font-bold text-cyan-300">
            Security Skill Progress
          </h3>
        </div>

        <SkillProgress label="Email Security" value={94} />

        <SkillProgress label="Password Hygiene" value={88} />

        <SkillProgress label="Phishing Detection" value={91} />

        <SkillProgress label="Incident Reporting" value={74} />

        <SkillProgress label="Social Engineering" value={79} />

        <SkillProgress label="Cloud Security Awareness" value={69} />
      </div>

      {/* AI Coach */}
      <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-5">
        <div className="mb-3 flex items-center gap-3">
          <BrainCircuit className="text-violet-300" size={24} />

          <h3 className="font-bold text-violet-300">
            AI Learning Recommendation
          </h3>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          Based on your activity, Cloud Security Awareness and Incident Reporting
          are your weakest learning areas. Completing those modules will increase
          your awareness score and unlock the Cyber Defender badge.
        </p>
      </div>
    </div>
  );
}

/* ===========================================================
   METRIC CARD
=========================================================== */

function ProgressMetric({
  icon: Icon,
  title,
  value,
  color,
  bg,
}: {
  icon: any;
  title: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4 transition hover:border-emerald-500/30">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
      >
        <Icon className={color} size={24} />
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className={`mt-2 text-2xl font-black ${color}`}>
        {value}
      </h3>
    </div>
  );
}

/* ===========================================================
   CHECKLIST ITEM
=========================================================== */

function Checklist({
  label,
  checked = false,
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      {checked ? (
        <CheckCircle2 className="text-emerald-400" size={18} />
      ) : (
        <div className="h-[18px] w-[18px] rounded-full border border-slate-500" />
      )}

      <span
        className={
          checked
            ? "text-sm text-slate-300 line-through"
            : "text-sm text-slate-400"
        }
      >
        {label}
      </span>
    </div>
  );
}

/* ===========================================================
   SKILL BAR
=========================================================== */

function SkillProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-sm text-slate-300">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}