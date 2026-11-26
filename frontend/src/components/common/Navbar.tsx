import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  X,
  ShieldCheck,
  Bell,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "../language/LanguageSwitcher";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  ["home", "/"],
  // Add additional menu items here as [key, path]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition ${
      isActive
        ? "text-emerald-400"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-5">
        <div className="glass mx-auto flex h-16 items-center justify-between rounded-full px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-violet-500 p-2 text-black">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="font-black text-white">CyberAware</h2>
              <p className="text-[10px] uppercase tracking-[4px] text-emerald-400">
                Enterprise Security
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(([key, path]) => (
              <NavLink key={path} to={path} className={navClass}>
                {t(key)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="rounded-full bg-white/5 p-2 text-white"
                >
                  <Bell size={18} />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2"
                >
                  <UserCircle size={20} className="text-emerald-400" />
                  <span className="text-white text-sm">
                    {user?.full_name}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="rounded-full bg-red-500/10 px-4 py-2 text-red-400 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 px-5 py-2 text-white"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 px-5 py-2 text-black font-semibold"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden">
          <div className="absolute right-5 top-24 max-h-[calc(100vh-8rem)] w-72 rounded-3xl bg-slate-900 p-6 flex flex-col shadow-2xl">
            {/* Scrollable Nav Block */}
            <nav className="mt-2 flex-1 space-y-1 overflow-y-auto pb-6">
              {navItems.map(([key, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-emerald-500/15 font-semibold text-emerald-400"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  <LayoutDashboard size={17} />
                  {t(key)}
                </NavLink>
              ))}
            </nav>

            {/* Logout / Footer Section */}
            <div className="mt-auto border-t border-[var(--border)] pt-4">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-red-400 transition hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block py-3 text-center text-white border border-white/10 rounded-xl"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-emerald-400 py-3 text-center text-black font-semibold"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}