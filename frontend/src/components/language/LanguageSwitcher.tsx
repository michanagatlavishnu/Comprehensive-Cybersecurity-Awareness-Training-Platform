import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const selected =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="glass flex h-11 items-center gap-2 rounded-full px-4 border border-[var(--border)]"
      >
        <Globe className="text-[var(--primary)]" size={16} />

        <span>{selected.flag}</span>

        <span className="text-sm font-medium">{selected.label}</span>
      </button>

      {open && (
        <div className="glass absolute right-0 mt-3 w-44 rounded-2xl border border-[var(--border)] p-2 shadow-xl">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLanguage(item.code as any);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-[var(--card-hover)] ${
                language === item.code ? "bg-[var(--card-hover)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{item.flag}</span>

                <span className="text-sm">{item.label}</span>
              </div>

              {language === item.code && (
                <Check size={16} className="text-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}