import { useEffect } from "react";
import { RacContainer } from "@/components/rac";

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
    <section id="media-section" className="scroll-mt-24 overflow-hidden bg-rac-blue-deep py-14 sm:py-20" aria-labelledby="media-section-title">
      <RacContainer>
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div className="max-w-xl text-white">
            <p className="text-xs font-semibold tracking-[0.24em] text-rac-gold">PHYSICAL ROOM EXPERIENCE</p>
            <h2 id="media-section-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">รู้จักห้องเรียนรู้ครั่ง</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              ชมบรรยากาศจริงของพื้นที่เรียนรู้ แล้วสำรวจห้องแบบ 3D เพื่อทำความรู้จักพื้นที่และประสบการณ์การเรียนรู้ของศูนย์ลำปาง
            </p>

            <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="รูปแบบการสำรวจห้องเรียนรู้">
              <button type="button" role="tab" aria-selected={activeTab === "video"} aria-controls="media-viewer" onClick={() => onTabChange("video")} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rac-gold focus:ring-offset-2 focus:ring-offset-rac-blue-deep ${activeTab === "video" ? "border-rac-gold bg-rac-gold text-rac-blue-deep" : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"}`}>
                🎥 ชมวิดีโอ
              </button>
              <button type="button" role="tab" aria-selected={activeTab === "3d"} aria-controls="media-viewer" onClick={() => onTabChange("3d")} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rac-lac focus:ring-offset-2 focus:ring-offset-rac-blue-deep ${activeTab === "3d" ? "border-rac-lac bg-rac-lac text-white" : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"}`}>
                🧊 สำรวจห้อง 3D
              </button>
            </div>

            <div className="mt-5 border-l-2 border-rac-lac/70 pl-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
              {activeTab === "video" ? "วิดีโอสำหรับทำความรู้จักพื้นที่และบรรยากาศของห้องเรียนรู้ก่อนเริ่มสำรวจองค์ความรู้" : "ลากเพื่อหมุนและใช้การควบคุมกล้องเพื่อสำรวจโครงสร้างพื้นที่แบบ 360°"}
            </div>
          </div>

          <div id="media-viewer" role="tabpanel" className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-2xl">
            {activeTab === "video" ? (
              <video className="h-full w-full object-cover" controls playsInline preload="metadata" aria-label="วิดีโอแนะนำห้องเรียนรู้ครั่ง">
                <source src="/intro-lac.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="relative flex h-full w-full items-center justify-center bg-slate-100">
                <model-viewer src="/rac-room3d.glb" alt="โมเดล 3D ห้องเรียนรู้ครั่ง" auto-rotate camera-controls shadow-intensity="1" style={{ width: "100%", height: "100%" }} />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-[11px] text-white shadow-md backdrop-blur-md">🖱️ คลิกและลากเพื่อหมุนดูห้องแบบ 360°</div>
              </div>
            )}
          </div>
        </div>
      </RacContainer>
    </section>
  );
}
