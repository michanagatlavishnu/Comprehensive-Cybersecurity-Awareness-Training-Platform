import { useMemo } from "react";
import {
  Award,
  BadgeCheck,
  BrainCircuit,
  Flame,
  Lock,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "quiz" | "certificate" | "streak" | "xp" | "star";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  progress: number;
  xpReward: number;
}

interface Props {
  achievements?: Achievement[];
  currentXP?: number;
  currentLevel?: number;
}

const sampleAchievements: Achievement[] = [
  {
    id: "1",
    title: "Email Security Expert",
    description: "Complete Email Security Fundamentals course.",
    icon: "shield",
    rarity: "common",
    unlocked: true,
    progress: 100,
    xpReward: 150,
  },
  {
    id: "2",
    title: "Phishing Hunter",
    description: "Successfully report 10 phishing emails.",
    icon: "shield",
    rarity: "rare",
    unlocked: true,
    progress: 100,
    xpReward: 250,
  },
  {
    id: "3",
    title: "AI Quiz Master",
    description: "Score above 90% in five AI quizzes.",
    icon: "quiz",
    rarity: "epic",
    unlocked: false,
    progress: 80,
    xpReward: 400,
  },
  {
    id: "4",
    title: "Cyber Guardian",
    description: "Maintain awareness score above 95 for 30 days.",
    icon: "star",
    rarity: "legendary",
    unlocked: false,
    progress: 55,
    xpReward: 1000,
  },
  {
    id: "5",
    title: "Learning Streak Hero",
    description: "Maintain a 15-day learning streak.",
    icon: "streak",
    rarity: "rare",
    unlocked: true,
    progress: 100,
    xpReward: 300,
  },
  {
    id: "6",
    title: "Certificate Collector",
    description: "Earn five CyberAware certificates.",
    icon: "certificate",
    rarity: "epic",
    unlocked: false,
    progress: 60,
    xpReward: 500,
  },
  {
    id: "7",
    title: "XP Champion",
    description: "Earn 5,000 XP in CyberAware.",
    icon: "xp",
    rarity: "legendary",
    unlocked: false,
    progress: 72,
    xpReward: 750,
  },
  {
    id: "8",
    title: "Password Defender",
    description: "Complete Password Security Lab perfectly.",
    icon: "shield",
    rarity: "rare",
    unlocked: true,
    progress: 100,
    xpReward: 220,
  },
];

export default function AchievementCards({
  achievements,
  currentXP = 2840,
  currentLevel = 8,
}: Props) {
  const items = achievements ?? sampleAchievements;

  const unlocked = useMemo(
    () => items.filter((a) => a.unlocked).length,
    [items]
  );

  const locked = items.length - unlocked;

  const earnedXP = useMemo(
    () =>
      items
        .filter((a) => a.unlocked)
        .reduce((sum, item) => sum + item.xpReward, 0),
    [items]
  );

  const nextLevelXP = 3500;
  const progress = Math.round((currentXP / nextLevelXP) * 100);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-yellow-400">
            Rewards Center
          </p>

          <h2 className="text-3xl font-black text-white">
            Achievements & Badges
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Earn XP, unlock badges, complete certifications, and become a Cyber Guardian.
          </p>
        </div>

        <Trophy className="text-yellow-400" size={34} />
      </div>

      {/* XP LEVEL CARD */}
      <div className="mb-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-yellow-300">
              Current Level
            </p>

            <h3 className="mt-2 text-5xl font-black text-white">
              Level {currentLevel}
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-400 bg-yellow-500/10">
            <Zap className="text-yellow-300" size={36} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-slate-300">
            <span>Progress to Level {currentLevel + 1}</span>

            <span>{progress}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <SummaryCard
          title="Unlocked"
          value={unlocked}
          icon={BadgeCheck}
          color="emerald"
        />

        <SummaryCard
          title="Locked"
          value={locked}
          icon={Lock}
          color="red"
        />

        <SummaryCard
          title="Achievement XP"
          value={earnedXP}
          icon={Zap}
          color="yellow"
        />

        <SummaryCard
          title="Certificates"
          value={2}
          icon={GraduationCap}
          color="cyan"
        />
      </div>

      {/* BADGE GRID */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>

      {/* MILESTONES */}
      <div className="mt-10 rounded-3xl border border-violet-500/20 bg-slate-800/50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Award className="text-violet-400" />

          <h3 className="text-xl font-bold text-white">
            Milestone Rewards
          </h3>
        </div>

        <div className="space-y-5">
          <Milestone
            title="1,000 XP Milestone"
            reward="Cyber Rookie Badge"
            completed
          />

          <Milestone
            title="2,500 XP Milestone"
            reward="Cyber Defender Badge"
            completed
          />

          <Milestone
            title="3,500 XP Milestone"
            reward="Level 9 + AI Security Champion Badge"
            progress={81}
          />

          <Milestone
            title="5,000 XP Milestone"
            reward="Cyber Guardian Legendary Badge"
            progress={57}
          />
        </div>
      </div>

      {/* CERTIFICATES */}
      <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <GraduationCap className="text-cyan-300" />

          <h3 className="text-xl font-bold text-white">
            Earned Certificates
          </h3>
        </div>

        <CertificateCard
          title="Email Security Fundamentals"
          date="Issued: September 2026"
        />

        <CertificateCard
          title="Password Security Awareness"
          date="Issued: September 2026"
        />

        <button className="mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black transition hover:scale-105">
          View All Certificates
        </button>
      </div>

      {/* AI RECOMMENDATIONS */}
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="text-emerald-300" />

          <h3 className="font-bold text-emerald-300">
            AI Recommended Achievements
          </h3>
        </div>

        <Recommendation
          text="Complete AI Quiz Master achievement to earn +400 XP."
        />

        <Recommendation
          text="Maintain a 20-day learning streak for Legendary Badge progress."
        />

        <Recommendation
          text="Finish Cloud Security module to unlock Security Architect badge."
        />

        <Recommendation
          text="Report 3 more phishing emails to unlock Phishing Hunter Elite."
        />
      </div>
    </section>
  );
}

