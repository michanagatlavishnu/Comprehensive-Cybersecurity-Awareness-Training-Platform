import type { LucideIcon } from "lucide-react";

interface IncidentSummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color?: "red" | "orange" | "cyan" | "violet" | "green";
}

const colors = {
  red: "text-red-400 bg-red-500/10 border-red-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default function IncidentSummaryCard({
  icon: Icon,
  title,
  value,
  color = "cyan",
}: IncidentSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 hover:border-cyan-500/30 transition">
      <div
        className={`inline-flex rounded-xl border p-3 ${colors[color]}`}
      >
        <Icon size={22} />
      </div>

      <p className="mt-4 text-xs uppercase tracking-[2px] text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-bold text-white break-words">
        {value}
      </h3>
    </div>
  );
}