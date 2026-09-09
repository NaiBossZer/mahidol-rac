import { Link } from "react-router-dom";

const journey = [
  {
    no: "01",
    icon: "🪲",
    title: "ครั่งคืออะไร?",
    text: "เริ่มจากสิ่งมีชีวิตตัวเล็ก ทำความเข้าใจครั่งและเรซินธรรมชาติที่แมลงครั่งผลิตขึ้น",
    href: "/lac/what-is-lac",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop",
    alt: "ภาพธรรมชาติสำหรับครั่งคืออะไร",
  },
  {
    no: "02",
    icon: "🌏",
    title: "ต้นกำเนิดครั่ง",
    text: "ทำความรู้จักที่มาและบริบทของครั่ง ก่อนเชื่อมโยงเข้าสู่การเรียนรู้ในพื้นที่ลำปาง",
    href: "/lac/origin",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop",
    alt: "ภูมิประเทศสำหรับต้นกำเนิดครั่ง",
  },
  {
    no: "03",
    icon: "🔬",
    title: "วงจรชีวิตครั่ง",
    text: "ติดตามชีววิทยาและการเปลี่ยนแปลงของแมลงครั่ง ตั้งแต่ระยะเริ่มต้นจนถึงการสร้างเรซิน",
    href: "/lac/life-cycle",
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&h=700&fit=crop",
    alt: "ภาพธรรมชาติสำหรับวงจรชีวิตครั่ง",
  },
  {
    no: "04",
    icon: "🌳",
    title: "ระบบนิเวศ & ต้นพิงอาศัย",
    text: "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นพิงอาศัย สภาพแวดล้อม และการเจริญเติบโต",
    href: "/lac/habitat",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&h=700&fit=crop",
    alt: "ป่าและพืชอาศัย",
  },
  {
    no: "05",
    icon: "🌱",
    title: "การเพาะเลี้ยงครั่ง",
    text: "ต่อยอดจากชีววิทยาสู่การปฏิบัติ ทำความเข้าใจการเตรียมพันธุ์ การดูแล และการเก็บเกี่ยว",
    href: "/lac/lac-farming",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&h=700&fit=crop",
    alt: "พื้นที่เกษตรสำหรับการเพาะเลี้ยงครั่ง",
  },
  {
    no: "06",
    icon: "📍",
    title: "ครั่งในจังหวัดลำปาง",
    text: "เชื่อมองค์ความรู้ทั้งหมดเข้ากับพื้นที่จริง เกษตรกร และบริบทการเพาะเลี้ยงครั่งในลำปาง",
    href: "/lac/lampang-lac",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&h=700&fit=crop",
    alt: "ภูมิทัศน์สำหรับบริบทครั่งในลำปาง",
  },
] as const;

export function LearningJourney() {
  return (
    <section
      id="learning-journey"
      className="scroll-mt-24 bg-[#f3eadb] px-4 py-14 sm:py-20"
      aria-labelledby="learning-journey-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-[#8f3328] sm:text-[10px] sm:tracking-[0.2em]">
            03 — LEARNING JOURNEY
          </p>
          <h2 id="learning-journey-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            เส้นทางการเรียนรู้
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            เรียนรู้เรื่องครั่งเป็นลำดับ จากพื้นฐานและชีววิทยา ไปสู่ระบบนิเวศ การเพาะเลี้ยง และบริบทของลำปาง
          </p>
        </div>

        <div className="relative mt-8 sm:mt-10">
          <div className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-[#c58a3a]/30 lg:block" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((item, index) => (
              <Link
                key={item.no}
                to={item.href}
                aria-label={`เรียนรู้: ${item.title}`}
                className="group relative min-h-[310px] min-w-0 overflow-hidden rounded-3xl border border-[#6d4a35]/15 bg-[#2f241d] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] focus-visible:ring-offset-2"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.28] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#241b17]/45 via-[#241b17]/60 to-[#241b17]/95" aria-hidden="true" />
                <div className="relative z-10 flex min-h-[310px] flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#c58a3a]">{item.no}</span>
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    </div>
                    {index < journey.length - 1 && (
                      <span className="hidden font-mono text-[10px] tracking-[0.12em] text-white/55 lg:block" aria-hidden="true">
                        NEXT →
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 w-fit max-w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-lg font-bold leading-snug text-white shadow-sm backdrop-blur-[2px] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-auto pt-5 text-sm leading-7 text-white/85">{item.text}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="h-px w-8 bg-[#c58a3a]/70 transition-all duration-300 group-hover:w-14" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[#ead9c4]">เปิดบทเรียน →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#6d4a35]/15 bg-white/60 px-4 py-3 sm:px-5">
          <p className="text-xs leading-5 text-slate-600 sm:text-sm">
            เส้นทางนี้เป็นจุดเริ่มต้นของ Knowledge UX และเชื่อมต่อไปยังองค์ความรู้รายหัวข้อในระบบ
          </p>
          <Link to="/lac/knowledge" className="shrink-0 rounded-xl bg-[#8f3028] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] focus-visible:ring-offset-2 sm:text-sm">
            ดูองค์ความรู้ทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}
