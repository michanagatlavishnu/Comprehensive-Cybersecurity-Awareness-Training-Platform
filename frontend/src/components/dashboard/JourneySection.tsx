import { UserPlus, PlayCircle, BrainCircuit, Award, ShieldCheck } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Register using organization email and verify OTP." },
  { icon: PlayCircle, title: "Complete Training", desc: "Watch videos and finish interactive modules." },
  { icon: BrainCircuit, title: "AI Quiz Assessment", desc: "Groq AI generates dynamic quizzes with explanations." },
  { icon: ShieldCheck, title: "Phishing Simulation", desc: "Receive simulated phishing emails and practice detection." },
  { icon: Award, title: "Earn Certificate", desc: "Pass modules and receive verified certificates." },
];

export default function JourneySection() {
  return (
    <section id="training" className="bg-[#050816] py-24">
      <div className="full-container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[6px] text-emerald-400">
            Learning Journey
          </p>
          <h2 className="text-5xl font-black">Your Cyber Security Journey</h2>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-7 top-4 h-full w-[2px] bg-gradient-to-b from-emerald-400 via-violet-500 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-6">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-black shadow-lg">
                  <step.icon size={24} />
                </div>

                <div className="glass flex-1 rounded-3xl p-6">
                  <span className="text-xs uppercase tracking-[3px] text-emerald-400">
                    Step {index + 1}
                  </span>

                  <h3 className="mt-2 text-2xl font-bold">{step.title}</h3>

                  <p className="mt-3 text-slate-400 leading-7">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}