import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Fingerprint,
  Globe2,
  BadgeCheck,
  Cloud,
} from "lucide-react";

const standards = [
  {
    title: "ISO 27001",
    icon: ShieldCheck,
    color: "text-emerald-400",
  },
  {
    title: "NIST CSF",
    icon: Lock,
    color: "text-cyan-400",
  },
  {
    title: "GDPR",
    icon: Fingerprint,
    color: "text-violet-400",
  },
  {
    title: "OWASP",
    icon: BadgeCheck,
    color: "text-orange-400",
  },
  {
    title: "Cloud Security",
    icon: Cloud,
    color: "text-sky-400",
  },
  {
    title: "Global Threat Intel",
    icon: Globe2,
    color: "text-blue-400",
  },
];

export default function TrustedRibbon() {
  return (
    <section className="border-y border-white/10 bg-slate-900/80 py-6 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {standards.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-lg transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
            >
              <item.icon className={item.color} size={22} />

              <span className="text-sm font-semibold text-slate-200">
                {item.title}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-sm text-slate-400"
        >
          Trusted cybersecurity awareness platform aligned with enterprise
          compliance frameworks and AI-powered employee protection.
        </motion.div>
      </div>
    </section>
  );
}