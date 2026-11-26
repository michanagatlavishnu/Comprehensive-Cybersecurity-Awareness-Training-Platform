import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-28 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="overflow-hidden rounded-[40px] border border-emerald-500/20 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 p-10 lg:p-16 shadow-[0_0_80px_rgba(16,185,129,.2)]">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                <ShieldCheck size={16} />
                Enterprise Cybersecurity Platform
              </div>

              <h2 className="mt-6 text-4xl lg:text-6xl font-black text-white leading-tight">
                Start Building a Security-Aware Workforce Today
              </h2>

              <p className="mt-6 text-white/90 leading-8">
                AI-powered learning, phishing simulations, multilingual
                cybersecurity education, enterprise analytics, certificates, and
                awareness scoring — all in one platform.
              </p>
            </div>

            <div className="space-y-5">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-3 rounded-2xl bg-black py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                Create Free Organization
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 py-4 font-semibold text-white transition hover:bg-white/20"
              >
                Login to CyberAware
              </Link>

              <button className="w-full rounded-2xl border border-white/30 bg-white/10 py-4 font-semibold text-white transition hover:bg-white/20">
                Schedule Enterprise Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}