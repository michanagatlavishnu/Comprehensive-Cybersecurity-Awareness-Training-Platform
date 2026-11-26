import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Mail, ShieldAlert, XCircle } from "lucide-react";
import trainingService from "../../services/trainingService";
import { useTranslation } from "react-i18next";

type PhishingEmail = {
  id: string;
  tracking_token: string;
  subject: string;
  sender_name: string;
  sender_email: string;
  html_body: string;
  opened: boolean;
  reported: boolean;
  clicked: boolean;
  identified: boolean;
  identified_as_phishing: boolean | null;
  decision_correct: boolean | null;
  sent_at: string;
};

type SimulationSummary = {
  round: number;
  total: number;
  identified: number;
  correct: number;
  accuracy: number;
  completed: boolean;
};

export default function PhishingSimulatorPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [emails, setEmails] = useState<PhishingEmail[]>([]);
  const [selected, setSelected] = useState<PhishingEmail | null>(null);
  const [message, setMessage] = useState("");
  const [starting, setStarting] = useState(false);
  const [stats, setStats] = useState({ identified_count: 0, total_count: 0, correct_count: 0 });
  const [summaries, setSummaries] = useState<SimulationSummary[]>([]);
  const roundComplete = stats.total_count > 0 && stats.identified_count === stats.total_count;

  const load = async () => {
    const inbox = await trainingService.getPhishingInbox();
    setEmails(inbox);
    setStats({
      identified_count: inbox.filter((email: PhishingEmail) => email.identified).length,
      total_count: inbox.length,
      correct_count: inbox.filter((email: PhishingEmail) => email.decision_correct).length,
    });
    setSummaries(await trainingService.getPhishingSimulationSummary());
  };

  useEffect(() => {
    void load();
  }, []);

  const openEmail = async (email: PhishingEmail) => {
    await trainingService.openPhishingEmail(email.tracking_token);
    setMessage(
      email.identified
        ? email.decision_correct
          ? t("correctIdentification")
          : t("incorrectClassification")
        : "",
    );
    setSelected({ ...email, opened: true });
    setEmails((items) => items.map((item) => item.id === email.id ? { ...item, opened: true } : item));
  };

  const startSimulation = async () => {
    setStarting(true);
    try {
      const result = await trainingService.startPhishingSimulation();
      await load();
      setMessage(result.message || t("simulationStarted"));
    } catch {
      setMessage(t("simulationStartFailed"));
    } finally {
      setStarting(false);
    }
  };

  const report = async () => {
    if (!selected) return;
    await trainingService.reportPhishingEmail(selected.tracking_token);
    setSelected({ ...selected, reported: true });
    setMessage(t("reportedSuccessfully"));
    setEmails((items) => items.map((item) => item.id === selected.id ? { ...item, reported: true } : item));
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const decide = async (isPhishing: boolean) => {
    if (!selected || selected.identified) return;
    const result = await trainingService.decidePhishingEmail(
      selected.tracking_token,
      isPhishing,
    );
    const updated = {
      ...selected,
      identified: true,
      identified_as_phishing: isPhishing,
      decision_correct: result.correct,
    };
    setSelected(updated);
    setEmails((items) => items.map((item) => item.id === selected.id ? updated : item));
    setStats({
      identified_count: result.identified_count,
      total_count: result.total_count,
      correct_count: result.correct_count,
    });
    setSummaries(await trainingService.getPhishingSimulationSummary());
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    await queryClient.invalidateQueries({ queryKey: ["dashboard-weekly"] });
    await queryClient.invalidateQueries({ queryKey: ["dashboard-progress"] });
    setMessage(
      result.correct
        ? result.badge_unlocked?.length
          ? t("badgeUnlocked")
          : result.identified_count === result.total_count
            ? t("roundComplete")
            : t("correctIdentification")
          : t("incorrectClassification"),
    );
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-3xl border border-orange-400/20 bg-slate-900 p-8">
        <div className="flex flex-wrap items-center justify-between gap-5"><div className="flex items-center gap-4"><ShieldAlert className="text-orange-400" size={34} /><div><h1 className="text-3xl font-black">{t("phishingSimulator")}</h1><p className="mt-1 text-slate-400">{t("phishingIntro")}</p></div></div><button onClick={() => void startSimulation()} disabled={starting || (!roundComplete && emails.some((email) => !email.identified))} className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60">{starting ? t("starting") : roundComplete ? t("startNextRound") : t("simulationActive")}</button></div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="rounded-2xl border border-white/10 bg-slate-900 p-4">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">{t("simulationInbox")}</h2><span className="text-sm text-slate-400">{emails.length}</span></div>
          <div className="mb-4 rounded-xl bg-slate-950 p-3 text-xs text-slate-400">{t("identified")} {stats.identified_count}/{stats.total_count || emails.length} | {t("correct")} {stats.correct_count}</div>
          <div className="space-y-2">{emails.map((email) => <button key={email.id} onClick={() => void openEmail(email)} className={`w-full rounded-xl border p-4 text-left ${selected?.id === email.id ? "border-orange-400 bg-orange-400/10" : "border-white/10 bg-slate-950 hover:border-orange-400/50"}`}><div className="flex items-start gap-3">{email.identified ? <CheckCircle2 className="mt-1 text-emerald-400" size={18} /> : <Mail className="mt-1 text-orange-300" size={18} />}<div className="min-w-0"><p className="truncate font-semibold">{email.subject}</p><p className="truncate text-xs text-slate-500">{email.sender_name} &lt;{email.sender_email}&gt;</p>{email.reported && <p className="mt-2 text-xs text-emerald-300">{t("reported")}</p>}</div></div></button>)}{!emails.length && <p className="p-5 text-center text-slate-400">{t("noSimulations")}</p>}</div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          {selected ? <><div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-sm text-slate-400">{selected.sender_name} &lt;{selected.sender_email}&gt;</p><h2 className="mt-2 text-2xl font-bold">{selected.subject}</h2></div><AlertTriangle className="text-orange-400" /></div><div className="prose prose-invert mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: selected.html_body }} /><div className="mt-8 border-t border-white/10 pt-5"><p className="mb-3 text-sm font-semibold text-slate-300">{t("isPhishing")}</p><div className="flex flex-wrap gap-3"><button onClick={() => void decide(true)} disabled={selected.identified} className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white disabled:opacity-50"><ShieldAlert className="mr-2 inline" size={17} />{t("phishing")}</button><button onClick={() => void decide(false)} disabled={selected.identified} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"><XCircle className="mr-2 inline" size={17} />{t("legitimate")}</button><button onClick={() => void report()} disabled={!selected.identified || selected.reported} className="rounded-xl border border-orange-400 px-5 py-3 font-semibold text-orange-300 disabled:opacity-50"><CheckCircle2 className="mr-2 inline" size={17} />{selected.reported ? t("reported") : t("reportPhishing")}</button></div>{selected.identified && <p className={selected.decision_correct ? "mt-4 text-emerald-300" : "mt-4 text-red-300"}>{selected.decision_correct ? t("correctIdentification") : t("incorrectClassification")}</p>}{selected.identified && message && <span className="mt-3 block text-slate-300">{message}</span>}</div></> : <div className="flex min-h-96 items-center justify-center text-slate-400">{t("selectEmail")}</div>}
        </section>
      </div>
      <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{t("simulationProgress")}</h2>
            <p className="mt-1 text-sm text-slate-400">{t("compareAccuracy")}</p>
          </div>
          <span className="text-sm text-slate-400">{summaries.length} {t("rounds")}</span>
        </div>
        {summaries.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{summaries.map((summary) => <div key={summary.round} className="rounded-xl border border-white/10 bg-slate-950 p-4"><div className="flex items-center justify-between"><span className="font-semibold">{t("round")} {summary.round}</span><span className={summary.completed ? "text-emerald-300" : "text-amber-300"}>{summary.completed ? t("complete") : t("inProgress")}</span></div><p className="mt-3 text-2xl font-black text-cyan-300">{summary.accuracy}%</p><p className="text-xs text-slate-400">{summary.correct}/{summary.identified} {t("correct")}</p></div>)}</div> : <p className="text-slate-400">{t("startSimulationHistory")}</p>}
      </section>
    </main>
  );
}