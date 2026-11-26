import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  Trophy,
  PlayCircle,
} from "lucide-react";

const modules = [
  {
    title: "Phishing Awareness Fundamentals",
    lessons: 8,
    xp: 150,
    difficulty: "Beginner",
    progress: 100,
  },
  {
    title: "Password Security & MFA",
    lessons: 6,
    xp: 120,
    difficulty: "Intermediate",
    progress: 75,
  },
  {
    title: "Social Engineering Defense",
    lessons: 10,
    xp: 200,
    difficulty: "Advanced",
    progress: 30,
  },
];

export default function TrainingPreviewSection() {
  return (
    <section className="py-28 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[5px] text-emerald-400 text-sm font-semibold">
            AI Learning Platform
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Interactive Cybersecurity Training Modules
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 leading-8">
            Learn cybersecurity through AI-assisted lessons, multilingual content,
            interactive videos, downloadable resources, and gamified XP rewards.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-7 backdrop-blur-xl hover:border-emerald-400/40 transition"
            >
              <div className="mb-6 flex items-center justify-between">
                <ShieldCheck className="text-emerald-400" size={32} />

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  {module.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {module.title}
              </h3>

              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <Clock3 size={18} />

                  {module.lessons} Lessons
                </div>

                <div className="flex items-center gap-3">
                  <Trophy size={18} />

                  {module.xp} XP Reward
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Completion Progress</span>

                  <span className="font-bold text-white">
                    {module.progress}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 font-semibold text-black transition hover:scale-[1.02]">
                <span className="inline-flex items-center gap-2 justify-center">
                  <PlayCircle size={18} />

                  Continue Module
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}