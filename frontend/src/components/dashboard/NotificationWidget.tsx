import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  BookOpenCheck,
  Trophy,
  TriangleAlert,
  Info,
  Filter,
  Clock3,
  CheckCircle2,
  Circle,
} from "lucide-react";

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: "security" | "training" | "achievement" | "system";
  priority: "critical" | "high" | "medium" | "low";
  created_at: string;
  read: boolean;
}

interface Props {
  notifications?: DashboardNotification[];
}

const demoNotifications: DashboardNotification[] = [
  {
    id: "1",
    title: "Critical Phishing Campaign Detected",
    message:
      "A simulated phishing campaign was delivered to your inbox. Review and report suspicious emails.",
    type: "security",
    priority: "critical",
    created_at: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "AI Quiz Available",
    message:
      "Today's adaptive phishing awareness quiz is now available.",
    type: "training",
    priority: "high",
    created_at: "25 minutes ago",
    read: false,
  },
  {
    id: "3",
    title: "Certificate Earned",
    message:
      "Congratulations! You earned the Email Security Fundamentals certificate.",
    type: "achievement",
    priority: "medium",
    created_at: "Yesterday",
    read: true,
  },
  {
    id: "4",
    title: "Password Security Reminder",
    message:
      "Complete Password Security Lab before Friday to improve awareness score.",
    type: "training",
    priority: "medium",
    created_at: "Yesterday",
    read: false,
  },
  {
    id: "5",
    title: "System Maintenance",
    message:
      "CyberAware services will undergo maintenance this weekend.",
    type: "system",
    priority: "low",
    created_at: "2 days ago",
    read: true,
  },
];

export default function NotificationWidget({
  notifications,
}: Props) {
  const [items, setItems] = useState(
    notifications ?? demoNotifications
  );

  const [filter, setFilter] = useState<
    "all" | "unread" | "security" | "training"
  >("all");

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return items.filter((n) => !n.read);

      case "security":
        return items.filter((n) => n.type === "security");

      case "training":
        return items.filter((n) => n.type === "training");

      default:
        return items;
    }
  }, [items, filter]);

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-cyan-400">
            Notification Center
          </p>

          <h2 className="text-2xl font-black text-white">
            Alerts & Updates
          </h2>
        </div>

        <div className="relative">
          <Bell className="text-cyan-400" size={30} />

          {unreadCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["all", "unread", "security", "training"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === tab
                  ? "bg-cyan-500 text-black"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
        >
          <CheckCheck size={16} />

          Mark All Read
        </button>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={() => markAsRead(notification.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Info className="text-cyan-300" size={18} />

          <p className="font-semibold text-cyan-300">
            AI Notification Summary
          </p>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          You have {unreadCount} unread notifications. One critical phishing
          simulation requires immediate attention and today's AI quiz is ready.
        </p>
      </div>
    </section>
  );
}

/* =======================================================
   Notification Card
======================================================= */

function NotificationCard({
  notification,
  onRead,
}: {
  notification: DashboardNotification;
  onRead: () => void;
}) {
  const config = notificationStyle(notification);

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:border-cyan-500/30 ${
        notification.read
          ? "border-white/10 bg-slate-800/40"
          : "border-cyan-500/20 bg-slate-800/70"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconBg}`}
          >
            <config.icon className={config.iconColor} size={22} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-white">
                {notification.title}
              </h3>

              <PriorityBadge priority={notification.priority} />
            </div>

            <p className="text-sm leading-6 text-slate-400">
              {notification.message}
            </p>
          </div>
        </div>

        {!notification.read ? (
          <button
            onClick={onRead}
            className="rounded-full bg-cyan-500/10 p-2 text-cyan-300 hover:bg-cyan-500/20"
          >
            <CheckCircle2 size={18} />
          </button>
        ) : (
          <CheckCircle2 className="text-emerald-400" size={18} />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Clock3 size={14} />

          {notification.created_at}
        </div>

        <div className="flex items-center gap-2">
          {notification.read ? (
            <>
              <CheckCircle2
                size={14}
                className="text-emerald-400"
              />
              Read
            </>
          ) : (
            <>
              <Circle size={10} className="text-cyan-400" />
              Unread
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   Priority Badge
======================================================= */

function PriorityBadge({
  priority,
}: {
  priority: DashboardNotification["priority"];
}) {
  const styles = {
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-cyan-500/20 text-cyan-300",
    low: "bg-slate-700 text-slate-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

/* =======================================================
   Empty State
======================================================= */

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 py-12 text-center">
      <Bell className="mx-auto mb-4 text-slate-600" size={42} />

      <h3 className="text-lg font-bold text-slate-300">
        You're All Caught Up
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        No notifications match the selected filter.
      </p>
    </div>
  );
}

/* =======================================================
   Notification Type Styling
======================================================= */

function notificationStyle(notification: DashboardNotification) {
  switch (notification.type) {
    case "security":
      return {
        icon: ShieldAlert,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
      };

    case "training":
      return {
        icon: BookOpenCheck,
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
      };

    case "achievement":
      return {
        icon: Trophy,
        iconBg: "bg-yellow-500/10",
        iconColor: "text-yellow-400",
      };

    default:
      return {
        icon: TriangleAlert,
        iconBg: "bg-violet-500/10",
        iconColor: "text-violet-400",
      };
  }
}