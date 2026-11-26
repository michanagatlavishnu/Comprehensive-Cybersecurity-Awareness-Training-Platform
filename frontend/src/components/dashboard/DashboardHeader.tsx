import {
  Bell,
  CalendarDays,
  ChevronDown,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const initials = useMemo(() => {
    if (!user?.full_name) return "CA";

    return user.full_name
      .split(" ")
      .map((item) => item.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-2xl backdrop-blur-xl">
      {/* Top Row */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Welcome */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 text-xl font-black text-black shadow-lg">
            {initials}
          </div>

          <div>
            <p className="text-sm text-emerald-400">{greeting}</p>

            <h1 className="text-3xl font-black text-white">
              {user?.full_name ?? "CyberAware Employee"}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full bg-white/5 px-3 py-1">
                {user?.department ?? "Engineering"}
              </span>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                {user?.role === "admin" ? "Admin" : "Employee"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules, quizzes..."
              className="w-72 rounded-full border border-white/10 bg-slate-800/60 py-2 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-full border border-white/10 bg-slate-800/60 p-3 transition hover:border-emerald-400 hover:bg-emerald-500/10">
            <Bell size={20} className="text-white" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* Theme */}
          <ThemeToggle />
        </div>
      </div>

      {/* Middle Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Date */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <CalendarDays size={18} />
            <span className="text-sm">Today</span>
          </div>

          <p className="text-sm text-white">{today}</p>
        </div>

        {/* Awareness */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-300">
            <ShieldCheck size={18} />
            <span className="text-sm">Awareness Score</span>
          </div>

          <h3 className="text-2xl font-black text-emerald-400">
            {user?.awareness_score ?? 100}%
          </h3>

          <p className="text-xs text-slate-300">
            Excellent security awareness level.
          </p>
        </div>

        {/* XP */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <Sparkles size={18} />
            <span className="text-sm">XP Earned</span>
          </div>

          <h3 className="text-2xl font-black text-cyan-300">
            {user?.xp.total_xp ?? 0}
          </h3>

          <p className="text-xs text-slate-300">
            Keep completing modules to level up.
          </p>
        </div>

        {/* Level */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-violet-300">
            <ChevronDown size={18} />
            <span className="text-sm">Current Level</span>
          </div>

          <h3 className="text-2xl font-black text-violet-300">
            Level {user?.xp.current_level ?? 1}
          </h3>

          <p className="text-xs text-slate-300">
            Unlock new badges and certificates.
          </p>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 via-cyan-600/10 to-violet-600/20 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Weekly Learning Goal
            </h3>

            <p className="text-sm text-slate-300">
              Complete 5 lessons and earn 500 XP this week.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
            72% Complete
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 transition-all duration-700" />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>360 XP Earned</span>

          <span>500 XP Target</span>
        </div>
      </div>
    </div>
  );
}