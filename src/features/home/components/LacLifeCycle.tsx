const stages = [
  { no: "01", title: "ไข่", icon: "🥚", text: "จุดเริ่มต้นของวงจรชีวิตแมลงครั่ง" },
  { no: "02", title: "ตัวอ่อน", icon: "🐛", text: "ตัวอ่อนเกาะบนพืชอาศัยและดูดกินน้ำเลี้ยงจากพืช" },
  { no: "03", title: "ตัวผู้", icon: "🪰", text: "ระยะตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน" },
  { no: "04", title: "ตัวเมีย", icon: "🪲", text: "ตัวเมียเจริญเติบโตและให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว" },
];

export function LacLifeCycle() {
  return (
    <section id="life-cycle" className="scroll-mt-24 bg-rac-blue-deep px-4 py-14 text-white sm:py-20" aria-labelledby="life-cycle-title">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-amber-300 sm:text-[10px] sm:tracking-[0.2em]">04 — LIFE CYCLE</p>
            <h2 id="life-cycle-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">วงจรชีวิต<br /><span className="text-amber-300">ของครั่ง</span></h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">สำรวจแต่ละช่วงของวงจรชีวิต ตั้งแต่ไข่จนถึงตัวเต็มวัย ผ่านลำดับการเรียนรู้ที่เชื่อมโยงกับการเพาะเลี้ยงครั่ง</p>
            <button type="button" className="mt-7 rounded-lg bg-rac-lac px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">สำรวจวงจรชีวิต →</button>
          </div>
          <div className="relative flex flex-col gap-3">
            <div className="absolute bottom-5 left-5 top-5 w-px bg-amber-300/20" aria-hidden="true" />
            {stages.map((stage) => (
              <article key={stage.no} className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-300/20 bg-white/[0.06] text-xl" aria-hidden="true">{stage.icon}</div>
                <div className="min-w-0"><p className="font-mono text-[9px] tracking-[0.12em] text-amber-300">{stage.no}</p><h3 className="text-base font-bold sm:text-lg">{stage.title}</h3><p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">{stage.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
