import { Link, useParams } from "react-router-dom";
import { getLacPage } from "@/features/lac/lacInformationArchitecture";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";

const process = [
  ["🪲", "แมลงครั่ง", "อาศัยอยู่บนกิ่งไม้"],
  ["🌳", "ต้นพิงอาศัย", "เป็นแหล่งน้ำเลี้ยง"],
  ["💧", "ดูดน้ำเลี้ยง", "แมลงครั่งดูดน้ำเลี้ยง"],
  ["🔴", "ชัน (Resin)", "ขับถ่ายยางสีแดง"],
  ["✨", "ครั่ง (Lac)", "นำไปใช้ประโยชน์"],
] as const;

const composition = [
  ["🧪", "เรซิน", "68–90%"],
  ["🕯️", "Wax", "5–6%"],
  ["🎨", "Dye", "2–10%"],
  ["🪨", "Mineral", "3–7%"],
  ["💧", "Water", "2–3%"],
] as const;

const journey = [
  { number: "01", title: "ครั่งคืออะไร?", href: "/lac/what-is-lac" },
  { number: "02", title: "วงจรชีวิต", href: "/lac/life-cycle" },
  { number: "03", title: "ระบบนิเวศ & ต้นพิงอาศัย", href: "/lac/habitat" },
  { number: "04", title: "ต้นพิงอาศัย", href: "/lac/host-plants" },
  { number: "05", title: "การเพาะเลี้ยงครั่ง", href: "/lac/lac-farming" },
] as const;

