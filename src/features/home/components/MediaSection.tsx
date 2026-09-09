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
    <section id="media-section" className="scroll-mt-24 bg-rac-surface py-12 sm:py-16">
      <RacContainer>
        <RacCard variant="featured" className="overflow-hidden p-0">
          <div className="space-y-6 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="text-center sm:text-left space-y-1">
                <h2 className="rac-display text-2xl sm:text-3xl font-bold text-white">
                  {activeTab === "video"
                    ? "🎬 วิดีโอแนะนำห้องการเรียนรู้"
                    : "🧊 โมเดล 3D อาคารเรียนรู้ (SketchUp)"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {activeTab === "video"
                    ? "รับชมบรรยากาศและบทเรียนการเพาะเลี้ยงครั่งอย่างถูกต้อง"
                    : "สำรวจโครงสร้างอาคารเรียนรู้ครั่ง 360 องศาด้วยโมเดล 3D"}
                </p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl font-semibold text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => onTabChange("video")}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "video" ? "bg-rac-blue text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  🎬 วิดีโอแนะนำ
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange("3d")}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "3d" ? "bg-rac-lac text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  🧊 โมเดล 3D SketchUp
                </button>
              </div>
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
              {activeTab === "video" ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="/intro-lac.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full relative bg-slate-100 flex items-center justify-center">
                  <model-viewer
                    src="/rac-room3d.glb"
                    alt="โมเดล 3D อาคารเรียนรู้ครั่ง"
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/20 pointer-events-none shadow-md">
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
