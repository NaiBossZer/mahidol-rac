const journey = [
  { no: "01", title: "ครั่งคืออะไร?", text: "ทำความรู้จักครั่งในฐานะทรัพยากรธรรมชาติจากแมลงครั่งและเรซินธรรมชาติที่ผลิตขึ้น" },
  { no: "02", title: "ต้นกำเนิด", text: "สำรวจแหล่งกำเนิดของครั่งในภูมิภาคเอเชียใต้และเอเชียตะวันออกเฉียงใต้" },
  { no: "03", title: "วงจรชีวิต", text: "ติดตามการเปลี่ยนแปลงของแมลงครั่ง ตั้งแต่ไข่ ตัวอ่อน ตัวผู้ และตัวเมีย" },
  { no: "04", title: "พืชอาศัยและนิเวศวิทยา", text: "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นไม้พิงอาศัย สภาพแวดล้อม และการเจริญเติบโต" },
  { no: "05", title: "การเพาะเลี้ยงครั่ง", text: "ทำความเข้าใจการเตรียมพันธุ์ การปล่อย การดูแล และการเก็บเกี่ยวตามฤดูกาล" },
  { no: "06", title: "ครั่งในจังหวัดลำปาง", text: "เชื่อมโยงองค์ความรู้กับพื้นที่ปลูกครั่งและบริบทของเกษตรกรในจังหวัดลำปาง" },
];

export function LearningJourney() {
  return (
    <section id="learning-journey" className="scroll-mt-24 bg-rac-surface px-4 py-14 sm:py-20" aria-labelledby="learning-journey-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-rac-lac sm:text-xs sm:tracking-[0.2em]">LEARNING JOURNEY</p>
          <h2 id="learning-journey-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">เส้นทางการเรียนรู้</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">เรียนรู้เรื่องครั่งเป็นลำดับ จากสิ่งมีชีวิตและระบบนิเวศ ไปสู่การเพาะเลี้ยงและบริบทของลำปาง</p>
        </div>
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {journey.map((item, index) => (
            <article key={item.no} className="group relative min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
              {index < journey.length - 1 && <span className="absolute right-5 top-5 hidden font-mono text-[10px] text-rac-lac/45 lg:block" aria-hidden="true">NEXT →</span>}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-rac-lac">{item.no}</span>
                <span className="h-px w-8 bg-rac-lac/30 transition-all group-hover:w-14" aria-hidden="true" />
              </div>
              <h3 className="mt-7 text-lg font-bold leading-snug text-slate-900 sm:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
