const products = [
  { no: "01", title: "Stick Lac", thai: "ครั่งดิบ", text: "วัตถุดิบครั่งที่เก็บจากกิ่งไม้และเป็นจุดเริ่มต้นของการแปรรูป" },
  { no: "02", title: "Seed Lac", thai: "ครั่งเม็ด", text: "ครั่งที่ผ่านการแยกและทำให้เป็นเม็ดสำหรับใช้เป็นวัตถุดิบต่อไป" },
  { no: "03", title: "Shellac", thai: "เชลแล็ก", text: "ผลิตภัณฑ์จากครั่งที่นำไปใช้เป็นสารเคลือบและวัสดุธรรมชาติหลายรูปแบบ" },
  { no: "04", title: "Product Innovation", thai: "นวัตกรรมผลิตภัณฑ์", text: "ต่อยอดครั่งสู่สีธรรมชาติ การเคลือบ อาหาร และผลิตภัณฑ์ในชีวิตประจำวัน" },
];

const uses = ["สีธรรมชาติ", "สีผสมอาหาร", "เคลือบไม้", "เคลือบผลไม้", "เคลือบยา", "ลิปสติก", "ช็อกโกแลต"];

export function LacProductJourney() {
  return (
    <section id="lac-product" className="scroll-mt-24 bg-[#4b2b24] px-4 py-16 text-white sm:py-20" aria-labelledby="lac-product-title">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">LAC → PRODUCT</p>
            <h2 id="lac-product-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">จากครั่งดิบสู่ผลิตภัณฑ์</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">มองเห็นเส้นทางการต่อยอดของครั่ง ตั้งแต่วัตถุดิบจากธรรมชาติ ไปสู่รูปแบบที่ใช้เป็นฐานสำหรับผลิตภัณฑ์และนวัตกรรม</p>
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-amber-200">LAC AROUND US</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {uses.map((use) => (
                  <span key={use} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs text-white/80">{use}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative grid gap-4 sm:grid-cols-2">
            {products.map((product, index) => (
              <article key={product.no} className="relative rounded-3xl border border-white/10 bg-[#5d352c] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-mono text-sm font-bold text-[#4b2b24]">{product.no}</span>
                  {index < products.length - 1 && <span className="hidden font-mono text-xs text-white/30 sm:block" aria-hidden="true">→</span>}
                </div>
                <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-amber-200">{product.thai}</p>
                <h3 className="mt-1 text-xl font-bold">{product.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{product.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-white/65" aria-label="เส้นทางการเรียนรู้จากครั่งสู่ผลิตภัณฑ์">
          <span className="rounded-full border border-white/10 px-4 py-2">ครั่งดิบ</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-full border border-white/10 px-4 py-2">การแปรรูป</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-amber-100">ผลิตภัณฑ์และนวัตกรรม</span>
        </div>
      </div>
    </section>
  );
}
