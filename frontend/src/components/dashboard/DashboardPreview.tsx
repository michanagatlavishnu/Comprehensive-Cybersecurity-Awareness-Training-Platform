import { motion } from "framer-motion";
import {
  Brain,
  Award,
  ShieldCheck,
  Trophy,
  Bell,
  BookOpen,
  MailWarning,
  BarChart3,
} from "lucide-react";

const cards = [
  {
    title: "Awareness Score",
    value: "92%",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-400",
  },
  {
    title: "Current XP",
    value: "3,850 XP",
    icon: Trophy,
    color: "from-yellow-500 to-orange-400",
  },
  {
    title: "AI Assistant",
    value: "Online",
    icon: Brain,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Certificates",
    value: "6 Earned",
    icon: Award,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Lessons Completed",
    value: "28",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Phishing Alerts",
    value: "3 Pending",
    icon: MailWarning,
    color: "from-red-500 to-orange-500",
  },
];

export default function DashboardPreview() {
  return (
    <section className="py-28 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-16 items-center lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="uppercase tracking-[5px] text-cyan-400 font-semibold text-sm">
              Employee Dashboard
            </p>

            <h2 className="mt-5 text-5xl font-black">
              A Personalized Cybersecurity Learning Dashboard
            </h2>

            <p className="mt-7 leading-8 text-slate-400">
              Every employee receives a personalized dashboard with XP,
              certificates, awareness score, phishing inbox, AI chatbot,
              notifications, quizzes, lesson progress, leaderboard ranking, and
              recommendations.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Live Awareness Score Tracking",
                "Weekly XP Progress Analytics",
                "AI Quiz Recommendations",
                "Department Leaderboards",
                "Phishing Campaign Notifications",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <ShieldCheck className="text-emerald-400" size={22} />

                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950 p-7 shadow-[0_0_80px_rgba(6,182,212,0.15)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-sm text-slate-400">CyberAware Dashboard</p>

                <h3 className="text-2xl font-bold text-white">
                  Welcome Back, Employee 👋
                </h3>
              </div>

              <Bell className="text-cyan-400" size={26} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl bg-white/5 p-5 border border-white/5"
                >
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-r ${card.color} p-3 text-black`}
                  >
                    <card.icon size={22} />
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">
                    {card.title}
                  </p>

                  <h4 className="mt-2 text-xl font-bold text-white">
                    {card.value}
                  </h4>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-800/70 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-slate-300">Weekly Learning Goal</span>

                <span className="font-bold text-cyan-400">84%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <span>5 Lessons Remaining</span>

                <span>480 XP This Week</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-800/60 p-5">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="text-cyan-400" />

                <span className="font-semibold text-white">
                  AI Recommendation
                </span>
              </div>

              <p className="text-slate-400 leading-7">
                Your weakest cybersecurity topic this week is{" "}
                <span className="text-red-400 font-semibold">
                  Social Engineering
                </span>
                . CyberAware recommends completing the{" "}
                <span className="text-emerald-400">
                  “Advanced Phishing Awareness”
                </span>{" "}
                lesson and taking an AI-generated quiz.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}