import { Link } from "react-router-dom";
import { homepageSectionImages } from "@/features/home/homepageSectionImages";

const products = [
  { no: "01", title: "Stick Lac", thai: "ครั่งดิบ", icon: "🌿", text: "วัตถุดิบครั่งที่เก็บจากกิ่งไม้และเป็นจุดเริ่มต้นของการแปรรูป" },
  { no: "02", title: "Seed Lac", thai: "ครั่งเม็ด", icon: "🟤", text: "ครั่งที่ผ่านการแยกและทำให้เป็นเม็ดสำหรับใช้เป็นวัตถุดิบต่อไป" },
  { no: "03", title: "Shellac", thai: "เชลแล็ก", icon: "✨", text: "ผลิตภัณฑ์จากครั่งที่นำไปใช้เป็นสารเคลือบและวัสดุธรรมชาติหลายรูปแบบ" },
  { no: "04", title: "Product Innovation", thai: "นวัตกรรมผลิตภัณฑ์", icon: "💡", text: "ต่อยอดครั่งสู่สีธรรมชาติ การเคลือบ อาหาร และผลิตภัณฑ์ในชีวิตประจำวัน" },
];

const uses = ["🎨 สีธรรมชาติ", "🍎 เคลือบผลไม้", "💊 เคลือบยา", "💄 ลิปสติก", "🍫 ช็อกโกแลต", "🪵 เคลือบไม้", "🥤 สีผสมอาหาร"];

export function LacProductJourney() {
  return (
    <section id="lac-product" className="relative scroll-mt-24 overflow-hidden bg-[#f3eadb] px-4 py-14 text-[#2a211d] sm:py-20" aria-labelledby="lac-product-title">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.12]" style={{ backgroundImage: `url(${homepageSectionImages.product})` }} aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8"><p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-[#8f3028] sm:text-[10px] sm:tracking-[0.2em]">06 — LAC → PRODUCT</p><h2 id="lac-product-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">จากครั่ง<span className="text-[#8f3028]">สู่การใช้ประโยชน์</span></h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d5a50] sm:text-base">เรื่องราวของครั่งจากวัตถุดิบธรรมชาติ ผ่านการแปรรูป ไปสู่การใช้ประโยชน์และนวัตกรรมในชีวิตประจำวัน</p></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.map((product) => <article key={product.no} className="rounded-2xl border border-[#8f3028]/15 bg-white/85 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold tracking-[0.16em] text-[#8f3028]">{product.no}</span><span className="text-3xl" aria-hidden="true">{product.icon}</span></div><p className="mt-5 text-[10px] font-semibold tracking-[0.14em] text-[#8f3028] sm:text-xs">{product.thai}</p><h3 className="mt-1 text-base font-bold sm:text-lg">{product.title}</h3><p className="mt-3 text-xs leading-6 text-[#6d5a50] sm:text-sm sm:leading-7">{product.text}</p></article>)}</div>
        <div className="mt-8 rounded-2xl border border-[#8f3028]/15 bg-white/80 p-5 sm:mt-10 sm:p-6"><p className="text-[10px] font-semibold tracking-[0.14em] text-[#8f3028] sm:text-xs sm:tracking-[0.16em]">LAC AROUND US</p><div className="mt-4 flex flex-wrap gap-2">{uses.map((use) => <span key={use} className="rounded-full border border-[#8f3028]/10 bg-[#8f3028]/5 px-3 py-1.5 text-xs text-[#6d302b]">{use}</span>)}</div></div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-[#6d5a50] sm:mt-10 sm:gap-3" aria-label="เส้นทางการเรียนรู้จากครั่งสู่การใช้ประโยชน์"><span className="rounded-full border border-[#8f3028]/15 bg-white/70 px-3 py-2 sm:px-4">ครั่ง</span><span aria-hidden="true">→</span><span className="rounded-full border border-[#8f3028]/15 bg-white/70 px-3 py-2 sm:px-4">แปรรูป</span><span aria-hidden="true">→</span><span className="rounded-full border border-[#8f3028]/20 bg-[#8f3028]/10 px-3 py-2 font-semibold text-[#8f3028] sm:px-4">ต่อยอด</span><span aria-hidden="true">→</span><span className="rounded-full border border-[#8f3028]/20 bg-[#8f3028] px-3 py-2 font-semibold text-white sm:px-4">ใช้ประโยชน์</span></div>
        <div className="mt-7 text-center"><Link to="/lac/application" className="inline-flex rounded-xl border border-[#8f3028] px-5 py-2.5 text-sm font-semibold text-[#8f3028] transition hover:bg-[#8f3028] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3028] focus-visible:ring-offset-2">เรื่องราวจาก ENV Mahidol →</Link></div>
      </div>
    </section>
  );
}
