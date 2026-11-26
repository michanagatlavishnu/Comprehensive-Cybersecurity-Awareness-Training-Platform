import { motion } from "framer-motion";
import {
  Brain,
  GraduationCap,
  MailWarning,
  Trophy,
  Languages,
  Lock,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Groq AI Security Assistant",
    icon: Brain,
    description:
      "Ask cybersecurity questions, translate lessons, summarize policies, and receive AI guidance instantly.",
  },
  {
    title: "AI Training Modules",
    icon: GraduationCap,
    description:
      "Interactive cybersecurity learning paths with videos, notes, quizzes, and XP rewards.",
  },
  {
    title: "AI Quiz Generator",
    icon: ShieldCheck,
    description:
      "Automatically generate quizzes from lesson content using Groq AI with explanations and analytics.",
  },
  {
    title: "Phishing Simulation Engine",
    icon: MailWarning,
    description:
      "Launch phishing campaigns, monitor clicks, credential submissions, and assign retraining automatically.",
  },
  {
    title: "Enterprise Analytics Dashboard",
    icon: BarChart3,
    description:
      "Track awareness score, department performance, weak topics, leaderboard, certificates, and campaigns.",
  },
  {
    title: "Password Security Lab",
    icon: Lock,
    description:
      "Password generator, password checker, MFA awareness lab, and best practices training.",
  },
  {
    title: "Certificates & Leaderboards",
    icon: Trophy,
    description:
      "Earn certificates, badges, XP levels, achievements, and department rankings.",
  },
  {
    title: "AI Translation",
    icon: Languages,
    description:
      "Translate lessons, chatbot responses, quizzes, phishing emails, and notifications into Telugu, Hindi, and English.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 uppercase tracking-[5px] text-sm font-semibold">
            Platform Features
          </p>

          <h2 className="text-4xl lg:text-5xl font-black mt-4">
            Everything Needed for Enterprise Security Awareness
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 leading-8">
            CyberAware combines AI, cybersecurity education, phishing defense,
            compliance, multilingual learning, certificates, analytics, and
            gamification into one intelligent platform.
          </p>
        </motion.div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-400/50 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-emerald-500/10"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 p-4 text-black">
                <feature.icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}