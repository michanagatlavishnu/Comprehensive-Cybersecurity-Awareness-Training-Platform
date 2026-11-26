import {
  Award,
  BookOpenCheck,
  BrainCircuit,
  Clock3,
  FileWarning,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type:
    | "lesson"
    | "quiz"
    | "certificate"
    | "phishing"
    | "incident"
    | "xp"
    | "achievement";

  title: string;

  description: string;

  time: string;

  xp?: number;
}

interface Props {
  events?: TimelineEvent[];
}

export default function ActivityTimeline({ events }: Props) {
  const timeline: TimelineEvent[] =
    events ??
    [
      {
        id: "1",
        type: "lesson",
        title: "Completed Email Security Fundamentals",
        description:
          "Finished Module 4 with 98% completion score.",
        time: "Today • 09:15 AM",
        xp: 50,
      },
      {
        id: "2",
        type: "quiz",
        title: "Passed AI Generated Phishing Quiz",
        description: "Scored 94% in adaptive phishing assessment.",
        time: "Today • 10:45 AM",
        xp: 80,
      },
      {
        id: "3",
        type: "achievement",
        title: "Unlocked Password Guardian Badge",
        description:
          "Completed Password Security Lab without mistakes.",
        time: "Yesterday • 06:20 PM",
        xp: 30,
      },
      {
        id: "4",
        type: "certificate",
        title: "Email Security Certificate Issued",
        description:
          "Certificate generated after successful module completion.",
        time: "Yesterday • 04:10 PM",
      },
      {
        id: "5",
        type: "phishing",
        title: "Reported Simulated Phishing Email",
        description:
          "Correctly reported phishing campaign simulation.",
        time: "2 Days Ago",
        xp: 25,
      },
      {
        id: "6",
        type: "incident",
        title: "Incident Report Submitted",
        description:
          "Reported suspicious QR phishing attempt to SOC.",
        time: "3 Days Ago",
      },
      {
        id: "7",
        type: "xp",
        title: "Daily XP Goal Completed",
        description: "Earned 250 XP for today's learning streak.",
        time: "3 Days Ago",
        xp: 250,
      },
    ];

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-cyan-400">
            Activity Center
          </p>

          <h2 className="text-2xl font-black text-white">
            Recent Learning Timeline
          </h2>
        </div>

        <Clock3 className="text-cyan-400" size={28} />
      </div>

      <div className="relative border-l border-slate-700 pl-6">
        {timeline.map((event, index) => (
          <TimelineCard
            key={event.id}
            event={event}
            last={index === timeline.length - 1}
          />
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-5">
        <div className="mb-3 flex items-center gap-3">
          <Sparkles className="text-cyan-300" />

          <h3 className="font-bold text-cyan-300">
            AI Weekly Summary
          </h3>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          You completed 3 lessons, passed 2 quizzes, reported one phishing email,
          earned one certificate, and maintained a 12-day learning streak.
        </p>
      </div>
    </div>
  );
}

function TimelineCard({
  event,
  last,
}: {
  event: TimelineEvent;
  last: boolean;
}) {
  const styles = getTimelineStyle(event.type);

  return (
    <div className={`relative ${!last ? "pb-8" : ""}`}>
      <div
        className={`absolute -left-[37px] flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 ${styles.bg}`}
      >
        <styles.icon className={styles.color} size={18} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5 transition hover:border-cyan-500/30">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}
          >
            {event.type}
          </span>

          <span className="text-xs text-slate-500">
            {event.time}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white">
          {event.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {event.description}
        </p>

        {event.xp && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
            <Zap size={16} />

            +{event.xp} XP Earned
          </div>
        )}
      </div>
    </div>
  );
}

function getTimelineStyle(type: TimelineEvent["type"]) {
  switch (type) {
    case "lesson":
      return {
        icon: BookOpenCheck,
        bg: "bg-emerald-500/10",
        color: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-300",
      };

    case "quiz":
      return {
        icon: BrainCircuit,
        bg: "bg-violet-500/10",
        color: "text-violet-400",
        badge: "bg-violet-500/10 text-violet-300",
      };

    case "certificate":
      return {
        icon: Trophy,
        bg: "bg-yellow-500/10",
        color: "text-yellow-400",
        badge: "bg-yellow-500/10 text-yellow-300",
      };

    case "phishing":
      return {
        icon: ShieldAlert,
        bg: "bg-cyan-500/10",
        color: "text-cyan-400",
        badge: "bg-cyan-500/10 text-cyan-300",
      };

    case "incident":
      return {
        icon: FileWarning,
        bg: "bg-red-500/10",
        color: "text-red-400",
        badge: "bg-red-500/10 text-red-300",
      };

    case "achievement":
      return {
        icon: Award,
        bg: "bg-orange-500/10",
        color: "text-orange-400",
        badge: "bg-orange-500/10 text-orange-300",
      };

    default:
      return {
        icon: Zap,
        bg: "bg-emerald-500/10",
        color: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-300",
      };
  }
}