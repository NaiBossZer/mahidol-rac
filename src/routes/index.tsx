นี่คือโค้ดปรับปรุงหน้าเว็บ **`src/routes/index.tsx`** ตามดีไซน์ระบบใหม่ **"Modern Earthy Academic"** ครับ 

### ✨ สิ่งที่ปรับปรุงในดีไซน์ใหม่:
1. **ยกระดับความน่าเชื่อถือแบบสถาบันวิจัย**: ปรับลดเส้นขอบดำหนาเตอะ (Neo-Brutalism) เป็นการ์ดสีขาวสะอาด ละมุนตา พร้อมขอบและเงาฟุ้งสไตล์โมเดิร์น (`border-slate-200/80`, `shadow-xl`, `rounded-2xl`)
2. **คุมโทนสีเอกลักษณ์ครั่ง & สิ่งแวดล้อม**:
   - **Header**: สีกรมท่าวิชาการ (`#0A2E4D`) และข้อความสีเหลืองทอง (`#F5B800`)
   - **Hero Section**: สีกรมเลือดหมูครั่งเกรดพรีเมียม (`bg-gradient-to-r from-[#701414] via-[#801818] to-[#961E1E]`)
   - **Cards & Visuals**: ใช้การ์ดไล่เฉดสีอ่อนธรรมชาติ (Rose, Emerald, Amber) ที่ถนอมสายตา
3. **เอฟเฟกต์การโต้ตอบที่ลื่นไหล (Micro-Interactions)**: เพิ่มลูกเล่น Hover ยกตัวขึ้นเบาๆ (`hover:-translate-y-1`), แท็บเลือกข้อมูลแบบ Pill Button และ Modal แบบกระจกฝ้า (`backdrop-blur-md`)

---

