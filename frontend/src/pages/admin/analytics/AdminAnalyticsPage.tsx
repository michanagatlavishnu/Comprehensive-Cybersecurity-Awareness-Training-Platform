import { useEffect, useState, type ReactNode } from "react";
import api from "../../../services/api";

type Trend = { day?: string; new_users?: number; completed_modules?: number; quizzes?: number };
type Campaign = { campaign: string; targets: number; opened: number; clicked: number; reported: number; open_rate: number; click_rate: number; report_rate: number; risk_score?: number; risk_level?: string; identified?: number; correct_identifications?: number };

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/admin/analytics/overview"),
      api.get("/admin/analytics/pass-rate"),
      api.get("/admin/dashboard/awareness-distribution"),
      api.get("/admin/dashboard/departments"),
      api.get("/admin/dashboard/security-metrics"),
      api.get("/admin/dashboard/weekly-trend"),
      api.get("/admin/phishing/analytics"),
    ]).then(([overview, passRate, awareness, departments, security, trend, campaigns]) => {
      setData({ overview: overview.data.data || {}, passRate: passRate.data.data || {}, awareness: awareness.data.data || [], departments: departments.data.data || [], security: security.data.data || {}, trend: trend.data.data || [], campaigns: campaigns.data.data || [] });
    }).catch(() => setError("Analytics data could not be loaded. Check the admin API and try again.")).finally(() => setLoading(false));
  }, []);

  const overview = data.overview || {};
  const security = data.security || {};
  const download = () => {
    const rows = (data.campaigns || []).map((item: Campaign) => [item.campaign, item.targets, item.opened, item.clicked, item.reported, item.open_rate, item.click_rate, item.report_rate].join(","));
    const blob = new Blob([["Campaign,Targets,Opened,Clicked,Reported,Open Rate,Click Rate,Report Rate", ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "cyberaware-analytics.csv"; link.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center text-slate-400">Loading organization analytics...</div>;
  if (error) return <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-red-200">{error}</div>;

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[3px] text-emerald-400">Admin intelligence</p><h1 className="mt-2 text-3xl font-bold text-white">Analytics Overview</h1><p className="mt-1 text-slate-400">A live view of awareness, learning, quiz performance, and phishing risk.</p></div><button onClick={download} className="rounded-xl border border-cyan-400 px-4 py-3 text-cyan-300 hover:bg-cyan-400/10">Download Analytics CSV</button></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Active users" value={overview.total_users ?? 0} detail={`${security.quizzes_completed ?? 0} quizzes completed`} tone="cyan" /><Metric label="Average quiz score" value={`${overview.average_score ?? 0}%`} detail={`${overview.total_attempts ?? 0} attempts`} tone="violet" /><Metric label="Quiz pass rate" value={`${data.passRate?.percentage ?? overview.pass_rate ?? 0}%`} detail={`${data.passRate?.passed ?? 0} passed`} tone="emerald" /><Metric label="Certificates" value={security.certificates_generated ?? 0} detail={`${security.modules_completed ?? 0} modules completed`} tone="orange" /></div>
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <Panel title="Weekly activity trend" subtitle="New users, completed modules, and quizzes"><TrendChart items={data.trend || []} /></Panel>
      <Panel title="Quiz outcomes" subtitle="Organization pass versus fail"><PassChart passed={data.passRate?.passed || 0} failed={data.passRate?.failed || 0} percentage={data.passRate?.percentage || 0} /></Panel>
    </div>
    <div className="grid gap-6 xl:grid-cols-2"><Panel title="Awareness distribution" subtitle="Employees grouped by awareness score"><AwarenessChart items={data.awareness || []} /></Panel><Panel title="Department performance" subtitle="Average department awareness"><DepartmentChart items={data.departments || []} /></Panel></div>
    <Panel title="Phishing campaign performance" subtitle="Employee response metrics across campaigns"><CampaignTable campaigns={data.campaigns || []} /></Panel>
  </div>;
}

function Metric({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: string }) { const styles: Record<string, string> = { cyan: "border-cyan-500/20 text-cyan-300", violet: "border-violet-500/20 text-violet-300", emerald: "border-emerald-500/20 text-emerald-300", orange: "border-orange-500/20 text-orange-300" }; return <div className={`rounded-2xl border bg-slate-900 p-5 ${styles[tone] || styles.cyan}`}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p><p className="mt-2 text-xs">{detail}</p></div>; }
function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="mb-5"><h2 className="text-lg font-semibold text-white">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{children}</section>; }
function TrendChart({ items }: { items: Trend[] }) { const max = Math.max(1, ...items.flatMap((item) => [item.new_users || 0, item.completed_modules || 0, item.quizzes || 0])); return <div><div className="flex h-56 items-end gap-2 border-b border-l border-slate-700 px-3">{items.map((item, index) => <div key={item.day || index} className="flex h-full flex-1 items-end justify-center gap-1"><Bar value={item.new_users || 0} max={max} color="bg-cyan-400" label={`New users: ${item.new_users || 0}`} /><Bar value={item.completed_modules || 0} max={max} color="bg-emerald-400" label={`Modules: ${item.completed_modules || 0}`} /><Bar value={item.quizzes || 0} max={max} color="bg-violet-400" label={`Quizzes: ${item.quizzes || 0}`} /></div>)}</div><div className="mt-3 flex justify-between text-xs text-slate-500">{items.map((item, index) => <span key={item.day || index}>{item.day || "-"}</span>)}</div><div className="mt-4 flex gap-4 text-xs text-slate-400"><Legend color="bg-cyan-400" label="New users" /><Legend color="bg-emerald-400" label="Modules" /><Legend color="bg-violet-400" label="Quizzes" /></div></div>; }
function Bar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) { return <div className={`relative w-full max-w-5 rounded-t ${color}`} style={{ height: `${value ? Math.max(5, value / max * 100) : 1}%` }} title={label}><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400 group-hover:block">{value || "0"}</span></div>; }
function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><i className={`h-2 w-2 rounded-full ${color}`} />{label}</span>; }
function PassChart({ passed, failed, percentage }: { passed: number; failed: number; percentage: number }) { return <div className="flex items-center justify-center gap-8 py-8"><div className="relative h-36 w-36 rounded-full" style={{ background: `conic-gradient(#34d399 ${percentage}%, #334155 0)` }}><div className="absolute inset-5 flex items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">{percentage}%</div></div><div className="space-y-3 text-sm"><Legend color="bg-emerald-400" label={`${passed} passed`} /><Legend color="bg-slate-600" label={`${failed} failed`} /></div></div>; }
function AwarenessChart({ items }: { items: any[] }) { const max = Math.max(1, ...items.map((item) => item.users || 0)); return <div className="space-y-4">{items.map((item) => <div key={item.range} className="flex items-center gap-3 text-sm"><span className="w-16 text-slate-400">{item.range}</span><div className="h-4 flex-1 rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${item.users / max * 100}%` }} /></div><span className="w-8 text-right font-semibold text-white">{item.users}</span></div>)}</div>; }
function DepartmentChart({ items }: { items: any[] }) { return <div className="space-y-3">{items.map((item, index) => { const value = item.average_awareness_score ?? item.average_awareness ?? item.awareness_score ?? 0; return <div key={item.department || item.name || index}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-300">{item.department || item.name || "Department"}</span><span className="text-cyan-300">{value}%</span></div><div className="h-3 rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, value)}%` }} /></div></div>; })}</div>; }
function CampaignTable({ campaigns }: { campaigns: Campaign[] }) { return <div className="overflow-x-auto"><table className="w-full min-w-175 text-left text-sm"><thead className="border-b border-slate-800 text-slate-500"><tr><th className="p-3">Campaign</th><th className="p-3">Targets</th><th className="p-3">Opened</th><th className="p-3">Clicked</th><th className="p-3">Reported</th><th className="p-3">Identified</th><th className="p-3">Risk</th></tr></thead><tbody>{campaigns.map((item, index) => <tr key={item.campaign || index} className="border-b border-slate-800/70"><td className="p-3 font-medium text-white">{item.campaign}</td><td className="p-3 text-slate-300">{item.targets}</td><td className="p-3 text-slate-300">{item.opened} <span className="text-xs text-slate-500">({item.open_rate}%)</span></td><td className="p-3 text-orange-300">{item.clicked} <span className="text-xs">({item.click_rate}%)</span></td><td className="p-3 text-emerald-300">{item.reported} <span className="text-xs">({item.report_rate}%)</span></td><td className="p-3 text-cyan-300">{item.correct_identifications ?? 0}/{item.identified ?? 0}</td><td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-slate-800"><div className={`h-full rounded-full ${item.risk_level === "High" ? "bg-red-400" : item.risk_level === "Medium" ? "bg-orange-400" : "bg-emerald-400"}`} style={{ width: `${Math.max(4, item.risk_score ?? 0)}%` }} /></div><span className="text-xs text-slate-400">{item.risk_score ?? 0}%</span></div></td></tr>)}</tbody></table>{!campaigns.length && <p className="p-5 text-center text-slate-500">No campaign analytics yet.</p>}</div>; }
