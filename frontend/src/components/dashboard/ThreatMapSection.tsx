import { motion } from "framer-motion";
import {
  Globe2,
  Radar,
  ShieldAlert,
  Activity,
  Wifi,
} from "lucide-react";

const attacks = [
  { country: "India", type: "Phishing", count: "12,450" },
  { country: "USA", type: "Malware", count: "8,231" },
  { country: "Germany", type: "Credential Theft", count: "5,804" },
  { country: "Singapore", type: "Ransomware", count: "3,552" },
  { country: "Japan", type: "Email Attack", count: "6,122" },
];

export default function ThreatMapSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[5px] text-red-400 text-sm font-semibold">
            Global Threat Intelligence
          </p>

          <h2 className="mt-5 text-5xl font-black text-white">
            Live Cyber Attack Intelligence Dashboard
          </h2>

          <p className="mt-6 text-slate-400 max-w-3xl mx-auto leading-8">
            CyberAware continuously monitors phishing trends, malware campaigns,
            ransomware attacks, credential theft, and suspicious email activity
            across global regions.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* World Map */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(14,165,233,0.12)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <Globe2 className="text-cyan-400" size={34} />

              <div>
                <h3 className="font-bold text-2xl text-white">
                  Cyber Threat World Map
                </h3>

                <p className="text-slate-400 text-sm">
                  Simulated live enterprise intelligence feed
                </p>
              </div>
            </div>

            <div className="relative h-[360px] rounded-2xl border border-cyan-500/20 bg-slate-950 overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 40,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="h-56 w-56 rounded-full border border-cyan-400/30" />
              </motion.div>

              <motion.div
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.9)]"
              />

              {[
                ["20%", "30%"],
                ["70%", "40%"],
                ["35%", "70%"],
                ["55%", "20%"],
                ["80%", "65%"],
              ].map(([left, top], index) => (
                <motion.div
                  key={index}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + index,
                  }}
                  style={{ left, top }}
                  className="absolute h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,.8)]"
                />
              ))}
            </div>
          </motion.div>

          {/* Attack Feed */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {attacks.map((attack) => (
              <div
                key={attack.country}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl hover:border-red-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {attack.country}
                    </h4>

                    <p className="text-red-400 text-sm">{attack.type}</p>
                  </div>

                  <ShieldAlert className="text-red-400" size={28} />
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Detected Today</span>

                  <span className="font-bold text-white">{attack.count}</span>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  title: "Threats",
                  value: "41K",
                  icon: Activity,
                },
                {
                  title: "Live Radar",
                  value: "328",
                  icon: Radar,
                },
                {
                  title: "Network Events",
                  value: "1.2M",
                  icon: Wifi,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center"
                >
                  <item.icon
                    className="mx-auto text-cyan-400 mb-2"
                    size={24}
                  />

                  <h4 className="font-black text-white text-xl">
                    {item.value}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}