### 💻 โค้ดฉบับสมบูรณ์สำหรับ `src/routes/index.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-['Mitr'] selection:bg-[#801818] selection:text-white flex flex-col justify-between">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#0A2E4D] text-white shadow-md border-b border-[#08233C]">
        <nav className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* ฝั่งซ้าย: โลโก้ 3 ตัว + เส้นแบ่ง + ข้อความ */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img 
                    src="/envi-logo.jpg" 
                    alt="Envi Mahidol Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🌍 Envi';
                    }}
                  />
                </div>

                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img 
                    src="/mahidol-logo.png" 
                    alt="Mahidol University Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🏛️ Mahidol';
                    }}
                  />
                </div>

                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img 
                    src="/social-engagement-logo.png" 
                    alt="Social Engagement Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🤝 Social';
                    }}
                  />
                </div>
              </div>

              <div className="w-[1px] h-8 sm:h-10 bg-white/20 shrink-0 hidden sm:block"></div>

              <div className="hidden sm:block">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-snug">
                  งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#F5B800] block leading-tight mt-0.5">
                  คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
                </span>
              </div>
            </div>

            {/* ฝั่งขวา: เมนูนำทาง */}
            <div className="hidden xl:flex items-center space-x-6 text-xs sm:text-sm font-normal text-slate-200 shrink-0">
              <Link to="/" className="hover:text-[#F5B800] transition-colors py-1">
                หน้าแรก
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("cards-section")}
                className="hover:text-[#F5B800] transition-colors py-1 cursor-pointer"
              >
                คลังความรู้
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("data-viz")}
                className="hover:text-[#F5B800] transition-colors py-1 cursor-pointer"
              >
                สถิติ
              </button>
              <Link to="/survey" className="hover:text-[#F5B800] transition-colors py-1">
                แบบสอบถาม
              </Link>
              <Link 
                to="/dashboard" 
                className="bg-[#F5B800] text-[#0A2E4D] hover:bg-[#ffc926] px-3.5 py-1.5 rounded-lg font-semibold transition-all shadow-sm"
              >
                DASHBOARD
              </Link>
              <button
                type="button"
                aria-label="Search"
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-200 hover:text-[#F5B800] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="xl:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-[#F5B800]"
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>

          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-white/15 space-y-2 text-sm font-normal">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
                หน้าแรก
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("cards-section")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white"
              >
                คลังความรู้
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("data-viz")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white"
              >
                สถิติ
              </button>
              <Link to="/survey" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
                แบบสอบถาม
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-[#F5B800] text-[#0A2E4D] font-semibold text-center mt-2">
                DASHBOARD
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="grow">
        
        {/* HERO SECTION */}
        <header className="bg-gradient-to-r from-[#701414] via-[#801818] to-[#961E1E] text-white py-16 sm:py-20 px-4 sm:px-8 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-[#F5B800] font-medium text-xs sm:text-sm tracking-wide px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F5B800] animate-pulse"></span>
              ห้องการเรียนรู้ครั่งครบวงจร มหาวิทยาลัยมหิดล
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
              ศูนย์เรียนรู้ & องค์ความรู้ครั่ง
            </h1>
            <p className="text-base sm:text-lg font-light max-w-2xl mx-auto text-rose-100/90 leading-relaxed">
              งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
            </p>
          </div>
        </header>

        {/* Video Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200/80 p-5 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>🎬</span> วิดีโอแนะนำห้องการเรียนรู้ครั่ง
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                รับชมบรรยากาศและบทเรียนการเพาะเลี้ยงครั่งอย่างถูกต้อง
              </p>
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                <source src="/intro-lac.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Cards Grid Section */}
        <div id="cards-section" className="scroll-mt-24">
          <LacKnowledgeCards />
        </div>

        {/* Data Viz Section */}
        <div id="data-viz" className="scroll-mt-24">
          <LacDataVisualization />
        </div>

        {/* Accordion Section */}
        <LacKnowledgeAccordion />
      </main>

      {/* Footer */}
      <footer className="bg-[#071F34] text-slate-300 py-10 border-t border-slate-800 mt-16 space-y-3 text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
            งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
          </p>
          <p className="text-slate-500 text-xs font-mono">
            © 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

// --- COMPONENT: Cards Grid ---
function LacKnowledgeCards() {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  const cards = [
    {
      id: 1,
      icon: "🐞",
      title: "ครั่งคืออะไร & ถิ่นกำเนิด",
      desc: "ยางธรรมชาติจากแมลงครั่ง สารชันสีแดงธรรมชาติตั้งแต่เอเชียใต้ถึงตะวันออกเฉียงใต้",
      tag: "พื้นฐานครั่ง",
      tagBg: "bg-amber-100 text-amber-800 border-amber-200",
      detail: {
        overview: "ครั่ง คือ ยางหรือสารชันที่ขับออกมาจากตัวแมลงครั่งเพื่อสร้างเป็นรังห่อหุ้มลำตัว มีคุณสมบัติละลายในแอลกอฮอล์และหลอมเหลวด้วยความร้อน",
        highlights: [
          "สารธรรมชาติ 100% ที่ปลอดภัยและย่อยสลายได้ง่าย",
          "ภูมิปัญญาดั้งเดิมในงานช่างสิบหมู่และยารักษาโรคไทย",
        ],
      },
    },
    {
      id: 2,
      icon: "🌳",
      title: "พืชอาศัย & นิเวศวิทยา",
      desc: "ต้นไม้อาศัยที่เหมาะแก่การเพาะเลี้ยง เช่น จามจุรี ปลัก สีเสียด พร้อมรับมือสภาวะโลกร้อน",
      tag: "นิเวศวิทยา",
      tagBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      detail: {
        overview: "แมลงครั่งอาศัยกิ่งของต้นไม้เฉพาะชนิดเพื่อดูดกินน้ำเลี้ยง พืชอาศัยที่ดีต้องมีทรงพุ่มโปร่งและกิ่งอ่อนสมบูรณ์",
        highlights: [
          "ต้นจามจุรี (ก้ามปู): โตไว ให้ผลผลิตครั่งสูงที่สุด",
          "ต้นปลัก/สีเสียด: ทนทานสภาพอากาศแห้งแล้งได้ดีเยี่ยม",
        ],
      },
    },
    {
      id: 3,
      icon: "📅",
      title: "การเพาะเลี้ยง & การจัดการ",
      desc: "รอบปฏิทินฤดูกาล (รอบร้อน/ฝน) เทคนิคการคัดแม่พันธุ์ และการดูแลป้องกันศัตรูครั่ง",
      tag: "คู่มือเกษตรกร",
      tagBg: "bg-rose-100 text-rose-800 border-rose-200",
      detail: {
        overview: "การเลี้ยงครั่งแบ่งเป็น 2 รอบตามฤดูกาล การจัดการที่ดีช่วยลดอัตราการสูญเสียจากศัตรูพืช",
        highlights: [
          "รอบฤดูร้อน: ปล่อยพันธุ์ พ.ย.-ธ.ค. เก็บเกี่ยว พ.ค.-มิ.ย.",
          "รอบฤดูฝน: ปล่อยพันธุ์ พ.ค.-มิ.ย. เก็บเกี่ยว พ.ย.-ธ.ค.",
        ],
      },
    },
    {
      id: 4,
      icon: "🧪",
      title: "ผลิตภัณฑ์ & การแปรรูป",
      desc: "การแปรรูปสู่ครั่งเมล็ด เชลแลก สีย้อมผ้า สารเคลือบผิวผลไม้/ยา และน้ำล้างครั่ง",
      tag: "นวัตกรรม",
      tagBg: "bg-sky-100 text-sky-800 border-sky-200",
      detail: {
        overview: "ครั่งดิบถูกนำไปแกะ บด ล้าง สกัดแยกสี เพื่อส่งต่อเข้าสู่อุตสาหกรรมมูลค่าสูง",
        highlights: [
          "เชลแลก (Shellac): เคลือบเงาไม้ และเคลือบเม็ดยา/อาหาร",
          "สีสกัดครั่ง: สีย้อมธรรมชาติปลอดภัยสำหรับสิ่งทอ",
        ],
      },
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
          📚 หมวดหมู่องค์ความรู้เรื่องครั่ง
        </h2>
        <p className="text-sm font-normal text-slate-500">
          คลิกที่การ์ดเพื่อเปิดอ่านรายละเอียดเชิงลึกฉบับเต็ม
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-3xl w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${card.tagBg}`}>
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#801818] transition-colors leading-snug">
                {card.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-slate-600">
                {card.desc}
              </p>
            </div>
            <div className="text-xs font-semibold text-[#801818] flex items-center gap-1 group-hover:gap-2 transition-all pt-2 border-t border-slate-100">
              <span>อ่านเพิ่มเติม</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                <span className="text-4xl p-2 bg-slate-50 rounded-2xl border border-slate-100">{selectedCard.icon}</span>
                <div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${selectedCard.tagBg}`}>
                    {selectedCard.tag}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedCard.title}</h3>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-[#801818]">📌 ภาพรวมองค์ความรู้</h4>
                <p className="text-sm font-normal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700">
                  {selectedCard.detail.overview}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-[#2D5A27]">💡 ประเด็นสำคัญ</h4>
                <ul className="space-y-2 text-sm font-normal text-slate-700">
                  {selectedCard.detail.highlights.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#801818] font-bold">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="w-full bg-[#0A2E4D] hover:bg-[#071F34] text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// --- COMPONENT: Data Visualization ---
function LacDataVisualization() {
  const [activeTab, setActiveTab] = useState<"farmers" | "efficiency">("farmers");

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
          📊 สถิติและข้อมูลการผลิต จ.ลำปาง
        </h2>
        <p className="text-sm font-normal text-slate-500">
          ข้อมูลเชิงสถิติจำนวนผู้ผลิตและพื้นที่ศักยภาพในจังหวัดลำปาง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50/50 border border-rose-200/60 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-semibold tracking-wider text-[#801818]">ศูนย์กลางการผลิตใหญ่สุด</p>
          <h3 className="text-xl font-bold text-slate-800">อ.งาว (บ้านบ่อสี่เหลี่ยม)</h3>
          <p className="text-3xl sm:text-4xl font-bold text-[#801818] pt-2">
            300,000 <span className="text-sm font-semibold text-slate-600">กก./ปี</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-semibold tracking-wider text-[#2D5A27]">ประสิทธิภาพสูงสุด</p>
          <h3 className="text-xl font-bold text-slate-800">อ.สบปราบ</h3>
          <p className="text-3xl sm:text-4xl font-bold text-[#2D5A27] pt-2">
            อันดับ 1
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200/60 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-semibold tracking-wider text-amber-800">พืชอาศัยยอดนิยม</p>
          <h3 className="text-xl font-bold text-slate-800">ต้นจามจุรี (ก้ามปู)</h3>
          <p className="text-3xl sm:text-4xl font-bold text-amber-700 pt-2">
            TOP 1
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">📍 อันดับพื้นที่การผลิต จ.ลำปาง</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl font-semibold text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("farmers")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "farmers" ? "bg-[#0A2E4D] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ผู้เลี้ยงมากสุด
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("efficiency")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "efficiency" ? "bg-[#2D5A27] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ประสิทธิภาพสูงสุด
            </button>
          </div>
        </div>

        <div className="space-y-3 font-semibold text-sm">
          {activeTab === "farmers" ? (
            <>
              <div className="p-4 bg-rose-50/70 border border-rose-200/70 rounded-2xl flex justify-between items-center text-slate-800">
                <span className="font-bold">🥇 อันดับ 1: อ.วังเหนือ</span>
                <span className="bg-[#801818] text-white px-3 py-1 rounded-full text-xs font-medium">เกษตรกรมากที่สุด</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-slate-700">
                <span>🥈 อันดับ 2: อ.แจ้ห่ม</span>
                <span className="text-xs font-normal text-slate-500">พื้นที่ยุทธศาสตร์</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-slate-700">
                <span>🥉 อันดับ 3: อ.เมืองปาน</span>
                <span className="text-xs font-normal text-slate-500">พื้นที่ยุทธศาสตร์</span>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex justify-between items-center text-slate-800">
                <span className="font-bold">🥇 อันดับ 1: อ.สบปราบ</span>
                <span className="bg-[#2D5A27] text-white px-3 py-1 rounded-full text-xs font-medium">ผลผลิต/กก.พันธุ์ สูงสุด</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-slate-700">
                <span>🥈 อันดับ 2: อ.เสริมงาม</span>
                <span className="text-xs font-normal text-slate-500">อัตราการรอดสูง</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-slate-700">
                <span>🥉 อันดับ 3: อ.ห้างฉัตร</span>
                <span className="text-xs font-normal text-slate-500">อัตราการรอดสูง</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// --- COMPONENT: Accordion ---
function LacKnowledgeAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const accordions = [
    {
      title: "🗓️ ปฏิทินและเทคนิคการเพาะเลี้ยงครั่ง",
      content: "รอบฤดูร้อน (ปล่อย พ.ย.-ธ.ค. / เก็บ พ.ค.-มิ.ย.) และรอบฤดูฝน (ปล่อย พ.ค.-มิ.ย. / เก็บ พ.ย.-ธ.ค.)",
    },
    {
      title: "🌿 รายชื่อพืชอาศัยยอดนิยม",
      content: "ต้นจามจุรี (ก้ามปู), ต้นปลัก, ต้นสีเสียด, กระถินเทพา, ต้นลำไย ฯลฯ",
    },
    {
      title: "🏭 ผลิตภัณฑ์และการแปรรูปจากครั่ง",
      content: "เชลแลกทาเงาไม้, สีสกัดย้อมผ้าธรรมชาติ, สารเคลือบเม็ดยา/ผลไม้ และน้ำล้างครั่งบำรุงดิน",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-6">
        ❓ เจาะลึกรายละเอียด (FAQ)
      </h2>

      <div className="space-y-3">
        {accordions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-4 sm:p-5 font-semibold text-slate-800 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-base sm:text-lg">{item.title}</span>
                <span className="text-xl font-medium text-slate-400">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 text-slate-700 text-sm leading-relaxed">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```
