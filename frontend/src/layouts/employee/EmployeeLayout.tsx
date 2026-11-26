import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
  LogOut,
  Trophy,
  BookOpen,
  ShieldAlert,
  Award,
  User,
} from "lucide-react";  
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ThemeToggle from "../../components/common/ThemeToggle";
import LanguageSwitcher from "../../components/language/LanguageSwitcher";
import GoogleTranslateBridge from "../../components/language/GoogleTranslateBridge";
import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
const navItems = [
  ["dashboard", "/dashboard", LayoutDashboard],
  ["training", "/training", BookOpen],
  ["phishing", "/phishing", ShieldAlert],
  ["certificates", "/certificates", Award],
  ["profile", "/profile", User],
] as const;

export default function EmployeeLayout() {
  const [open, setOpen] = useState(false);
  

  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { overview } = useDashboard();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      <GoogleTranslateBridge />
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="rounded-xl bg-gradient-to-br from-emerald-400 to-violet-500 p-2 text-black">
              <ShieldCheck size={20} />
            </span>

            <span className="text-lg font-black">CyberAware</span>
          </Link>

          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-6 mt-2 pl-12 text-[10px] uppercase tracking-[3px] text-emerald-500">
          {t("workspace")}
        </p>

        {/* User Card */}
        <div className="mb-6 rounded-2xl bg-white/5 p-4">
          <p className="text-xs text-[var(--text-secondary)]">{t("loggedInAs")}</p>

          <h2 className="text-2xl font-bold text-white">
            {user?.full_name || t("employee")}
          </h2>

          <p className="text-sm text-emerald-400">
            {user?.email || ""}
          </p>

          <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm">
            <Trophy size={16} />
            {t("xpShort")} {overview?.total_xp ?? 0}
          </div>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t("awarenessScore")} {overview?.awareness_score ?? user?.awareness_score ?? 0}%
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map(([key, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
                }`
              }
            >
              <Icon size={17} />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut size={16} />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur-xl sm:px-8">
          <button
            className="rounded-xl border border-[var(--border)] p-2 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{t("securityWorkspace")}</p>

            <p className="text-xs text-[var(--text-secondary)]">
              {t("welcomeBack")}, {user?.full_name || t("employee")}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                {user?.full_name?.charAt(0).toUpperCase() || "E"}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold">
                  {user?.full_name || t("employee")}
                </p>

                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

