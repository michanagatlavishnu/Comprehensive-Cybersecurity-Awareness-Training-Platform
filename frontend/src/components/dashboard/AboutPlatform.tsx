import {
  ShieldCheck,
  BrainCircuit,
  MailWarning,
  Languages,
  BarChart3,
  FileBadge,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "20+ Security Training Modules",
    desc: "Interactive lessons covering phishing, passwords, malware, ransomware, email security, network security and organizational policies.",
  },
  {
    icon: BrainCircuit,
    title: "Groq AI Powered Learning",
    desc: "AI generates quizzes, summaries, explanations, phishing emails and personalized recommendations.",
  },
  {
    icon: MailWarning,
    title: "Real Phishing Simulation",
    desc: "Employees receive simulated phishing emails and awareness reports based on their actions.",
  },
  {
    icon: Languages,
    title: "English • Hindi • Telugu",
    desc: "Switch the complete platform instantly without refreshing the application.",
  },
  {
    icon: BarChart3,
    title: "Live Awareness Analytics",
    desc: "Track training completion, phishing score, awareness score and compliance reports.",
  },
  {
    icon: FileBadge,
    title: "Verified Certificates",
    desc: "Automatically generated certificates with QR verification after passing modules.",
  },
];

export default function AboutPlatform() {
  return (
    <section className="bg-[#050816] py-28">
      <div className="full-container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[6px] text-emerald-400">
            About CyberAware
          </p>

          <h2 className="text-5xl font-black">
            Enterprise Cybersecurity Awareness Platform
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            CyberAware combines AI-powered learning, phishing simulations,
            multilingual training, policy compliance, analytics, certificates and
            gamification into a single enterprise security awareness platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="glass rounded-[28px] p-8 transition duration-300 hover:-translate-y-2 hover:border-emerald-400/30"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4">
                <item.icon size={30} className="text-emerald-400" />
              </div>

              <h3 className="mb-4 text-xl font-bold">{item.title}</h3>

              <p className="text-sm leading-7 text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="glass rounded-[32px] p-8">
            <p className="mb-3 text-sm uppercase tracking-[5px] text-violet-400">
              Learning Path
            </p>

            <h3 className="mb-6 text-3xl font-black">
              Complete Security Awareness Journey
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Phishing Awareness",
                "Password Security",
                "Social Engineering",
                "Incident Reporting",
                "Email Security",
                "Safe Browsing",
                "Data Privacy & GDPR",
                "ISO 27001 Policies",
                "Mobile Device Security",
                "Cloud Security Basics",
              ].map((module) => (
                <div
                  key={module}
                  className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-slate-300"
                >
                  {module}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[32px] p-8">
            <p className="mb-3 text-sm uppercase tracking-[5px] text-emerald-400">
              Security Score
            </p>

            <div className="mb-6 flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-[10px] border-emerald-400/20">
                <div className="text-center">
                  <h2 className="text-5xl font-black text-emerald-400">94%</h2>
                  <p className="mt-2 text-sm text-slate-400">Awareness Score</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {[
                ["Training Completed", "18 / 20"],
                ["Quiz Average", "92%"],
                ["Phishing Detection", "96%"],
                ["Policy Compliance", "89%"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-emerald-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}