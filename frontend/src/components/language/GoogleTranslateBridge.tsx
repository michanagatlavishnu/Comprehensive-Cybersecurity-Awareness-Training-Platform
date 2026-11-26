import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: { pageLanguage: string; autoDisplay: boolean }, elementId: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function setGoogleLanguage(language: string) {
  document.cookie = `googtrans=/en/${language}; path=/`;
  document.cookie = `googtrans=/en/${language}; path=/; domain=${window.location.hostname}`;

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select && select.value !== language) {
    select.value = language;
    select.dispatchEvent(new Event("change"));
  }
}

export default function GoogleTranslateBridge() {
  const { language } = useLanguage();

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element",
        );
        setGoogleLanguage(language);
      }
    };

    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setGoogleLanguage(language);
    }

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, [language]);

  return <div id="google_translate_element" className="hidden" aria-hidden="true" />;
}
