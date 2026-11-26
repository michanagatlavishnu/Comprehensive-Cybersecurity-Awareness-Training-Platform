import { useLearningProgress } from "../../../hooks/useTraining";
import {
  Trophy,
  Flame,
  BookOpen,
  BrainCircuit,
  ShieldCheck,
  Clock3,
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Star,
} from "lucide-react";

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  xp: number;
  lessonsCompleted: number;
  totalLessons: number;
  color: string;
}

const courses: CourseProgress[] = [
  {
    id: 1,
    title: "Email Security Fundamentals",
    progress: 78,
    xp: 150,
    lessonsCompleted: 6,
    totalLessons: 8,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    title: "Password Security Lab",
    progress: 55,
    xp: 120,
    lessonsCompleted: 5,
    totalLessons: 9,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 3,
    title: "Social Engineering Awareness",
    progress: 31,
    xp: 240,
    lessonsCompleted: 3,
    totalLessons: 10,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Cloud Security Essentials",
    progress: 15,
    xp: 300,
    lessonsCompleted: 2,
    totalLessons: 12,
    color: "from-violet-500 to-indigo-500",
  },
];

const weeklyProgress = [
  { day: "Mon", hours: 1.2 },
  { day: "Tue", hours: 2.1 },
  { day: "Wed", hours: 0.8 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 3.4 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 1.9 },
];

const achievements = [
  "Completed Email Security Module 1",
  "First Phishing Simulation Passed",
  "Maintained 7-Day Learning Streak",
  "Generated AI Notes for 5 Lessons",
  "Scored 92% in Practice Quiz",
];

