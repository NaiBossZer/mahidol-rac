import { useEffect } from "react";
import { RacContainer, RacCard } from "@/components/rac";
import { homepageSectionImages } from "@/features/home/homepageSectionImages";

export interface MediaSectionProps {
  activeTab: "video" | "3d";
  onTabChange: (tab: "video" | "3d") => void;
}

export function MediaSection({ activeTab, onTabChange }: MediaSectionProps) {
  useEffect(() => {
    if (document.querySelector('script[src*="model-viewer"]')) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  return (
    <section id="media-section" className="relative flex min-h-0 scroll-mt-24 items-center overflow-hidden bg-[#8f3028] py-10 text-white sm:py-16 lg:min-h-[720px]" aria-labelledby="media-title">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${homepageSectionImages.learningCenter})` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[#8f3028]/55" aria-hidden="true" />
      <RacContainer>
        <RacCard variant="featured" className="relative min-w-0 overflow-hidden border-[#f3eadb] bg-[#f3eadb] p-0 text-[#2a211d] shadow-xl">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-8">
            <div className="flex min-w-0 flex-col gap-5 border-b border-[#8f3028]/15 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-2xl space-y-2">
                <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.1em] text-[#8f3028] sm:text-[10px] sm:tracking-[0.16em]">02 — PHYSICAL ROOM EXPERIENCE</p>
                <h2 id="media-title" className="rac-display whitespace-nowrap text-xl font-bold leading-tight text-[#2a211d] sm:text-3xl">ชมบรรยากาศจริงของพื้นที่เรียนรู้</h2>
              </div>
              <div className="grid w-full grid-cols-2 rounded-xl bg-[#8f3028]/10 p-1 text-[11px] font-semibold sm:w-auto sm:min-w-[19rem] sm:text-xs" role="tablist" aria-label="รูปแบบการสำรวจห้องเรียนรู้ครั่ง">
                <button type="button" role="tab" aria-selected={activeTab === "video"} aria-controls="media-panel-video" onClick={() => onTabChange("video")} className={`min-w-0 rounded-lg px-2 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] sm:px-3 ${activeTab === "video" ? "bg-[#8f3028] text-white shadow-sm" : "text-[#8f3028] hover:bg-[#8f3028]/10"}`}>
                  <span className="block truncate">🎥 ชมวิดีโอ</span>
                </button>
                <button type="button" role="tab" aria-selected={activeTab === "3d"} aria-controls="media-panel-3d" onClick={() => onTabChange("3d")} className={`min-w-0 rounded-lg px-2 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] sm:px-3 ${activeTab === "3d" ? "bg-[#8f3028] text-white shadow-sm" : "text-[#8f3028] hover:bg-[#8f3028]/10"}`}>
                  <span className="block truncate">🧊 สำรวจห้อง 3D</span>
                </button>
              </div>
            </div>
            <div id={activeTab === "video" ? "media-panel-video" : "media-panel-3d"} role="tabpanel" className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#8f3028]/20 bg-[#f3eadb] p-2 shadow-inner sm:p-3">
              {activeTab === "video" ? (
                <video className="h-full w-full rounded-xl bg-black object-cover" controls playsInline preload="metadata">
                  <source src="/intro-lac.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
                  <model-viewer src="/rac-room3d.glb" alt="โมเดล 3D ห้องเรียนรู้ครั่ง" auto-rotate camera-controls shadow-intensity="1" style={{ width: "100%", height: "100%" }} />
                  <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-white/20 bg-slate-900/80 px-3 py-1.5 text-center text-[10px] text-white shadow-md backdrop-blur-md sm:left-auto sm:right-3 sm:text-left sm:text-[11px]">
                    🖱️ คลิกและลากเพื่อหมุนดูโมเดล 3D แบบ 360°
                  </div>
                </div>
              )}
            </div>
          </div>
        </RacCard>
      </RacContainer>
    </section>
  );
}
