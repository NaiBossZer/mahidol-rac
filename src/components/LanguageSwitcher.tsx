import { useTranslation } from "react-i18next";
import { setAppLanguage, type AppLanguage } from "@/i18n";

const LANGUAGES: readonly AppLanguage[] = ["th", "en"];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const activeLanguage: AppLanguage = i18n.language === "en" ? "en" : "th";

  return (
    <div
      className="inline-flex items-center rounded-lg border border-white/15 bg-white/[0.06] p-0.5"
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((language) => {
        const active = activeLanguage === language;
        return (
          <button
            key={language}
            type="button"
            onClick={() => void setAppLanguage(language)}
            aria-pressed={active}
            className={`min-w-9 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold ${
              active
                ? "bg-white text-rac-blue shadow-sm"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
