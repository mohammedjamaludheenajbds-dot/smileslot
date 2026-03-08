import { create } from "zustand";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const loadLanguage = (): Language => {
  try {
    return (localStorage.getItem("app_language") as Language) || "en";
  } catch {
    return "en";
  }
};

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: loadLanguage(),
  setLanguage: (lang) => {
    localStorage.setItem("app_language", lang);
    set({ language: lang });
  },
  t: (key: string) => {
    const lang = get().language;
    return translations[lang][key] || translations["en"][key] || key;
  },
}));
