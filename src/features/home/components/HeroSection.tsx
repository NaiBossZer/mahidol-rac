import { useTranslation } from "react-i18next";
import { HERO_SLIDES } from "@/features/home/data/homeData";
import { RacButton } from "@/components/rac";
import { Pause, Play, ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";

export interface HeroSectionProps {
  currentSlide: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  onScrollToSection: (id: string) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function HeroSection({ currentSlide, onPrevious, onNext, onSelectSlide, onScrollToSection, isPaused, onTogglePause }: HeroSectionProps) {
  const slide = HERO_SLIDES[currentSlide];
  const { t } = useTranslation();

  return (
    <section id="hero" aria-label={t("hero.ariaLabel")} className="relative min-h-[560px] w-full overflow-hidden bg-rac-blue sm:min-h-[600px] lg:min-h-[680px]">
      {HERO_SLIDES.map((item, index) => {
        const title = t(item.titleKey);
        return (
          <div key={item.id} aria-hidden={index !== currentSlide} className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === currentSlide ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}>
            <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ${index === currentSlide ? "scale-105" : "scale-100"}`} style={{ backgroundImage: `url('${encodeURI(item.image)}')` }}>
              <div className="absolute inset-0 bg-gradient-to-b from-rac-blue-deep/55 via-rac-blue-deep/35 to-rac-blue-deep/95" />
              <div className="absolute inset-0 bg-gradient-to-r from-rac-blue-deep/60 via-transparent to-rac-lac/15" />
            </div>
            <div className="relative z-20 mx-auto flex h-full max-w-6xl items-center px-4 pb-24 pt-24 sm:px-10 sm:pb-20 lg:px-12">
              <div className="max-w-3xl text-left text-white">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold tracking-[0.12em] text-rac-gold backdrop-blur-md sm:px-4 sm:text-[11px] sm:tracking-[0.14em]"><span className="h-2 w-2 shrink-0 rounded-full bg-rac-gold" /><span className="truncate">{t(item.badgeKey)}</span></span>
                  <span className="text-xs font-medium text-white/70">{String(index + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}</span>
                </div>
                <h1 className="rac-display max-w-3xl text-3xl font-bold leading-[1.18] tracking-tight drop-shadow-md sm:text-5xl lg:text-6xl">{title}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 drop-shadow sm:text-base sm:leading-7 lg:text-lg">{t(item.subtitleKey)}</p>
                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <RacButton type="button" onClick={() => onScrollToSection(item.buttonLink.replace("#", ""))} variant="primary" className="w-full justify-center border border-white/20 px-6 py-3.5 shadow-xl hover:shadow-2xl sm:w-auto"><span>{t(item.buttonTextKey)}</span><span className="font-bold text-rac-gold">›</span></RacButton>
                  <button type="button" onClick={() => onScrollToSection("activities")} className="w-full rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold sm:w-auto">{t("hero.latestActivities")}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-16 sm:px-10 sm:pb-5"><div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4"><div className="flex items-center gap-2" role="tablist" aria-label={t("hero.slideSelector")}>{HERO_SLIDES.map((item, idx) => <button key={item.id} type="button" role="tab" aria-selected={currentSlide === idx} aria-label={t("hero.goToSlide", { index: idx + 1, title: t(item.titleKey) })} onClick={() => onSelectSlide(idx)} className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold focus-visible:ring-offset-2 ${currentSlide === idx ? "w-10 bg-rac-gold" : "w-2 bg-white/55 hover:bg-white"}`} />)}</div><div className="flex items-center gap-2 self-end"><button type="button" onClick={onTogglePause} aria-label={isPaused ? t("nav.playAutoSlides") : t("nav.pauseAutoSlides")} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold">{isPaused ? <Play size={16} /> : <Pause size={16} />}</button><button type="button" onClick={onPrevious} aria-label={t("nav.previousSlide")} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold"><ChevronLeft size={20} /></button><button type="button" onClick={onNext} aria-label={t("nav.nextSlide")} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold"><ChevronRight size={20} /></button></div></div></div>
      <button type="button" onClick={() => onScrollToSection("what-is-lac")} aria-label={t("hero.exploreWhatIsLac")} className="absolute bottom-20 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm transition hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-rac-gold sm:flex"><ArrowDown size={14} />{t("hero.exploreWhatIsLac")}</button>
      <span className="sr-only" aria-live="polite">{t("hero.currentSlide", { title: t(slide.titleKey) })}</span>
    </section>
  );
}
