import { useEffect, useState, type FormEvent } from "react";
import api from "../../../services/api";

type EmployeeReport = { employee_id: string; employee_name: string; employee_email: string; identified: number; correct: number; accuracy: number; reported: number; clicked: number; credentials_submitted: number };
type Campaign = { id?: string; title?: string; campaign?: string; status: string; sent?: number; created_at?: string; targets?: number; opened?: number; reported?: number; clicked?: number; credentials_submitted?: number; report_rate?: number; employee_reports?: EmployeeReport[] };

const downloadReport = (campaigns: Campaign[]) => {
  const header = "Campaign,Status,Targets,Opened,Clicked,Reported,Report Rate";
  const rows = campaigns.map((campaign) => [campaign.campaign || campaign.title || "Campaign", campaign.status, campaign.targets ?? 0, (campaign as any).opened ?? 0, campaign.clicked ?? 0, campaign.reported ?? 0, `${campaign.report_rate ?? 0}%`].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = "cyberaware-phishing-campaign-report.csv"; link.click(); URL.revokeObjectURL(url);
};

export default function AdminPhishingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await api.get("/admin/phishing/analytics");
    setCampaigns(response.data.data || []);
  };
  useEffect(() => { void load(); }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const response = await api.post("/admin/phishing/campaigns", { campaign_name: name, topic, department: "All", template_name: "gmail", language: "en" });
    setMessage(`Campaign ${response.data.data.title || name} created.`);
    setName(""); setTopic(""); await load();
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-white">Phishing Campaigns</h1><p className="mt-1 text-slate-400">Create campaigns and monitor employee response rates.</p></div><button onClick={() => downloadReport(campaigns)} disabled={!campaigns.length} className="rounded-xl border border-cyan-400 px-4 py-3 text-cyan-300 disabled:opacity-40">Download Full Report</button></div>
    <form onSubmit={create} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[1fr_1fr_auto]"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Campaign name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" /><input required value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Simulation topic" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" /><button className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-slate-950">Create Campaign</button></form>
    {message && <p className="text-emerald-300">{message}</p>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{campaigns.map((campaign, index) => <div key={campaign.id || index} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-semibold text-white">{campaign.campaign || campaign.title || "Campaign"}</h2><span className="text-xs text-emerald-300">{campaign.status || "reported"}</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-center text-sm"><Metric label="Targets" value={campaign.targets ?? 0} /><Metric label="Opened" value={campaign.opened ?? 0} /><Metric label="Clicked" value={campaign.clicked ?? 0} /><Metric label="Reported" value={`${campaign.report_rate ?? 0}%`} /><Metric label="Credentials" value={campaign.credentials_submitted ?? 0} /></div>{campaign.employee_reports?.length ? <div className="mt-5 border-t border-slate-800 pt-4"><h3 className="mb-3 text-sm font-semibold text-slate-300">Employee Reports</h3><div className="space-y-2">{campaign.employee_reports.map((report) => <div key={report.employee_id} className="rounded-xl bg-slate-950 p-3 text-xs"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-white">{report.employee_name}</p><p className="text-slate-500">{report.employee_email}</p></div><span className="text-cyan-300">{report.accuracy}%</span></div><p className="mt-2 text-slate-400">{report.correct}/{report.identified} correct · {report.reported} reported · {report.clicked} clicked</p></div>)}</div></div> : null}</div>)}</div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-lg bg-slate-950 p-2"><p className="font-bold text-cyan-300">{value}</p><p className="text-xs text-slate-500">{label}</p></div>; }
