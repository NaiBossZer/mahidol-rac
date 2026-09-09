import { useEffect } from "react";
import { RacContainer, RacCard } from "@/components/rac";

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
    <section id="media-section" className="scroll-mt-24 bg-rac-blue-deep py-12 text-white sm:py-20" aria-labelledby="media-title">
      <RacContainer>
        <RacCard variant="featured" className="min-w-0 overflow-hidden border-white/10 bg-white/[0.04] p-0">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-8">
            <div className="flex min-w-0 flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-2xl space-y-2">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-amber-300 sm:text-xs sm:tracking-[0.2em]">PHYSICAL ROOM EXPERIENCE</p>
                <h2 id="media-title" className="rac-display text-2xl font-bold leading-tight sm:text-4xl">รู้จักห้องเรียนรู้ครั่ง</h2>
                <p className="text-sm leading-7 text-slate-300 sm:text-base">ชมบรรยากาศจริงของพื้นที่เรียนรู้ แล้วสำรวจห้องแบบ 3D เพื่อทำความรู้จักพื้นที่และประสบการณ์การเรียนรู้ของศูนย์ลำปาง</p>
              </div>
              <div className="grid w-full grid-cols-2 rounded-xl bg-white/10 p-1 text-[11px] font-semibold sm:w-auto sm:min-w-[19rem] sm:text-xs" role="tablist" aria-label="รูปแบบการสำรวจห้องเรียนรู้ครั่ง">
                <button type="button" role="tab" aria-selected={activeTab === "video"} aria-controls="media-panel-video" onClick={() => onTabChange("video")} className={`min-w-0 rounded-lg px-2 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-3 ${activeTab === "video" ? "bg-rac-blue text-white shadow-sm" : "text-slate-300 hover:text-white"}`}>
                  <span className="block truncate">🎥 ชมวิดีโอ</span>
                </button>
                <button type="button" role="tab" aria-selected={activeTab === "3d"} aria-controls="media-panel-3d" onClick={() => onTabChange("3d")} className={`min-w-0 rounded-lg px-2 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-3 ${activeTab === "3d" ? "bg-rac-lac text-white shadow-sm" : "text-slate-300 hover:text-white"}`}>
                  <span className="block truncate">🧊 สำรวจห้อง 3D</span>
                </button>
              </div>
            </div>
            <div id={activeTab === "video" ? "media-panel-video" : "media-panel-3d"} role="tabpanel" className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-inner">
              {activeTab === "video" ? (
                <video className="h-full w-full object-cover" controls playsInline preload="metadata">
                  <source src="/intro-lac.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-slate-100">
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
