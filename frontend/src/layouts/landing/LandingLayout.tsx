import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import GoogleTranslateBridge from "../../components/language/GoogleTranslateBridge";

export default function LandingLayout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)] transition-all duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98120,transparent_35%),radial-gradient(circle_at_bottom_right,#8b5cf620,transparent_35%),linear-gradient(to_bottom,#040712,#050816,#02040a)] dark:block hidden" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#34d39920,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f720,transparent_35%),linear-gradient(to_bottom,#F8FAFC,#EEF2FF,#FFFFFF)] block dark:hidden" />

        {/* Aurora Glow */}
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[140px] animate-pulse" />

        <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating Particles */}
        <div className="absolute left-[8%] top-[12%] h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
        <div className="absolute right-[15%] top-[22%] h-3 w-3 rounded-full bg-violet-400 animate-pulse" />
        <div className="absolute left-[20%] bottom-[18%] h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        <div className="absolute right-[30%] bottom-[28%] h-4 w-4 rounded-full bg-emerald-300 animate-bounce" />
      </div>

      {/* Navbar */}
      <Navbar />
      <GoogleTranslateBridge />

      {/* Main Content */}
      <main className="relative pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll To Top Button */}
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 text-black shadow-lg transition hover:scale-110"
      >
        ↑
      </button>
    </div>
  );
}