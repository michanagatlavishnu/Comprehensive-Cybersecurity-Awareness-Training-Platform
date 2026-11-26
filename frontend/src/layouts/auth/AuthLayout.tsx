import { Outlet } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import Navbar from "../../components/common/Navbar";

export default function AuthLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-(--background) px-4 pb-8 pt-28 text-(--text-primary) sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
        <section className="hidden max-w-xl lg:block">
          <div className="mb-8 flex items-center gap-3">
            <span className="rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-500 p-3 text-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={28} />
            </span>
            <div>
              <p className="text-2xl font-black tracking-wide text-white">
                CyberAware
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400">
                Enterprise Security Platform
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
            Safer teams start here
          </p>
          <h1 className="text-5xl font-black leading-tight text-white xl:text-6xl">
            Turn security awareness into everyday confidence.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Give every employee the practical knowledge to spot threats, protect
            company data, and respond with confidence.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-slate-300">
            {["Practical security learning", "AI-powered guidance", "Progress your whole organization"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-400/15 p-1 text-emerald-400">
                    <Check size={14} />
                  </span>
                  {item}
                </li>
              )
            )}
          </ul>
        </section>

        <section className="flex justify-center">
          <Outlet />
        </section>
      </div>
      </main>
    </>
  );
}