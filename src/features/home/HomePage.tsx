import AppNavbar from "@/layout/AppNavbar";
import { HeroSection } from "@/features/home/components/HeroSection";
import { MediaSection } from "@/features/home/components/MediaSection";
import { LearningJourney } from "@/features/home/components/LearningJourney";
import { LacLifeCycle } from "@/features/home/components/LacLifeCycle";
import { LampangLacMap } from "@/features/home/components/LampangLacMap";
import { LacProductJourney } from "@/features/home/components/LacProductJourney";
import { DataVisualization } from "@/features/home/components/DataVisualization";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { ActivitySection } from "@/features/activity/components/ActivitySection";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";
import { useHome } from "@/features/home/hooks/useHome";

export function HomePage() {
  const home = useHome();

  return (
    <div data-rac-theme="living" className="min-h-screen overflow-x-hidden bg-rac-surface font-['Mitr'] text-slate-800 selection:bg-rac-lac selection:text-white">
      <AppNavbar />
      <main className="grow">
        <HeroSection currentSlide={home.currentSlide} onPrevious={home.prevSlide} onNext={home.nextSlide} onSelectSlide={home.setCurrentSlide} onScrollToSection={home.scrollToSection} isPaused={home.isHeroPaused} onTogglePause={() => home.setIsHeroPaused((paused) => !paused)} />

        {/* 01 Discover — answer the first question before moving into the room */}
        <RacSection id="cards-section" className="scroll-mt-24 bg-rac-surface">
          <RacContainer>
            <RacSectionHeader eyebrow="01 // DISCOVER" title="ครั่งคืออะไร?" description="เริ่มต้นทำความรู้จักครั่งผ่านองค์ความรู้พื้นฐาน นิเวศวิทยา การเพาะเลี้ยง และการใช้ประโยชน์" />
            <LacKnowledgeCards />
          </RacContainer>
        </RacSection>

        {/* Physical Room Experience — Bring the Room Online */}
        <MediaSection activeTab={home.activeMediaTab} onTabChange={home.setActiveMediaTab} />

        {/* 02 Explore — the learning path follows the first knowledge encounter */}
        <LearningJourney />
        <LacLifeCycle />

        {/* 03 Connect — move from scientific knowledge to the real Lampang context */}
        <LampangLacMap />
        <LacProductJourney />

        <RacSection id="data-viz" className="scroll-mt-24 bg-rac-surface">
          <RacContainer>
            <RacSectionHeader eyebrow="REGIONAL INTELLIGENCE" title="ข้อมูลและภาพรวมศูนย์เรียนรู้" description="มุมมองข้อมูลที่ช่วยเชื่อมโยงองค์ความรู้กับบริบทพื้นที่และการพัฒนาอย่างยั่งยืน" />
            <DataVisualization />
          </RacContainer>
        </RacSection>

        {/* 04 Apply — keep the existing activity feature visible without making it the hero */}
        <ActivitySection />
      </main>

      <footer className="mt-16 border-t border-slate-800 bg-rac-blue-deep py-10 text-center text-slate-300">
        <div className="mx-auto max-w-5xl space-y-2 px-4">
          <p className="text-xs leading-relaxed sm:text-sm">งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง</p>
          <p className="font-mono text-xs text-slate-500">© 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
