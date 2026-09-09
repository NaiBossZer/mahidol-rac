import { HeroSection } from "@/features/home/components/HeroSection";
import { MediaSection } from "@/features/home/components/MediaSection";
import { LearningJourney } from "@/features/home/components/LearningJourney";
import { LacLifeCycle } from "@/features/home/components/LacLifeCycle";
import { LampangLacMap } from "@/features/home/components/LampangLacMap";
import { LacProductJourney } from "@/features/home/components/LacProductJourney";
import { useHome } from "@/features/home/hooks/useHome";
import { WhatIsLacSection } from "@/features/home/components/WhatIsLacSection";
import AppNavbar from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";

export function HomePage() {
  const home = useHome();
  return (
    <div data-rac-theme="living" className="min-h-screen overflow-x-hidden bg-rac-surface font-['Mitr'] text-slate-800 selection:bg-rac-lac selection:text-white">
      <AppNavbar />
      <main className="grow">
        <HeroSection currentSlide={home.currentSlide} onPrevious={home.prevSlide} onNext={home.nextSlide} onSelectSlide={home.setCurrentSlide} onScrollToSection={home.scrollToSection} isPaused={home.isHeroPaused} onTogglePause={() => home.setIsHeroPaused((paused) => !paused)} />
        <WhatIsLacSection />
        <MediaSection activeTab={home.activeMediaTab} onTabChange={home.setActiveMediaTab} />
        <LearningJourney />
        <LacLifeCycle />
        <LampangLacMap />
        <LacProductJourney />
      </main>
      <AppFooter />
    </div>
  );
}
