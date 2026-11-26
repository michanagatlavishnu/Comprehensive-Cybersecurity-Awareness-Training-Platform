import { motion } from "framer-motion";
import {
  Brain,
  Languages,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const conversation = [
  {
    role: "user",
    message: "Explain phishing in simple English.",
  },
  {
    role: "assistant",
    message:
      "Phishing is a cyberattack where attackers pretend to be trusted organizations to steal passwords, OTPs, or sensitive information.",
  },
  {
    role: "user",
    message: "Translate this lesson into Telugu.",
  },
  {
    role: "assistant",
    message:
      "పాఠాన్ని తెలుగులోకి అనువదించాను. Formatting and examples are preserved.",
  },
];

export default function AIAssistantSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={16} />
              Powered by Groq AI
            </div>

            <h2 className="text-5xl font-black text-white leading-tight">
              Meet Your 24×7 AI Cybersecurity Assistant
            </h2>

            <p className="mt-7 leading-8 text-slate-400">
              CyberAware integrates Groq AI to provide instant cybersecurity
              explanations, multilingual translations, lesson summaries,
              phishing analysis, AI-generated quizzes, and personalized
              recommendations.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: Brain,
                  title: "Cybersecurity Tutor",
                  text: "Explain security concepts from beginner to advanced level.",
                },
                {
                  icon: Languages,
                  title: "AI Translation",
                  text: "Translate lessons, quizzes, chatbot responses, phishing emails, and policies.",
                },
                {
                  icon: ShieldCheck,
                  title: "Phishing Analyzer",
                  text: "Paste suspicious emails and AI explains why they are malicious.",
                },
                {
                  icon: MessageCircle,
                  title: "Interactive Learning",
                  text: "Ask follow-up questions while reading training modules.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <div className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 text-black">
                    <item.icon size={22} />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/signup"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 font-semibold text-white hover:scale-105 transition"
            >
              Try AI Assistant
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-white/10 bg-slate-900/70 p-7 backdrop-blur-xl shadow-[0_0_80px_rgba(168,85,247,0.15)]"
          >
            <div className="mb-6 flex items-center gap-3">
              <Brain className="text-violet-400" size={30} />

              <div>
                <h3 className="font-bold text-xl text-white">
                  Groq AI Conversation
                </h3>

                <p className="text-sm text-slate-400">
                  Llama 3.3-70B Enterprise Assistant
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 ${
                    msg.role === "assistant"
                      ? "bg-violet-500/10 border border-violet-500/20"
                      : "bg-slate-800 border border-slate-700"
                  }`}
                >
                  <p className="mb-2 text-xs uppercase tracking-[3px] text-slate-400">
                    {msg.role}
                  </p>

                  <p className="leading-7 text-slate-200">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-5 text-white">
              <p className="text-sm font-medium">
                AI Features Included in CyberAware
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Chat • Translate • Summarize • Quiz • Analyze
              </h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}