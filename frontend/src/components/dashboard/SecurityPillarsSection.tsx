import {
  ShieldCheck,
  LockKeyhole,
  UserCheck,
  Cloud,
  Database,
  Eye,
} from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Security Awareness",
    desc: "Interactive learning modules with AI-generated explanations and quizzes.",
  },
  {
    icon: LockKeyhole,
    title: "Identity Protection",
    desc: "Password security, MFA, account protection and authentication awareness.",
  },
  {
    icon: UserCheck,
    title: "Social Engineering Defense",
    desc: "QR phishing, fake IT support, USB attacks and impersonation simulations.",
  },
  {
    icon: Cloud,
    title: "Cloud & Device Security",
    desc: "Secure browsing, cloud storage protection and endpoint awareness.",
  },
  {
    icon: Database,
    title: "Data Privacy & GDPR",
    desc: "PII handling, privacy compliance and organizational policies.",
  },
  {
    icon: Eye,
    title: "Continuous Monitoring",
    desc: "Real-time awareness score, phishing tracking and compliance analytics.",
  },
];

export default function SecurityPillarsSection() {
  return (
    <section className="bg-[#040712] py-28">
      <div className="full-container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[6px] text-emerald-400">
            Security Pillars
          </p>

          <h2 className="text-5xl font-black">
            Six Core Areas Every Employee Learns
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="glass rounded-[28px] p-8 hover:border-emerald-400/30 transition"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4">
                <pillar.icon className="text-emerald-400" size={32} />
              </div>

              <h3 className="mb-4 text-2xl font-bold">{pillar.title}</h3>

              <p className="leading-7 text-slate-400">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}