import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import th from "@/locales/th.json";
import en from "@/locales/en.json";

export const SUPPORTED_LANGUAGES = ["th", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type TranslationKey = keyof typeof th;

const STORAGE_KEY = "mahidol-rac-language";

function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") return "th";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "th" ? stored : "th";
}

void i18n.use(initReactI18next).init({
  resources: {
    th: { translation: th },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: "th",
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
  react: { useSuspense: false },
});

function syncDocument(language: string) {
  if (typeof document === "undefined") return;

  const normalized: AppLanguage = language === "en" ? "en" : "th";
  document.documentElement.lang = normalized;
  document.title = normalized === "en" ? en["document.title"] : th["document.title"];
}

syncDocument(i18n.language);
i18n.on("languageChanged", syncDocument);

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  if (!SUPPORTED_LANGUAGES.includes(language)) return;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, language);
  }

  await i18n.changeLanguage(language);
}

export default i18n;
