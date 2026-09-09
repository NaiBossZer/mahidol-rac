const journey = [
  { no: "01", icon: "🪲", title: "ครั่งคืออะไร?", text: "ทำความรู้จักครั่งในฐานะทรัพยากรธรรมชาติจากแมลงครั่งและเรซินธรรมชาติที่ผลิตขึ้น", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop", alt: "ภาพธรรมชาติสำหรับครั่งคืออะไร" },
  { no: "02", icon: "🌏", title: "ต้นกำเนิด", text: "สำรวจแหล่งกำเนิดของครั่งในภูมิภาคเอเชียใต้และเอเชียตะวันออกเฉียงใต้", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop", alt: "ภูมิประเทศสำหรับต้นกำเนิด" },
  { no: "03", icon: "🔬", title: "วงจรชีวิต", text: "ติดตามการเปลี่ยนแปลงของแมลงครั่ง ตั้งแต่ไข่ ตัวอ่อน ตัวผู้ และตัวเมีย", image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&h=700&fit=crop", alt: "ภาพธรรมชาติสำหรับวงจรชีวิต" },
  { no: "04", icon: "🌳", title: "พืชอาศัยและนิเวศวิทยา", text: "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นไม้พิงอาศัย สภาพแวดล้อม และการเจริญเติบโต", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&h=700&fit=crop", alt: "ป่าและพืชอาศัย" },
  { no: "05", icon: "🌱", title: "การเพาะเลี้ยงครั่ง", text: "ทำความเข้าใจการเตรียมพันธุ์ การปล่อย การดูแล และการเก็บเกี่ยวตามฤดูกาล", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&h=700&fit=crop", alt: "พื้นที่เกษตรสำหรับการเพาะเลี้ยง" },
  { no: "06", icon: "📍", title: "ครั่งในจังหวัดลำปาง", text: "เชื่อมโยงองค์ความรู้กับพื้นที่ปลูกครั่งและบริบทของเกษตรกรในจังหวัดลำปาง", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&h=700&fit=crop", alt: "ภูมิทัศน์สำหรับบริบทลำปาง" },
];

export function LearningJourney() {
  return (
    <section id="learning-journey" className="scroll-mt-24 bg-rac-surface px-4 py-14 sm:py-20" aria-labelledby="learning-journey-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-rac-lac sm:text-[10px] sm:tracking-[0.2em]">03 — LEARNING JOURNEY</p>
          <h2 id="learning-journey-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">เส้นทางการเรียนรู้</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">เรียนรู้เรื่องครั่งเป็นลำดับ จากสิ่งมีชีวิตและระบบนิเวศ ไปสู่การเพาะเลี้ยงและบริบทของลำปาง</p>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((item, index) => (
            <article key={item.no} className="group relative min-h-[300px] min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.32] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.42]" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/55 to-slate-950/90" aria-hidden="true" />
              <div className="relative z-10 flex h-full min-h-[300px] flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="font-mono text-xs font-bold tracking-[0.2em] text-rac-gold">{item.no}</span><span className="text-xl" aria-hidden="true">{item.icon}</span></div>
                  {index < journey.length - 1 && <span className="hidden font-mono text-[10px] tracking-[0.12em] text-white/60 lg:block" aria-hidden="true">NEXT →</span>}
                </div>
                <h3 className="mt-6 w-fit max-w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-lg font-bold leading-snug text-white shadow-sm backdrop-blur-[2px] sm:text-xl">{item.title}</h3>
                <p className="mt-auto max-w-xl pt-5 text-sm leading-7 text-white/85">{item.text}</p>
                <span className="mt-4 h-px w-8 bg-rac-gold/60 transition-all duration-300 group-hover:w-14" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
