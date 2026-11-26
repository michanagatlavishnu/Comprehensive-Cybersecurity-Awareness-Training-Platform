import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import i18n from "../i18n";
import api from "../services/api";
import tokenService from "../services/auth/tokenService";

export type Language = "en" | "hi" | "te";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

function getSupportedLanguage(language: string | undefined): Language {
  const code = language?.split("-")[0];
  return code === "hi" || code === "te" ? code : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    getSupportedLanguage(
      localStorage.getItem("cyberaware-language") || i18n.language
    )
  );

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("cyberaware-language", nextLanguage);

    if (tokenService.getAccessToken()) {
      void api.put("/users/profile", { language: nextLanguage }).catch(() => undefined);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }

  return context;
}