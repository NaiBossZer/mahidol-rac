import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { homepageSectionImages } from "@/features/home/homepageSectionImages";
import type { TranslationKey } from "@/i18n";

const journey = [
  { no: "01", icon: "🪲", key: "whatIsLac", href: "/lac/what-is-lac", image: homepageSectionImages.learningJourney, alt: "ภาพสำหรับเส้นทางการเรียนรู้ครั่ง" },
  { no: "02", icon: "🔬", key: "lifeCycle", href: "/lac/life-cycle", image: homepageSectionImages.lifecycle, alt: "ภาพวงจรชีวิตครั่ง" },
  { no: "03", icon: "🌳", key: "habitat", href: "/lac/habitat", image: homepageSectionImages.learningJourney, alt: "ภาพระบบนิเวศสำหรับครั่ง" },
  { no: "04", icon: "🌱", key: "hostPlants", href: "/lac/host-plants", image: homepageSectionImages.learningJourney, alt: "ภาพต้นพิงอาศัย" },
  { no: "05", icon: "🌾", key: "lacFarming", href: "/lac/lac-farming", image: homepageSectionImages.northThai, alt: "ภาพพื้นที่เกษตรสำหรับการเพาะเลี้ยงครั่ง" },
] as const;

export function LearningJourney() {
  const { t } = useTranslation();

  const lessonTitleKey = (key: (typeof journey)[number]["key"]): TranslationKey => `learningJourney.${key}.title`;
  const lessonTextKey = (key: (typeof journey)[number]["key"]): TranslationKey => `learningJourney.${key}.text`;

  return (
    <section id="learning-journey" className="relative flex min-h-0 scroll-mt-24 items-center overflow-hidden bg-[#f3eadb] px-4 py-14 sm:py-20 lg:min-h-[720px]" aria-labelledby="learning-journey-title">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.24]" style={{ backgroundImage: `url(${homepageSectionImages.learningJourney})` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[#f3eadb]/55" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-[#8f3328] sm:text-[10px] sm:tracking-[0.2em]">03 — LEARNING JOURNEY</p>
          <h2 id="learning-journey-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{t("learningJourney.label")}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{t("learningJourney.description")}</p>
        </div>
        <div className="relative mt-8 sm:mt-10">
          <div className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-[#c58a3a]/30 lg:block" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((item, index) => {
              const titleKey = lessonTitleKey(item.key);
              const textKey = lessonTextKey(item.key);
              return (
                <Link key={item.no} to={item.href} aria-label={t("learningJourney.ariaLabel", { title: t(titleKey) })} className="group relative min-h-[310px] min-w-0 overflow-hidden rounded-3xl border border-[#6d4a35]/15 bg-[#2f241d] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] focus-visible:ring-offset-2">
                  <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.52] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.68]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#241b17]/20 via-[#241b17]/45 to-[#241b17]/88" aria-hidden="true" />
                  <div className="relative z-10 flex min-h-[310px] flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="font-mono text-xs font-bold tracking-[0.2em] text-[#c58a3a]">{item.no}</span><span className="text-xl" aria-hidden="true">{item.icon}</span></div>
                      {index < journey.length - 1 && <span className="hidden font-mono text-[10px] tracking-[0.12em] text-white/55 lg:block" aria-hidden="true">{t("learningJourney.next")}</span>}
                    </div>
                    <h3 className="mt-6 w-fit max-w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-lg font-bold leading-snug text-white shadow-sm backdrop-blur-[2px] sm:text-xl">{t(titleKey)}</h3>
                    <p className="mt-auto pt-5 text-sm leading-7 text-white/85">{t(textKey)}</p>
                    <div className="mt-4 flex items-center justify-between"><span className="h-px w-8 bg-[#c58a3a]/70 transition-all duration-300 group-hover:w-14" aria-hidden="true" /><span className="text-sm font-semibold text-[#ead9c4]">{t("learningJourney.openLesson")}</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
