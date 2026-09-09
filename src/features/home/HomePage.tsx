import { lazy, Suspense } from "react";
import AppNavbar from "@/layout/AppNavbar";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { LacKnowledgeAccordion } from "@/features/home/LacKnowledgeAccordion";
import { HeroSection } from "@/features/home/components/HeroSection";
import { MediaSection } from "@/features/home/components/MediaSection";
import { DataVisualization } from "@/features/home/components/DataVisualization";
import { ActivitySection } from "@/features/activity/components/ActivitySection";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";
import { useHome } from "@/features/home/hooks/useHome";

const LacBingoGame = lazy(() => import("@/features/bingo/LacBingoGame"));
const SobprabLacLabGame = lazy(() => import("@/features/home/SobprabLacLabGame"));

export function HomePage() {
  const home = useHome();

  return (
    <div
      data-rac-theme="living"
      className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr'] selection:bg-rac-lac selection:text-white flex flex-col"
    >
      <AppNavbar />
      <main className="grow">
        <HeroSection
          currentSlide={home.currentSlide}
          onPrevious={home.prevSlide}
          onNext={home.nextSlide}
          onSelectSlide={home.setCurrentSlide}
          onScrollToSection={home.scrollToSection}
          isPaused={home.isHeroPaused}
          onTogglePause={() => home.setIsHeroPaused((paused) => !paused)}
        />

        <MediaSection activeTab={home.activeMediaTab} onTabChange={home.setActiveMediaTab} />

        <RacSection id="cards-section" className="scroll-mt-24 bg-white/70">
          <RacContainer>
            <RacSectionHeader
              eyebrow="Lac Knowledge System"
              title="องค์ความรู้ครั่งแบบเชื่อมโยง"
              description="จากต้นกำเนิด วงจรชีวิต พืชอาศัย การเพาะเลี้ยง ไปสู่นวัตกรรมการผลิต — เรียนรู้เป็นระบบในพื้นที่เดียว"
            />
            <LacKnowledgeCards />
          </RacContainer>
        </RacSection>

        <RacSection id="data-viz" className="scroll-mt-24 bg-rac-surface">
          <RacContainer>
            <RacSectionHeader
              eyebrow="Regional Intelligence"
              title="ข้อมูลและภาพรวมศูนย์เรียนรู้"
              description="มุมมองข้อมูลที่ช่วยเชื่อมโยงองค์ความรู้กับบริบทพื้นที่และการพัฒนาอย่างยั่งยืน"
            />
            <DataVisualization />
          </RacContainer>
        </RacSection>

        <ActivitySection />

        <section
          id="learning-game"
          className="scroll-mt-24 px-4 py-12"
          aria-labelledby="learning-game-title"
        >
          <div className="mx-auto max-w-6xl space-y-3 text-center">
            <p className="text-xs font-semibold tracking-widest text-rac-lac">INTERACTIVE LEARNING LAB</p>
            <h2 id="learning-game-title" className="text-2xl font-bold text-slate-800">
              เกมจำลองวิทยาศาสตร์ครั่งสบปราบ
            </h2>
            <p className="text-sm text-slate-500">
              ทดลองเลือกต้นโฮสต์ ฤดูกาล และกระบวนการแปรรูป แล้วดูผลลัพธ์แบบทันที
            </p>
            <Suspense
              fallback={
                <div
                  className="mx-auto min-h-48 max-w-4xl rounded-2xl border border-slate-200 bg-white/60"
                  aria-label="Loading learning lab"
                />
              }
            >
              <SobprabLacLabGame />
            </Suspense>
          </div>
        </section>

        <section
          id="bingo-section"
          className="scroll-mt-24 bg-gradient-to-b from-transparent via-rac-lac/5 to-transparent px-4 py-12"
          aria-labelledby="bingo-game-title"
        >
          <div className="mx-auto max-w-6xl space-y-4 text-center">
            <span className="rounded-full bg-rac-lac px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              CLASSROOM INTERACTIVE BINGO
            </span>
            <h2 id="bingo-game-title" className="text-2xl font-bold text-slate-800 sm:text-3xl">
              🎲 เกมบิงโกวิทยาศาสตร์ครั่งสบปราบ
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-500">
              ท้าทายความรู้ครั่ง 16 คีย์เวิร์ด ตรวจจับสายบิงโกอัตโนมัติ 10 รูปแบบ พร้อมพิธีกรพี่ M-Guide
            </p>
            <Suspense
              fallback={
                <div
                  className="mx-auto min-h-48 max-w-4xl rounded-2xl border border-rac-lac/10 bg-white/60"
                  aria-label="Loading bingo game"
                />
              }
            >
              <LacBingoGame />
            </Suspense>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-6" aria-labelledby="academic-sources-title">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h2 id="academic-sources-title" className="text-lg font-bold text-slate-800">
              แหล่งข้อมูลประกอบการเรียนรู้
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ข้อมูลพื้นฐานเรื่องแมลงครั่ง การแปรรูป sticklac, seedlac และ shellac ควรอ่านประกอบจากแหล่งอ้างอิงต่อไปนี้ และตรวจทานความเหมาะสมกับบริบทจังหวัดลำปางโดยผู้เชี่ยวชาญก่อนนำข้อมูลสถิติไปใช้อ้างอิง.
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="font-semibold text-rac-lac underline underline-offset-2" href="https://www.fao.org/4/v8879e/v8879e.pdf" target="_blank" rel="noreferrer">
                  FAO: Natural colourants and dyestuffs — Lac
                </a>
              </li>
              <li>
                <a className="font-semibold text-rac-lac underline underline-offset-2" href="https://agrovoc.fao.org/browse/agrovoc/en/page/c_4089?anylang=on&clang=en" target="_blank" rel="noreferrer">
                  FAO AGROVOC: Kerria lacca
                </a>
              </li>
            </ul>
          </div>
        </section>

        <LacKnowledgeAccordion />
      </main>

      <footer className="mt-16 border-t border-slate-800 bg-rac-blue-deep py-10 text-center text-slate-300">
        <div className="mx-auto max-w-5xl space-y-2 px-4">
          <p className="text-xs leading-relaxed sm:text-sm">
            งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
          </p>
          <p className="font-mono text-xs text-slate-500">
            © 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
