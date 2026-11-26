import {
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
} from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="uppercase tracking-[5px] text-emerald-400 text-sm font-semibold">
              Contact Us
            </p>

            <h2 className="mt-4 text-5xl font-black text-white">
              Secure Your Workforce with CyberAware
            </h2>

            <p className="mt-7 text-slate-400 leading-8">
              Whether you're an enterprise, university, or organization,
              CyberAware helps improve employee cybersecurity awareness through
              AI-powered learning and phishing defense.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "support@cyberaware.ai",
                },
                {
                  icon: Phone,
                  title: "Support",
                  value: "+91 90000 00000",
                },
                {
                  icon: Globe,
                  title: "Website",
                  value: "www.cyberaware.ai",
                },
                {
                  icon: Building2,
                  title: "Enterprise",
                  value: "CyberAware Security Platform",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  value: "India",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                    <item.icon size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">{item.title}</p>

                    <h4 className="font-semibold text-white">
                      {item.value}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Enterprise Demo Request
            </h3>

            <div className="space-y-5">
              {["Organization Name", "Business Email", "Phone Number"].map(
                (placeholder) => (
                  <input
                    key={placeholder}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-emerald-400"
                  />
                )
              )}

              <textarea
                rows={5}
                placeholder="Tell us about your organization..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-emerald-400"
              />

              <button className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 font-semibold text-black hover:scale-[1.02] transition">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}