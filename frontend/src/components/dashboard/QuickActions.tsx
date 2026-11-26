import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Bug,
  FileWarning,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionCard {
  title: string;
  description: string;
  icon: any;
  route: string;
  badge?: string;
  gradient: string;
  progress?: number;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const actions: ActionCard[] = [
    {
      title: "Continue Training",
      description: "Resume your next cybersecurity learning module.",
      icon: BookOpen,
      route: "/training/all-courses",
      badge: "Resume",
      progress: 72,
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "AI Quiz Engine",
      description: "Take today's adaptive AI generated security quiz.",
      icon: BrainCircuit,
      route: "/quizzes/module-quiz",
      badge: "AI Ready",
      gradient: "from-violet-500 to-indigo-500",
    },
    {
      title: "Phishing Simulator",
      description: "Practice identifying phishing attacks safely.",
      icon: ShieldAlert,
      route: "/phishing/inbox",
      badge: "New Campaign",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Password Security Lab",
      description: "Check password strength and MFA readiness.",
      icon: LockKeyhole,
      route: "/password-lab/password-checker",
      badge: "Security",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Report Cyber Incident",
      description: "Report suspicious emails or security incidents.",
      icon: FileWarning,
      route: "/incidents/report-incident",
      badge: "SOC",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "AI Security Assistant",
      description: "Ask CyberAware AI about cyber threats and policies.",
      icon: Sparkles,
      route: "/training/ai-summary",
      badge: "Groq AI",
      gradient: "from-emerald-400 to-violet-500",
    },
    {
      title: "Achievements",
      description: "View badges, certificates and milestones earned.",
      icon: Trophy,
      route: "/leaderboard/badges",
      badge: "Rewards",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Threat Intelligence",
      description: "View latest phishing and malware intelligence.",
      icon: Bug,
      route: "/dashboard",
      badge: "Live Feed",
      gradient: "from-slate-500 to-cyan-500",
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-emerald-400">
            Productivity Hub
          </p>

          <h2 className="text-3xl font-black text-white">
            Quick Actions
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Access CyberAware training, AI quizzes, phishing simulations,
            password lab, incidents, and certificates instantly.
          </p>
        </div>

        <ShieldCheck className="text-emerald-400" size={34} />
      </div>

      {/* Action Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.route)}
            className="group rounded-3xl border border-white/10 bg-slate-800/50 p-5 text-left transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/40 hover:bg-slate-800"
          >
            {/* Badge */}
            {action.badge && (
              <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                {action.badge}
              </span>
            )}

            {/* Icon */}
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg`}
            >
              <action.icon className="text-white" size={28} />
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-bold text-white">
              {action.title}
            </h3>

            {/* Description */}
            <p className="mb-4 text-sm leading-6 text-slate-400">
              {action.description}
            </p>

            {/* Progress */}
            {action.progress !== undefined && (
              <>
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>Progress</span>

                  <span>{action.progress}%</span>
                </div>

                <div className="mb-4 h-2 rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 transition-all duration-700"
                    style={{ width: `${action.progress}%` }}
                  />
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-all duration-300 group-hover:translate-x-1">
              Open Module

              <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>

      {/* AI Assistant CTA */}
      <div className="mt-10 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg">
              <BrainCircuit className="text-white" size={32} />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[3px] text-cyan-300">
                CyberAware AI Assistant
              </p>

              <h3 className="mt-1 text-2xl font-black text-white">
                Need help understanding a cyber threat?
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Chat with Groq AI to understand phishing emails, ransomware,
                malware, company policies, password security, GDPR, ISO 27001,
                and incident response.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/training/ai-summary")}
            className="rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 px-6 py-3 font-bold text-black transition hover:scale-105"
          >
            Launch AI Assistant
          </button>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" />

          <h3 className="text-xl font-bold text-white">
            Today's Recommended Security Tasks
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Task text="Complete AI Generated Cyber Quiz." completed />

          <Task text="Watch Social Engineering Awareness Video." />

          <Task text="Finish Password Security Lab Exercise." />

          <Task text="Report Today's Phishing Simulation Email." />

          <Task text="Review Updated GDPR Security Policy." />

          <Task text="Earn 250 XP Daily Goal." completed />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TASK ITEM
============================================================ */

function Task({
  text,
  completed = false,
}: {
  text: string;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-800/50 p-4">
      {completed ? (
        <ShieldCheck className="text-emerald-400" size={20} />
      ) : (
        <div className="h-5 w-5 rounded-full border border-slate-500" />
      )}

      <span
        className={`text-sm ${
          completed
            ? "text-slate-300 line-through"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>
    </div>
  );
}