export function LacPage() {
  const { slug = "" } = useParams();
  const page = getLacPage(slug);

  if (!page) {
    return (
      <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-rac-lac">LAC LEARNING CENTER</p>
          <h1 className="mt-2 text-3xl font-bold">ไม่พบหน้าการเรียนรู้</h1>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white">กลับหน้าแรก</Link>
        </div>
      </main>
    );
  }

  if (slug === "knowledge") {
    return (
      <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">ความรู้เรื่องครั่ง</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">ภาพรวมความรู้เรื่องครั่ง</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">สำรวจองค์ความรู้หลักที่เชื่อมโยงตั้งแต่ความรู้พื้นฐาน ระบบนิเวศ การเพาะเลี้ยง ไปจนถึงการแปรรูปและการใช้ประโยชน์จากครั่ง</p>
          </div>
          <LacKnowledgeCards />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link>
            <Link to="/lac/what-is-lac" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">เริ่มจาก ครั่งคืออะไร</Link>
          </div>
        </div>
      </main>
    );
  }

  if (slug === "what-is-lac") {
    return (
      <main className="min-h-screen bg-[#f3eadb] text-slate-900">
        <section className="bg-[#2f241d] px-4 pb-14 pt-28 text-[#f3ebdd] sm:px-6 sm:pb-16">
          <RacContainer>
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#c58a3a]">01 — WHAT IS LAC?</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">ครั่งคืออะไร?</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f3ebdd]/75 sm:text-base">ทำความรู้จักครั่งในฐานะยางธรรมชาติจากแมลงครั่ง และเรซินที่เกิดขึ้นบนต้นพิงอาศัย</p>
            </div>
          </RacContainer>
        </section>

        <RacContainer>
          <section className="py-12 sm:py-16">
            <RacSectionHeader eyebrow="ความรู้พื้นฐาน" title="เริ่มจากสิ่งมีชีวิตตัวเล็ก" description="ครั่งเกิดขึ้นจากความสัมพันธ์ระหว่างแมลงครั่งกับต้นพิงอาศัย" />
            <div className="mt-7 max-w-4xl space-y-4 text-sm leading-8 text-slate-700 sm:text-[15px]">
              <p><strong className="font-semibold text-[#6d2f28]">ครั่ง (Lac)</strong> คือ ยางธรรมชาติที่ผลิตโดย <strong className="font-semibold text-[#6d2f28]">แมลงครั่ง</strong> ตัวจิ๋วชนิดหนึ่งที่อาศัยอยู่บนกิ่งไม้ โดยแมลงจะดูดน้ำเลี้ยงจากต้นไม้แล้วขับถ่ายยางสีแดง <strong className="font-semibold text-[#6d2f28]">"ชัน" (Resin)</strong> ออกมาห่อหุ้มตัวเพื่อป้องกันศัตรู ซึ่งสารนี้เองคือ <strong className="font-semibold text-[#6d2f28]">"ครั่ง"</strong> ที่นำมาใช้ประโยชน์ในอุตสาหกรรม</p>
            </div>

            <div className="mt-9 grid gap-2 sm:grid-cols-5">
              {process.map(([icon, title, desc], index) => (
                <div key={title} className="relative rounded-2xl border border-[#6d4a35]/15 bg-white/70 px-3 py-4 text-center">
                  <div className="text-2xl" aria-hidden="true">{icon}</div>
                  <p className="mt-2 text-xs font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">{desc}</p>
                  {index < process.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[#a56a35] sm:block" aria-hidden="true">→</span>}
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#6d4a35]/10 py-12 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-start">
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#8f3328]">KEY FACTS</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">สิ่งสำคัญที่ควรรู้</h2>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-[#6d4a35]/12 bg-white/65 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f3328]">01</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">ครั่งเกี่ยวข้องกับแมลงครั่งและต้นพิงอาศัยโดยตรง</p>
                  </div>
                  <div className="rounded-2xl border border-[#6d4a35]/12 bg-white/65 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f3328]">02</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">เรซินที่แมลงครั่งสร้างขึ้นเป็นส่วนสำคัญของวัตถุดิบครั่ง</p>
                  </div>
                  <div className="rounded-2xl border border-[#6d4a35]/12 bg-white/65 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f3328]">03</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">การทำความเข้าใจครั่งควรเริ่มจากสิ่งมีชีวิต ระบบอาศัย และกระบวนการเกิดเรซิน</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#6d4a35]/15 bg-white/75 p-5 sm:p-6">
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#8f3328]">COMPOSITION / องค์ประกอบโดยประมาณ</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {composition.map(([icon, label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-[#faf7f0] px-3 py-3">
                      <div className="flex items-center gap-2"><span className="text-lg" aria-hidden="true">{icon}</span><p className="text-[11px] text-slate-500">{label}</p></div>
                      <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] leading-4 text-slate-500">ช่วงค่าขึ้นกับแหล่งข้อมูลและตัวอย่างครั่ง</p>
              </div>
            </div>
          </section>

          <section className="pb-16 pt-2 sm:pb-20">
            <div className="rounded-3xl bg-[#2f241d] p-6 text-[#f3ebdd] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#c58a3a]">LEARNING JOURNEY</p>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">ไปต่อในบทถัดไป</h2>
                </div>
                <Link to="/lac/life-cycle" className="inline-flex w-fit rounded-xl bg-[#8f3328] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a]">วงจรชีวิต →</Link>
              </div>
              <div className="mt-7 grid gap-2 sm:grid-cols-5">
                {journey.map((item, index) => (
                  <Link key={item.number} to={item.href} className={`rounded-xl border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a] ${index === 0 ? "border-[#c58a3a]/50 bg-[#c58a3a]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                    <p className="font-mono text-[10px] text-[#c58a3a]">{item.number}</p>
                    <p className="mt-1 text-xs leading-5">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </RacContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">{page.section.toUpperCase()}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{page.title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">โครงสร้างหน้านี้ถูกกำหนดไว้ใน LAC Information Architecture และจะเติมเนื้อหาจริงในขั้น Knowledge UX ของโครงการ</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link>
          <Link to="/lac/knowledge" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">ความรู้เรื่องครั่ง</Link>
          <Link to="/bingo" className="rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90">ไป Learning Games</Link>
        </div>
      </div>
    </main>
  );
}
