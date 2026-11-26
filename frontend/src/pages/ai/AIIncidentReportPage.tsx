import { useMemo, useState } from "react";
import {
  FileWarning,
  ShieldAlert,
  BrainCircuit,
  Sparkles,
  Send,
  Download,
  Copy,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Clock3,
  Building2,
  User,
  Globe,
  MailWarning,
  Bug,
  FileText,
} from "lucide-react";

import { useGenerateIncidentReport } from "../../hooks/useAI";
import IncidentSummaryCard from "./IncidentSummaryCard";

const SAMPLE_INCIDENT = `Employee received an email pretending to be Microsoft Security Team asking to reset the password within 30 minutes. The email contained a suspicious URL: https://micros0ft-support-login-verification.com/reset-password. Employee clicked the link but did not submit credentials and immediately reported the incident.`;

const severityOptions = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const categoryOptions = [
  "Phishing Email",
  "QR Phishing",
  "Business Email Compromise",
  "Credential Theft",
  "Malware",
  "Social Engineering",
  "Ransomware",
];

export default function AIIncidentReportPage() {
  const [incidentText, setIncidentText] = useState(SAMPLE_INCIDENT);
  const [severity, setSeverity] = useState("High");
  const [category, setCategory] = useState("Phishing Email");
  const [location, setLocation] = useState("TriNet Corporate Network");
  const [reporter, setReporter] = useState("Employee");
  const [copied, setCopied] = useState(false);

  const reportMutation = useGenerateIncidentReport();

  const report = reportMutation.data;

  const reportStatus = useMemo(() => {
    if (!report) return "Draft";
    return "Generated";
  }, [report]);

  const generateReport = () => {
    reportMutation.mutate({
      incident: incidentText,
      severity,
      category,
      location,
      reporter,
    });
  };

  const copyReport = async () => {
    if (!report?.executive_summary) return;

    await navigator.clipboard.writeText(report.executive_summary);

    setCopied(true);

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* HERO */}

        <section className="mb-10 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-slate-900 to-orange-500/10 p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-3">
                <FileWarning className="text-red-400" size={30} />

                <p className="text-sm uppercase tracking-[3px] text-red-300">
                  CyberAware AI Incident Center
                </p>
              </div>

              <h1 className="text-5xl font-black">
                AI Incident Report Generator
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Convert employee incident descriptions into professional
                SOC-style incident reports with executive summary,
                timeline, impact assessment, IOC extraction,
                MITRE ATT&CK mapping, containment steps,
                remediation plan, and PDF-ready formatting.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300">
                  SOC Report
                </span>

                <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                  Executive Summary
                </span>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                  IOC Extraction
                </span>
              </div>
            </div>

            <div className="rounded-full bg-red-500/10 p-8">
              <ShieldAlert className="text-red-300" size={90} />
            </div>
          </div>
        </section>

        {/* INCIDENT FORM */}

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          {/* LEFT */}

          <div className="rounded-3xl border border-red-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Bug className="text-red-300" size={24} />

              <h2 className="text-2xl font-bold">
                Describe Security Incident
              </h2>
            </div>

            <textarea
              rows={16}
              value={incidentText}
              onChange={(e) => setIncidentText(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 p-5 text-slate-200 outline-none focus:border-red-400"
            />

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={generateReport}
                disabled={reportMutation.isPending}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white"
              >
                {reportMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    AI Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate AI Report
                  </>
                )}
              </button>

              <button
                onClick={() => setIncidentText(SAMPLE_INCIDENT)}
                className="rounded-full bg-violet-500/10 px-5 py-3 text-violet-300 hover:bg-violet-500/20"
              >
                Load Sample
              </button>

              <button
                onClick={() => setIncidentText("")}
                className="rounded-full bg-slate-800 px-5 py-3 hover:bg-slate-700"
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="rounded-3xl border border-orange-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-orange-300" size={24} />

              <h2 className="text-xl font-bold">
                Incident Metadata
              </h2>
            </div>

            {/* Severity */}

            <label className="mb-2 block text-sm text-slate-400">
              Severity
            </label>

            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="mb-5 w-full rounded-xl border border-white/10 bg-slate-950 p-3"
            >
              {severityOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-slate-900"
                >
                  {option}
                </option>
              ))}
            </select>

            {/* Category */}

            <label className="mb-2 block text-sm text-slate-400">
              Incident Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-5 w-full rounded-xl border border-white/10 bg-slate-950 p-3"
            >
              {categoryOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-slate-900"
                >
                  {option}
                </option>
              ))}
            </select>

            {/* Reporter */}

            <label className="mb-2 block text-sm text-slate-400">
              Reporter
            </label>

            <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-3">
              <User size={18} className="text-cyan-300" />

              <input
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* Location */}

            <label className="mb-2 block text-sm text-slate-400">
              Location
            </label>

            <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-3">
              <Building2 size={18} className="text-cyan-300" />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* STATUS */}

            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-xs uppercase tracking-[2px] text-slate-500">
                Report Status
              </p>

              <h3 className="mt-3 text-3xl font-black text-orange-300">
                {reportStatus}
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                AI automatically formats the incident according to enterprise SOC reporting standards.
              </p>
            </div>
          </div>
        </section>

        {/* EXECUTIVE SUMMARY */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
          <div className="mb-5 flex items-center gap-3">
            <BrainCircuit className="text-cyan-300" size={26} />

            <h2 className="text-2xl font-bold">
              AI Executive Summary
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 text-slate-300 leading-8">
            {report?.executive_summary ||
              "AI will generate an executive summary describing the incident, severity, impact, affected assets, and recommended response actions."}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={copyReport}
              className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-5 py-3 text-cyan-300 hover:bg-cyan-500/20"
            >
              <Copy size={18} />
              {copied ? "Copied" : "Copy Summary"}
            </button>

            <button className="rounded-full bg-violet-500/10 px-5 py-3 text-violet-300 hover:bg-violet-500/20">
              Rewrite Summary
            </button>

            <button className="rounded-full bg-emerald-500/10 px-5 py-3 text-emerald-300 hover:bg-emerald-500/20">
              Executive Version
            </button>
          </div>
        </section>

        {/* INCIDENT DETAILS */}

        <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <IncidentSummaryCard
            icon={Clock3}
            title="Reported Time"
            value={report?.reported_time || "17 Sept 2026 • 10:45 AM"}
            color="cyan"
          />

          <IncidentSummaryCard
            icon={AlertTriangle}
            title="Severity"
            value={report?.severity || severity}
            color="orange"
          />

          <IncidentSummaryCard
            icon={Building2}
            title="Affected Department"
            value={report?.department || "Corporate IT"}
            color="violet"
          />

          <IncidentSummaryCard
            icon={ShieldAlert}
            title="Threat Category"
            value={report?.category || category}
            color="red"
          />
        </section>

        {/* IOC EXTRACTION */}

        <section className="mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-slate-900 to-orange-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <MailWarning className="text-red-300" size={28} />

            <h2 className="text-2xl font-bold">
              Indicators of Compromise (IOC)
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {(report?.ioc || [
              {
                label: "Malicious Domain",
                value: "micros0ft-support-login-verification.com",
              },
              {
                label: "Sender Email",
                value: "security-update@micros0ft-support.com",
              },
              {
                label: "Suspicious URL",
                value: "https://micros0ft-support-login-verification.com/reset-password",
              },
              {
                label: "Attack Type",
                value: "Credential Harvesting",
              },
            ]).map((ioc: any) => (
              <div
                key={ioc.label}
                className="rounded-2xl border border-red-500/20 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[2px] text-red-300">
                  {ioc.label}
                </p>

                <p className="mt-3 break-all text-sm text-slate-300">
                  {ioc.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PART 2 CONTINUES BELOW */}
              {/* ================= INCIDENT TIMELINE ================= */}

        <section className="mb-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-slate-900 to-cyan-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Clock3 className="text-violet-300" size={28} />
            <h2 className="text-2xl font-bold">AI Incident Timeline</h2>
          </div>

          <div className="space-y-6">
            {(report?.timeline || [
              { time: "10:30 AM", event: "Suspicious phishing email received by employee." },
              { time: "10:32 AM", event: "Employee opened the email." },
              { time: "10:34 AM", event: "Clicked suspicious password reset URL." },
              { time: "10:35 AM", event: "No credentials submitted." },
              { time: "10:37 AM", event: "Incident reported to CyberAware Security Center." },
              { time: "10:45 AM", event: "SOC initiated phishing investigation." },
            ]).map((step: any, index: number) => (
              <div key={index} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="h-5 w-5 rounded-full bg-violet-400" />
                  {index !== 5 && (
                    <div className="mt-2 h-full w-[2px] bg-violet-500/30" />
                  )}
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[2px] text-violet-300">
                    {step.time}
                  </p>

                  <p className="mt-2 text-slate-300">{step.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= IMPACT ASSESSMENT ================= */}

        <section className="mb-8 rounded-3xl border border-orange-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert className="text-orange-400" size={28} />
            <h2 className="text-2xl font-bold">Impact Assessment</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Business Impact",
                value: report?.impact?.business || "Medium",
                color: "text-orange-300",
              },
              {
                title: "Affected Users",
                value: report?.impact?.users || "1 Employee",
                color: "text-cyan-300",
              },
              {
                title: "Affected Assets",
                value: report?.impact?.assets || "Microsoft 365 Account",
                color: "text-violet-300",
              },
              {
                title: "Data Exposure",
                value: report?.impact?.data || "No Credentials Submitted",
                color: "text-emerald-300",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center"
              >
                <p className="text-xs uppercase tracking-[2px] text-slate-500">
                  {card.title}
                </p>

                <h3 className={`mt-3 text-lg font-bold ${card.color}`}>
                  {card.value}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-5">
            <h3 className="mb-3 font-semibold text-orange-300">
              AI Impact Summary
            </h3>

            <p className="leading-8 text-slate-300">
              {report?.impact_summary ||
                "The phishing email attempted credential harvesting by impersonating Microsoft Security. The employee clicked the malicious URL but did not submit credentials, significantly reducing potential account compromise. Immediate reporting enabled early containment."}
            </p>
          </div>
        </section>

        {/* ================= MITRE ATT&CK ================= */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <BrainCircuit className="text-cyan-300" size={28} />
            <h2 className="text-2xl font-bold">MITRE ATT&CK Mapping</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {(report?.mitre_attack || [
              {
                id: "T1566.002",
                title: "Phishing — Spearphishing Link",
              },
              {
                id: "T1036",
                title: "Masquerading",
              },
              {
                id: "T1585.001",
                title: "Establish Accounts",
              },
              {
                id: "T1204.001",
                title: "User Execution — Malicious Link",
              },
            ]).map((technique: any) => (
              <div
                key={technique.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[2px] text-cyan-300">
                  {technique.id}
                </p>

                <h3 className="mt-2 font-semibold">{technique.title}</h3>

                <p className="mt-3 text-sm text-slate-400">
                  AI mapped this incident to MITRE ATT&CK techniques used by phishing campaigns targeting enterprise identities.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTAINMENT ACTIONS ================= */}

        <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={28} />
            <h2 className="text-2xl font-bold">Containment Actions</h2>
          </div>

          <div className="space-y-4">
            {(report?.containment_steps || [
              "Isolate affected workstation from corporate network if credentials were submitted.",
              "Block malicious domain using email gateway.",
              "Reset affected Microsoft account password.",
              "Force MFA reauthentication.",
              "Invalidate active sessions.",
              "Notify SOC and Email Security Team.",
              "Scan endpoint for malware.",
            ]).map((step: string) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-4"
              >
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= REMEDIATION PLAN ================= */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert className="text-cyan-300" size={28} />
            <h2 className="text-2xl font-bold">Remediation Plan</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Immediate Response",
                text: "Disable malicious links, block sender, notify SOC, preserve email evidence.",
              },
              {
                title: "Short-Term Actions",
                text: "Reset passwords, enforce MFA, investigate mailbox rules and sign-in logs.",
              },
              {
                title: "Long-Term Prevention",
                text: "Conduct phishing awareness training, enable DMARC enforcement, strengthen email gateway filtering.",
              },
              {
                title: "Security Improvements",
                text: "Monitor look-alike domains, deploy URL sandboxing, enable Safe Links and Safe Attachments.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-800/60 p-5"
              >
                <h3 className="font-semibold text-cyan-300">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ROOT CAUSE ANALYSIS ================= */}

        <section className="mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-slate-900 to-orange-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Bug className="text-red-400" size={28} />
            <h2 className="text-2xl font-bold">AI Root Cause Analysis</h2>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6">
            <p className="leading-8 text-slate-300">
              {report?.root_cause ||
                "The attacker impersonated Microsoft Security using a look-alike domain ('micros0ft') and created urgency by claiming password expiration within 30 minutes. The email attempted credential harvesting through a fake Microsoft login page."}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Look-alike Domain",
              "Credential Harvesting",
              "Urgency Language",
              "Microsoft Brand Impersonation",
            ].map((cause) => (
              <div
                key={cause}
                className="rounded-xl bg-red-500/10 p-4 text-center text-red-300"
              >
                {cause}
              </div>
            ))}
          </div>
        </section>

        {/* ================= AI REPORT QUALITY ================= */}

        <section className="mb-8 rounded-3xl border border-violet-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-violet-300" size={28} />
            <h2 className="text-2xl font-bold">AI Report Quality Metrics</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Threat Confidence",
                value: report?.confidence || "98%",
              },
              {
                label: "IOC Extraction Accuracy",
                value: "97%",
              },
              {
                label: "MITRE Mapping Confidence",
                value: "95%",
              },
              {
                label: "Executive Summary Quality",
                value: "99%",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center"
              >
                <p className="text-xs uppercase tracking-[2px] text-slate-500">
                  {metric.label}
                </p>

                <h3 className="mt-3 text-3xl font-black text-violet-300">
                  {metric.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ================= EXPORT REPORT ================= */}

        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[3px] text-cyan-300">
                CyberAware Security Center
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Export Professional Incident Report
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                AI formats this report into an enterprise-ready document containing executive summary, IOC table, MITRE mapping, impact analysis, remediation actions, and SOC recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white">
                <Send size={18} />
                Submit to SOC
              </button>

              <button className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-cyan-300 hover:bg-cyan-500/20">
                <Download size={18} />
                Download PDF
              </button>

              <button className="flex items-center gap-2 rounded-full bg-violet-500/10 px-6 py-3 text-violet-300 hover:bg-violet-500/20">
                <FileText size={18} />
                Export JSON
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}