import { useState } from "react";

export default function AdminSettingsPage() {
  const [requireMfa, setRequireMfa] = useState(true);
  const [simulationAlerts, setSimulationAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("cyberaware-admin-settings", JSON.stringify({ requireMfa, simulationAlerts }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return <div className="max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold text-white">Admin Settings</h1><p className="mt-1 text-slate-400">Control organization security defaults and simulator alerts.</p></div><section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"><Setting label="Require MFA for employees" description="Show MFA as an organization security requirement." value={requireMfa} onChange={setRequireMfa} /><Setting label="Phishing simulation alerts" description="Notify employees when a new simulation round starts." value={simulationAlerts} onChange={setSimulationAlerts} /><button onClick={save} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950">Save Settings</button>{saved && <span className="ml-3 text-emerald-300">Settings saved.</span>}</section></div>;
}

function Setting({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center justify-between gap-5 border-b border-slate-800 pb-5"><span><span className="block font-semibold text-white">{label}</span><span className="mt-1 block text-sm text-slate-400">{description}</span></span><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-emerald-400" /></label>; }