export default function LearningProgress() {
  const { data: progressData, isLoading } = useLearningProgress();
  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading learning progress...</div>;
  }

  const actualProgress = progressData as any;
  const completedLessons = actualProgress?.completed_lessons ?? 0;
  const totalLessons = actualProgress?.total_lessons ?? 0;
  const awarenessScore = actualProgress?.awareness_score ?? 0;
  const totalXP = actualProgress?.xp ?? 0;
  const avgProgress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 py-8">
      {/* HERO */}

      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 via-slate-900 to-violet-600/10 p-8">
        <p className="uppercase tracking-[3px] text-cyan-400 text-sm">
          CyberAware Learning Dashboard
        </p>

        <h1 className="mt-2 text-5xl font-black">
          My Learning Progress
        </h1>

        <p className="mt-4 max-w-3xl text-slate-400 leading-7">
          Track course completion, XP earned, learning streaks, certificates,
          AI activity, and cybersecurity awareness growth.
        </p>
      </section>

      {/* STATS */}

      <section className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Trophy}
          label="Total XP Earned"
          value={`${totalXP}`}
          color="yellow"
        />

        <StatCard
          icon={Flame}
          label="Learning Streak"
          value="12 Days"
          color="orange"
        />

        <StatCard
          icon={BookOpen}
          label="Courses Completed"
          value="4 / 10"
          color="cyan"
        />

        <StatCard
          icon={TrendingUp}
          label="Average Progress"
          value={`${avgProgress}%`}
          color="emerald"
        />
      </section>

      {/* OVERALL PROGRESS */}

      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Target className="text-cyan-400" size={28} />
          <h2 className="text-2xl font-bold">Overall Awareness Progress</h2>
        </div>

        <div className="mb-4 flex justify-between">
          <span>Cyber Awareness Level</span>
          <span className="text-cyan-300">{awarenessScore}%</span>
        </div>

        <div className="h-4 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
            style={{ width: `${avgProgress}%` }}
          />
        </div>

        <p className="mt-5 text-slate-400">
          Complete AI quizzes and phishing simulations to increase your awareness score.
        </p>
      </section>

      {/* COURSE PROGRESS */}

      <section className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="text-cyan-300" size={28} />
          <h2 className="text-2xl font-bold">Course Progress</h2>
        </div>

        <div className="space-y-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{course.title}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {course.lessonsCompleted} / {course.totalLessons} Lessons Completed
                  </p>
                </div>

                <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
                  +{course.xp} XP
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span>{course.progress}% Completed</span>
                <span>{course.progress}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY LEARNING HOURS */}

      <section className="mb-10 rounded-3xl border border-violet-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Clock3 className="text-violet-300" size={28} />
          <h2 className="text-2xl font-bold">Weekly Learning Activity</h2>
        </div>

        <div className="flex items-end justify-between gap-3 h-64">
          {weeklyProgress.map((item) => (
            <div
              key={item.day}
              className="flex flex-1 flex-col items-center justify-end gap-3"
            >
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-cyan-400"
                style={{ height: `${item.hours * 45}px` }}
              />

              <span className="text-xs text-slate-400">{item.day}</span>

              <span className="text-xs text-cyan-300">{item.hours}h</span>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}

      <section className="mb-10 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-slate-900 to-orange-500/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Award className="text-yellow-300" size={28} />
          <h2 className="text-2xl font-bold">Recent Achievements</h2>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement}
              className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-4"
            >
              <CheckCircle2 className="text-yellow-300" size={20} />
              <span>{achievement}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI ACTIVITY */}

      <section className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ActivityCard
          icon={BrainCircuit}
          title="AI Notes Generated"
          value="18"
          color="violet"
        />

        <ActivityCard
          icon={ShieldCheck}
          title="Phishing Reports Submitted"
          value="12"
          color="emerald"
        />

        <ActivityCard
          icon={Star}
          title="AI Flashcards Completed"
          value="46"
          color="cyan"
        />

        <ActivityCard
          icon={Trophy}
          title="Practice Quiz Accuracy"
          value="91%"
          color="yellow"
        />
      </section>

      {/* PART 2 STARTS HERE */}


      {/* ================= LEARNING TIMELINE ================= */}

      <section className="mb-10 rounded-3xl border border-violet-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Clock3 className="text-violet-300" size={28} />
          <h2 className="text-2xl font-bold">Learning Timeline</h2>
        </div>

        <div className="space-y-6">
          {[
            {
              date: "Today • 11:40 AM",
              title: "Completed Module 6 — AI Generated Phishing Emails",
              xp: "+20 XP",
            },
            {
              date: "Yesterday • 06:15 PM",
              title: "Generated AI Notes for Email Security Lesson",
              xp: "+10 XP",
            },
            {
              date: "Yesterday • 05:40 PM",
              title: "Completed Practice Quiz — Score 92%",
              xp: "+25 XP",
            },
            {
              date: "2 Days Ago",
              title: "Finished Phishing Simulation Exercise",
              xp: "+30 XP",
            },
            {
              date: "3 Days Ago",
              title: "Downloaded CyberAware Study Resources",
              xp: "+5 XP",
            },
          ].map((event, index) => (
            <div key={index} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="h-5 w-5 rounded-full bg-violet-400" />
                {index !== 4 && (
                  <div className="mt-2 h-full w-[2px] bg-violet-500/30" />
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-white/10 bg-slate-800/60 p-5">
                <p className="text-xs uppercase tracking-[2px] text-violet-300">
                  {event.date}
                </p>

                <h3 className="mt-2 font-semibold">{event.title}</h3>

                <p className="mt-3 text-sm text-cyan-300">{event.xp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CERTIFICATES PROGRESS ================= */}

      <section className="mb-10 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-slate-900 to-orange-500/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Award className="text-yellow-300" size={28} />
          <h2 className="text-2xl font-bold">Certificate Progress</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[
            {
              course: "Email Security Fundamentals",
              progress: 78,
              status: "In Progress",
            },
            {
              course: "Password Security Lab",
              progress: 55,
              status: "In Progress",
            },
            {
              course: "Social Engineering Awareness",
              progress: 31,
              status: "Locked",
            },
            {
              course: "Cloud Security Essentials",
              progress: 15,
              status: "Locked",
            },
          ].map((item) => (
            <div
              key={item.course}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">{item.course}</h3>

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                  {item.status}
                </span>
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span>Completion</span>
                <span>{item.progress}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <button className="mt-5 rounded-full bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/20">
                View Certificate Status
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SKILL PROGRESS ================= */}

      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="text-cyan-300" size={28} />
          <h2 className="text-2xl font-bold">Cybersecurity Skill Progress</h2>
        </div>

        <div className="space-y-5">
          {[
            ["Email Security", 92],
            ["Password Hygiene", 81],
            ["Social Engineering Detection", 74],
            ["AI Phishing Awareness", 67],
            ["Cloud Security Basics", 58],
            ["Incident Reporting", 86],
            ["Data Privacy (GDPR)", 79],
            ["Zero Trust Security", 61],
          ].map(([skill, value]) => (
            <div key={String(skill)}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{skill}</span>
                <span className="text-cyan-300">{value}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BADGES ================= */}

      <section className="mb-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="text-emerald-300" size={28} />
          <h2 className="text-2xl font-bold">Achievement Badges</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Phishing Hunter", "Completed phishing simulations."],
            ["AI Learner", "Generated AI notes for 10 lessons."],
            ["Security Champion", "Scored above 90% in quizzes."],
            ["12-Day Streak", "Maintained daily learning streak."],
            ["Incident Reporter", "Reported simulated phishing emails."],
            ["Password Master", "Completed Password Security Lab."],
            ["Email Defender", "Completed Email Security course."],
            ["Cyber Explorer", "Started Cloud Security course."],
          ].map(([badge, desc]) => (
            <div
              key={String(badge)}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-center"
            >
              <Award className="mx-auto text-yellow-300" size={36} />

              <h3 className="mt-4 font-bold">{badge}</h3>

              <p className="mt-2 text-xs leading-6 text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AI RECOMMENDATIONS ================= */}

      <section className="mb-10 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-slate-900 to-cyan-600/10 p-7">
        <div className="mb-6 flex items-center gap-3">
          <BrainCircuit className="text-violet-300" size={28} />
          <h2 className="text-2xl font-bold">AI Recommended Next Lessons</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[
            {
              course: "Cloud Security Essentials",
              reason: "Based on your Email Security completion and phishing score.",
            },
            {
              course: "Prompt Injection & AI Security",
              reason: "You've completed AI Generated Phishing Emails lesson.",
            },
            {
              course: "Data Privacy & GDPR",
              reason: "Recommended after Incident Reporting module.",
            },
            {
              course: "Zero Trust Enterprise Security",
              reason: "Matches your current awareness level.",
            },
          ].map((item) => (
            <div
              key={item.course}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
            >
              <h3 className="font-semibold text-violet-300">{item.course}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.reason}
              </p>

              <button className="mt-5 rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-300 hover:bg-violet-500/20">
                Start Course
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MONTHLY GOALS ================= */}

      <section className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Target className="text-cyan-400" size={28} />
          <h2 className="text-2xl font-bold">Monthly Learning Goals</h2>
        </div>

        <div className="space-y-5">
          {[
            ["Complete 4 Cybersecurity Courses", 65],
            ["Earn 1000 XP", 72],
            ["Finish 20 AI Practice Quizzes", 48],
            ["Maintain 30-Day Learning Streak", 40],
            ["Complete 5 Phishing Simulations", 80],
          ].map(([goal, value]) => (
            <div key={String(goal)}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{goal}</span>
                <span className="text-cyan-300">{value}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LEARNING INSIGHTS ================= */}

      <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 via-slate-900 to-emerald-600/10 p-8">
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="text-cyan-300" size={30} />
          <h2 className="text-3xl font-black">AI Learning Insights</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[
            "You perform best on Email Security topics.",
            "Quiz accuracy increased from 74% to 91% this week.",
            "AI Notes improve quiz accuracy by approximately 18%.",
            "Complete Cloud Security next for balanced awareness score.",
            "Your phishing detection speed has improved significantly.",
            "Keep your streak alive to earn bonus XP tomorrow.",
          ].map((insight) => (
            <div
              key={insight}
              className="rounded-2xl bg-slate-900/60 p-5"
            >
              <CheckCircle2 className="mb-3 text-emerald-400" size={20} />
              <p className="text-slate-300">{insight}</p>
            </div>
          ))}
        </div>

        <button className="mt-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-black">
          Continue Learning Journey
        </button>
      </section>
   
      
    </div>
  );
}

/* ---------- Helper Components ---------- */

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: "yellow" | "orange" | "cyan" | "emerald";
}) {
  const styles = {
    yellow: "text-yellow-300",
    orange: "text-orange-300",
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center">
      <Icon className={`mx-auto ${styles[color]}`} size={30} />
      <p className="mt-4 text-xs uppercase tracking-[2px] text-slate-500">
        {label}
      </p>
      <h3 className="mt-2 text-3xl font-black">{value}</h3>
    </div>
  );
}

function ActivityCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: string;
  color: "violet" | "emerald" | "cyan" | "yellow";
}) {
  const styles = {
    violet: "text-violet-300",
    emerald: "text-emerald-300",
    cyan: "text-cyan-300",
    yellow: "text-yellow-300",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center">
      <Icon className={`mx-auto ${styles[color]}`} size={28} />
      <h3 className="mt-4 text-3xl font-black">{value}</h3>
      <p className="mt-2 text-sm text-slate-400">{title}</p>
    </div>
  );
}