/* ============================================================
   ACHIEVEMENT CARD
============================================================ */

function AchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const rarity = rarityStyle(achievement.rarity);

  return (
    <div
      className={`rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        achievement.unlocked
          ? rarity.border
          : "border-white/10 bg-slate-800/40 opacity-80"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${rarity.bg}`}
        >
          {achievement.unlocked ? (
            <AchievementIcon type={achievement.icon} color={rarity.color} />
          ) : (
            <Lock className="text-slate-500" size={24} />
          )}
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${rarity.badge}`}>
          {achievement.rarity}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white">
        {achievement.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {achievement.description}
      </p>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>Progress</span>

          <span>{achievement.progress}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${rarity.gradient}`}
            style={{ width: `${achievement.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-300">
          <Zap size={16} />

          {achievement.xpReward} XP
        </div>

        {achievement.unlocked ? (
          <BadgeCheck className="text-emerald-400" size={20} />
        ) : (
          <Lock className="text-slate-500" size={20} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ICONS
============================================================ */

function AchievementIcon({
  type,
  color,
}: {
  type: Achievement["icon"];
  color: string;
}) {
  switch (type) {
    case "shield":
      return <ShieldCheck className={color} size={26} />;

    case "quiz":
      return <BrainCircuit className={color} size={26} />;

    case "certificate":
      return <GraduationCap className={color} size={26} />;

    case "streak":
      return <Flame className={color} size={26} />;

    case "xp":
      return <Zap className={color} size={26} />;

    default:
      return <Star className={color} size={26} />;
  }
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: "emerald" | "red" | "yellow" | "cyan";
}) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${styles[color]}`}>
        <Icon size={24} />
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        {value}
      </h3>
    </div>
  );
}

/* ============================================================
   MILESTONE CARD
============================================================ */

function Milestone({
  title,
  reward,
  completed,
  progress,
}: {
  title: string;
  reward: string;
  completed?: boolean;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-bold text-white">{title}</h4>

        {completed ? (
          <CheckCircle2 className="text-emerald-400" size={20} />
        ) : (
          <Lock className="text-slate-500" size={20} />
        )}
      </div>

      <p className="mb-4 text-sm text-slate-400">
        Reward: {reward}
      </p>

      {completed ? (
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Completed
        </span>
      ) : (
        <>
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>Progress</span>

            <span>{progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   CERTIFICATE CARD
============================================================ */

function CertificateCard({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white">{title}</h4>

          <p className="mt-1 text-sm text-slate-400">{date}</p>
        </div>

        <Medal className="text-cyan-400" size={28} />
      </div>
    </div>
  );
}

/* ============================================================
   AI RECOMMENDATIONS
============================================================ */

function Recommendation({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <Sparkles className="text-emerald-400" size={18} />

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

/* ============================================================
   RARITY STYLE
============================================================ */

function rarityStyle(rarity: Achievement["rarity"]) {
  switch (rarity) {
    case "common":
      return {
        border: "border-emerald-500/30 bg-emerald-500/5",
        bg: "bg-emerald-500/10",
        color: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-300",
        gradient: "from-emerald-400 to-green-500",
      };

    case "rare":
      return {
        border: "border-cyan-500/30 bg-cyan-500/5",
        bg: "bg-cyan-500/10",
        color: "text-cyan-400",
        badge: "bg-cyan-500/10 text-cyan-300",
        gradient: "from-cyan-400 to-blue-500",
      };

    case "epic":
      return {
        border: "border-violet-500/30 bg-violet-500/5",
        bg: "bg-violet-500/10",
        color: "text-violet-400",
        badge: "bg-violet-500/10 text-violet-300",
        gradient: "from-violet-400 to-purple-500",
      };

    default:
      return {
        border: "border-yellow-500/30 bg-yellow-500/5",
        bg: "bg-yellow-500/10",
        color: "text-yellow-400",
        badge: "bg-yellow-500/10 text-yellow-300",
        gradient: "from-yellow-400 via-orange-400 to-red-500",
      };
  }
}