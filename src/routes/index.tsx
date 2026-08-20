import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function HeaderNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A2E4D] text-white font-['Mitr'] shadow-lg border-b border-[#08233C]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* ==================== ฝั่งซ้าย: โลโก้ 3 ตัว + เส้นแบ่ง + ชื่อหน่วยงาน ==================== */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* กลุ่มโลโก้ 3 ตัว */}
            <div className="flex items-center gap-2">
              {/* โลโก้ 1: Envi */}
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

              {/* โลโก้ 2: Mahidol */}
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

              {/* โลโก้ 3: Social Engagement */}
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

            {/* เส้นแบ่งแนวตั้ง */}
            <div className="w-[1px] h-8 sm:h-10 bg-white/25 shrink-0 hidden sm:block"></div>

            {/* ชื่อหน่วยงาน 2 บรรทัด (ขาว / เหลืองทอง) */}
            <div className="hidden sm:block">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-snug">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#F5B800] block leading-tight mt-0.5">
                คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
              </span>
            </div>

          </div>

          {/* ==================== ฝั่งขวา: เมนูนำทาง ==================== */}
          <div className="hidden xl:flex items-center space-x-5 text-xs sm:text-sm font-normal text-white shrink-0">
            <Link to="/" className="hover:text-[#F5B800] transition-colors py-1">
              หน้าแรก
            </Link>
            <a href="#cards-section" className="hover:text-[#F5B800] transition-colors py-1">
              คลังความรู้
            </a>
            <a href="#learning-base" className="hover:text-[#F5B800] transition-colors py-1">
              ฐานการเรียนรู้
            </a>
            <a href="#about" className="hover:text-[#F5B800] transition-colors py-1">
              เกี่ยวกับเรา
            </a>
            <a href="#data-viz" className="hover:text-[#F5B800] transition-colors py-1">
              สถิติ
            </a>
            <a href="#feedback" className="hover:text-[#F5B800] transition-colors py-1">
              เสียงสะท้อน
            </a>
            <a href="#partners" className="hover:text-[#F5B800] transition-colors py-1">
              พันธมิตร
            </a>
            <a href="#news" className="hover:text-[#F5B800] transition-colors py-1">
              ข่าวสาร
            </a>

            {/* ไอคอนค้นหา 🔍 */}
            <button 
              type="button" 
              aria-label="Search"
              className="p-1.5 rounded-full hover:bg-white/10 text-white hover:text-[#F5B800] transition-colors cursor-pointer ml-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* ปุ่ม Mobile Menu Hamburger (สำหรับหน้าจอเล็ก) */}
          <div className="xl:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-[#F5B800] focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-white/20 space-y-2 text-sm font-normal">
            <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              หน้าแรก
            </Link>
            <a href="#cards-section" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              คลังความรู้
            </a>
            <a href="#learning-base" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              ฐานการเรียนรู้
            </a>
            <a href="#about" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              เกี่ยวกับเรา
            </a>
            <a href="#data-viz" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              สถิติ
            </a>
            <a href="#feedback" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              เสียงสะท้อน
            </a>
            <a href="#partners" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              พันธมิตร
            </a>
            <a href="#news" className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
              ข่าวสาร
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
      {/* ==================== HERO SECTION ==================== */}
      <div>
        <header className="bg-[#801818] text-white py-16 px-4 sm:px-8 border-b-3 border-[#1A1A1A] relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <span className="inline-block bg-[#F2E8CF] text-[#1A1A1A] font-semibold text-xs sm:text-sm tracking-wider px-4 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
              [RESEARCH] ห้องการเรียนรู้ครั่งครบวงจร
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-[2px_2px_0px_#1A1A1A]">
              ศูนย์เรียนรู้ & องค์ความรู้ครั่ง
            </h1>
            <p className="text-base sm:text-xl font-normal max-w-2xl mx-auto text-[#F2E8CF] leading-relaxed">
              คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
            </p>
          </div>
        </header>

        {/* Video Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="bg-white border-3 border-[#1A1A1A] p-4 sm:p-6 rounded-3xl shadow-[6px_6px_0px_#1A1A1A] space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-center">
              🎬 วิดีโอแนะนำห้องการเรียนรู้ครั่ง
            </h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#1A1A1A] bg-[#1A1A1A]">
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
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-[#F9F6F0] py-8 text-center border-t-3 border-[#1A1A1A] mt-16 space-y-2">
        <p className="text-xs sm:text-sm font-normal px-4">
          งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
        </p>
        <p className="text-[#A0A0A0] text-xs font-mono">
          © 2026 Faculty of Environment and Resource Studies, Mahidol University
        </p>
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
      bg: "bg-[#F2E8CF]",
      detail: {
        overview: "ครั่ง คือ ยางหรือสารชันที่ขับออกมาจากตัวแมลงครั่งเพื่อสร้างเป็นรังห่อหุ้มลำตัว มีคุณสมบัติละลายในแอลกอฮอล์และหลอมเหลวด้วยความร้อน",
        highlights: [
          "สารธรรมชาติ 100% ที่ปลอดภัยและย่อยสลายได้",
          "ภูมิปัญญาดั้งเดิมในงานช่างสิบหมู่และยารักษาโรค",
        ],
      },
    },
    {
      id: 2,
      icon: "🌳",
      title: "พืชอาศัย & นิเวศวิทยา",
      desc: "ต้นไม้อาศัยที่เหมาะแก่การเพาะเลี้ยง เช่น จามจุรี ปลัก สีเสียด พร้อมรับมือสภาวะโลกร้อน",
      tag: "นิเวศวิทยา",
      bg: "bg-[#D8E2DC]",
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
      bg: "bg-[#FFCAD4]",
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
      bg: "bg-[#BEE1E6]",
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
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          📚 หมวดหมู่องค์ความรู้เรื่องครั่ง
        </h2>
        <p className="text-sm font-medium text-[#4A4A4A]">
          (คลิกที่การ์ดเพื่ออ่านข้อมูลเชิงลึกแบบเต็ม)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`${card.bg} border-3 border-[#1A1A1A] p-6 rounded-3xl shadow-[5px_5px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#1A1A1A] transition-all cursor-pointer flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl bg-white p-2 rounded-2xl border-2 border-[#1A1A1A]">
                  {card.icon}
                </span>
                <span className="text-[11px] font-semibold tracking-wider px-3 py-1 bg-[#1A1A1A] text-white rounded-full">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold leading-snug pt-2">
                {card.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-[#2B2B2B]">
                {card.desc}
              </p>
            </div>
            <div className="text-xs font-semibold text-[#801818] flex items-center gap-1">
              <span>อ่านเพิ่มเติม</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/80 backdrop-blur-xs"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-[#F9F6F0] border-3 border-[#1A1A1A] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[8px_8px_0px_#1A1A1A] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 bg-white border-2 border-[#1A1A1A] w-9 h-9 rounded-full font-bold flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCard.icon}</span>
                <h3 className="text-2xl font-bold">{selectedCard.title}</h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-[#801818]">📌 ภาพรวมองค์ความรู้</h4>
                <p className="text-sm font-normal leading-relaxed bg-white p-4 rounded-2xl border-2 border-[#1A1A1A] text-[#2B2B2B]">
                  {selectedCard.detail.overview}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-[#2D5A27]">💡 ประเด็นสำคัญ</h4>
                <ul className="space-y-2 text-sm font-normal text-[#2B2B2B]">
                  {selectedCard.detail.highlights.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#801818] font-bold">•</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="w-full bg-[#1A1A1A] text-white font-semibold py-3 rounded-xl border-2 border-[#1A1A1A] tracking-wider cursor-pointer hover:bg-[#333] transition-colors"
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
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          📊 สถิติและข้อมูลการผลิต จ.ลำปาง
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFCAD4] border-3 border-[#1A1A1A] p-6 rounded-3xl shadow-[5px_5px_0px_#1A1A1A]">
          <p className="text-xs font-semibold tracking-wider text-[#801818]">ศูนย์กลางการผลิตใหญ่สุด</p>
          <h3 className="text-2xl font-bold mt-1">อ.งาว (บ้านบ่อสี่เหลี่ยม)</h3>
          <p className="text-4xl font-bold mt-4">300,000 <span className="text-base font-semibold text-[#1A1A1A]">กก./ปี</span></p>
        </div>

        <div className="bg-[#D8E2DC] border-3 border-[#1A1A1A] p-6 rounded-3xl shadow-[5px_5px_0px_#1A1A1A]">
          <p className="text-xs font-semibold tracking-wider text-[#2D5A27]">ประสิทธิภาพสูงสุด</p>
          <h3 className="text-2xl font-bold mt-1">อ.สบปราบ</h3>
          <p className="text-4xl font-bold mt-4">อันดับ 1</p>
        </div>

        <div className="bg-[#F2E8CF] border-3 border-[#1A1A1A] p-6 rounded-3xl shadow-[5px_5px_0px_#1A1A1A]">
          <p className="text-xs font-semibold tracking-wider text-[#801818]">พืชอาศัยยอดนิยม</p>
          <h3 className="text-2xl font-bold mt-1">ต้นจามจุรี (ก้ามปู)</h3>
          <p className="text-4xl font-bold mt-4">TOP 1</p>
        </div>
      </div>

      <div className="bg-white border-3 border-[#1A1A1A] p-6 rounded-3xl shadow-[6px_6px_0px_#1A1A1A] space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <h3 className="text-xl font-bold">📍 อันดับพื้นที่การผลิต จ.ลำปาง</h3>
          <div className="flex bg-[#F9F6F0] p-1.5 rounded-xl border-2 border-[#1A1A1A] font-semibold text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("farmers")}
              className={`px-3 py-1.5 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                activeTab === "farmers" ? "bg-[#801818] text-white border-[#1A1A1A]" : ""
              }`}
            >
              ผู้เลี้ยงมากสุด
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("efficiency")}
              className={`px-3 py-1.5 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                activeTab === "efficiency" ? "bg-[#2D5A27] text-white border-[#1A1A1A]" : ""
              }`}
            >
              ประสิทธิภาพสูงสุด
            </button>
          </div>
        </div>

        <div className="space-y-3 font-semibold text-sm">
          {activeTab === "farmers" ? (
            <>
              <div className="p-4 bg-[#FFCAD4] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥇 อันดับ 1: อ.วังเหนือ</span>
                <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-xs font-semibold">เกษตรกรมากที่สุด</span>
              </div>
              <div className="p-4 bg-[#F9F6F0] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥈 อันดับ 2: อ.แจ้ห่ม</span>
                <span className="text-xs font-medium text-[#555]">ยุทธศาสตร์การผลิต</span>
              </div>
              <div className="p-4 bg-[#F9F6F0] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥉 อันดับ 3: อ.เมืองปาน</span>
                <span className="text-xs font-medium text-[#555]">ยุทธศาสตร์การผลิต</span>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-[#D8E2DC] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥇 อันดับ 1: อ.สบปราบ</span>
                <span className="bg-[#2D5A27] text-white px-3 py-1 rounded-full text-xs font-semibold">ผลผลิต/กก.พันธุ์ สูงสุด</span>
              </div>
              <div className="p-4 bg-[#F9F6F0] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥈 อันดับ 2: อ.เสริมงาม</span>
                <span className="text-xs font-medium text-[#555]">อัตราการรอดสูง</span>
              </div>
              <div className="p-4 bg-[#F9F6F0] rounded-2xl border-2 border-[#1A1A1A] flex justify-between items-center">
                <span>🥉 อันดับ 3: อ.ห้างฉัตร</span>
                <span className="text-xs font-medium text-[#555]">อัตราการรอดสูง</span>
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
      <h2 className="text-2xl font-bold text-center mb-6">
        ❓ เจาะลึกรายละเอียด (FAQ)
      </h2>

      <div className="space-y-3">
        {accordions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white border-3 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1A1A1A]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-4 font-bold text-left cursor-pointer"
              >
                <span className="text-base sm:text-lg">{item.title}</span>
                <span className="text-xl font-black">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#F9F6F0] font-normal text-sm leading-relaxed text-[#2B2B2B]">
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
