import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useAIRecommendations } from "../../hooks/useAI";
import RecommendationCard from "../../components/ai/RecommendationCard";

export default function AIRecommendationsPage() {
  const { data = [], isLoading } = useAIRecommendations();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <Sparkles className="text-cyan-400" />
          AI Learning Recommendations
        </h1>
        <p className="text-slate-400 mt-2">
          Personalized cybersecurity learning suggestions.
        </p>
      </div>

      {isLoading ? (
        <p className="text-cyan-300">Loading AI recommendations...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {data.map((item: any) => (
            <RecommendationCard key={item.id} recommendation={item} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 p-6">
        <h2 className="text-xl font-bold mb-4">Quick Suggestions</h2>

        {[
          "Complete Email Security Fundamentals",
          "Take AI Phishing Quiz",
          "Review Password Security Guide",
          "Finish Cloud Security Essentials",
        ].map((task) => (
          <div key={task} className="flex justify-between items-center py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={18} />
              {task}
            </div>

            <ArrowRight size={18} className="text-cyan-400" />
          </div>
        ))}
      </div>
    </div>
  );
}