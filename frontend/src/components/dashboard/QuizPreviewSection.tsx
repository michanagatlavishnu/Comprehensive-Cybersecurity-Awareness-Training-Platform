import { motion } from "framer-motion";
import {
  Brain,
  Timer,
  Trophy,
  CheckCircle2,
} from "lucide-react";

const questions = [
  "Which email characteristic indicates phishing?",
  "What is Multi-Factor Authentication?",
  "What should you do after clicking a suspicious link?",
  "Which password is strongest?",
];

export default function QuizPreviewSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-16 items-center lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="uppercase tracking-[5px] text-violet-400 text-sm font-semibold">
              AI Quiz Engine
            </p>

            <h2 className="mt-4 text-5xl font-black text-white">
              Groq AI Generates Personalized Cybersecurity Quizzes
            </h2>

            <p className="mt-7 text-slate-400 leading-8">
              Every completed lesson automatically generates a unique quiz based
              on your learning progress, weak topics, department, and awareness
              score.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "AI-generated questions from lesson content.",
                "Randomized question bank every attempt.",
                "Instant explanations after each answer.",
                "XP rewards based on performance.",
                "Analytics and weak topic detection.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <CheckCircle2 className="text-violet-400" size={22} />

                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-white/10 bg-slate-900/80 p-7 backdrop-blur-xl shadow-[0_0_80px_rgba(139,92,246,.15)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="text-violet-400" size={28} />

                <div>
                  <h3 className="font-bold text-xl text-white">
                    AI Quiz Preview
                  </h3>

                  <p className="text-sm text-slate-400">
                    Generated from completed lesson
                  </p>
                </div>
              </div>

              <Timer className="text-orange-400" size={22} />
            </div>

            {questions.map((question, index) => (
              <div
                key={question}
                className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xs uppercase tracking-[3px] text-violet-300">
                  Question {index + 1}
                </p>

                <h4 className="mt-2 text-white font-semibold">{question}</h4>

                <div className="mt-4 space-y-2">
                  {[1, 2, 3, 4].map((option) => (
                    <div
                      key={option}
                      className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300"
                    >
                      Option {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-5 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Quiz Reward</p>

                  <h3 className="text-3xl font-black">150 XP</h3>
                </div>

                <Trophy size={34} />
              </div>

              <p className="mt-2 text-sm font-medium">
                AI explanation for every correct and incorrect answer.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}