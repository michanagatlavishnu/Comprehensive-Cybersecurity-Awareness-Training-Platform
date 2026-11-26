import { Shield, BrainCircuit, Trophy, TrendingUp, AlertTriangle } from "lucide-react";

export default function AIDashboardWidgets() {
  const widgets = [
    { title: "Awareness Score", value: "91%", icon: Shield, color: "text-cyan-400" },
    { title: "Threats Blocked", value: "24", icon: AlertTriangle, color: "text-red-400" },
    { title: "AI XP Forecast", value: "+320 XP", icon: Trophy, color: "text-yellow-400" },
    { title: "Learning Progress", value: "78%", icon: TrendingUp, color: "text-emerald-400" },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
      {widgets.map((w) => (
        <div key={w.title} className="rounded-3xl bg-slate-900 border border-white/10 p-5">
          <w.icon className={`${w.color} mb-3`} size={28} />
          <p className="text-sm text-slate-400">{w.title}</p>
          <h2 className={`text-3xl font-black mt-2 ${w.color}`}>{w.value}</h2>
        </div>
      ))}

      <div className="md:col-span-2 xl:col-span-4 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-cyan-400" />
          <h2 className="text-xl font-bold">AI Insights</h2>
        </div>

        <ul className="space-y-3 text-slate-300">
          <li>• Employees are improving phishing detection by 18% this month.</li>
          <li>• Password security training completion reached 92%.</li>
          <li>• AI recommends Email Security Fundamentals as next priority.</li>
          <li>• Weekly phishing simulation performance improved by 12%.</li>
        </ul>
      </div>
    </div>
  );
}