import { motion } from "framer-motion";
import {
  MailWarning,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const emails = [
  {
    sender: "payroll@trinett-support.com",
    subject: "Immediate Payroll Verification Required",
    status: "Suspicious",
    danger: true,
  },
  {
    sender: "security@cyberaware.ai",
    subject: "Password Policy Update Available",
    status: "Safe",
    danger: false,
  },
  {
    sender: "admin@microsoft-security.co",
    subject: "Account Locked — Verify Now",
    status: "Phishing",
    danger: true,
  },
];

export default function PhishingPreviewSection() {
  return (
    <section className="py-28 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="uppercase tracking-[5px] text-red-400 text-sm font-semibold">
              Phishing Simulator
            </p>

            <h2 className="mt-5 text-5xl font-black text-white">
              Train Employees with AI Generated Phishing Campaigns
            </h2>

            <p className="mt-7 leading-8 text-slate-400">
              CyberAware automatically generates phishing emails, tracks opens,
              clicks, credential submissions, browser, device, IP address, and
              assigns retraining modules when employees fail simulations.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "AI-generated phishing emails.",
                "Open, click and credential tracking.",
                "Automatic XP penalties for failed simulations.",
                "Automatic retraining assignment.",
                "Department phishing analytics dashboard.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <ShieldAlert className="text-red-400" size={22} />

                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-7 backdrop-blur-xl shadow-[0_0_80px_rgba(239,68,68,.15)]"
          >
            <div className="mb-7 flex items-center gap-3">
              <MailWarning className="text-red-400" size={30} />

              <div>
                <h3 className="font-bold text-xl text-white">
                  Simulated Employee Inbox
                </h3>

                <p className="text-sm text-slate-400">
                  AI Phishing Campaign Preview
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.subject}
                  className={`rounded-2xl border p-5 ${
                    email.danger
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-emerald-500/30 bg-emerald-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{email.sender}</p>

                    {email.danger ? (
                      <AlertTriangle className="text-red-400" size={20} />
                    ) : (
                      <CheckCircle2 className="text-emerald-400" size={20} />
                    )}
                  </div>

                  <h4 className="mt-3 text-slate-200">{email.subject}</h4>

                  <div className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-white/10 text-slate-300">
                    {email.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-red-500/10 p-5 border border-red-500/30">
              <h4 className="font-bold text-red-300">
                AI Awareness Simulation Result
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Employee clicked a simulated phishing email. CyberAware deducted
                XP, reduced awareness score, assigned a phishing retraining
                module, and notified the Admin automatically.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}