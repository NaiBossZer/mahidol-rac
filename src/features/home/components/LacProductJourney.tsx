const products = [
  { no: "01", title: "Stick Lac", thai: "ครั่งดิบ", icon: "🌿", text: "วัตถุดิบครั่งที่เก็บจากกิ่งไม้และเป็นจุดเริ่มต้นของการแปรรูป" },
  { no: "02", title: "Seed Lac", thai: "ครั่งเม็ด", icon: "🟤", text: "ครั่งที่ผ่านการแยกและทำให้เป็นเม็ดสำหรับใช้เป็นวัตถุดิบต่อไป" },
  { no: "03", title: "Shellac", thai: "เชลแล็ก", icon: "✨", text: "ผลิตภัณฑ์จากครั่งที่นำไปใช้เป็นสารเคลือบและวัสดุธรรมชาติหลายรูปแบบ" },
  { no: "04", title: "Product Innovation", thai: "นวัตกรรมผลิตภัณฑ์", icon: "💡", text: "ต่อยอดครั่งสู่สีธรรมชาติ การเคลือบ อาหาร และผลิตภัณฑ์ในชีวิตประจำวัน" },
];

const uses = ["🎨 สีธรรมชาติ", "🍎 เคลือบผลไม้", "💊 เคลือบยา", "💄 ลิปสติก", "🍫 ช็อกโกแลต", "🪵 เคลือบไม้", "🥤 สีผสมอาหาร"];

export function LacProductJourney() {
  return (
    <section id="lac-product" className="scroll-mt-24 bg-[#4b2b24] px-4 py-14 text-white sm:py-20" aria-labelledby="lac-product-title">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-amber-300 sm:text-[10px] sm:tracking-[0.2em]">06 — LAC → PRODUCT</p>
          <h2 id="lac-product-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">จากครั่ง<span className="text-amber-300">สู่ผลิตภัณฑ์</span></h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">มองเห็นเส้นทางการต่อยอดของครั่ง ตั้งแต่วัตถุดิบจากธรรมชาติ ไปสู่ผลิตภัณฑ์และนวัตกรรม</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.no} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:bg-white/[0.09] sm:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold tracking-[0.16em] text-amber-300">{product.no}</span><span className="text-3xl" aria-hidden="true">{product.icon}</span></div>
              <p className="mt-5 text-[10px] font-semibold tracking-[0.14em] text-amber-200 sm:text-xs">{product.thai}</p>
              <h3 className="mt-1 text-base font-bold sm:text-lg">{product.title}</h3>
              <p className="mt-3 text-xs leading-6 text-white/65 sm:text-sm sm:leading-7">{product.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:mt-10 sm:p-6">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-amber-200 sm:text-xs sm:tracking-[0.16em]">LAC AROUND US</p>
          <div className="mt-4 flex flex-wrap gap-2">{uses.map((use) => <span key={use} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs text-white/80">{use}</span>)}</div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-white/65 sm:mt-10 sm:gap-3" aria-label="เส้นทางการเรียนรู้จากครั่งสู่ผลิตภัณฑ์">
          <span className="rounded-full border border-white/10 px-3 py-2 sm:px-4">ครั่งดิบ</span><span aria-hidden="true">→</span><span className="rounded-full border border-white/10 px-3 py-2 sm:px-4">การแปรรูป</span><span aria-hidden="true">→</span><span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-amber-100 sm:px-4">ผลิตภัณฑ์และนวัตกรรม</span>
        </div>
      </div>
    </section>
  );
}
