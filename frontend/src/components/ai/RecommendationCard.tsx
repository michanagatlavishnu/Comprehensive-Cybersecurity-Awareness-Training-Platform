import { BookOpen, Target, Trophy } from "lucide-react";

interface Props {
  recommendation: {
    id: string;
    course: string;
    reason: string;
    level: string;
    xp: number;
  };
}

export default function RecommendationCard({ recommendation }: Props) {
  return (
    <div className="rounded-3xl bg-slate-900 border border-white/10 p-5 hover:border-cyan-500/30 transition">
      <BookOpen className="text-cyan-400 mb-4" size={28} />

      <h2 className="text-xl font-bold">{recommendation.course}</h2>

      <p className="text-slate-400 text-sm mt-3">
        {recommendation.reason}
      </p>

      <div className="flex justify-between mt-5 text-sm">
        <div className="flex items-center gap-2">
          <Target className="text-yellow-400" size={16} />
          {recommendation.level}
        </div>

        <div className="flex items-center gap-2 text-emerald-400">
          <Trophy size={16} />
          {recommendation.xp} XP
        </div>
      </div>

      <button className="w-full mt-6 bg-cyan-500 text-black py-2 rounded-xl font-semibold">
        Start Lesson
      </button>
    </div>
  );
}