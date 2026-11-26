import { useMemo, useState } from "react";
import {
  ShieldAlert,
  BrainCircuit,
  MailWarning,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Download,
  Send,
  Copy,
  Loader2,
  Globe,
  Link2,
  Bug,
  TriangleAlert,
  BadgeCheck,
  Info,
} from "lucide-react";

import { useAnalyzePhishingEmail } from "../../hooks/useAI";
import ThreatScoreMeter from "./ThreatScoreMeter";
import EmailRiskCard from "./EmailRiskCard";

const SAMPLE_EMAIL = `From: security-update@micros0ft-support.com
Subject: Urgent Password Reset Required

Dear Employee,

We detected suspicious activity on your Microsoft 365 account.
Your password will expire within 30 minutes.

Please verify your account immediately using the secure link below.

https://micros0ft-support-login-verification.com/reset-password

Failure to verify may result in account suspension.

Regards,
Microsoft Security Team`;

const phishingIndicators = [
  "Urgency or time pressure",
  "Spoofed sender domain",
  "Credential harvesting links",
  "Unexpected password reset request",
  "Suspicious greeting",
  "Grammar or formatting inconsistencies",
  "Unknown attachments",
  "QR code phishing possibility",
];

export default function AIPhishingAnalyzerPage() {
  const [emailContent, setEmailContent] = useState(SAMPLE_EMAIL);
  const [copied, setCopied] = useState(false);

  const analyzeMutation = useAnalyzePhishingEmail();

  const analysis = analyzeMutation.data;

  const riskLevel = useMemo(() => {
    if (!analysis) return "Unknown";

    if (analysis.threat_score >= 85) return "Critical";
    if (analysis.threat_score >= 70) return "High";
    if (analysis.threat_score >= 40) return "Medium";

    return "Safe";
  }, [analysis]);

  const riskColor = useMemo(() => {
    switch (riskLevel) {
      case "Critical":
        return "text-red-400";

      case "High":
        return "text-orange-400";

      case "Medium":
        return "text-yellow-300";

      case "Safe":
        return "text-emerald-400";

      default:
        return "text-slate-400";
    }
  }, [riskLevel]);

  const analyzeEmail = () => {
    analyzeMutation.mutate({
      email_content: emailContent,
    });
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailContent);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero */}

        <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-3">
                <BrainCircuit className="text-cyan-400" size={30} />

                <p className="text-sm uppercase tracking-[3px] text-cyan-300">
                  CyberAware AI Security Engine
                </p>
              </div>

              <h1 className="text-5xl font-black leading-tight">
                AI Phishing Email Analyzer
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Paste any suspicious email. Groq AI analyzes phishing indicators,
                spoofed domains, malicious URLs, urgency tactics, credential
                harvesting attempts, and recommends the safest action.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                  GPT OSS 20B Powered
                </span>

                <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                  Threat Intelligence
                </span>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                  MITRE ATT&CK Mapping
                </span>
              </div>
            </div>

            <div className="rounded-full bg-cyan-500/10 p-8">
              <ShieldAlert className="text-cyan-300" size={90} />
            </div>
          </div>
        </section>

        {/* Input + Threat Meter */}

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          {/* Email Input */}

          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <MailWarning className="text-cyan-300" size={26} />

              <h2 className="text-2xl font-bold">
                Suspicious Email Content
              </h2>
            </div>

            <textarea
              rows={18}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste suspicious email content here..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950 p-5 text-slate-200 outline-none focus:border-cyan-400"
            />

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={analyzeEmail}
                disabled={analyzeMutation.isPending}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze Email
                  </>
                )}
              </button>

              <button
                onClick={() => setEmailContent(SAMPLE_EMAIL)}
                className="rounded-full bg-violet-500/10 px-5 py-3 text-violet-300 hover:bg-violet-500/20"
              >
                Load Sample Email
              </button>

              <button
                onClick={copyEmail}
                className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-5 py-3 text-cyan-300 hover:bg-cyan-500/20"
              >
                <Copy size={18} />
                {copied ? "Copied" : "Copy Email"}
              </button>
            </div>
          </div>

          {/* Threat Meter */}

          <div className="rounded-3xl border border-red-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <ShieldAlert className="text-red-400" size={26} />

              <h2 className="text-2xl font-bold">Threat Score</h2>
            </div>

            <ThreatScoreMeter score={analysis?.threat_score || 0} />

            <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-center">
              <p className="text-xs uppercase tracking-[2px] text-slate-400">
                Risk Level
              </p>

              <h3 className={`mt-3 text-4xl font-black ${riskColor}`}>
                {riskLevel}
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                AI confidence based on phishing indicators, malicious links,
                sender spoofing and language analysis.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <QuickScore label="Sender Authenticity" value={analysis?.sender_score ?? 0} />
              <QuickScore label="URL Reputation" value={analysis?.url_score ?? 0} />
              <QuickScore label="Language Risk" value={analysis?.language_score ?? 0} />
              <QuickScore label="Urgency Detection" value={analysis?.urgency_score ?? 0} />
            </div>
          </div>
        </section>

        {/* AI Explanation */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
          <div className="mb-5 flex items-center gap-3">
            <BrainCircuit className="text-cyan-300" size={28} />

            <h2 className="text-2xl font-bold">AI Security Explanation</h2>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 leading-8 text-slate-300">
            {analysis?.summary ||
              "Run AI analysis to receive a complete phishing explanation with identified attack techniques, suspicious URLs, spoofed domains, urgency tactics, and recommended employee actions."}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-cyan-500/10 px-5 py-2 text-cyan-300 hover:bg-cyan-500/20">
              Generate Executive Summary
            </button>

            <button className="rounded-full bg-violet-500/10 px-5 py-2 text-violet-300 hover:bg-violet-500/20">
              Explain Like Beginner
            </button>

            <button className="rounded-full bg-emerald-500/10 px-5 py-2 text-emerald-300 hover:bg-emerald-500/20">
              SOC Analyst View
            </button>
          </div>
        </section>

        {/* Detected Indicators */}

        <section className="mb-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-slate-900 to-orange-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="text-yellow-300" size={28} />

            <h2 className="text-2xl font-bold">Detected Phishing Indicators</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(analysis?.detected_indicators || phishingIndicators).map(
              (indicator: string) => (
                <div
                  key={indicator}
                  className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-4"
                >
                  <TriangleAlert className="text-yellow-300" size={20} />

                  <span>{indicator}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Highlighted Suspicious Text */}

        <section className="mb-8 rounded-3xl border border-red-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Bug className="text-red-400" size={28} />

            <h2 className="text-2xl font-bold">Suspicious Content Highlighting</h2>
          </div>

          <div className="space-y-4 rounded-2xl bg-slate-950 p-5">
            {(analysis?.highlighted_phrases || [
              "Urgent Password Reset Required",
              "within 30 minutes",
              "verify your account immediately",
              "account suspension",
              "micros0ft-support-login-verification.com",
            ]).map((phrase: string) => (
              <div
                key={phrase}
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
              >
                <div className="flex items-center gap-2">
                  <BadgeCheck className="text-red-400" size={18} />

                  <span className="font-semibold text-red-300">{phrase}</span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  AI flagged this phrase because it is commonly associated with phishing campaigns.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PART 2 CONTINUES BELOW */}




              {/* URL & DOMAIN ANALYSIS */}

        <section className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-orange-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Globe className="text-orange-300" size={26} />
              <h2 className="text-2xl font-bold">Sender Domain Analysis</h2>
            </div>

            <EmailRiskCard
              title="Sender Domain"
              value={
                analysis?.sender_domain ||
                "micros0ft-support.com"
              }
              risk="critical"
              description="AI detected look-alike domain impersonating Microsoft."
            />

            <EmailRiskCard
              title="Display Name"
              value={
                analysis?.display_name ||
                "Microsoft Security Team"
              }
              risk="medium"
              description="Display name appears legitimate but sender domain does not match Microsoft's official domain."
            />

            <EmailRiskCard
              title="SPF / DKIM / DMARC"
              value={
                analysis?.email_authentication ||
                "Authentication Failed"
              }
              risk="high"
              description="Sender authentication failed verification."
            />
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Link2 className="text-red-400" size={26} />
              <h2 className="text-2xl font-bold">URL Reputation Analysis</h2>
            </div>

            {(analysis?.urls || [
              {
                url: "https://micros0ft-support-login-verification.com/reset-password",
                reputation: "Malicious",
              },
            ]).map((url: any) => (
              <div
                key={url.url}
                className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4"
              >
                <p className="break-all text-sm text-red-300">{url.url}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[2px] text-slate-500">
                    Reputation
                  </span>

                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">
                    {url.reputation}
                  </span>
                </div>
              </div>
            ))}

            <div className="mt-5 rounded-xl bg-slate-950 p-4 text-sm text-slate-400">
              AI checks domain similarity, suspicious TLDs, shortened links, fake Microsoft login URLs, QR redirects, and credential harvesting pages.
            </div>
          </div>
        </section>

        {/* MITRE ATT&CK */}

        <section className="mb-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert className="text-violet-300" size={28} />

            <h2 className="text-2xl font-bold">MITRE ATT&CK Mapping</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {(analysis?.mitre_attack || [
              {
                id: "T1566.001",
                title: "Phishing — Spearphishing Attachment",
              },
              {
                id: "T1566.002",
                title: "Phishing — Spearphishing Link",
              },
              {
                id: "T1585.001",
                title: "Establish Accounts",
              },
              {
                id: "T1036",
                title: "Masquerading / Domain Spoofing",
              },
            ]).map((technique: any) => (
              <div
                key={technique.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[2px] text-violet-300">
                  {technique.id}
                </p>

                <h3 className="mt-2 font-semibold">
                  {technique.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ATTACK BREAKDOWN */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Info className="text-cyan-300" size={26} />

            <h2 className="text-2xl font-bold">
              AI Threat Breakdown
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Sender Risk",
                score: analysis?.sender_score ?? 94,
                color: "from-red-500 to-orange-500",
              },
              {
                title: "Language Risk",
                score: analysis?.language_score ?? 86,
                color: "from-yellow-400 to-orange-500",
              },
              {
                title: "URL Risk",
                score: analysis?.url_score ?? 98,
                color: "from-red-500 to-red-700",
              },
              {
                title: "Urgency Risk",
                score: analysis?.urgency_score ?? 90,
                color: "from-orange-400 to-red-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center"
              >
                <p className="text-xs uppercase tracking-[2px] text-slate-500">
                  {item.title}
                </p>

                <h3 className="mt-3 text-4xl font-black text-cyan-300">
                  {item.score}
                </h3>

                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECOMMENDED ACTIONS */}

        <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={28} />

            <h2 className="text-2xl font-bold">
              Recommended Employee Actions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(analysis?.recommendations || [
              "Do NOT click the link in the email.",
              "Report the email using CyberAware Incident Reporting.",
              "Delete the email after reporting.",
              "Verify password reset requests directly in Microsoft Portal.",
              "Notify Security Operations Center (SOC).",
              "Run endpoint malware scan if clicked.",
            ]).map((recommendation: string) => (
              <div
                key={recommendation}
                className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-4"
              >
                <CheckCircle2 className="text-emerald-400" size={20} />

                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY REPORT */}

        <section className="mb-8 rounded-3xl border border-red-500/20 bg-slate-900/70 p-7">
          <div className="mb-6 flex items-center gap-3">
            <FileWarning className="text-red-400" size={28} />

            <h2 className="text-2xl font-bold">
              AI Incident Report Preview
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 text-sm leading-8 text-slate-300">
            <p>
              <span className="font-medium">Threat Level:</span> {riskLevel}
            </p>

            <p>
              <span className="font-medium">Threat Score:</span>{" "}
              {analysis?.threat_score ?? 92}/100
            </p>

            <p>
              <span className="font-medium">Attack Category:</span> Credential Harvesting / Phishing
            </p>

            <p>
              <span className="font-medium">Primary Technique:</span> Spear Phishing with Malicious Link
            </p>

            <p>
              <span className="font-medium">Recommended Severity:</span> High
            </p>

            <p className="mt-4 text-slate-400">
              This report can be exported as PDF and submitted directly to CyberAware Security Center.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white">
              <Send size={18} />
              Report to Security Team
            </button>

            <button className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-cyan-300 hover:bg-cyan-500/20">
              <Download size={18} />
              Download Incident Report
            </button>

            <button className="rounded-full bg-violet-500/10 px-6 py-3 text-violet-300 hover:bg-violet-500/20">
              Export JSON
            </button>
          </div>
        </section>

        {/* SECURITY EDUCATION */}

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <BrainCircuit className="text-cyan-300" size={28} />

            <h2 className="text-2xl font-bold">
              AI Security Education
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Why this email is dangerous",
                text: "Attackers impersonate Microsoft and pressure employees into clicking malicious credential harvesting links.",
              },
              {
                title: "Spoofed Domain Detection",
                text: "The sender replaces the letter 'o' with the number '0' to imitate Microsoft.",
              },
              {
                title: "Urgency Tactics",
                text: "Time pressure is used to reduce critical thinking and increase click probability.",
              },
              {
                title: "Safe Response",
                text: "Never click links. Verify password reset requests directly through the official Microsoft portal.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <h3 className="font-semibold text-cyan-300">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER ACTIONS */}

        <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[3px] text-violet-300">
                CyberAware AI
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Analyze Another Suspicious Email
              </h2>

              <p className="mt-3 max-w-xl text-slate-400">
                Use AI to inspect sender reputation, malicious URLs, spoofing indicators, QR phishing attempts, credential harvesting tactics, and enterprise security recommendations.
              </p>
            </div>

            <button
              onClick={() => {
                setEmailContent("");
                analyzeMutation.reset();
              }}
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black"
            >
              Analyze New Email
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function QuickScore({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
