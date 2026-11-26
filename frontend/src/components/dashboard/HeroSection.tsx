import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  PlayCircle,
  Brain,
  Trophy,
  MailWarning,
  Globe2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-violet-600/10" />

      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <Sparkles size={16} />
              AI Powered Cybersecurity Awareness Platform
            </div>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Protect Your Organization with{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI Security Training
              </span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-300">
              CyberAware combines AI-powered learning, phishing simulations,
              multilingual cybersecurity training, smart quizzes, analytics,
              certificates, and awareness scoring into one enterprise platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-4 font-bold text-black shadow-xl transition hover:scale-105"
              >
                Start Learning
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-semibold text-white transition hover:border-emerald-400 hover:bg-emerald-500/10"
              >
                <PlayCircle size={18} />
                Launch Demo
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-5">
              {[
                {
                  icon: ShieldCheck,
                  title: "ISO 27001 Ready",
                  value: "Enterprise Compliance",
                },
                {
                  icon: Brain,
                  title: "Groq AI Assistant",
                  value: "24×7 AI Security Coach",
                },
                {
                  icon: Trophy,
                  title: "XP + Certificates",
                  value: "Gamified Learning Journey",
                },
                {
                  icon: MailWarning,
                  title: "AI Phishing Simulator",
                  value: "Live Attack Campaigns",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <card.icon className="mb-4 text-emerald-400" size={28} />
                  <p className="text-sm text-slate-400">{card.title}</p>
                  <h4 className="mt-2 font-semibold text-white">{card.value}</h4>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            {/* Main Dashboard Card */}
            <div className="relative w-full max-w-xl rounded-[34px] border border-white/10 bg-slate-900/70 p-7 shadow-[0_0_80px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Employee Security Dashboard
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-white">
                    CyberAware
                  </h3>
                </div>

                <ShieldCheck className="text-emerald-400" size={34} />
              </div>

              <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-5 text-black">
                <p className="font-medium">Awareness Score</p>

                <h2 className="mt-2 text-5xl font-black">92%</h2>

                <p className="mt-1 font-semibold">Excellent Security Awareness</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Level", "12"],
                  ["XP Earned", "3,850 XP"],
                  ["Lessons", "28 Completed"],
                  ["Certificates", "6 Earned"],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-xl bg-white/5 p-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      {title}
                    </p>

                    <h4 className="mt-2 text-xl font-bold text-white">
                      {value}
                    </h4>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-slate-800/70 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-slate-300">Weekly Progress</p>

                  <span className="font-semibold text-emerald-400">
                    +480 XP
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-700">
                  <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  84% of weekly cybersecurity goal completed.
                </p>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-4 top-12 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 backdrop-blur-xl"
            >
              <Brain className="mb-2 text-emerald-400" />

              <p className="text-xs text-slate-300">AI Assistant Active</p>

              <h4 className="font-bold text-white">Groq Llama 3.3</h4>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -right-4 bottom-12 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl"
            >
              <MailWarning className="mb-2 text-red-400" />

              <p className="text-xs text-slate-300">Today's Phishing Attack</p>

              <h4 className="font-bold text-white">3 Suspicious Emails</h4>
            </motion.div>

            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/30 bg-cyan-500/10 p-5 backdrop-blur-xl"
            >
              <Globe2 className="text-cyan-400" size={40} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}