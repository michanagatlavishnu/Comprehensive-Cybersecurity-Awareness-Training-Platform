import { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  FileText,
  Download,
  Copy,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Clock3,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const aiSummaryText = `
Email security is one of the most important pillars of enterprise cybersecurity.

Attackers primarily exploit email because employees interact with messages every day. Modern phishing attacks use AI-generated content, spoofed domains, malicious QR codes, fake login pages, and business email compromise techniques.

Key protection strategies include verifying sender identity, inspecting URLs before clicking, avoiding unknown attachments, enabling MFA, reporting suspicious emails immediately, and following organizational security policies.

CyberAware AI continuously analyzes phishing indicators and recommends safer actions for employees.
`;

const flashcards = [
  {
    question: "What is phishing?",
    answer:
      "A social engineering attack that tricks users into revealing credentials or sensitive information.",
  },
  {
    question: "What is Business Email Compromise (BEC)?",
    answer:
      "An attack where criminals impersonate executives or trusted vendors to manipulate payments or sensitive information.",
  },
  {
    question: "What is spoofing?",
    answer:
      "Forging an email sender or domain so it appears legitimate.",
  },
  {
    question: "What is Quishing?",
    answer:
      "A phishing attack that uses malicious QR codes instead of hyperlinks.",
  },
];

const interviewQuestions = [
  "Explain phishing with an enterprise example.",
  "Differentiate phishing, spear phishing, and whaling.",
  "How do attackers spoof sender domains?",
  "Explain SPF, DKIM and DMARC.",
  "How should an employee report a phishing email?",
  "How does AI improve phishing attacks?",
];

const revisionPoints = [
  "Verify sender domain carefully.",
  "Hover over links before clicking.",
  "Never trust urgent financial requests immediately.",
  "Enable Multi-Factor Authentication.",
  "Report suspicious emails using CyberAware.",
  "Avoid downloading unknown attachments.",
  "Recognize QR phishing attacks.",
];

export default function AISummaryPage() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  const copySummary = async () => {
    await navigator.clipboard.writeText(aiSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const regenerateSummary = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 py-8">
      {/* Header */}

      <section className="mb-10">
        <p className="uppercase tracking-[3px] text-cyan-400 text-sm">
          CyberAware AI Study Assistant
        </p>

        <h1 className="text-5xl font-black mt-2">
          AI Lesson Summary
        </h1>

        <p className="text-slate-400 mt-4 max-w-3xl leading-7">
          AI generates concise summaries, revision notes, interview questions,
          flashcards, and downloadable study material from each cybersecurity lesson.
        </p>
      </section>

      {/* Hero Card */}

      <section className="mb-10 rounded-3xl bg-gradient-to-r from-cyan-600/10 via-slate-900 to-violet-600/10 border border-cyan-500/20 p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-cyan-400" size={30} />
              <h2 className="text-3xl font-bold">
                AI Generated Study Material
              </h2>
            </div>

            <p className="mt-4 text-slate-300 max-w-2xl leading-7">
              AI reads the lesson transcript, extracts cybersecurity concepts,
              explains attacks, creates flashcards, revision notes, quizzes,
              and interview questions automatically.
            </p>
          </div>

          <button
            onClick={regenerateSummary}
            className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Again
              </>
            )}
          </button>
        </div>
      </section>

      {/* Summary */}

      <section className="mb-10 rounded-3xl bg-slate-900/70 border border-white/10 p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BookOpen className="text-cyan-300" size={28} />
            <h2 className="text-2xl font-bold">
              AI Summary
            </h2>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full bg-slate-800 p-2"
          >
            {expanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
          </button>
        </div>

        {expanded && (
          <>
            <p className="leading-8 text-slate-300 whitespace-pre-line">
              {aiSummaryText}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={copySummary}
                className="rounded-full bg-cyan-500/10 px-5 py-2 text-cyan-300 hover:bg-cyan-500/20 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={18}/>
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18}/>
                    Copy Summary
                  </>
                )}
              </button>

              <button className="rounded-full bg-violet-500/10 px-5 py-2 text-violet-300 hover:bg-violet-500/20 flex items-center gap-2">
                <Download size={18}/>
                Download PDF
              </button>
            </div>
          </>
        )}
      </section>

      {/* Revision Notes */}

      <section className="mb-10 rounded-3xl bg-slate-900/70 border border-emerald-500/20 p-7">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="text-emerald-400" size={28}/>
          <h2 className="text-2xl font-bold">
            Quick Revision Notes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {revisionPoints.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-slate-800/60 p-4"
            >
              <CheckCircle2 className="text-emerald-400" size={20}/>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Flashcards */}

      <section className="mb-10 rounded-3xl bg-slate-900/70 border border-violet-500/20 p-7">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-violet-300" size={28}/>
          <h2 className="text-2xl font-bold">
            AI Flashcards
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {flashcards.map((card) => (
            <div
              key={card.question}
              className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-slate-900 border border-white/10 p-5"
            >
              <p className="text-xs uppercase tracking-[2px] text-violet-300">
                Question
              </p>

              <h3 className="font-bold mt-2">
                {card.question}
              </h3>

              <div className="border-t border-white/10 my-4"/>

              <p className="text-xs uppercase tracking-[2px] text-cyan-300">
                Answer
              </p>

              <p className="mt-2 leading-7 text-slate-300">
                {card.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Questions */}

      <section className="mb-10 rounded-3xl bg-slate-900/70 border border-red-500/20 p-7">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-red-400" size={28}/>
          <h2 className="text-2xl font-bold">
            AI Interview Questions
          </h2>
        </div>

        <div className="space-y-4">
          {interviewQuestions.map((question, index) => (
            <div
              key={question}
              className="rounded-2xl border border-white/10 bg-slate-800/60 p-5"
            >
              <p className="text-xs uppercase tracking-[2px] text-red-300">
                Question {index + 1}
              </p>

              <h3 className="mt-2 font-medium">
                {question}
              </h3>

              <button className="mt-4 rounded-full bg-red-500/10 px-4 py-2 text-red-300 hover:bg-red-500/20 text-sm">
                Generate AI Answer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI Quiz Preview */}

      <section className="mb-10 rounded-3xl bg-slate-900/70 border border-cyan-500/20 p-7">
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit className="text-cyan-400" size={28}/>
          <h2 className="text-2xl font-bold">
            AI Quiz Preview
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <QuizStat title="Questions" value="25"/>
          <QuizStat title="Difficulty" value="Adaptive"/>
          <QuizStat title="Passing Score" value="80%"/>
          <QuizStat title="XP Reward" value="+150 XP"/>
        </div>

        <button className="mt-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black">
          Start AI Practice Quiz
        </button>
      </section>

      {/* Learning Stats */}

      <section className="mb-10 rounded-3xl bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 border border-violet-500/20 p-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard icon={Clock3} label="Reading Time" value="6 Min"/>
          <StatCard icon={BookOpen} label="Concepts Covered" value="18"/>
          <StatCard icon={BrainCircuit} label="AI Notes Generated" value="12"/>
          <StatCard icon={Trophy} label="XP Earned" value="+150"/>
        </div>
      </section>

      {/* AI Tips */}

      <section className="rounded-3xl bg-gradient-to-r from-cyan-500/10 via-slate-900 to-emerald-500/10 border border-cyan-500/20 p-8">
        <div className="flex items-center gap-3 mb-5">
          <Lightbulb className="text-yellow-300" size={30}/>
          <h2 className="text-3xl font-black">
            AI Study Tips
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {[
            "Review flashcards before attempting quizzes.",
            "Use AI Notes after every completed lesson.",
            "Practice phishing scenarios before certification.",
            "Repeat revision notes for long-term memory.",
            "Download summary PDFs for offline study.",
            "Complete AI practice quizzes after every module.",
          ].map((tip) => (
            <div
              key={tip}
              className="rounded-2xl bg-slate-800/60 p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="text-yellow-300" size={20}/>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <button className="mt-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 font-semibold text-black">
          Continue to AI Notes
        </button>
      </section>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function QuizStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/60 p-5 text-center border border-white/10">
      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className="text-2xl font-black mt-3 text-cyan-300">
        {value}
      </h3>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-5 text-center border border-white/10">
      <Icon className="mx-auto text-cyan-400" size={28}/>

      <p className="text-xs uppercase tracking-[2px] mt-3 text-slate-500">
        {label}
      </p>

      <h3 className="text-3xl font-black mt-2">
        {value}
      </h3>
    </div>
  );
}