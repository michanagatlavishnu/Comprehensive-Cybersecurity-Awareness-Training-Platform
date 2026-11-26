import { MoonStar, Sun, Globe, Languages } from "lucide-react";

export default function ThemePreviewSection() {
  return (
    <section className="bg-[#050816] py-28">
      <div className="full-container">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="glass rounded-[36px] p-8">
            <div className="mb-6 flex items-center gap-3">
              <MoonStar className="text-violet-400" size={30} />
              <h3 className="text-2xl font-bold">Dark & Light Experience</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-[#090C18] p-6 border border-white/5">
                <MoonStar className="text-violet-400 mb-4" size={28} />
                <h4 className="font-semibold mb-2">Dark Theme</h4>
                <p className="text-sm text-slate-400">
                  Enterprise glass UI optimized for security operations.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-black">
                <Sun className="text-yellow-500 mb-4" size={28} />
                <h4 className="font-semibold mb-2">Light Theme</h4>
                <p className="text-sm text-slate-600">
                  Bright dashboard with the same enterprise layout.
                </p>
              </div>
            </div>

            <button className="mt-8 rounded-full bg-violet-500 px-6 py-3 font-semibold">
              Switch Theme
            </button>
          </div>

          <div className="glass rounded-[36px] p-8">
            <div className="mb-6 flex items-center gap-3">
              <Languages className="text-emerald-400" size={30} />
              <h3 className="text-2xl font-bold">
                Multilingual Learning Platform
              </h3>
            </div>

            {[
              ["🇺🇸 English", "Complete enterprise UI in English."],
              ["🇮🇳 हिन्दी", "Full cybersecurity lessons translated into Hindi."],
              ["🇮🇳 తెలుగు", "Complete UI and training available in Telugu."],
            ].map(([lang, desc]) => (
              <div
                key={lang}
                className="mb-5 rounded-2xl border border-white/5 bg-white/5 p-5"
              >
                <div className="mb-2 flex items-center gap-3">
                  <Globe className="text-emerald-400" size={20} />
                  <h4 className="font-semibold">{lang}</h4>
                </div>

                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}

            <button className="mt-4 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black">
              Change Language
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}