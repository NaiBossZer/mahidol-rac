import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";

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
    <RacSection id="what-is-lac" className="scroll-mt-24 bg-[#f3eadb]">
      <RacContainer>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div>
            <RacSectionHeader
              eyebrow="01 — WHAT IS LAC?"
              title="ครั่งคืออะไร?"
              description="ทำความรู้จักครั่งในฐานะยางธรรมชาติจากแมลงครั่ง และเรซินที่เกิดขึ้นบนต้นพิงอาศัย"
            />
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              <p>
                <strong className="font-semibold text-[#6d2f28]">ครั่ง (Lac)</strong> คือ ยางธรรมชาติที่ผลิตโดย <strong className="font-semibold text-[#6d2f28]">แมลงครั่ง</strong> ตัวจิ๋วชนิดหนึ่งที่อาศัยอยู่บนกิ่งไม้ โดยแมลงจะดูดน้ำเลี้ยงจากต้นไม้แล้วขับถ่ายยางสีแดง <strong className="font-semibold text-[#6d2f28]">"ชัน" (Resin)</strong> ออกมาห่อหุ้มตัวเพื่อป้องกันศัตรู ซึ่งสารนี้เองคือ <strong className="font-semibold text-[#6d2f28]">"ครั่ง"</strong> ที่นำมาใช้ประโยชน์ในอุตสาหกรรม
              </p>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-5">
              {process.map(([icon, title, desc], index) => (
                <div key={title} className="relative rounded-2xl border border-[#6d4a35]/15 bg-white/65 p-3 text-center">
                  <div className="text-2xl" aria-hidden="true">{icon}</div>
                  <p className="mt-2 text-xs font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">{desc}</p>
                  {index < process.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-[#a56a35] sm:block" aria-hidden="true">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-7">
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#8f3328]">COMPOSITION / องค์ประกอบโดยประมาณ</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {composition.map(([icon, label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-[#faf7f0] p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{icon}</span>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">ช่วงค่าขึ้นกับแหล่งข้อมูลและตัวอย่างครั่ง</p>
          </div>
        </div>
      </RacContainer>
    </RacSection>
  );
}
