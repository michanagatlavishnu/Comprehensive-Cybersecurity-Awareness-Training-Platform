import { ShieldCheck, LockKeyhole, FileCheck } from "lucide-react";

const standards = [
  {
    title: "ISO 27001",
    desc: "Information Security Management System compliance and organizational best practices.",
    icon: ShieldCheck,
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    title: "NIST SP 800-50",
    desc: "Cybersecurity awareness and training framework for organizations.",
    icon: LockKeyhole,
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    title: "GDPR",
    desc: "Privacy, user consent, and personal data protection compliance.",
    icon: FileCheck,
    color: "from-orange-500/20 to-orange-500/5",
  },
];

export default function StandardsSection() {
  return (
    <section id="standards" className="bg-[#050816] py-24">
      <div className="full-container">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[6px] text-emerald-400">
            Security Standards
          </p>

          <h2 className="text-5xl font-black">
            Built Around International Standards
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {standards.map((item) => (
            <div
              key={item.title}
              className={`glass rounded-3xl bg-gradient-to-br ${item.color} p-8`}
            >
              <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4">
                <item.icon size={34} className="text-emerald-400" />
              </div>

              <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>

              <p className="leading-7 text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}