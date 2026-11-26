import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is CyberAware?",
    answer:
      "CyberAware is an AI-powered enterprise cybersecurity awareness platform that provides training modules, phishing simulations, AI chatbot assistance, quizzes, analytics, certificates, and multilingual learning.",
  },
  {
    question: "How does AI Quiz Generation work?",
    answer:
      "After an employee completes a lesson, Groq AI automatically generates a personalized quiz from lesson content, weak topics, and learning history.",
  },
  {
    question: "Does CyberAware support phishing simulations?",
    answer:
      "Yes. Admins can launch AI-generated phishing campaigns, track opens, clicks, credential submissions, and automatically assign retraining modules.",
  },
  {
    question: "Can the platform translate lessons into Telugu and Hindi?",
    answer:
      "Yes. CyberAware uses Groq AI translation so lessons, chatbot responses, phishing emails, quizzes, and notifications can be translated dynamically.",
  },
  {
    question: "How are certificates awarded?",
    answer:
      "Certificates are automatically generated after employees successfully complete required lessons and quizzes with the minimum passing score.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 bg-slate-950">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <p className="text-cyan-400 uppercase tracking-[5px] text-sm font-semibold">
            Frequently Asked Questions
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Everything About CyberAware
          </h2>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-white text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition ${
                    open === index ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="border-t border-white/10 px-6 py-5 text-slate-400 leading-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}