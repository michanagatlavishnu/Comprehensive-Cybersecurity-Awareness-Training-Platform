import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  question: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  index: number;
}

export default function QuizCard({ question, index }: Props) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correct = selected === question.answer;

  return (
    <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 mb-6">
      <h2 className="font-bold text-lg">
        {index}. {question.question}
      </h2>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            disabled={submitted}
            onClick={() => setSelected(option)}
            className={`w-full text-left rounded-xl border p-3 transition ${
              selected === option
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-white/10 bg-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              {selected === option ? (
                <CheckCircle2 className="text-cyan-400" size={18} />
              ) : (
                <Circle className="text-slate-500" size={18} />
              )}
              {option}
            </div>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button
          disabled={!selected}
          onClick={() => setSubmitted(true)}
          className="mt-5 bg-cyan-500 text-black px-5 py-2 rounded-full font-semibold"
        >
          Submit Answer
        </button>
      ) : (
        <div
          className={`mt-5 rounded-xl p-4 ${
            correct ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}
        >
          <p className={correct ? "text-emerald-400" : "text-red-400"}>
            {correct ? "Correct Answer" : `Correct: ${question.answer}`}
          </p>

          <p className="text-sm text-slate-300 mt-2">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}