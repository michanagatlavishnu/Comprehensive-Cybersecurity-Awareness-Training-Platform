import { motion } from "framer-motion";
import {
  ShieldCheck,
  Brain,
  Trophy,
  Globe2,
  Users,
  BookOpen,
  MailWarning,
  Award,
} from "lucide-react";

const stats = [
  {
    title: "Employees Protected",
    value: "25,000+",
    icon: Users,
    color: "from-emerald-400 to-cyan-400",
  },
  {
    title: "AI Quizzes Generated",
    value: "120,000+",
    icon: Brain,
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    title: "Training Modules Completed",
    value: "18,500+",
    icon: BookOpen,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Phishing Emails Simulated",
    value: "98,000+",
    icon: MailWarning,
    color: "from-red-400 to-orange-500",
  },
  {
    title: "Certificates Issued",
    value: "15,420+",
    icon: Award,
    color: "from-yellow-400 to-orange-400",
  },
  {
    title: "Organizations",
    value: "150+",
    icon: Globe2,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Awareness Score",
    value: "92%",
    icon: ShieldCheck,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "XP Awarded",
    value: "2.5M+",
    icon: Trophy,
    color: "from-pink-400 to-violet-500",
  },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-black py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-sm text-emerald-300">
            <ShieldCheck size={16} />
            CyberAware Enterprise Metrics
          </div>

          <h2 className="text-5xl font-black text-white lg:text-6xl">
            Trusted by Organizations for AI Cybersecurity Awareness
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AI learning, phishing simulations, multilingual training, awareness
            scoring, certificates, and enterprise analytics.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-emerald-400/40 transition-all"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color} text-black`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-4xl font-black text-white">
                  {stat.value}
                </h3>

                <p className="mt-3 text-slate-400">{stat.title}</p>

                <div
                  className={`mt-6 h-1 rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 rounded-[36px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-8 backdrop-blur-xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[3px] text-cyan-300">
                Live Threat Intelligence
              </p>
              <h3 className="mt-3 text-4xl font-black text-white">41,000+</h3>
            </div>

            <div className="text-center">
              <p className="text-sm uppercase tracking-[3px] text-emerald-300">
                AI Response Time
              </p>
              <h3 className="mt-3 text-4xl font-black text-white">&lt; 1 sec</h3>
            </div>

            <div className="text-center">
              <p className="text-sm uppercase tracking-[3px] text-violet-300">
                Languages Supported
              </p>
              <h3 className="mt-3 text-4xl font-black text-white">3+</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}