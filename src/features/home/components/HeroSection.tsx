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

export function HeroSection({
  currentSlide,
  onPrevious,
  onNext,
  onSelectSlide,
  onScrollToSection,
  isPaused,
  onTogglePause,
}: HeroSectionProps) {
  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero"
      aria-label="ศูนย์เรียนรู้ครั่งมหิดล ลำปาง"
      className="relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden bg-rac-blue"
    >
      {HERO_SLIDES.map((item, index) => (
        <div
          key={item.id}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ${
              index === currentSlide ? "scale-105" : "scale-100"
            }`}
            style={{ backgroundImage: `url('${encodeURI(item.image)}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-rac-blue-deep/55 via-rac-blue-deep/35 to-rac-blue-deep/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-rac-blue-deep/55 via-transparent to-rac-lac/15" />
          </div>

          <div className="relative z-20 mx-auto flex h-full max-w-6xl items-center px-6 pb-20 pt-24 sm:px-10 lg:px-12">
            <div className="max-w-3xl text-left text-white">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-rac-gold backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-rac-gold shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
                  {item.badge}
                </span>
                <span className="text-xs font-medium text-white/70">
                  {String(index + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
                </span>
              </div>

              <h1 className="rac-display max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight drop-shadow-md sm:text-5xl lg:text-7xl">
                {item.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 drop-shadow sm:text-lg sm:leading-8">
                {item.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <RacButton
                  type="button"
                  onClick={() => onScrollToSection(item.buttonLink.replace("#", ""))}
                  variant="primary"
                  className="border border-white/20 px-6 py-3.5 shadow-xl hover:shadow-2xl"
                >
                  <span>{item.buttonText}</span>
                  <span className="text-rac-gold font-bold">›</span>
                </RacButton>
                <button
                  type="button"
                  onClick={() => onScrollToSection("activities")}
                  className="rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-rac-gold"
                >
                  ดูกิจกรรมล่าสุด
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/40 to-transparent px-6 pb-5 pt-16 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="เลือกสไลด์">
            {HERO_SLIDES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={currentSlide === idx}
                aria-label={`ไปสไลด์ ${idx + 1}: ${item.title}`}
                onClick={() => onSelectSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rac-gold focus:ring-offset-2 focus:ring-offset-transparent ${
                  currentSlide === idx ? "w-10 bg-rac-gold" : "w-2 bg-white/55 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePause}
              aria-label={isPaused ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์อัตโนมัติ"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-rac-gold"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              type="button"
              onClick={onPrevious}
              aria-label="สไลด์ก่อนหน้า"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-rac-gold"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="สไลด์ถัดไป"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-rac-gold"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onScrollToSection("cards-section")}
        aria-label="เลื่อนลงเพื่อดูองค์ความรู้"
        className="absolute bottom-20 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm transition hover:bg-black/40 sm:flex"
      >
        <ArrowDown size={14} />
        สำรวจองค์ความรู้
      </button>

      <span className="sr-only" aria-live="polite">
        สไลด์ปัจจุบัน: {slide.title}
      </span>
    </section>
  );
}
