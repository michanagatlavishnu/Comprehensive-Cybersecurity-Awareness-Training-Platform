import { useEffect, useState } from "react";
import {
  Users,
  Shield,
  Trophy,
  Bell,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import api from "../../../services/api";

interface DashboardStats {
  total_users: number;
  total_xp: number;
  average_awareness_score: number;
  active_users: number;
  employees: number;
  admins: number;
  simulation_identified: number;
  simulation_correct: number;
  simulation_accuracy: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: any;
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {value}
        </h2>
      </div>

      <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_xp: 0,
    average_awareness_score: 0,
    active_users: 0,
    employees: 0,
    admins: 0,
    simulation_identified: 0,
    simulation_correct: 0,
    simulation_accuracy: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
    const refreshTimer = window.setInterval(loadDashboard, 30000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      const dashboard = res.data.data;
      setStats(dashboard.cards);
      setRecentUsers(dashboard.recent_users || []);
      setRecentActivity(dashboard.recent_activity || []);
    } catch {
      setStats((current) => current);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-slate-400">
          Welcome to CyberAware Enterprise Administration.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={stats.total_users}
          icon={Users}
        />

        <StatCard
          title="Employees"
          value={stats.employees}
          icon={Shield}
        />

        <StatCard
          title="Active Users"
          value={stats.active_users}
          icon={Bell}
        />

        <StatCard
          title="Average Awareness"
          value={`${stats.average_awareness_score}%`}
          icon={Trophy}
        />

        <StatCard title="Total XP" value={stats.total_xp} icon={Activity} />

        <StatCard
          title="Simulation Accuracy"
          value={`${stats.simulation_accuracy}%`}
          icon={Shield}
        />

        <StatCard
          title="Simulation Decisions"
          value={`${stats.simulation_correct}/${stats.simulation_identified}`}
          icon={Activity}
        />
      </div>

      {/* Progress Card */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Overall Training Completion
            </h3>

            <p className="text-sm text-slate-400">
              Employee completion progress.
            </p>
          </div>

          <ArrowUpRight className="text-emerald-400" />
        </div>

        <div className="mt-6 h-4 rounded-full bg-slate-800">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
            style={{ width: `${stats.average_awareness_score}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-emerald-400">
          {stats.average_awareness_score}% Average Awareness
        </p>
      </div>

      {/* Recent Activity */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">
          Recent Activity
        </h3>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-slate-800 p-3"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <p className="text-sm text-slate-300">{activity.user}: {activity.activity}</p>
            </div>
          ))}
          {!recentActivity.length && recentUsers.map((user, index) => (
            <div key={`user-${index}`} className="flex items-center gap-3 rounded-xl bg-slate-800 p-3"><div className="h-2 w-2 rounded-full bg-emerald-400" /><p className="text-sm text-slate-300">{user.name} joined from {user.department || "unassigned"}.</p></div>
          ))}
          {!recentActivity.length && !recentUsers.length && <p className="text-sm text-slate-400">No recent activity.</p>}
        </div>
      </div>
    </div>
  );
}