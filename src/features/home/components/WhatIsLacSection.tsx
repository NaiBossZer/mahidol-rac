import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";
import { homepageSectionImages } from "@/features/home/homepageSectionImages";

const process = [
  ["🪲", "แมลงครั่ง", "อาศัยอยู่บนกิ่งไม้"],
  ["🌳", "ต้นพิงอาศัย", "เป็นแหล่งน้ำเลี้ยงของแมลงครั่ง"],
  ["💧", "ดูดน้ำเลี้ยง", "แมลงครั่งดูดน้ำเลี้ยงจากต้นไม้"],
  ["🔴", "ชัน (Resin)", "ขับถ่ายยางสีแดงห่อหุ้มตัว"],
  ["✨", "ครั่ง (Lac)", "เรซินที่นำมาใช้ประโยชน์ในอุตสาหกรรม"],
] as const;

const composition = [
  ["🧪", "เรซิน", "68–90%"],
  ["🕯️", "Wax", "5–6%"],
  ["🎨", "Dye", "2–10%"],
  ["🪨", "Mineral", "3–7%"],
  ["💧", "Water", "2–3%"],
] as const;

export function WhatIsLacSection() {
  return (
    <RacSection id="what-is-lac" className="relative flex min-h-0 scroll-mt-24 items-center overflow-hidden bg-[#f3eadb] lg:min-h-[720px]">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-cover bg-center opacity-20 lg:block" style={{ backgroundImage: `url(${homepageSectionImages.whatIsLac})` }} aria-hidden="true" />
      <RacContainer>
        <div className="relative grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
          <div>
            <RacSectionHeader className="mb-6" eyebrow="01 — WHAT IS LAC?" title="ครั่งคืออะไร?" description="ทำความรู้จักครั่งในฐานะยางธรรมชาติจากแมลงครั่ง และเรซินที่เกิดขึ้นบนต้นพิงอาศัย" />
            <div className="max-w-2xl space-y-4 text-sm leading-7 text-slate-700 sm:text-[15px] sm:leading-7">
              <p><strong className="font-semibold text-[#6d2f28]">ครั่ง (Lac)</strong> คือ ยางธรรมชาติที่ผลิตโดย <strong className="font-semibold text-[#6d2f28]">แมลงครั่ง</strong> ตัวจิ๋วชนิดหนึ่งที่อาศัยอยู่บนกิ่งไม้ โดยแมลงจะดูดน้ำเลี้ยงจากต้นไม้แล้วขับถ่ายยางสีแดง <strong className="font-semibold text-[#6d2f28]">"ชัน" (Resin)</strong> ออกมาห่อหุ้มตัวเพื่อป้องกันศัตรู ซึ่งสารนี้เองคือ <strong className="font-semibold text-[#6d2f28]">"ครั่ง"</strong> ที่นำมาใช้ประโยชน์ในอุตสาหกรรม</p>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-5">
              {process.map(([icon, title, desc], index) => (
                <div key={title} className="relative rounded-xl border border-[#6d4a35]/15 bg-white/65 px-2.5 py-2.5 text-center">
                  <div className="text-xl" aria-hidden="true">{icon}</div><p className="mt-1 text-[11px] font-bold leading-4 text-slate-800">{title}</p><p className="mt-0.5 text-[9px] leading-3.5 text-slate-500">{desc}</p>
                  {index < process.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-[#a56a35] sm:block" aria-hidden="true">→</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[#6d4a35]/15 bg-white/80 p-4 sm:p-5">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${homepageSectionImages.whatIsLac})` }} aria-hidden="true" />
            <div className="relative"><p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328] sm:text-[10px]">COMPOSITION / องค์ประกอบโดยประมาณ</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2">{composition.map(([icon, label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-[#faf7f0]/90 px-3 py-2.5"><div className="flex items-center gap-1.5"><span className="text-lg" aria-hidden="true">{icon}</span><p className="text-[11px] text-slate-500">{label}</p></div><p className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">{value}</p></div>)}</div>
              <p className="mt-3 text-[10px] leading-4 text-slate-500">ช่วงค่าขึ้นกับแหล่งข้อมูลและตัวอย่างครั่ง</p>
            </div>
          </div>
        </div>
      </RacContainer>
    </RacSection>
  );
}
