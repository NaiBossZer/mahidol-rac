import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";

const composition = [
  ["เรซิน", "68–90%"],
  ["Wax", "5–6%"],
  ["Dye", "2–10%"],
  ["Mineral", "3–7%"],
  ["Water", "2–3%"],
] as const;

export function WhatIsLacSection() {
  return (
    <RacSection id="what-is-lac" className="scroll-mt-24 bg-[#f3eadb]">
      <RacContainer>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-14">
          <div>
            <RacSectionHeader
              eyebrow="01 — WHAT IS LAC?"
              title="ครั่งคืออะไร?"
              description="ทำความรู้จักครั่งในฐานะทรัพยากรธรรมชาติจากแมลงครั่ง และเรซินที่เกิดขึ้นบนต้นพิงอาศัย"
            />
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              <p>ครั่งเป็นเรซินธรรมชาติที่ผลิตโดยแมลงครั่ง ซึ่งอาศัยดูดกินน้ำเลี้ยงจากต้นพิงอาศัยและสร้างเรซินขึ้นบนกิ่งไม้</p>
              <p>ส่วนนี้เป็นจุดเริ่มต้นของการเรียนรู้ ก่อนพาไปสู่ต้นกำเนิด วงจรชีวิต พืชอาศัย การเพาะเลี้ยง และบริบทของลำปาง</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-7">
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#8f3328]">COMPOSITION / องค์ประกอบโดยประมาณ</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {composition.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-[#faf7f0] p-4">
                  <p className="text-xs text-slate-500">{label}</p>
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
