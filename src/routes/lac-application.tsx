import { useState } from "react";
import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { RacContainer } from "@/components/rac";

const stories = [
  {
    id: "farmer-income",
    no: "01",
    title: "จากแมลงสู่รายได้หลัก?",
    subtitle: "“ครั่ง” ทางรอดเกษตรกรไทย",
    video: "https://www.youtube-nocookie.com/embed/nhXN1WczDnM",
    insight: "ครั่งในมุมของเกษตรกร — จากสิ่งมีชีวิตขนาดเล็กบนต้นพิงอาศัย สู่โอกาสในการสร้างรายได้จากทรัพยากรในพื้นที่",
  },
  {
    id: "lac-water",
    no: "02",
    title: "ปุ๋ยแพงไม่ไหว!",
    subtitle: "“น้ำครั่ง” ทางเลือกใหม่ลดต้นทุน",
    video: "https://www.youtube-nocookie.com/embed/vfkRPCHP170",
    insight: "ครั่งในมุมของการเกษตร — เรื่องราวการต่อยอดองค์ความรู้ครั่งไปสู่แนวทางที่ช่วยลดต้นทุนการผลิต",
  },
] as const;

export function LacApplicationPage() {
  const [selectedId, setSelectedId] = useState(stories[0].id);
  const selected = stories.find((story) => story.id === selectedId) ?? stories[0];

  return (
    <div className="min-h-screen bg-[#f3eadb] text-slate-900">
      <AppNavbar />
      <main className="min-h-[calc(100vh-60px)]">
        <RacContainer className="flex min-h-[calc(100vh-60px)] flex-col px-3 py-3 sm:px-4 sm:py-4">
          <header className="shrink-0">
            <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-[#8f3328] sm:text-[10px]">FROM LAC TO APPLICATION</p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">จากครั่งสู่การใช้ประโยชน์</h1>
                <p className="mt-1 hidden text-xs text-slate-600 sm:block">จากวัสดุธรรมชาติ → การต่อยอด → การใช้ประโยชน์จริง</p>
              </div>
              <span className="hidden rounded-full border border-[#8f3328]/15 bg-white/60 px-3 py-1.5 text-[10px] font-medium text-[#8f3328] sm:inline-flex">Story Room</span>
            </div>
          </header>

          <section className="min-h-0 flex-1 py-3" aria-label="เรื่องราวจาก ENV Mahidol">
            <div className="grid h-full min-h-0 overflow-hidden rounded-[24px] border border-[#8f3328]/15 bg-white lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
              <div className="relative min-h-0 bg-black">
                <iframe
                  key={selected.id}
                  className="h-full w-full"
                  src={selected.video}
                  title={`${selected.title} ${selected.subtitle}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-sm">ENV Mahidol</div>
              </div>

              <aside className="min-h-0 overflow-hidden bg-[#f3eadb] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328]">STORIES</p>
                    <h2 className="mt-1 text-sm font-bold text-[#8f3328]">เรื่องราวจาก ENV Mahidol</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#8f3328]/70">{selected.no}/02</span>
                </div>

                <div className="mt-4 grid gap-2">
                  {stories.map((story) => {
                    const active = story.id === selected.id;
                    return (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => setSelectedId(story.id)}
                        aria-pressed={active}
                        className={`w-full rounded-2xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3328] ${active ? "border-[#8f3328] bg-[#8f3328] text-white" : "border-[#8f3328]/15 bg-white/70 text-slate-800 hover:bg-white"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 font-mono text-[10px] font-bold ${active ? "text-white/80" : "text-[#8f3328]"}`}>{story.no}</span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold leading-5">{story.title}</span>
                            <span className={`mt-0.5 block text-[11px] leading-4 ${active ? "text-white/75" : "text-slate-500"}`}>{story.subtitle}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 border-t border-[#8f3328]/15 pt-4">
                  <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328]">INSIGHT</p>
                  <p className="mt-2 text-xs leading-6 text-slate-700">{selected.insight}</p>
                </div>
              </aside>
            </div>
          </section>

          <div className="shrink-0 pb-2 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#8f3328] sm:text-xs">
              <span>ครั่ง</span><span aria-hidden="true">→</span>
              <span>แปรรูป</span><span aria-hidden="true">→</span>
              <span>ต่อยอด</span><span aria-hidden="true">→</span>
              <span>ใช้ประโยชน์</span>
            </div>
          </div>
        </RacContainer>
      </main>
      <AppFooter />
    </div>
  );
}
