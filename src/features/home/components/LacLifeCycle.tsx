const stages = [
  { no: "01", title: "ไข่", text: "จุดเริ่มต้นของวงจรชีวิตแมลงครั่ง" },
  { no: "02", title: "ตัวอ่อน", text: "ตัวอ่อนเกาะบนพืชอาศัยและดูดกินน้ำเลี้ยงจากพืช" },
  { no: "03", title: "ตัวผู้", text: "ระยะตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน" },
  { no: "04", title: "ตัวเมีย", text: "ตัวเมียเจริญเติบโตและให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว" },
];

export function LacLifeCycle() {
  return (
    <section id="life-cycle" className="scroll-mt-24 bg-rac-blue-deep px-4 py-16 text-white sm:py-20" aria-labelledby="life-cycle-title">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">LIFE CYCLE</p>
            <h2 id="life-cycle-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">วงจรชีวิตครั่ง</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              จากไข่สู่ตัวอ่อน ตัวผู้ และตัวเมีย — วงจรชีวิตเชื่อมโยงโดยตรงกับการแพร่พันธุ์และการเพาะเลี้ยงครั่งบนพืชอาศัย
            </p>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            <div className="pointer-events-none absolute left-8 right-8 top-8 hidden h-px bg-white/15 sm:block" aria-hidden="true" />
            {stages.map((stage) => (
              <article key={stage.no} className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-mono text-sm font-bold text-rac-blue-deep">{stage.no}</span>
                  <h3 className="text-xl font-bold">{stage.title}</h3>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
