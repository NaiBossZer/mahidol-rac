import { HERO_SLIDES } from "@/features/home/data/homeData";
import { RacButton } from "@/components/rac";

export interface HeroSectionProps {
  currentSlide: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  onScrollToSection: (id: string) => void;
}

export function HeroSection({
  currentSlide,
  onPrevious,
  onNext,
  onSelectSlide,
  onScrollToSection,
}: HeroSectionProps) {
  return (
    <section className="relative w-full h-[500px] sm:h-[560px] lg:h-[620px] overflow-hidden bg-rac-blue">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 transform scale-105"
            style={{ backgroundImage: `url('${encodeURI(slide.image)}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-rac-blue-deep/90 via-rac-lac/55 to-rac-blue/25" />
          </div>
          <div className="relative z-20 max-w-5xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center items-center text-center text-white space-y-4">
            <span className="bg-white/15 backdrop-blur-md text-rac-gold text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rac-gold animate-pulse" />
              {slide.badge}
            </span>
            <h1 className="rac-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-md leading-tight max-w-4xl">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-lg text-rose-100/95 max-w-2xl font-light leading-relaxed drop-shadow">
              {slide.subtitle}
            </p>
            <RacButton
              type="button"
              onClick={() => onScrollToSection(slide.buttonLink.replace("#", ""))}
              variant="primary"
              className="border border-white/20 px-7 py-3.5 shadow-lg hover:shadow-2xl"
            >
              <span>{slide.buttonText}</span>
              <span className="text-rac-gold font-bold">›</span>
            </RacButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all flex items-center justify-center cursor-pointer border border-white/20"
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all flex items-center justify-center cursor-pointer border border-white/20"
        aria-label="Next Slide"
      >
        ›
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? "w-8 bg-rac-lac border border-rose-400" : "w-2.5 bg-white/60 hover:bg-white"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
