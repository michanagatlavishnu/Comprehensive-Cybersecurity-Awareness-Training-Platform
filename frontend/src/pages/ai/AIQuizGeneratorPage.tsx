import { useState } from "react";
import { BrainCircuit, Sparkles, Trophy } from "lucide-react";
import { useGenerateQuiz } from "../../hooks/useAI";
import QuizCard from "../../components/ai/QuizCard";

export default function AIQuizGeneratorPage() {
  const [topic, setTopic] = useState("Email Security");
  const quizMutation = useGenerateQuiz();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-4xl font-black flex items-center gap-3 mb-8">
        <BrainCircuit className="text-cyan-400" />
        AI Quiz Generator
      </h1>

      <div className="rounded-3xl bg-slate-900 border border-cyan-500/20 p-6 mb-8">
        <label className="text-sm text-slate-400">Lesson / Topic</label>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full mt-2 bg-slate-950 rounded-xl border border-white/10 p-3"
        />

        <button
          onClick={() => quizMutation.mutate(topic)}
          className="mt-5 bg-gradient-to-r from-cyan-400 to-violet-500 text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2"
        >
          <Sparkles size={18} />
          Generate Quiz
        </button>
      </div>

      {quizMutation.data?.questions?.map((q: any, index: number) => (
        <QuizCard key={index} question={q} index={index + 1} />
      ))}

      <div className="rounded-3xl bg-slate-900 border border-emerald-500/20 p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-yellow-300" />
          <h2 className="text-xl font-bold">Quiz Result</h2>
        </div>

        <p className="text-slate-300">
          Score: {quizMutation.data?.score ?? 0}/100
        </p>
        <p className="text-slate-400 mt-2">
          XP Earned: {quizMutation.data?.xp ?? 0}
        </p>
      </div>
    </div>
  );
}