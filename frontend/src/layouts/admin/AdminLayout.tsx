import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

/* ==========================================================
   ADMIN SIDEBAR MENU
========================================================== */

const adminNav = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    path: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Phishing Campaigns",
    path: "/admin/phishing-campaigns",
    icon: Mail,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

/* ==========================================================
   ADMIN LAYOUT
========================================================== */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { logout, user } = useAuth();

  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}

        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 text-black">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-wide">
                CyberAware
              </h2>

              <p className="text-xs text-emerald-400">
                ADMIN PANEL
              </p>
            </div>
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Admin Card */}

        <div className="m-4 rounded-2xl border border-emerald-500/20 bg-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Admin
          </p>

          <h3 className="mt-2 text-lg font-bold">
            {user?.full_name || "Admin User"}
          </h3>

          <p className="mt-1 truncate text-sm text-emerald-400">
            {user?.email}
          </p>

          <div className="mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            Role : {user?.role}
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 pb-6">
          {adminNav.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />

                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600/10 py-3 font-semibold text-red-400 transition hover:bg-red-600/20"
          >
            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="lg:pl-72">
        {/* Top Header */}

        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-xl">
          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-lg bg-slate-800 p-2 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Title */}

          <div>
            <h1 className="text-lg font-bold">
              CyberAware Administration
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise Cybersecurity Awareness Platform
            </p>
          </div>

          {/* Right Actions */}

          <div className="ml-auto flex items-center gap-3">
            {/* Profile Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-black">
              {user?.full_name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}

        <main className="min-h-[calc(100vh-80px)] bg-slate-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}