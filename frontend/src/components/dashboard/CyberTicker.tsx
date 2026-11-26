import { motion } from "framer-motion";
import {
  ShieldAlert,
  Globe,
  MailWarning,
  Bug,
  LockKeyhole,
  Wifi,
  TriangleAlert,
} from "lucide-react";

const tickerItems = [
  {
    icon: MailWarning,
    text: "⚠️ 3.4 Million phishing emails blocked worldwide in the last 24 hours.",
    color: "text-red-400",
  },
  {
    icon: Bug,
    text: "🛡️ Critical ransomware campaigns detected targeting enterprise users.",
    color: "text-orange-400",
  },
  {
    icon: ShieldAlert,
    text: "🔒 New zero-day vulnerability reported in enterprise authentication systems.",
    color: "text-emerald-400",
  },
  {
    icon: Globe,
    text: "🌍 Live cyber threat intelligence monitoring across global networks.",
    color: "text-sky-400",
  },
  {
    icon: LockKeyhole,
    text: "🔑 Weak passwords remain one of the top causes of security breaches.",
    color: "text-yellow-400",
  },
  {
    icon: Wifi,
    text: "📡 AI-powered phishing detection protects enterprise employees in real time.",
    color: "text-violet-400",
  },
  {
    icon: TriangleAlert,
    text: "🚨 Social engineering attacks continue to be the #1 human security threat.",
    color: "text-pink-400",
  },
];

export default function CyberTicker() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-4 backdrop-blur-xl">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-violet-500/5" />

      <div className="relative flex items-center gap-4 overflow-hidden whitespace-nowrap">
        {/* LIVE Badge */}
        <div className="ml-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-white shadow-lg">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          LIVE CYBER THREAT FEED
        </div>

        {/* Infinite Ticker */}
        <motion.div
          className="flex gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: "linear",
          }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm font-medium"
            >
              <item.icon className={item.color} size={18} />

              <span className="text-[var(--text-secondary)]">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}