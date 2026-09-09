import { useState, useEffect, useRef } from "react";
import { C } from "./tokens";
import { Eyebrow, SourceTag, PageHero, SectionWrap, SectionHead, KnowledgeCard, DetailDrawer, ProcessStep, Footer } from "./components";

// ── Page type ──────────────────────────────────────────────────────────────
type Page =
  | "home"
  | "what-is-lac"
  | "life-cycle"
  | "habitat"
  | "host-plants"
  | "lac-farming"
  | "farmers-choice"
  | "lampang-lac"
  | "lac-product"
  | "product-innovation"
  | "lac-around-us"
  | "carbon-footprint"
  | "community";

// ── Navigation ─────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "ความรู้",
    items: [
      { label: "ครั่งคืออะไร", page: "what-is-lac" as Page },
      { label: "วงจรชีวิต", page: "life-cycle" as Page },
      { label: "ระบบนิเวศ & ต้นพิงอาศัย", page: "habitat" as Page },
      { label: "ต้นพิงอาศัย", page: "host-plants" as Page },
      { label: "การเพาะเลี้ยงครั่ง", page: "lac-farming" as Page },
    ],
  },
  {
    label: "ผลิตภัณฑ์",
    items: [
      { label: "ครั่ง → ผลิตภัณฑ์", page: "lac-product" as Page },
      { label: "นวัตกรรม", page: "product-innovation" as Page },
      { label: "ครั่งรอบตัวเรา", page: "lac-around-us" as Page },
    ],
  },
  {
    label: "เกษตรกร & ชุมชน",
    items: [
      { label: "ครั่งในลำปาง", page: "lampang-lac" as Page },
      { label: "ทางเลือกเกษตรกร", page: "farmers-choice" as Page },
      { label: "Carbon Footprint", page: "carbon-footprint" as Page },
      { label: "ชุมชน & เครือข่าย", page: "community" as Page },
    ],
  },
];

function Nav({ current, navigate, heroVisible }: { current: Page; navigate: (p: Page) => void; heroVisible: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const dark = !heroVisible || current !== "home";
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: dark ? "rgba(42,33,29,0.95)" : "transparent",
        backdropFilter: dark ? "blur(14px)" : "none",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <button onClick={() => navigate("home")} className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-mono font-bold tracking-tight"
            style={{ background: C.red, color: C.cream }}
          >
            ครั่ง
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase" style={{ color: C.amber }}>
              LAC LEARNING CENTER
            </p>
            <p className="font-display text-sm font-semibold leading-tight" style={{ color: C.cream }}>
              ห้องเรียนรู้ครั่ง
            </p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 relative" ref={dropdownRef}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="relative">
              <button
                onMouseEnter={() => setActiveGroup(group.label)}
                onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
                className="px-4 py-2 rounded-md font-body text-sm transition-all duration-150 flex items-center gap-1.5"
                style={{
                  color: "rgba(243,235,221,0.8)",
                  background: activeGroup === group.label ? "rgba(255,255,255,0.06)" : "transparent",
                  fontFamily: "'Noto Sans Thai', sans-serif",
                }}
              >
                {group.label}
                <span className="text-[8px] opacity-50">▼</span>
              </button>
              {activeGroup === group.label && (
                <div
                  className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden shadow-2xl animate-scaleIn z-50"
                  style={{ minWidth: "200px", background: "rgba(42,33,29,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseLeave={() => setActiveGroup(null)}
                >
                  {group.items.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => { navigate(item.page); setActiveGroup(null); }}
                      className="w-full text-left px-4 py-3 font-body text-sm transition-all duration-100 border-b last:border-b-0"
                      style={{
                        color: current === item.page ? C.blue : "rgba(243,235,221,0.75)",
                        background: current === item.page ? `${C.blue}12` : "transparent",
                        borderColor: "rgba(255,255,255,0.05)",
                        fontFamily: "'Noto Sans Thai', sans-serif",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="เมนู" style={{ color: C.cream }}>
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`block w-full h-0.5 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: C.cream }} />
            <span className={`block w-full h-0.5 transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} style={{ background: C.cream }} />
            <span className={`block w-full h-0.5 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: C.cream }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden overflow-y-auto max-h-[80vh]" style={{ background: "rgba(42,33,29,0.98)" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="px-6 py-3 font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: C.amber }}>
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { navigate(item.page); setMenuOpen(false); }}
                  className="w-full text-left px-8 py-3 font-body text-sm border-b"
                  style={{
                    color: current === item.page ? C.blue : "rgba(243,235,221,0.75)",
                    borderColor: "rgba(255,255,255,0.04)",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

// ── HOME ───────────────────────────────────────────────────────────────────
function HomePage({ navigate, setHeroVisible }: { navigate: (p: Page) => void; setHeroVisible: (v: boolean) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0.1 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, [setHeroVisible]);

  const journey = [
    { label: "WHAT?", sub: "ครั่งคืออะไร", page: "what-is-lac" as Page },
    { label: "LIFE CYCLE", sub: "วงจรชีวิต", page: "life-cycle" as Page },
    { label: "HABITAT", sub: "ระบบนิเวศ", page: "habitat" as Page },
    { label: "FARMING", sub: "การเพาะเลี้ยง", page: "lac-farming" as Page },
    { label: "LAMPANG", sub: "ครั่งลำปาง", page: "lampang-lac" as Page },
    { label: "FARMER'S CHOICE", sub: "ทางเลือก", page: "farmers-choice" as Page },
    { label: "PRODUCT", sub: "ผลิตภัณฑ์", page: "lac-product" as Page },
    { label: "INNOVATION", sub: "นวัตกรรม", page: "product-innovation" as Page },
    { label: "AROUND US", sub: "รอบตัวเรา", page: "lac-around-us" as Page },
    { label: "CARBON", sub: "CFP", page: "carbon-footprint" as Page },
    { label: "COMMUNITY", sub: "ชุมชน", page: "community" as Page },
  ];

  const knowledgeCards = [
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", alt: "ครั่งบนกิ่งไม้", cat: "01 — ความรู้พื้นฐาน", title: "ครั่งคืออะไร?", desc: "เรซินธรรมชาติจากแมลงตัวเล็ก สู่วัตถุดิบที่มีคุณค่าหลากหลาย", page: "what-is-lac" as Page },
    { img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop", alt: "ธรรมชาติ", cat: "02 — LIFE CYCLE", title: "วงจรชีวิตครั่ง", desc: "จากไข่ ตัวอ่อน จนถึงการสร้างเรซินและการเก็บเกี่ยว", page: "life-cycle" as Page },
    { img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", alt: "ป่าและระบบนิเวศ", cat: "03 — HABITAT", title: "ระบบนิเวศ & ต้นพิงอาศัย", desc: "สภาพแวดล้อม ต้นไม้ และระบบนิเวศที่เหมาะสมสำหรับครั่ง", page: "habitat" as Page },
    { img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop", alt: "เกษตรกร", cat: "04 — FARMING", title: "การเพาะเลี้ยงครั่ง", desc: "ขั้นตอนการเพาะเลี้ยงจากการเลือกพันธุ์ถึงการเก็บเกี่ยว", page: "lac-farming" as Page },
    { img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", alt: "ลำปาง", cat: "05 — LAMPANG", title: "ครั่งในจังหวัดลำปาง", desc: "แผนที่นิทรรศการ 7 อำเภอ ชุมชน และพื้นที่การเพาะเลี้ยง", page: "lampang-lac" as Page },
    { img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=400&fit=crop", alt: "ความยั่งยืน", cat: "06 — CARBON", title: "Carbon Footprint", desc: "CFP CFO Scope 1–3 และเส้นทางสู่ Net Zero ผ่านครั่ง", page: "carbon-footprint" as Page },
  ];

  const productHighlights = [
    { label: "Stick Lac", thai: "ครั่งแท่ง", icon: "🪵", desc: "ครั่งดิบที่เก็บจากกิ่งไม้", page: "lac-product" as Page },
    { label: "Seed Lac", thai: "ครั่งเมล็ด", icon: "🌱", desc: "ครั่งที่ผ่านการบดและแยกเมล็ด", page: "lac-product" as Page },
    { label: "Shellac", thai: "เชลแลค", icon: "✨", desc: "เรซินบริสุทธิ์ใช้ในอุตสาหกรรม", page: "lac-product" as Page },
    { label: "Lac Dye", thai: "สีย้อมครั่ง", icon: "🎨", desc: "สีธรรมชาติจากเรซินครั่ง", page: "product-innovation" as Page },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${C.dark} 0%, #3D2820 45%, #2E1E15 100%)` }}
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] right-[-8%] w-[700px] h-[700px] rounded-full opacity-[0.07]"
            style={{ background: `radial-gradient(circle, ${C.amber} 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: `radial-gradient(circle, ${C.red} 0%, transparent 65%)` }} />
          {/* Decorative insect SVG */}
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04] hidden xl:block" width="600" height="600" viewBox="0 0 200 200">
            <ellipse cx="100" cy="85" rx="20" ry="28" fill={C.red} />
            <ellipse cx="100" cy="130" rx="32" ry="48" fill={C.red} />
            <circle cx="100" cy="60" r="18" fill={C.amber} />
            {[0,45,90,135,180,225,270,315].map((deg, i) => (
              <line key={i} x1="100" y1="110"
                x2={100 + 60 * Math.cos((deg - 90) * Math.PI / 180)}
                y2={110 + 60 * Math.sin((deg - 90) * Math.PI / 180)}
                stroke={C.amber} strokeWidth="1.5" opacity="0.5" />
            ))}
          </svg>
          {/* Horizontal rule */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(197,138,58,0.12)" }} />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-20 relative z-10 w-full">
          <div className="max-w-[700px]">
            <p className="section-eyebrow mb-8 tracking-[0.25em]">LAC LEARNING CENTER — ห้องเรียนรู้ครั่ง</p>
            <h1
              className="font-display font-semibold leading-[1.12] mb-7"
              style={{ color: C.cream, fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
            >
              จากแมลงตัวเล็ก<br />
              <span style={{ color: C.amber }}>สู่ทรัพยากรธรรมชาติ</span><br />
              ที่สร้างคุณค่า
            </h1>
            <p
              className="font-body text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: "rgba(243,235,221,0.7)", fontFamily: "'Noto Sans Thai', sans-serif", maxWidth: "520px" }}
            >
              เรียนรู้ครั่งตั้งแต่ธรรมชาติ การเพาะเลี้ยง ผลิตภัณฑ์ นวัตกรรม และความยั่งยืน
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate("what-is-lac")}
                className="px-8 py-4 rounded-lg font-body font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: C.red, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}
              >
                เริ่มเรียนรู้
              </button>
              <button
                onClick={() => navigate("life-cycle")}
                className="px-8 py-4 rounded-lg font-body font-semibold text-base transition-all duration-200"
                style={{ background: "rgba(243,235,221,0.08)", color: C.cream, border: `1px solid rgba(243,235,221,0.18)`, fontFamily: "'Noto Sans Thai', sans-serif" }}
              >
                วงจรชีวิตครั่ง →
              </button>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-6 flex items-center gap-3" style={{ opacity: 0.45 }}>
            <div className="flex flex-col gap-1">
              <div className="w-px h-8 mx-auto" style={{ background: C.amber }} />
              <div className="w-1 h-1 rounded-full mx-auto" style={{ background: C.amber }} />
            </div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: C.amber }}>Scroll</p>
          </div>
        </div>
      </section>

      {/* ── Journey strip ── */}
      <section style={{ background: C.dark }}>
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {journey.map((j, i) => (
              <div key={j.label} className="flex items-center gap-1">
                <button
                  onClick={() => navigate(j.page)}
                  className="font-mono text-[9px] md:text-[10px] tracking-[0.1em] px-2 py-1 rounded transition-all"
                  style={{ color: i < 3 ? C.amber : i < 7 ? "rgba(243,235,221,0.6)" : C.blue }}
                >
                  {j.label}
                </button>
                {i < journey.length - 1 && (
                  <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is Lac teaser ── */}
      <SectionWrap>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>ความรู้พื้นฐาน</Eyebrow>
            <h2 className="font-display text-4xl font-semibold mt-2 mb-6" style={{ color: C.dark }}>
              ครั่งคืออะไร?
            </h2>
            <p className="font-body text-lg leading-relaxed mb-4" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              ครั่งเป็นเรซินธรรมชาติที่เกี่ยวข้องกับแมลงครั่ง ซึ่งอาศัยบนต้นไม้พิงอาศัยและสร้างเรซินรอบบริเวณที่อาศัย
            </p>
            <p className="font-body text-base leading-relaxed mb-8" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              เรซินนี้คือ "ครั่ง" ที่เรารู้จัก — วัตถุดิบธรรมชาติที่มีคุณสมบัติพิเศษ ใช้ในอาหาร เครื่องสำอาง งานไม้ และอุตสาหกรรม
            </p>
            <button
              onClick={() => navigate("what-is-lac")}
              className="font-body text-sm font-semibold flex items-center gap-2 transition-all"
              style={{ color: C.red, fontFamily: "'Noto Sans Thai', sans-serif" }}
            >
              เรียนรู้เพิ่มเติม <span className="text-base">→</span>
            </button>
          </div>
          {/* Visual composition */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Resin", thai: "เรซิน", pct: "~70%", color: C.red, icon: "💧" },
              { name: "Dye", thai: "สีย้อม", pct: "~10%", color: "#C4442C", icon: "🎨" },
              { name: "Water", thai: "น้ำ", pct: "~10%", color: C.blue, icon: "💦" },
              { name: "Wax", thai: "ขี้ผึ้ง", pct: "~5%", color: C.amber, icon: "🕯️" },
              { name: "Mineral", thai: "แร่ธาตุ", pct: "~5%", color: "#8A7060", icon: "🪨" },
            ].map((c, i) => (
              <div
                key={c.name}
                className={`rounded-xl p-5 ${i === 0 ? "col-span-2" : ""}`}
                style={{ background: `${c.color}10`, border: `1px solid ${c.color}25` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: c.color }}>{c.name}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-display text-xl font-semibold" style={{ color: C.dark }}>{c.pct}</p>
                      <p className="font-body text-xs" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{c.thai}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrap>

      {/* ── Knowledge grid ── */}
      <SectionWrap bg={C.creamDeep}>
        <SectionHead eyebrow="ห้องนิทรรศการ" title="เส้นทางการเรียนรู้" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeCards.map((k) => (
            <KnowledgeCard key={k.page} img={k.img} alt={k.alt} category={k.cat} title={k.title} desc={k.desc} onClick={() => navigate(k.page)} />
          ))}
        </div>
      </SectionWrap>

      {/* ── Life Cycle teaser ── */}
      <SectionWrap bg={C.dark}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>LIFE CYCLE</Eyebrow>
            <h2 className="font-display text-4xl font-semibold mt-2 mb-6" style={{ color: C.cream }}>
              วงจรชีวิต<br />
              <span style={{ color: C.amber }}>ของครั่ง</span>
            </h2>
            <p className="font-body text-lg leading-relaxed mb-8" style={{ color: "rgba(243,235,221,0.7)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
              สำรวจแต่ละช่วงของวงจรชีวิต ตั้งแต่ไข่จนถึงการเก็บเกี่ยวครั่ง ผ่าน interactive timeline ที่ออกแบบเพื่อการเรียนรู้
            </p>
            <button
              onClick={() => navigate("life-cycle")}
              className="px-6 py-3 rounded-lg font-body font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: C.red, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}
            >
              สำรวจวงจรชีวิต →
            </button>
          </div>
          {/* Mini timeline */}
          <div className="flex flex-col gap-3">
            {[
              { num: "01", label: "ไข่", icon: "🥚" },
              { num: "02", label: "ตัวอ่อน", icon: "🐛" },
              { num: "03", label: "เพศผู้/เพศเมีย", icon: "🦋" },
              { num: "04", label: "การดูดกิน", icon: "🌿" },
              { num: "05", label: "การสร้างเรซิน", icon: "💧" },
              { num: "06", label: "การเก็บเกี่ยว", icon: "✨" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-3 ml-5" style={{ background: "rgba(197,138,58,0.3)" }} />}
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(197,138,58,0.2)" }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.12em]" style={{ color: C.amber }}>{s.num}</p>
                    <p className="font-body text-sm" style={{ color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrap>

      {/* ── Products teaser ── */}
      <SectionWrap bg={C.wood}>
        <SectionHead eyebrow="LAC → PRODUCT" title={<span style={{ color: C.cream }}>จากครั่ง<span style={{ color: C.amber }}>สู่ผลิตภัณฑ์</span></span>} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productHighlights.map((p) => (
            <button
              key={p.label}
              onClick={() => navigate(p.page)}
              className="interactive-card rounded-xl p-6 text-left"
              style={{ background: "rgba(243,235,221,0.06)", border: "1px solid rgba(243,235,221,0.12)" }}
            >
              <span className="text-3xl block mb-3">{p.icon}</span>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: C.amber }}>{p.label}</p>
              <p className="font-display font-semibold text-base mb-1" style={{ color: C.cream }}>{p.thai}</p>
              <p className="font-body text-xs" style={{ color: "rgba(243,235,221,0.55)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{p.desc}</p>
            </button>
          ))}
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={() => navigate("lac-product")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold transition-all"
            style={{ background: C.amber, color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ดูกระบวนการแปรรูป →
          </button>
          <button onClick={() => navigate("product-innovation")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold transition-all"
            style={{ background: "rgba(243,235,221,0.1)", color: C.cream, border: "1px solid rgba(243,235,221,0.2)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
            นวัตกรรม →
          </button>
        </div>
      </SectionWrap>

      {/* ── Lampang teaser ── */}
      <SectionWrap>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2">
            <Eyebrow>LAMPANG</Eyebrow>
            <h2 className="font-display text-4xl font-semibold mt-2 mb-5" style={{ color: C.dark }}>
              ครั่งในจังหวัดลำปาง
            </h2>
            <p className="font-body text-base leading-relaxed mb-6" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              สำรวจ 7 อำเภอหลักที่มีการเพาะเลี้ยงครั่ง ผ่านแผนที่นิทรรศการแบบ interactive
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["วังเหนือ", "แจ้ห่ม", "เมืองปาน", "งาว", "สบปราบ", "เสริมงาม", "ห้างฉัตร"].map(d => (
                <span key={d} className="px-3 py-1.5 rounded-full font-body text-xs"
                  style={{ background: "rgba(41,169,199,0.1)", color: C.blue, border: `1px solid ${C.blue}30`, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                  {d}
                </span>
              ))}
            </div>
            <button onClick={() => navigate("lampang-lac")}
              className="px-6 py-3 rounded-lg font-body text-sm font-semibold"
              style={{ background: C.dark, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              เปิดแผนที่นิทรรศการ →
            </button>
          </div>
          {/* Decorative mini map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3", background: "#E8DFC8" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "linear-gradient(135deg, #D4C8A8 0%, #C8BC98 100%)" }}>
              <path d="M20 10 L75 8 L88 20 L82 35 L78 50 L70 65 L72 80 L60 92 L40 90 L25 78 L18 62 L15 45 L18 28 Z"
                fill="#D9CDA8" stroke="rgba(90,64,48,0.25)" strokeWidth="0.5" />
              <path d="M30 15 Q35 35 38 55 Q40 70 42 88" fill="none" stroke={C.blue} strokeWidth="0.8" opacity="0.3" />
              {[{x:52,y:18},{x:38,y:30},{x:60,y:28},{x:30,y:45},{x:50,y:65},{x:35,y:70},{x:55,y:82}].map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="2" fill={i < 3 ? C.blue : C.red} stroke="#fff" strokeWidth="0.8" />
              ))}
              <text x="18" y="97" fontSize="2.2" fill={C.muted} style={{ fontFamily: "'DM Mono', monospace" }}>LAMPANG EXHIBITION MAP</text>
            </svg>
          </div>
        </div>
      </SectionWrap>

      {/* ── Carbon teaser ── */}
      <SectionWrap bg={`linear-gradient(135deg, #1A2F2A 0%, #0D1F1A 100%)`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>CARBON FOOTPRINT</Eyebrow>
            <h2 className="font-display text-4xl font-semibold mt-2 mb-6" style={{ color: C.cream }}>
              ครั่งกับ<br />
              <span style={{ color: "#4DB6AC" }}>ความยั่งยืน</span>
            </h2>
            <p className="font-body text-lg leading-relaxed mb-8" style={{ color: "rgba(243,235,221,0.7)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
              เรียนรู้ Carbon Footprint Scope 1–3 และเส้นทางสู่ Net Zero ผ่านมุมมองของครั่ง
            </p>
            <button onClick={() => navigate("carbon-footprint")}
              className="px-6 py-3 rounded-lg font-body text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: "#29A9C7", color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              สำรวจ Carbon Journey →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Scope 1", desc: "การปล่อยโดยตรง", color: C.red },
              { label: "Scope 2", desc: "พลังงานที่ซื้อมา", color: C.amber },
              { label: "Scope 3", desc: "ทางอ้อมอื่นๆ", color: C.blue },
              { label: "CFP", desc: "ระดับผลิตภัณฑ์", color: "#4DB6AC" },
              { label: "CFO", desc: "ระดับองค์กร", color: "#81C784" },
              { label: "Net Zero", desc: "เป้าหมายสูงสุด", color: C.amber },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}30` }}>
                <p className="font-mono text-xs font-semibold" style={{ color: s.color }}>{s.label}</p>
                <p className="font-body text-[10px] mt-1" style={{ color: "rgba(243,235,221,0.5)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrap>

      {/* ── Community teaser ── */}
      <SectionWrap>
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <Eyebrow>COMMUNITY</Eyebrow>
          <h2 className="font-display text-4xl font-semibold mt-2 mb-4" style={{ color: C.dark }}>
            จบที่คน
          </h2>
          <p className="font-body text-lg leading-relaxed" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            วิทยาศาสตร์ที่ยิ่งใหญ่เกิดจากความร่วมมือของชุมชน เกษตรกร สถาบันการศึกษา และภาคเอกชน
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["มหาวิทยาลัยมหิดล", "ภาครัฐ", "ภาคเอกชน", "โรงเรียน", "เกษตรกร", "ชุมชน"].map((n, i) => (
            <div key={n} className="flex items-center gap-2 px-4 py-3 rounded-full"
              style={{ background: i === 4 ? C.dark : C.creamDeep, border: i === 4 ? `1px solid ${C.amber}40` : "1px solid rgba(90,64,48,0.15)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: [C.red, C.amber, C.blue, "#81C784", C.amber, C.red][i] }} />
              <p className="font-body text-sm" style={{ color: i === 4 ? C.cream : C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{n}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigate("community")}
            className="px-8 py-4 rounded-lg font-body font-semibold text-base"
            style={{ background: C.dark, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            สำรวจเครือข่ายชุมชน →
          </button>
        </div>
      </SectionWrap>

      <Footer navigate={navigate} />
    </div>
  );
}

// ── WHAT IS LAC ────────────────────────────────────────────────────────────
function WhatIsLacPage({ navigate }: { navigate: (p: Page) => void }) {
  const [active, setActive] = useState<string | null>(null);

  const elements = [
    { id: "insect", label: "แมลงครั่ง", en: "Lac Insect", icon: "🐛", color: C.red,
      desc: "แมลงเกล็ด (Scale insect) ในวงศ์ Kerriidae สกุล Kerria ตัวเมียสร้างเรซินปกคลุมร่างกายเพื่อป้องกันตัวและไข่ ตัวผู้มีปีกและมีชีวิตสั้น",
      sci: "Kerria lacca" },
    { id: "plant", label: "ต้นพิงอาศัย", en: "Host Plant", icon: "🌿", color: "#2E7D32",
      desc: "ต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยง ได้แก่ จามจุรี ลิ้นจี่ ลำไย พุทรา ปันแถ/แถ/แข ถั่วมะแฮะ และอื่นๆ",
      sci: "Host Plant Species" },
    { id: "resin", label: "เรซิน", en: "Resin", icon: "💧", color: C.amber,
      desc: "สารธรรมชาติที่ครั่งสร้างขึ้นรอบตัว ประกอบด้วยเรซิน ขี้ผึ้ง สีย้อม แร่ธาตุ และน้ำ เป็นส่วนหลักที่นำมาแปรรูป",
      sci: "Shellac Resin" },
    { id: "lac", label: "ครั่ง", en: "Lac", icon: "✨", color: C.wood,
      desc: "เรซินธรรมชาติที่เก็บจากกิ่งไม้ หลังผ่านกระบวนการแปรรูปจะได้ Stick Lac → Seed Lac → Shellac ซึ่งใช้ประโยชน์ได้หลากหลาย",
      sci: "Lac / Shellac" },
  ];

  const composition = [
    { name: "Resin", thai: "เรซิน", color: C.red, pct: "~70%", w: "70%" },
    { name: "Dye", thai: "สีย้อม", color: "#C4442C", pct: "~10%", w: "10%" },
    { name: "Water", thai: "น้ำ", color: C.blue, pct: "~10%", w: "10%" },
    { name: "Wax", thai: "ขี้ผึ้ง", color: C.amber, pct: "~5%", w: "5%" },
    { name: "Mineral", thai: "แร่ธาตุ", color: "#8A7060", pct: "~5%", w: "5%" },
  ];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="01 — ความรู้พื้นฐาน"
        title={<>ครั่งคืออะไร?</>}
        subtitle="ครั่งเป็นเรซินธรรมชาติที่เกี่ยวข้องกับแมลงครั่ง ซึ่งอาศัยบนต้นไม้พิงอาศัยและสร้างเรซินรอบบริเวณที่อาศัย" />

      {/* Interactive elements */}
      <SectionWrap>
        <SectionHead eyebrow="องค์ประกอบ" title="เรื่องราวของครั่ง" desc="คลิกแต่ละองค์ประกอบเพื่อเรียนรู้" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {elements.map((el, i) => (
              <div key={el.id}>
                {i > 0 && <div className="flex items-center gap-2 ml-5 my-1"><div className="w-px h-5" style={{ background: `${C.amber}40` }} /><span className="font-mono text-xs" style={{ color: C.amber }}>↓</span></div>}
                <button
                  onClick={() => setActive(active === el.id ? null : el.id)}
                  className="w-full text-left rounded-xl p-5 transition-all duration-200 border"
                  style={{ background: active === el.id ? C.dark : "#fff", borderColor: active === el.id ? el.color : "rgba(90,64,48,0.14)", boxShadow: active === el.id ? `0 0 0 2px ${el.color}35` : "none" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${el.color}15` }}>
                      {el.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: el.color }}>{el.en}</p>
                      <p className="font-display text-lg font-semibold" style={{ color: active === el.id ? C.cream : C.dark }}>{el.label}</p>
                    </div>
                    <span className="font-mono text-sm flex-shrink-0" style={{ color: active === el.id ? C.amber : C.muted }}>{active === el.id ? "▲" : "▼"}</span>
                  </div>
                  {active === el.id && (
                    <div className="mt-4 pt-4 border-t animate-fadeIn space-y-3" style={{ borderColor: `${el.color}25` }}>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(243,235,221,0.82)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{el.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] px-2 py-1 rounded" style={{ background: `${el.color}20`, color: el.color }}>{el.sci}</span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Composition chart */}
          <div className="rounded-2xl p-8 sticky top-24 h-fit" style={{ background: C.dark }}>
            <Eyebrow>องค์ประกอบ</Eyebrow>
            <h3 className="font-display text-2xl font-semibold mt-2 mb-8" style={{ color: C.cream }}>Composition</h3>
            <div className="space-y-5">
              {composition.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="font-mono text-xs" style={{ color: "rgba(243,235,221,0.55)" }}>{c.name}</span>
                      <span className="font-body text-xs" style={{ color: "rgba(243,235,221,0.35)", fontFamily: "'Noto Sans Thai', sans-serif" }}>({c.thai})</span>
                    </div>
                    <span className="font-mono text-sm font-medium" style={{ color: c.color }}>{c.pct}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{ width: c.w, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* Key facts */}
      <SectionWrap bg={C.creamDeep}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "ชื่อทางวิทยาศาสตร์", value: "Kerria lacca", note: "สกุล Kerria วงศ์ Kerriidae" },
            { label: "ชนิดแมลง", value: "Scale Insect", note: "แมลงเกล็ดที่สร้างเรซินปกคลุมร่างกาย" },
            { label: "แหล่งกำเนิด", value: "เอเชียใต้", note: "กระจายสู่เอเชียตะวันออกเฉียงใต้รวมถึงไทย" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl p-6" style={{ background: "#fff" }}>
              <Eyebrow>{f.label}</Eyebrow>
              <p className="font-display text-2xl font-semibold mt-2 mb-1" style={{ color: C.dark }}>{f.value}</p>
              <p className="font-body text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{f.note}</p>
            </div>
          ))}
        </div>
      </SectionWrap>

      <Footer navigate={navigate} />
    </div>
  );
}

// ── LIFE CYCLE ─────────────────────────────────────────────────────────────
function LifeCyclePage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { num: "01", label: "ไข่", en: "Egg", icon: "🥚", color: C.amber,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      desc: "ตัวเมียที่โตเต็มวัยวางไข่ใต้เปลือกเรซิน ไข่มีขนาดเล็กมากและมีจำนวนมาก ระยะนี้เป็นจุดเริ่มต้นของวงจรชีวิตครั่ง",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
    { num: "02", label: "ตัวอ่อน", en: "Larva (Crawler)", icon: "🐛", color: "#7CB342",
      img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop",
      desc: "ตัวอ่อนระยะแรก (Crawler) ออกจากไข่ เดินทางตามกิ่งไม้เพื่อหาตำแหน่งเกาะ เริ่มดูดน้ำเลี้ยงและสร้างเรซิน",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
    { num: "03", label: "เพศผู้/เพศเมีย", en: "Male / Female", icon: "🦋", color: C.red,
      img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=400&fit=crop",
      desc: "ตัวผู้พัฒนาปีกและผสมพันธุ์ ตัวเมียไม่มีปีก อาศัยอยู่กับที่บนกิ่งไม้ เพิ่มขนาดและสร้างเรซินมากขึ้น",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
    { num: "04", label: "การดูดกิน", en: "Feeding", icon: "🌿", color: "#2E7D32",
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
      desc: "ครั่งดูดน้ำเลี้ยงจากกิ่งไม้พิงอาศัย สารอาหารถูกแปรสภาพเป็นเรซินและสารอื่นๆ ที่มีคุณค่าทางเศรษฐกิจ",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
    { num: "05", label: "การสร้างเรซิน", en: "Resin Formation", icon: "💧", color: "#F57F17",
      img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
      desc: "เรซินถูกสร้างจากต่อมของครั่งและปกคลุมรอบตัว ระยะนี้เป็นช่วงที่เรซินมีคุณภาพดีที่สุดก่อนการเก็บเกี่ยว",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
    { num: "06", label: "การเก็บเกี่ยว", en: "Lac Harvest", icon: "✨", color: C.wood,
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      desc: "เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม โดยเก็บทั้งกิ่งหรือขูดเรซินออก นำไปแปรรูปเป็นผลิตภัณฑ์ต่างๆ",
      duration: "ข้อมูลอยู่ระหว่างตรวจสอบ" },
  ];

  const s = stages[activeStage];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="02 — SIGNATURE EXPERIENCE" title={<>วงจรชีวิต<span style={{ color: C.amber }}>ของครั่ง</span></>}
        subtitle="สำรวจแต่ละช่วงของวงจรชีวิต ตั้งแต่ไข่จนถึงการเก็บเกี่ยว" />

      {/* Desktop horizontal timeline */}
      <SectionWrap>
        <div className="hidden md:block">
          {/* Track */}
          <div className="relative mb-14">
            <div className="absolute top-8 left-0 right-0 h-0.5" style={{ background: "rgba(90,64,48,0.12)" }} />
            <div className="absolute top-8 left-0 h-0.5 transition-all duration-700"
              style={{ width: `${((activeStage + 0.5) / stages.length) * 100}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.red})` }} />
            <div className="flex justify-between relative">
              {stages.map((st, i) => (
                <button key={st.num} onClick={() => setActiveStage(i)}
                  className="flex flex-col items-center gap-3 group"
                  style={{ width: `${100 / stages.length}%` }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200 border-2 relative z-10"
                    style={{
                      background: i <= activeStage ? (i === activeStage ? C.dark : C.wood) : "#fff",
                      borderColor: i === activeStage ? C.blue : i < activeStage ? C.amber : "rgba(90,64,48,0.18)",
                      boxShadow: i === activeStage ? `0 0 0 5px ${C.blue}22` : "none",
                      transform: i === activeStage ? "scale(1.1)" : "scale(1)",
                    }}>
                    {st.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] tracking-[0.15em]" style={{ color: i === activeStage ? C.amber : C.muted }}>{st.num}</p>
                    <p className="font-body text-xs font-semibold" style={{ color: i === activeStage ? C.dark : C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{st.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div key={activeStage} className="grid grid-cols-5 gap-0 rounded-2xl overflow-hidden animate-scaleIn" style={{ background: C.dark }}>
            <div className="col-span-2 min-h-[320px]">
              <img src={s.img} alt={s.en} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 p-10 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${s.color}25` }}>{s.icon}</div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: s.color }}>{s.num} — {s.en}</p>
                  <h3 className="font-display text-3xl font-semibold" style={{ color: C.cream }}>{s.label}</h3>
                </div>
              </div>
              <p className="font-body text-lg leading-relaxed mb-8" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
              <div className="flex items-center justify-between">
                <div className="rounded-lg px-4 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-1" style={{ color: C.muted }}>ระยะเวลา</p>
                  <p className="font-body text-sm" style={{ color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{ background: activeStage === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)", color: activeStage === 0 ? C.muted : C.cream }}>←</button>
                  <button onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))} disabled={activeStage === stages.length - 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{ background: activeStage === stages.length - 1 ? "rgba(255,255,255,0.04)" : `${C.blue}30`, color: activeStage === stages.length - 1 ? C.muted : C.blue }}>→</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-3">
          {stages.map((st, i) => (
            <button key={st.num} onClick={() => setActiveStage(i)}
              className="w-full text-left rounded-xl overflow-hidden transition-all duration-200 border"
              style={{ background: i === activeStage ? C.dark : "#fff", borderColor: i === activeStage ? C.blue : "rgba(90,64,48,0.12)" }}>
              <div className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${st.color}20` }}>{st.icon}</div>
                <div>
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: st.color }}>{st.num}</p>
                  <p className="font-display font-semibold" style={{ color: i === activeStage ? C.cream : C.dark }}>{st.label}</p>
                </div>
              </div>
              {i === activeStage && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <img src={st.img} alt={st.en} className="w-full h-44 object-cover rounded-lg mb-3" />
                  <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(243,235,221,0.8)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{st.desc}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── HABITAT & ECOLOGY ──────────────────────────────────────────────────────
function HabitatPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeLayer, setActiveLayer] = useState<"env" | "plant" | "lac">("env");

  const layers = {
    env: {
      label: "สภาพแวดล้อม",
      en: "Environment",
      icon: "🌦️",
      color: C.blue,
      factors: [
        { icon: "🌧️", label: "ปริมาณน้ำฝน", desc: "ต้องการปริมาณน้ำฝนที่เหมาะสม ไม่ชื้นเกินหรือแห้งเกิน" },
        { icon: "💧", label: "ความชื้น", desc: "ความชื้นสัมพัทธ์มีผลต่อการเจริญเติบโตและการสร้างเรซิน" },
        { icon: "🌡️", label: "อุณหภูมิ", desc: "อุณหภูมิที่เหมาะสมส่งผลต่อวงจรชีวิตและคุณภาพครั่ง" },
        { icon: "🌤️", label: "ภูมิอากาศ", desc: "ภูมิอากาศแบบร้อนชื้นเขตร้อนเหมาะกับการเพาะเลี้ยงครั่ง" },
      ],
    },
    plant: {
      label: "ต้นพิงอาศัย",
      en: "Host Plant",
      icon: "🌿",
      color: "#2E7D32",
      factors: [
        { icon: "🌱", label: "โครงสร้างกิ่ง", desc: "กิ่งที่มีขนาดเหมาะสมและสุขภาพดีสำหรับครั่งเกาะ" },
        { icon: "☀️", label: "แสงแดด", desc: "ต้นพิงอาศัยต้องได้รับแสงแดดเพียงพอ" },
        { icon: "🌬️", label: "การระบายอากาศ", desc: "อากาศถ่ายเทดีช่วยป้องกันโรคและแมลงศัตรู" },
        { icon: "🍃", label: "น้ำเลี้ยง", desc: "ความสมบูรณ์ของน้ำเลี้ยงในกิ่งเป็นอาหารหลักของครั่ง" },
      ],
    },
    lac: {
      label: "แมลงครั่ง",
      en: "Lac Insect",
      icon: "🐛",
      color: C.red,
      factors: [
        { icon: "🍽️", label: "การดูดกิน", desc: "ครั่งดูดน้ำเลี้ยงจากกิ่งผ่านปากที่เป็นเข็ม" },
        { icon: "📈", label: "การเจริญเติบโต", desc: "การเจริญเติบโตขึ้นอยู่กับสภาพแวดล้อมและต้นพิงอาศัย" },
        { icon: "💧", label: "การสร้างเรซิน", desc: "ต่อมในร่างกายสร้างเรซินปกคลุมตัวเป็นชั้นๆ" },
        { icon: "🔄", label: "วงจรชีวิต", desc: "วงจรชีวิตสัมพันธ์กับฤดูกาลและสภาพแวดล้อม" },
      ],
    },
  };

  const current = layers[activeLayer];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="03 — ระบบนิเวศ" title={<>Habitat &<br /><span style={{ color: C.amber }}>Ecology</span></>}
        subtitle="ระบบนิเวศ 3 ชั้นที่สัมพันธ์กัน: สภาพแวดล้อม ต้นพิงอาศัย และแมลงครั่ง" />

      <SectionWrap>
        <SectionHead eyebrow="โครงสร้าง 3 ชั้น" title="ระบบนิเวศของครั่ง" />

        {/* Layer selector */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {(Object.entries(layers) as [keyof typeof layers, typeof layers[keyof typeof layers]][]).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 border"
              style={{
                background: activeLayer === key ? layer.color : "#fff",
                borderColor: activeLayer === key ? layer.color : "rgba(90,64,48,0.15)",
                color: activeLayer === key ? "#fff" : C.dark,
              }}
            >
              <span className="text-xl">{layer.icon}</span>
              <div className="text-left">
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase" style={{ opacity: 0.7 }}>{layer.en}</p>
                <p className="font-body text-sm font-semibold" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>{layer.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Factor grid */}
        <div key={activeLayer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fadeIn">
          {current.factors.map((f) => (
            <div key={f.label} className="rounded-xl p-6 border" style={{ background: `${current.color}08`, borderColor: `${current.color}25` }}>
              <span className="text-3xl block mb-3">{f.icon}</span>
              <p className="font-display font-semibold mb-2" style={{ color: C.dark }}>{f.label}</p>
              <p className="font-body text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Layer diagram */}
        <div className="mt-14 rounded-2xl overflow-hidden" style={{ background: C.dark }}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {(Object.entries(layers) as [keyof typeof layers, typeof layers[keyof typeof layers]][]).map(([key, layer], i) => (
              <div
                key={key}
                className="p-8 cursor-pointer transition-all duration-200 border-b md:border-b-0 md:border-r last:border-0"
                style={{
                  background: activeLayer === key ? `${layer.color}18` : "transparent",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
                onClick={() => setActiveLayer(key)}
              >
                <div className="text-3xl mb-3">{layer.icon}</div>
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: layer.color }}>{layer.en}</p>
                <p className="font-display text-xl font-semibold mb-2" style={{ color: C.cream }}>{layer.label}</p>
                <p className="font-body text-sm" style={{ color: "rgba(243,235,221,0.55)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
                  {layer.factors.length} ปัจจัยหลัก
                </p>
                {i < 2 && (
                  <div className="hidden md:flex items-center justify-end mt-4">
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={() => navigate("host-plants")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold"
            style={{ background: C.dark, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ดูต้นพิงอาศัยทั้งหมด →
          </button>
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── HOST PLANTS ────────────────────────────────────────────────────────────
function HostPlantsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof plants)[0] | null>(null);

  const plants = [
    { name: "จามจุรี", en: "Rain Tree", sci: "Samanea saman", icon: "🌳", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=280&fit=crop", desc: "ต้นไม้ขนาดใหญ่ กิ่งก้านแข็งแรง เหมาะสำหรับการเพาะเลี้ยงครั่งจำนวนมาก", conditions: "แสงแดดเต็ม ดินร่วน ชื้นพอประมาณ" },
    { name: "ลิ้นจี่", en: "Lychee", sci: "Litchi chinensis", icon: "🌿", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=280&fit=crop", desc: "ผลไม้เศรษฐกิจที่ยังเป็นต้นพิงอาศัยชั้นดีของครั่ง สร้างรายได้สองทาง", conditions: "ภูมิอากาศเย็น ดินอุดมสมบูรณ์" },
    { name: "ลำไย", en: "Longan", sci: "Dimocarpus longan", icon: "🌱", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop", desc: "ต้นลำไยเป็นต้นพิงอาศัยที่พบมากในภาคเหนือของไทย โดยเฉพาะจังหวัดลำปาง", conditions: "อากาศเย็น ระดับความสูงปานกลาง" },
    { name: "พุทรา", en: "Indian Jujube", sci: "Ziziphus mauritiana", icon: "🌾", img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&h=280&fit=crop", desc: "ต้นพุทราทนแล้งได้ดี เหมาะกับพื้นที่แห้งแล้ง เป็นต้นพิงอาศัยที่ใช้ได้กว้าง", conditions: "ทนแล้ง ดินทรายปนร่วน" },
    { name: "ปันแถ / แถ / แข", en: "Paanthe", sci: "Dalbergia cultrata", icon: "🌲", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=280&fit=crop", desc: "ต้นไม้พื้นเมืองภาคเหนือ เป็นต้นพิงอาศัยตามธรรมชาติของครั่ง", conditions: "ภูมิอากาศกึ่งร้อนชื้น ป่าผลัดใบ" },
    { name: "ถั่วมะแฮะ", en: "Pigeon Pea", sci: "Cajanus cajan", icon: "🫘", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop", desc: "พืชตระกูลถั่วที่เติบโตเร็ว เหมาะสำหรับการเพาะเลี้ยงครั่งระยะสั้น", conditions: "ดินร่วน น้ำฝนปานกลาง" },
  ];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="04 — ต้นพิงอาศัย" title={<>Host Plant<br /><span style={{ color: C.amber }}>Explorer</span></>}
        subtitle="สำรวจต้นพิงอาศัยของครั่ง — พืชที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงเพื่อสร้างเรซิน" />

      <SectionWrap>
        <SectionHead eyebrow="ต้นพิงอาศัย" title="คลิกเพื่อดูรายละเอียด" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((p) => (
            <button
              key={p.name}
              onClick={() => { setSelected(p); setDrawerOpen(true); }}
              className="interactive-card group text-left rounded-xl overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 2px 16px rgba(42,33,29,0.07)" }}
            >
              <div className="h-44 overflow-hidden relative" style={{ background: C.creamDeep }}>
                <img src={p.img} alt={p.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 rounded-full w-10 h-10 flex items-center justify-center text-xl"
                  style={{ background: "rgba(42,33,29,0.6)", backdropFilter: "blur(4px)" }}>{p.icon}</div>
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: C.muted }}>{p.en}</p>
                <h3 className="font-display text-xl font-semibold mb-1" style={{ color: C.dark }}>{p.name}</h3>
                <p className="font-mono text-[9px] italic mb-3" style={{ color: C.muted }}>{p.sci}</p>
                <p className="font-body text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{p.desc}</p>
                <div className="flex items-center gap-2" style={{ color: C.blue }}>
                  <span className="font-mono text-xs">ดูรายละเอียด</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </SectionWrap>

      <DetailDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={selected?.name || ""}>
        {selected && (
          <div className="space-y-5">
            <img src={selected.img} alt={selected.en} className="w-full h-48 object-cover rounded-xl" />
            <div>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-0.5" style={{ color: C.muted }}>{selected.en}</p>
              <p className="font-mono text-sm italic mb-4" style={{ color: C.muted }}>{selected.sci}</p>
              <p className="font-body text-base leading-relaxed" style={{ color: C.text, fontFamily: "'Noto Sans Thai', sans-serif" }}>{selected.desc}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: C.creamDeep }}>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-2" style={{ color: C.amber }}>เงื่อนไขที่เหมาะสม</p>
              <p className="font-body text-sm" style={{ color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{selected.conditions}</p>
            </div>
            <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
          </div>
        )}
      </DetailDrawer>

      <Footer navigate={navigate} />
    </div>
  );
}

// ── LAC FARMING ────────────────────────────────────────────────────────────
function LacFarmingPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { num: "01", title: "เลือกพันธุ์ครั่ง", icon: "🔍", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=380&fit=crop",
      desc: "เลือกพันธุ์ครั่งที่มีคุณภาพดี สังเกตจากสีและความหนาของเรซิน ควรเลือกจากแหล่งที่เชื่อถือได้",
      note: "ควรเลือกพันธุ์ที่เหมาะสมกับพื้นที่และต้นพิงอาศัยที่มี" },
    { num: "02", title: "เตรียมต้นพิงอาศัย", icon: "🌿", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=380&fit=crop",
      desc: "ตัดแต่งกิ่งให้อากาศถ่ายเทดี ขจัดแมลงศัตรูพืช และเตรียมต้นให้สมบูรณ์ก่อนปล่อยครั่ง",
      note: "ต้นพิงอาศัยที่สมบูรณ์มีผลโดยตรงต่อคุณภาพและปริมาณครั่ง" },
    { num: "03", title: "ปล่อยครั่ง", icon: "🐛", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=380&fit=crop",
      desc: "ผูกกิ่งที่มีครั่งระยะตัวอ่อน (Crawler) ไว้กับกิ่งที่ต้องการให้ครั่งเกาะ เลือกช่วงเวลาที่เหมาะสม",
      note: "ต้องปล่อยในช่วงเวลาที่ตัวอ่อนออกจากไข่เท่านั้น" },
    { num: "04", title: "ดูแลรักษา", icon: "🌱", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=380&fit=crop",
      desc: "ดูแลต้นพิงอาศัย รดน้ำ ใส่ปุ๋ย และตรวจสอบสภาพแวดล้อมสม่ำเสมอ",
      note: "หลีกเลี่ยงการใช้สารเคมีที่อาจเป็นอันตรายต่อครั่ง" },
    { num: "05", title: "ตรวจติดตาม", icon: "🔎", img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=380&fit=crop",
      desc: "ตรวจสอบการเจริญเติบโต สังเกตสัญญาณโรคหรือแมลงศัตรู และบันทึกข้อมูลการเพาะเลี้ยง",
      note: "การตรวจติดตามสม่ำเสมอช่วยป้องกันความเสียหายได้ทันท่วงที" },
    { num: "06", title: "เก็บเกี่ยว", icon: "✨", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop",
      desc: "เก็บเกี่ยวในช่วงเวลาที่เหมาะสม ก่อนที่ตัวอ่อนชุดใหม่จะออก เพื่อรักษาคุณภาพเรซิน",
      note: "เวลาเก็บเกี่ยวมีผลอย่างมากต่อคุณภาพและปริมาณผลผลิต" },
  ];

  const s = steps[activeStep];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="05 — การเพาะเลี้ยง" title={<>การเพาะเลี้ยง<span style={{ color: C.amber }}>ครั่ง</span></>}
        subtitle="เส้นทางการเพาะเลี้ยงครั่ง 6 ขั้นตอน ตั้งแต่การเลือกพันธุ์ถึงการเก็บเกี่ยว" />

      <SectionWrap>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Step list */}
          <div className="space-y-3">
            {steps.map((st, i) => (
              <ProcessStep
                key={st.num} num={st.num} title={st.title} icon={st.icon}
                desc={st.desc} note={st.note} active={activeStep === i}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>

          {/* Detail panel */}
          <div className="sticky top-24 h-fit">
            <div key={activeStep} className="rounded-2xl overflow-hidden animate-scaleIn" style={{ background: C.dark }}>
              <img src={s.img} alt={s.title} className="w-full h-64 object-cover" />
              <div className="p-8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: C.amber }}>{s.num} — ขั้นตอน</p>
                <h3 className="font-display text-2xl font-semibold mb-4" style={{ color: C.cream }}>{s.title}</h3>
                <p className="font-body text-base leading-relaxed mb-5" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
                {s.note && (
                  <div className="rounded-xl p-4" style={{ background: `${C.amber}15`, border: `1px solid ${C.amber}25` }}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-1.5" style={{ color: C.amber }}>สิ่งสำคัญ</p>
                    <p className="font-body text-sm" style={{ color: C.amber, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button onClick={() => navigate("farmers-choice")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold"
            style={{ background: C.dark, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ดูทางเลือกเกษตรกร →
          </button>
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── FARMER'S CHOICE ────────────────────────────────────────────────────────
function FarmersChoicePage({ navigate }: { navigate: (p: Page) => void }) {
  const [selectedB, setSelectedB] = useState("lac-natural");

  const cropOption = { id: "cash-crop", label: "พืชเศรษฐกิจ", sub: "ข้าวโพด / มันสำปะหลัง / ข้าว", icon: "🌽" };
  const lacOptions = [
    { id: "lac-rent", label: "แบบเช่า", sub: "เช่าต้นไม้จากเจ้าของ", icon: "📋" },
    { id: "lac-natural", label: "แบบธรรมชาติ", sub: "ปล่อยครั่งตามธรรมชาติ", icon: "🌿" },
    { id: "lac-mixed", label: "แบบผสมผสาน", sub: "ผสมระหว่างการเลี้ยงและธรรมชาติ", icon: "🔀" },
  ];

  const metrics: Record<string, { yield: string; price: string; income: string; manage: string; invest: string }> = {
    "cash-crop": { yield: "ข้อมูลอยู่ระหว่างตรวจสอบ (ต่อไร่/ปี)", price: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/กก.)", income: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/ไร่/ปี)", manage: "ต้องการแรงงานและสารเคมีสูง", invest: "ต้นทุนสูง" },
    "lac-rent": { yield: "ข้อมูลอยู่ระหว่างตรวจสอบ (กก./ต้น/ปี)", price: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/กก.)", income: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/ไร่/ปี)", manage: "ต้องการการดูแลสม่ำเสมอ มีค่าเช่า", invest: "ต้นทุนปานกลาง มีค่าเช่า" },
    "lac-natural": { yield: "ข้อมูลอยู่ระหว่างตรวจสอบ (กก./ต้น/ปี)", price: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/กก.)", income: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/ไร่/ปี)", manage: "ต้นทุนต่ำ พึ่งพิงธรรมชาติ", invest: "ต้นทุนต่ำ" },
    "lac-mixed": { yield: "ข้อมูลอยู่ระหว่างตรวจสอบ (กก./ต้น/ปี)", price: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/กก.)", income: "ข้อมูลอยู่ระหว่างตรวจสอบ (บาท/ไร่/ปี)", manage: "ยืดหยุ่น เหมาะกับพื้นที่หลายประเภท", invest: "ปรับได้ตามบริบท" },
  };

  const metricRows = [
    { key: "yield" as const, label: "ผลผลิต (ต่อต้น/ปี)", icon: "📦" },
    { key: "price" as const, label: "ราคาเฉลี่ย (ต่อกิโลกรัม)", icon: "💰" },
    { key: "income" as const, label: "รายได้รวมเฉลี่ย (ต่อไร่/ปี)", icon: "📊" },
    { key: "invest" as const, label: "ระดับการลงทุน", icon: "💼" },
    { key: "manage" as const, label: "รูปแบบการจัดการ", icon: "⚙️" },
  ];

  const mA = metrics["cash-crop"];
  const mB = metrics[selectedB];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="06 — ทางเลือก" dark={false}
        title={<>เกษตรกรมีทางเลือก<br />อะไรบ้าง?</>}
        subtitle="เปรียบเทียบข้อมูลเพื่อประกอบการตัดสินใจ — ข้อมูลนี้เป็นเพียงการให้ข้อมูล ไม่ใช่คำแนะนำการลงทุน" />

      <SectionWrap>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Option A - fixed */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: C.muted }}>ตัวเลือก A</p>
            <div className="rounded-xl p-5 border" style={{ background: C.dark, borderColor: C.amber }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cropOption.icon}</span>
                <div>
                  <p className="font-display font-semibold text-lg" style={{ color: C.cream }}>{cropOption.label}</p>
                  <p className="font-body text-sm" style={{ color: "rgba(243,235,221,0.6)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{cropOption.sub}</p>
                </div>
                <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.amber }}>
                  <span className="text-white text-xs">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option B - selectable */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: C.muted }}>ตัวเลือก B — การเพาะเลี้ยงครั่ง</p>
            <div className="space-y-3">
              {lacOptions.map((o) => (
                <button key={o.id} onClick={() => setSelectedB(o.id)}
                  className="w-full text-left rounded-xl p-4 border transition-all duration-200"
                  style={{ background: selectedB === o.id ? C.dark : "#fff", borderColor: selectedB === o.id ? C.blue : "rgba(90,64,48,0.14)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{o.icon}</span>
                    <div>
                      <p className="font-display font-semibold text-sm" style={{ color: selectedB === o.id ? C.cream : C.dark }}>{o.label}</p>
                      <p className="font-body text-xs" style={{ color: selectedB === o.id ? "rgba(243,235,221,0.6)" : C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{o.sub}</p>
                    </div>
                    {selectedB === o.id && (
                      <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.blue }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: "rgba(90,64,48,0.15)" }} />
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm" style={{ background: C.dark, color: C.cream }}>VS</div>
          <div className="flex-1 h-px" style={{ background: "rgba(90,64,48,0.15)" }} />
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(90,64,48,0.15)" }}>
          <div className="grid grid-cols-3" style={{ background: C.dark }}>
            <div className="p-4 border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: "rgba(243,235,221,0.4)" }}>เมตริก</p>
            </div>
            <div className="p-4 border-r text-center" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: C.amber }}>พืชเศรษฐกิจ</p>
            </div>
            <div className="p-4 text-center">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: C.blue }}>
                ครั่ง — {lacOptions.find(o => o.id === selectedB)?.label}
              </p>
            </div>
          </div>
          {metricRows.map((m, i) => (
            <div key={m.key} className="grid grid-cols-3 border-t" style={{ borderColor: "rgba(90,64,48,0.1)", background: i % 2 === 0 ? "#fff" : C.creamDeep }}>
              <div className="p-4 border-r flex items-center gap-2" style={{ borderColor: "rgba(90,64,48,0.1)" }}>
                <span>{m.icon}</span>
                <p className="font-body text-sm font-semibold" style={{ color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{m.label}</p>
              </div>
              <div className="p-4 border-r text-center" style={{ borderColor: "rgba(90,64,48,0.1)" }}>
                <p className="font-body text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{mA[m.key]}</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-body text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{mB[m.key]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl p-6 border" style={{ background: `${C.amber}08`, borderColor: `${C.amber}35` }}>
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <p className="font-body text-sm font-semibold mb-2" style={{ color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>หมายเหตุสำคัญ</p>
              <p className="font-body text-sm leading-relaxed mb-3" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                ผลผลิตและรายได้ที่แสดงอาจแตกต่างกันตามพื้นที่ ฤดูกาล สภาพอากาศ และการจัดการ ข้อมูลนี้จัดทำเพื่อประกอบการเรียนรู้เท่านั้น
              </p>
              <SourceTag>สำนักงานเศรษฐกิจการเกษตร — ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
            </div>
          </div>
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── LAMPANG LAC ────────────────────────────────────────────────────────────
function LampangLacPage({ navigate }: { navigate: (p: Page) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const districts = [
    { id: "wang-nuea", name: "วังเหนือ", en: "Wang Nuea", x: 52, y: 18, highlight: "พื้นที่เพาะเลี้ยงหลัก", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop", desc: "อำเภอวังเหนือเป็นพื้นที่สำคัญของการเพาะเลี้ยงครั่งในจังหวัดลำปาง มีต้นพิงอาศัยหลากหลายชนิด ชุมชนมีประสบการณ์การเพาะเลี้ยงครั่งมาอย่างยาวนาน" },
    { id: "chae-hom", name: "แจ้ห่ม", en: "Chae Hom", x: 38, y: 30, highlight: "ชุมชนเกษตรกรครั่ง", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop", desc: "แจ้ห่มมีชุมชนเกษตรกรครั่งที่เข้มแข็ง และมีเครือข่ายการเรียนรู้ร่วมกับองค์กรภาคีต่างๆ" },
    { id: "mueang-pan", name: "เมืองปาน", en: "Mueang Pan", x: 62, y: 26, highlight: "สภาพภูมิอากาศเหมาะสม", img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&h=200&fit=crop", desc: "เมืองปานมีสภาพภูมิอากาศที่เหมาะสมสำหรับการเพาะเลี้ยงครั่ง มีความชื้นและอุณหภูมิที่เอื้ออำนวย" },
    { id: "ngao", name: "งาว", en: "Ngao", x: 28, y: 46, highlight: "ต้นพิงอาศัยธรรมชาติ", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=200&fit=crop", desc: "งาวเป็นพื้นที่ที่มีต้นไม้พิงอาศัยธรรมชาติจำนวนมาก เหมาะสำหรับการเพาะเลี้ยงแบบธรรมชาติ" },
    { id: "sob-prap", name: "สบปราบ", en: "Sob Prap", x: 50, y: 64, highlight: "ภูมิปัญญาท้องถิ่น", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop", desc: "สบปราบมีประเพณีการเพาะเลี้ยงครั่งที่สืบทอดมาหลายชั่วอายุคน เป็นภูมิปัญญาท้องถิ่นที่มีคุณค่า" },
    { id: "soem-ngam", name: "เสริมงาม", en: "Soem Ngam", x: 34, y: 70, highlight: "วิสาหกิจชุมชน", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop", desc: "เสริมงามมีกลุ่มเกษตรกรครั่งที่รวมตัวกันเป็นกลุ่มวิสาหกิจชุมชน สร้างรายได้ให้ชุมชน" },
    { id: "hang-chat", name: "ห้างฉัตร", en: "Hang Chat", x: 56, y: 82, highlight: "จุดเชื่อมต่อตลาด", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop", desc: "ห้างฉัตรตั้งอยู่ใกล้เขตเมืองลำปาง เป็นจุดเชื่อมต่อระหว่างชุมชนครั่งกับตลาดและผู้ประกอบการ" },
  ];

  const active = districts.find(d => d.id === selected);

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="07 — SIGNATURE INTERACTION" title={<>ครั่งในจังหวัด<span style={{ color: C.amber }}>ลำปาง</span></>}
        subtitle="คลิกที่อำเภอบนแผนที่เพื่อสำรวจชุมชนและพื้นที่การเพาะเลี้ยงครั่ง" />

      <SectionWrap>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl overflow-hidden relative border" style={{ aspectRatio: "4/3", borderColor: "rgba(90,64,48,0.15)" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "linear-gradient(145deg, #D4C8A8 0%, #C8BC98 60%, #BFAD8A 100%)" }}>
                {/* Province shape */}
                <path d="M20 10 L75 8 L88 20 L82 35 L78 50 L70 65 L72 80 L60 92 L40 90 L25 78 L18 62 L15 45 L18 28 Z"
                  fill="#D9CDA8" stroke="rgba(90,64,48,0.25)" strokeWidth="0.5" />
                {/* Grid */}
                {[20,40,60,80].map(v => <line key={`h${v}`} x1="15" y1={v} x2="88" y2={v} stroke="rgba(90,64,48,0.07)" strokeWidth="0.3" />)}
                {[30,50,70].map(v => <line key={`v${v}`} x1={v} y1="8" x2={v} y2="92" stroke="rgba(90,64,48,0.07)" strokeWidth="0.3" />)}
                {/* River */}
                <path d="M30 15 Q35 35 38 55 Q40 70 42 88" fill="none" stroke={C.blue} strokeWidth="0.8" opacity="0.35" />
                <path d="M56 22 Q52 38 50 54 Q48 67 51 82" fill="none" stroke={C.blue} strokeWidth="0.6" opacity="0.25" />

                {/* Markers */}
                {districts.map((d) => {
                  const isActive = selected === d.id;
                  return (
                    <g key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)} className="cursor-pointer">
                      {isActive && (
                        <>
                          <circle cx={d.x} cy={d.y} r="5" fill={C.blue} opacity="0.15">
                            <animate attributeName="r" values="4;8" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.25;0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                      <circle cx={d.x} cy={d.y} r="2.8" fill={isActive ? C.blue : C.red} stroke="#fff" strokeWidth="0.9" />
                      <text x={d.x} y={d.y - 4.5} textAnchor="middle" fontSize="2.6"
                        fill={C.dark} fontWeight={isActive ? "700" : "400"}
                        style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
                        {d.name}
                      </text>
                    </g>
                  );
                })}
                {/* Labels */}
                <text x="16" y="97" fontSize="2" fill="rgba(90,64,48,0.4)" style={{ fontFamily: "'DM Mono', monospace" }}>LAMPANG — EXHIBITION MAP</text>
                <text x="16" y="6" fontSize="2" fill="rgba(90,64,48,0.35)" style={{ fontFamily: "'DM Mono', monospace" }}>คลิกที่จุดเพื่อดูข้อมูล</text>
              </svg>
            </div>

            {/* District chips */}
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
                  className="px-3 py-1.5 rounded-full font-body text-xs transition-all duration-150"
                  style={{
                    background: selected === d.id ? C.blue : "rgba(90,64,48,0.1)",
                    color: selected === d.id ? "#fff" : C.dark,
                    fontFamily: "'Noto Sans Thai', sans-serif",
                  }}>
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-1 sticky top-24">
            {active ? (
              <div key={active.id} className="rounded-2xl overflow-hidden animate-scaleIn" style={{ background: C.dark }}>
                <div className="relative">
                  <img src={active.img} alt={active.name} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(42,33,29,0.8) 0%, transparent 50%)" }} />
                  <button onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(42,33,29,0.6)", backdropFilter: "blur(4px)", color: C.cream }}>×</button>
                </div>
                <div className="p-6">
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: C.blue }}>อำเภอ — {active.en}</p>
                  <h3 className="font-display text-2xl font-semibold mb-3" style={{ color: C.cream }}>{active.name}</h3>
                  <span className="inline-block rounded-lg px-3 py-1 mb-4 font-body text-xs"
                    style={{ background: `${C.blue}20`, color: C.blue, border: `1px solid ${C.blue}35`, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                    {active.highlight}
                  </span>
                  <p className="font-body text-sm leading-relaxed mb-5" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{active.desc}</p>
                  <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-10 text-center border-2 border-dashed min-h-[240px] flex flex-col items-center justify-center"
                style={{ borderColor: "rgba(90,64,48,0.2)", background: C.creamDeep }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl" style={{ background: `${C.red}15` }}>📍</div>
                <p className="font-display text-lg font-semibold mb-1" style={{ color: C.dark }}>เลือกอำเภอ</p>
                <p className="font-body text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>คลิกที่จุดบนแผนที่<br />หรือชื่ออำเภอด้านล่าง</p>
              </div>
            )}

            <div className="mt-5 rounded-xl p-5" style={{ background: "#fff", border: "1px solid rgba(90,64,48,0.12)" }}>
              <Eyebrow>พื้นที่เพาะเลี้ยง</Eyebrow>
              <p className="font-display text-2xl font-semibold mt-1 mb-0.5" style={{ color: C.dark }}>7 อำเภอ</p>
              <p className="font-body text-sm mb-3" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>ในจังหวัดลำปาง</p>
              <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
            </div>
          </div>
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── LAC → PRODUCT ──────────────────────────────────────────────────────────
function LacProductPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { label: "Raw Lac", thai: "ครั่งดิบ", icon: "🌿", color: "#5D4037",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=380&fit=crop",
      desc: "ครั่งที่เก็บเกี่ยวจากกิ่งไม้พิงอาศัย ประกอบด้วยเรซิน ขี้ผึ้ง สีย้อม และสิ่งเจือปนอื่นๆ ยังไม่ผ่านการแปรรูป",
      use: "วัตถุดิบต้นน้ำ" },
    { label: "Stick Lac", thai: "ครั่งแท่ง", icon: "🪵", color: C.wood,
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=380&fit=crop",
      desc: "ครั่งดิบที่ยังอยู่บนกิ่ง เมื่อตัดกิ่งที่มีครั่งออกมา เรียกว่า Stick Lac หรือครั่งแท่ง เป็นรูปแบบแรกหลังการเก็บเกี่ยว",
      use: "ขายตลาดดิบ / แปรรูปต่อ" },
    { label: "Seed Lac", thai: "ครั่งเมล็ด", icon: "🌱", color: C.amber,
      img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=380&fit=crop",
      desc: "ครั่งแท่งที่ผ่านการบด กรอง และล้างแยกสิ่งเจือปน ได้เป็นเม็ดครั่งที่มีความบริสุทธิ์สูงขึ้น",
      use: "ส่งออก / แปรรูปต่อ" },
    { label: "Shellac", thai: "เชลแลค", icon: "✨", color: C.red,
      img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=380&fit=crop",
      desc: "เรซินบริสุทธิ์ที่ผ่านการหลอมและกรองแล้ว มีคุณสมบัติพิเศษในการเคลือบผิว ใช้ในอุตสาหกรรมหลากหลาย",
      use: "ยาเคลือบ / สีรองพื้น / งานไม้" },
    { label: "Bleached Shellac", thai: "เชลแลคขาว", icon: "⬜", color: C.blue,
      img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=380&fit=crop",
      desc: "Shellac ที่ผ่านกระบวนการฟอกสีจนใส ไม่มีสี เหมาะสำหรับการใช้ในอาหาร เครื่องสำอาง และยา",
      use: "อาหาร / เครื่องสำอาง / ยา" },
    { label: "Aleuritic Acid & Lac Dye", thai: "สารสกัด", icon: "🎨", color: C.muted,
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=380&fit=crop",
      desc: "สารสกัดจากครั่ง ได้แก่ Aleuritic Acid ใช้ในน้ำหอมและยา และ Lac Dye สีธรรมชาติจากครั่ง",
      use: "น้ำหอม / สีย้อมธรรมชาติ" },
  ];

  const s = stages[activeStage];

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="08 — การแปรรูป" title={<>จากครั่ง<span style={{ color: C.amber }}>สู่ผลิตภัณฑ์</span></>}
        subtitle="เส้นทางการแปรรูปครั่ง ตั้งแต่วัตถุดิบดิบจนกลายเป็นวัสดุมูลค่าสูง" />

      <SectionWrap>
        {/* Flow chart */}
        <div className="flex items-center gap-0 overflow-x-auto pb-4 mb-10">
          {stages.map((st, i) => (
            <div key={st.label} className="flex items-center flex-shrink-0">
              <button
                onClick={() => setActiveStage(i)}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200"
                style={{ background: activeStage === i ? C.dark : "transparent" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: activeStage === i ? `${st.color}30` : `${st.color}15`, border: `1px solid ${st.color}25` }}>
                  {st.icon}
                </div>
                <div className="text-center">
                  <p className="font-mono text-[8px] tracking-[0.1em] uppercase whitespace-nowrap" style={{ color: st.color }}>{st.label}</p>
                  <p className="font-body text-xs whitespace-nowrap" style={{ color: activeStage === i ? C.cream : C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{st.thai}</p>
                </div>
              </button>
              {i < stages.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className="w-6 h-px" style={{ background: "rgba(90,64,48,0.2)" }} />
                  <span className="font-mono text-xs" style={{ color: "rgba(90,64,48,0.3)" }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div key={activeStage} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn rounded-2xl overflow-hidden" style={{ background: C.dark }}>
          <img src={s.img} alt={s.thai} className="w-full h-64 md:h-auto object-cover" />
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${s.color}25` }}>{s.icon}</div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: s.color }}>{s.label}</p>
                <h3 className="font-display text-2xl font-semibold" style={{ color: C.cream }}>{s.thai}</h3>
              </div>
            </div>
            <p className="font-body text-base leading-relaxed mb-6" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
            <div className="rounded-lg px-4 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-1" style={{ color: C.muted }}>การใช้งาน</p>
              <p className="font-body text-sm" style={{ color: C.amber, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.use}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 flex-wrap">
          <button onClick={() => navigate("product-innovation")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold"
            style={{ background: C.dark, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ดูนวัตกรรมผลิตภัณฑ์ →
          </button>
          <button onClick={() => navigate("lac-around-us")}
            className="px-6 py-3 rounded-lg font-body text-sm font-semibold border"
            style={{ background: "transparent", color: C.dark, borderColor: "rgba(90,64,48,0.25)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ครั่งรอบตัวเรา →
          </button>
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── PRODUCT INNOVATION ─────────────────────────────────────────────────────
function ProductInnovationPage({ navigate }: { navigate: (p: Page) => void }) {
  const [filter, setFilter] = useState("all");

  const products = [
    { cat: "food", catLabel: "อาหาร", name: "Food Color", thai: "สีผสมอาหาร", desc: "สีธรรมชาติจาก Lac Dye ใช้เป็นสีผสมอาหาร ปลอดภัย ย่อยสลายได้", icon: "🍬", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop", tag: "Natural Color" },
    { cat: "food", catLabel: "อาหาร", name: "Fruit Coating", thai: "เคลือบผิวผลไม้", desc: "Shellac ใช้เคลือบผิวผลไม้เพื่อยืดอายุการเก็บรักษา ได้รับการรับรองจาก FDA", icon: "🍎", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=260&fit=crop", tag: "FDA Approved" },
    { cat: "cosmetics", catLabel: "เครื่องสำอาง", name: "Lipstick Coating", thai: "สารเคลือบลิปสติก", desc: "Shellac ใช้เป็นสารเคลือบในลิปสติกและผลิตภัณฑ์เครื่องสำอาง ให้ความมันเงา", icon: "💄", img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&h=260&fit=crop", tag: "Cosmetics Grade" },
    { cat: "wood", catLabel: "งานไม้", name: "Wood Finish", thai: "แลคเกอร์งานไม้", desc: "Shellac เป็นสารเคลือบไม้แบบดั้งเดิม ให้ความมันเงา ปกป้องผิวไม้ ปลอดสารพิษ", icon: "🪵", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=260&fit=crop", tag: "Traditional" },
    { cat: "medicine", catLabel: "ยา", name: "Pill Coating", thai: "เคลือบเม็ดยา", desc: "Shellac เป็น enteric coating ที่ได้รับการรับรอง ใช้เคลือบเม็ดยาให้ละลายในลำไส้", icon: "💊", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=260&fit=crop", tag: "Pharmaceutical" },
    { cat: "craft", catLabel: "งานฝีมือ", name: "Natural Dye", thai: "สีย้อมธรรมชาติ", desc: "Lac Dye ให้สีแดง ชมพู และม่วง ใช้ย้อมผ้าและงานศิลปหัตถกรรมตามแบบดั้งเดิม", icon: "🎨", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=260&fit=crop", tag: "Traditional Craft" },
    { cat: "industry", catLabel: "อุตสาหกรรม", name: "Industrial Varnish", thai: "แลคเกอร์อุตสาหกรรม", desc: "Shellac ใช้ในการผลิตแลคเกอร์ฉนวน สารเคลือบอิเล็กทรอนิกส์ และอื่นๆ", icon: "⚙️", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=260&fit=crop", tag: "Industrial" },
    { cat: "food", catLabel: "อาหาร", name: "Chocolate Glaze", thai: "เคลือบช็อกโกแลต", desc: "Shellac ใช้เป็น confectionery glaze ทำให้ช็อกโกแลตและลูกอมมีความมันเงา", icon: "🍫", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop", tag: "Confectionery" },
  ];

  const cats = [
    { id: "all", label: "ทั้งหมด" },
    { id: "food", label: "อาหาร" },
    { id: "cosmetics", label: "เครื่องสำอาง" },
    { id: "medicine", label: "ยา" },
    { id: "wood", label: "งานไม้" },
    { id: "craft", label: "งานฝีมือ" },
    { id: "industry", label: "อุตสาหกรรม" },
  ];

  const filtered = filter === "all" ? products : products.filter(p => p.cat === filter);

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="09 — นวัตกรรม" title={<>Product<br /><span style={{ color: C.amber }}>Innovation</span></>}
        subtitle="ผลิตภัณฑ์และนวัตกรรมที่ใช้ครั่งเป็นวัตถุดิบ — จากอาหาร เครื่องสำอาง ไปจนถึงอุตสาหกรรม" />

      <SectionWrap>
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className="px-4 py-2 rounded-full font-body text-sm transition-all duration-150"
              style={{
                background: filter === c.id ? C.dark : "#fff",
                color: filter === c.id ? C.cream : C.dark,
                border: `1px solid ${filter === c.id ? "transparent" : "rgba(90,64,48,0.15)"}`,
                fontFamily: "'Noto Sans Thai', sans-serif",
              }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <div key={`${p.name}-${i}`} className="interactive-card group rounded-xl overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 2px 16px rgba(42,33,29,0.07)" }}>
              <div className="h-44 relative overflow-hidden" style={{ background: C.creamDeep }}>
                <img src={p.img} alt={p.thai} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 rounded-full px-3 py-1"
                  style={{ background: "rgba(42,33,29,0.65)", backdropFilter: "blur(4px)" }}>
                  <p className="font-mono text-[9px] tracking-[0.12em]" style={{ color: C.amber }}>{p.tag}</p>
                </div>
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xl"
                  style={{ background: "rgba(42,33,29,0.6)", backdropFilter: "blur(4px)" }}>{p.icon}</div>
              </div>
              <div className="p-5">
                <Eyebrow>{p.catLabel}</Eyebrow>
                <h3 className="font-display text-lg font-semibold mt-1.5 mb-0.5" style={{ color: C.dark }}>{p.thai}</h3>
                <p className="font-mono text-[10px] tracking-wide mb-3" style={{ color: C.muted }}>{p.name}</p>
                <p className="font-body text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{p.desc}</p>
                <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── LAC AROUND US ──────────────────────────────────────────────────────────
function LacAroundUsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [active, setActive] = useState<string | null>(null);

  const categories = [
    { id: "food", icon: "🍎", label: "FOOD", thai: "อาหาร", color: "#E8652A", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=340&fit=crop", app: "เคลือบผิวผลไม้ สีผสมอาหาร เคลือบช็อกโกแลต ลูกอม", examples: "ผลไม้เคลือบ, ลูกอม, ช็อกโกแลต, ผักผลไม้อบแห้ง" },
    { id: "cosmetics", icon: "💄", label: "COSMETICS", thai: "เครื่องสำอาง", color: "#E91E8C", img: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=500&h=340&fit=crop", app: "สารเคลือบลิปสติก แลคเกอร์เล็บ ผลิตภัณฑ์บำรุงผิว", examples: "ลิปสติก, ยาทาเล็บ, ครีม, เซรั่ม" },
    { id: "medicine", icon: "💊", label: "MEDICINE", thai: "ยา", color: "#1565C0", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=340&fit=crop", app: "เคลือบเม็ดยา (enteric coating) ที่ละลายในลำไส้", examples: "ยาเม็ด, แคปซูล, อาหารเสริม" },
    { id: "wood", icon: "🪵", label: "WOOD FINISH", thai: "งานไม้", color: C.wood, img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=340&fit=crop", app: "แลคเกอร์เคลือบไม้ สารปกป้องผิวไม้ เฟอร์นิเจอร์", examples: "เฟอร์นิเจอร์, พื้นไม้, เครื่องดนตรี" },
    { id: "craft", icon: "🎨", label: "CRAFT", thai: "งานฝีมือ", color: C.amber, img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=340&fit=crop", app: "สีย้อมธรรมชาติ งานศิลปหัตถกรรม ผ้าทอ เครื่องเขิน", examples: "ผ้าย้อม, เครื่องเขิน, งานจักสาน" },
    { id: "industry", icon: "⚙️", label: "INDUSTRY", thai: "อุตสาหกรรม", color: "#546E7A", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=340&fit=crop", app: "แลคเกอร์ฉนวน สารเคลือบอิเล็กทรอนิกส์ หมึกพิมพ์", examples: "อิเล็กทรอนิกส์, สิ่งพิมพ์, บรรจุภัณฑ์" },
    { id: "fruit", icon: "🍊", label: "FRUIT COATING", thai: "เคลือบผลไม้", color: "#EF6C00", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&h=340&fit=crop", app: "เคลือบผิวส้ม แอปเปิล และผลไม้อื่นๆ เพื่อยืดอายุ", examples: "ส้ม, แอปเปิล, มะนาว, องุ่น" },
    { id: "dye", icon: "🧵", label: "NATURAL DYE", thai: "สีธรรมชาติ", color: C.red, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=340&fit=crop", app: "สีย้อมผ้า สีธรรมชาติในอาหาร สี ink สำหรับงานศิลปะ", examples: "ผ้าไหม, ผ้าฝ้าย, หนัง, กระดาษ" },
  ];

  const activeItem = categories.find(c => c.id === active);

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="10 — รอบตัวเรา" title={<>ครั่งอยู่<span style={{ color: C.amber }}>รอบตัวเรา</span></>}
        subtitle="สำรวจการใช้งานครั่งในชีวิตประจำวัน — จากอาหารบนโต๊ะอาหาร ไปจนถึงอุตสาหกรรม" />

      <SectionWrap>
        <SectionHead eyebrow="หมวดหมู่" title="คลิกเพื่อสำรวจ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActive(active === c.id ? null : c.id)}
              className="rounded-xl p-5 text-left transition-all duration-200 border"
              style={{
                background: active === c.id ? C.dark : "#fff",
                borderColor: active === c.id ? c.color : "rgba(90,64,48,0.12)",
                boxShadow: active === c.id ? `0 0 0 2px ${c.color}30` : "none",
              }}>
              <span className="text-3xl block mb-2">{c.icon}</span>
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase mb-0.5" style={{ color: c.color }}>{c.label}</p>
              <p className="font-body text-sm font-semibold" style={{ color: active === c.id ? C.cream : C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{c.thai}</p>
            </button>
          ))}
        </div>

        {/* Active detail */}
        {activeItem && (
          <div key={activeItem.id} className="rounded-2xl overflow-hidden animate-scaleIn" style={{ background: C.dark }}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={activeItem.img} alt={activeItem.thai} className="w-full h-64 md:h-full object-cover min-h-[200px]" />
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{activeItem.icon}</span>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: activeItem.color }}>{activeItem.label}</p>
                    <h3 className="font-display text-2xl font-semibold" style={{ color: C.cream }}>{activeItem.thai}</h3>
                  </div>
                </div>
                <p className="font-body text-base leading-relaxed mb-5" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{activeItem.app}</p>
                <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-2" style={{ color: C.muted }}>ตัวอย่างผลิตภัณฑ์</p>
                  <p className="font-body text-sm" style={{ color: C.amber, fontFamily: "'Noto Sans Thai', sans-serif" }}>{activeItem.examples}</p>
                </div>
                <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
              </div>
            </div>
          </div>
        )}
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── CARBON FOOTPRINT ───────────────────────────────────────────────────────
function CarbonFootprintPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [boundary, setBoundary] = useState<"gate" | "grave">("gate");
  const [activeTab, setActiveTab] = useState<"overview" | "scope" | "assessment" | "netzero">("overview");

  const stages = [
    { id: 0, label: "วัตถุดิบ", en: "Raw Material", icon: "🌿", color: "#2E7D32", gateInclude: true,
      desc: "การสกัดและเก็บเกี่ยวครั่ง รวมถึงการปลูกต้นพิงอาศัย การใช้ที่ดิน และการขนส่งจากแปลง" },
    { id: 1, label: "การผลิต", en: "Production", icon: "🏭", color: C.amber, gateInclude: true,
      desc: "การแปรรูปครั่งเป็น Shellac และผลิตภัณฑ์ การใช้พลังงาน น้ำ และสารเคมีในกระบวนการผลิต" },
    { id: 2, label: "การจัดจำหน่าย", en: "Distribution", icon: "🚚", color: C.blue, gateInclude: false,
      desc: "การขนส่งผลิตภัณฑ์จากโรงงานสู่ตลาด การบรรจุภัณฑ์ และการจัดเก็บในคลังสินค้า" },
    { id: 3, label: "การใช้งาน", en: "Use", icon: "👤", color: C.red, gateInclude: false,
      desc: "การใช้ผลิตภัณฑ์โดยผู้บริโภค รวมถึงพลังงานและทรัพยากรที่ใช้ในระหว่างการใช้งาน" },
    { id: 4, label: "สิ้นสุดอายุการใช้งาน", en: "End of Life", icon: "♻️", color: "#5D4037", gateInclude: false,
      desc: "การจัดการซากผลิตภัณฑ์ การรีไซเคิล การย่อยสลาย หรือการฝังกลบ และผลกระทบต่อสิ่งแวดล้อม" },
  ];

  const scopes = [
    { num: "Scope 1", label: "การปล่อยก๊าซโดยตรง", color: C.red,
      desc: "การปล่อยก๊าซเรือนกระจกจากแหล่งที่องค์กรเป็นเจ้าของหรือควบคุมโดยตรง เช่น การเผาไหม้เชื้อเพลิง ยานพาหนะขององค์กร" },
    { num: "Scope 2", label: "พลังงานที่ซื้อมา", color: C.amber,
      desc: "การปล่อยก๊าซจากการผลิตพลังงานที่ซื้อมาใช้ เช่น ไฟฟ้า ความร้อน ไอน้ำ ที่ซื้อจากภายนอก" },
    { num: "Scope 3", label: "ทางอ้อมอื่นๆ", color: C.blue,
      desc: "การปล่อยก๊าซจากกิจกรรมอื่นในห่วงโซ่คุณค่า เช่น การจัดหาวัตถุดิบ การขนส่ง การใช้งาน และการกำจัดผลิตภัณฑ์" },
  ];

  const assessmentSteps = [
    { num: "01", label: "Goal & Scope", icon: "🎯", desc: "กำหนดเป้าหมายและขอบเขตการประเมิน ระบุขอบเขตระบบ (System Boundary) หน่วยอ้างอิง และผู้มีส่วนได้ส่วนเสีย" },
    { num: "02", label: "Life Cycle Inventory", icon: "📋", desc: "รวบรวมข้อมูลปริมาณ Input/Output ทุกขั้นตอน ตั้งแต่วัตถุดิบจนถึงการกำจัด ทั้งวัสดุ พลังงาน และของเสีย" },
    { num: "03", label: "Calculation", icon: "🧮", desc: "คำนวณปริมาณก๊าซเรือนกระจกด้วยค่า Emission Factor จาก TGO และมาตรฐาน ISO 14067" },
    { num: "04", label: "Hotspot Analysis", icon: "🔥", desc: "วิเคราะห์ขั้นตอนที่ปล่อยก๊าซสูงสุด เพื่อกำหนดแนวทางลดการปล่อยก๊าซอย่างมีประสิทธิภาพ" },
    { num: "05", label: "Verification", icon: "✅", desc: "ตรวจสอบความถูกต้องของข้อมูลและการคำนวณโดยผู้ตรวจสอบภายนอก ตามมาตรฐาน ISO 14064-3" },
    { num: "06", label: "Registration / Use", icon: "📜", desc: "ขึ้นทะเบียนคาร์บอนฟุตพริ้นท์กับ TGO และนำข้อมูลไปใช้ประโยชน์ในการสื่อสารและพัฒนาผลิตภัณฑ์" },
  ];

  const netZeroSteps = [
    { label: "วัดและประเมิน", en: "MEASURE", icon: "📏", color: C.blue, desc: "ประเมิน CFP ทุกขั้นตอน" },
    { label: "ทำความเข้าใจ", en: "UNDERSTAND", icon: "🔍", color: C.amber, desc: "วิเคราะห์ Hotspot" },
    { label: "ลดการปล่อย", en: "REDUCE", icon: "📉", color: "#2E7D32", desc: "ปรับปรุงกระบวนการ" },
    { label: "พัฒนาต่อเนื่อง", en: "IMPROVE", icon: "⬆️", color: C.red, desc: "นวัตกรรมและเทคโนโลยี" },
    { label: "ชดเชยการปล่อย", en: "OFFSET", icon: "🌳", color: C.wood, desc: "คาร์บอนเครดิต" },
    { label: "Net Zero", en: "NET ZERO", icon: "🎯", color: "#4DB6AC", desc: "สมดุลคาร์บอน" },
  ];

  const activeS = stages.find(s => s.id === activeStage);

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="11 — ADVANCED LEARNING" dark
        title={<>Carbon<br /><span style={{ color: "#4DB6AC" }}>Footprint</span></>}
        subtitle="เข้าใจ CFP CFO Scope 1–3 และเส้นทางสู่ Net Zero ผ่านมุมมองของครั่ง" />

      {/* Tabs */}
      <div style={{ background: C.dark, borderBottom: "1px solid rgba(255,255,255,0.07)" }} className="sticky top-[72px] z-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex overflow-x-auto gap-0">
            {[
              { id: "overview" as const, label: "ภาพรวม CFP" },
              { id: "scope" as const, label: "Scope 1–3" },
              { id: "assessment" as const, label: "การประเมิน" },
              { id: "netzero" as const, label: "→ Net Zero" },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="flex-shrink-0 px-5 py-4 font-body text-sm transition-all duration-150 border-b-2"
                style={{
                  color: activeTab === t.id ? "#4DB6AC" : "rgba(243,235,221,0.55)",
                  borderColor: activeTab === t.id ? "#4DB6AC" : "transparent",
                  fontFamily: "'Noto Sans Thai', sans-serif",
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SectionWrap>
        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <SectionHead eyebrow="ขอบเขตระบบ" title="วงจรชีวิตผลิตภัณฑ์" />
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "rgba(90,64,48,0.2)" }}>
                {(["gate", "grave"] as const).map(b => (
                  <button key={b} onClick={() => setBoundary(b)}
                    className="px-5 py-2.5 font-mono text-xs tracking-wide transition-all"
                    style={{ background: boundary === b ? C.dark : "#fff", color: boundary === b ? C.cream : C.muted }}>
                    {b === "gate" ? "Cradle-to-Gate" : "Cradle-to-Grave"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {stages.map((s, i) => {
                const included = boundary === "gate" ? s.gateInclude : true;
                return (
                  <div key={s.id} className="flex md:flex-col items-center gap-2">
                    {i > 0 && <div className="w-8 h-px md:w-px md:h-6 flex-shrink-0" style={{ background: included ? `${s.color}40` : "rgba(90,64,48,0.1)" }} />}
                    <button onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
                      className="flex-1 md:flex-none rounded-xl p-5 transition-all duration-200 border"
                      style={{
                        background: activeStage === s.id ? C.dark : included ? "#fff" : C.creamDeep,
                        borderColor: activeStage === s.id ? C.blue : included ? `${s.color}35` : "rgba(90,64,48,0.1)",
                        opacity: included ? 1 : 0.45,
                        minWidth: "140px",
                      }}>
                      <div className="flex md:flex-col items-center md:items-start gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <p className="font-mono text-[8px] tracking-[0.1em] uppercase" style={{ color: activeStage === s.id ? s.color : C.muted }}>{s.en}</p>
                          <p className="font-body text-sm font-semibold" style={{ color: activeStage === s.id ? C.cream : included ? C.dark : C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.label}</p>
                          {!included && <p className="font-mono text-[8px]" style={{ color: C.muted }}>ไม่อยู่ในขอบเขต</p>}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {activeS && (
              <div className="rounded-2xl p-8 animate-fadeInUp mb-10" style={{ background: C.dark }}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{activeS.icon}</span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: activeS.color }}>{activeS.en}</p>
                    <h3 className="font-display text-2xl font-semibold" style={{ color: C.cream }}>{activeS.label}</h3>
                  </div>
                </div>
                <p className="font-body text-lg leading-relaxed mb-5" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>{activeS.desc}</p>
                <SourceTag>TGO / ISO 14044 — ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
              </div>
            )}

            {/* CFP vs CFO */}
            <div className="mt-4">
              <SectionHead eyebrow="ความแตกต่าง" title="CFP vs CFO" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { abbr: "CFP", full: "Carbon Footprint of Product", thai: "คาร์บอนฟุตพริ้นท์ผลิตภัณฑ์", desc: "ปริมาณก๊าซเรือนกระจกตลอดวงจรชีวิตของผลิตภัณฑ์หรือบริการ ตั้งแต่วัตถุดิบถึงการกำจัด", scope: "ระดับผลิตภัณฑ์", color: C.red, std: "ISO 14067" },
                  { abbr: "CFO", full: "Carbon Footprint of Organization", thai: "คาร์บอนฟุตพริ้นท์องค์กร", desc: "ปริมาณก๊าซเรือนกระจกทั้งหมดจากการดำเนินงานขององค์กร ครอบคลุม Scope 1, 2 และ 3", scope: "ระดับองค์กร", color: C.blue, std: "ISO 14064" },
                ].map(item => (
                  <div key={item.abbr} className="rounded-2xl overflow-hidden border" style={{ borderColor: `${item.color}25` }}>
                    <div className="p-6" style={{ background: `${item.color}10` }}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-xl" style={{ background: item.color, color: "#fff" }}>{item.abbr}</div>
                        <div>
                          <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: item.color }}>{item.scope}</p>
                          <p className="font-body text-sm font-semibold" style={{ color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{item.thai}</p>
                        </div>
                      </div>
                      <p className="font-body text-sm leading-relaxed mb-3" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{item.desc}</p>
                      <SourceTag>{item.std}</SourceTag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scope 1-3 */}
        {activeTab === "scope" && (
          <div>
            <SectionHead eyebrow="การจำแนกประเภท" title="Scope 1, 2 และ 3" />
            <div className="space-y-5">
              {scopes.map(s => (
                <div key={s.num} className="rounded-2xl overflow-hidden border" style={{ borderColor: `${s.color}20` }}>
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-1 p-8 flex items-center justify-center" style={{ background: s.color }}>
                      <p className="font-display text-3xl font-semibold text-center" style={{ color: "#fff" }}>{s.num}</p>
                    </div>
                    <div className="md:col-span-4 p-8" style={{ background: `${s.color}07` }}>
                      <p className="font-display text-xl font-semibold mb-3" style={{ color: C.dark }}>{s.label}</p>
                      <p className="font-body text-base leading-relaxed" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl p-5" style={{ background: C.creamDeep }}>
              <SourceTag>GHG Protocol / TGO / ISO 14064</SourceTag>
            </div>
          </div>
        )}

        {/* Assessment */}
        {activeTab === "assessment" && (
          <div>
            <SectionHead eyebrow="กระบวนการ" title="การประเมิน CFP" />
            <div className="space-y-4">
              {assessmentSteps.map((s, i) => (
                <div key={s.num} className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(90,64,48,0.12)", background: "#fff" }}>
                  <div className="grid grid-cols-1 md:grid-cols-6">
                    <div className="md:col-span-1 p-6 flex items-center gap-3" style={{ background: C.dark }}>
                      <span className="text-2xl">{s.icon}</span>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: C.amber }}>{s.num}</p>
                    </div>
                    <div className="md:col-span-5 p-6">
                      <p className="font-display font-semibold text-lg mb-1" style={{ color: C.dark }}>{s.label}</p>
                      <p className="font-body text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8"><SourceTag>TGO — Thailand Greenhouse Gas Management Organization / ISO 14067</SourceTag></div>
          </div>
        )}

        {/* Net Zero */}
        {activeTab === "netzero" && (
          <div>
            <SectionHead eyebrow="เส้นทางสู่ความยั่งยืน" title="CFP → Net Zero" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
              {netZeroSteps.map((s, i) => (
                <div key={s.en} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-3 relative"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}35` }}>
                    {s.icon}
                  </div>
                  <p className="font-mono text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: s.color }}>{s.en}</p>
                  <p className="font-body text-xs font-semibold mb-0.5" style={{ color: C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.label}</p>
                  <p className="font-body text-xs" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{s.desc}</p>
                  {i < netZeroSteps.length - 1 && (
                    <div className="mt-2 font-mono text-[10px]" style={{ color: C.muted }}>↓</div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-10 text-center" style={{ background: C.dark }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
                style={{ background: "rgba(77,182,172,0.15)", border: "2px solid rgba(77,182,172,0.35)" }}>🌍</div>
              <h3 className="font-display text-2xl font-semibold mb-4" style={{ color: C.cream }}>ครั่งกับความยั่งยืน</h3>
              <p className="font-body text-lg max-w-[560px] mx-auto leading-relaxed mb-8" style={{ color: "rgba(243,235,221,0.72)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
                เรซินธรรมชาติจากครั่งเป็นวัตถุดิบที่ย่อยสลายได้ตามธรรมชาติ มีศักยภาพในการลดการใช้สารสังเคราะห์ และสนับสนุนเศรษฐกิจหมุนเวียน
              </p>
              <SourceTag>ข้อมูลอยู่ระหว่างตรวจสอบ</SourceTag>
            </div>
          </div>
        )}
      </SectionWrap>
      <Footer navigate={navigate} />
    </div>
  );
}

// ── COMMUNITY ──────────────────────────────────────────────────────────────
function CommunityPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const network = [
    { id: "mahidol", label: "มหาวิทยาลัยมหิดล", en: "Mahidol University", icon: "🎓", color: C.blue,
      role: "วิจัยและพัฒนา", desc: "งานวิจัยด้านวิทยาศาสตร์ครั่ง Carbon Footprint และนวัตกรรมผลิตภัณฑ์จากครั่ง" },
    { id: "gov", label: "ภาครัฐ", en: "Government", icon: "🏛️", color: C.amber,
      role: "นโยบายและสนับสนุน", desc: "สนับสนุนนโยบาย ส่งเสริมการเกษตรยั่งยืน และการขึ้นทะเบียน Carbon Footprint" },
    { id: "private", label: "ภาคเอกชน", en: "Private Sector", icon: "🏢", color: C.red,
      role: "ตลาดและผลิตภัณฑ์", desc: "รับซื้อครั่งและพัฒนาผลิตภัณฑ์มูลค่าสูง เชื่อมตลาดในประเทศและส่งออก" },
    { id: "school", label: "โรงเรียน", en: "Schools", icon: "📚", color: "#2E7D32",
      role: "การศึกษา", desc: "บูรณาการความรู้เรื่องครั่งในหลักสูตรท้องถิ่น สร้างเยาวชนที่เข้าใจทรัพยากรธรรมชาติ" },
    { id: "farmers", label: "เกษตรกร", en: "Farmers", icon: "🧑‍🌾", color: C.wood,
      role: "ผู้ผลิต", desc: "เกษตรกรผู้เพาะเลี้ยงครั่ง เป็นผู้ขับเคลื่อนหลักของห่วงโซ่คุณค่าครั่ง" },
    { id: "community", label: "ชุมชน", en: "Community", icon: "🏘️", color: C.muted,
      role: "ฐานราก", desc: "ชุมชนท้องถิ่นเป็นฐานรากของการเพาะเลี้ยงครั่ง รักษาภูมิปัญญาและสร้างเครือข่ายการเรียนรู้" },
  ];

  const themes = [
    { icon: "🔄", label: "เศรษฐกิจหมุนเวียน", desc: "Circular Economy ผ่านครั่ง — วัตถุดิบธรรมชาติที่ย่อยสลายได้", color: C.blue },
    { icon: "📍", label: "พื้นที่การเรียนรู้", desc: "Learning Space ที่เชื่อมความรู้วิชาการกับภูมิปัญญาท้องถิ่น", color: C.amber },
    { icon: "💎", label: "คุณค่าท้องถิ่น", desc: "Local Value สร้างรายได้และอัตลักษณ์ให้ชุมชนลำปาง", color: C.red },
    { icon: "🌱", label: "ความยั่งยืน", desc: "Sustainable Development ผ่านการเพาะเลี้ยงครั่งและ Carbon Footprint", color: "#2E7D32" },
  ];

  const active = network.find(n => n.id === activeNode);

  return (
    <div style={{ background: C.cream }} className="min-h-screen pt-[72px]">
      <PageHero eyebrow="12 — ชุมชน & เครือข่าย" dark
        title={<>Lac ×<br /><span style={{ color: C.amber }}>Community</span></>}
        subtitle="จบที่คน — วิทยาศาสตร์ที่ยิ่งใหญ่เกิดจากความร่วมมือของชุมชน เกษตรกร สถาบันการศึกษา และภาคเอกชน" />

      {/* Network visualization */}
      <SectionWrap>
        <SectionHead eyebrow="เครือข่ายความร่วมมือ" title="คลิกเพื่อดูบทบาท" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Network diagram */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: C.dark, aspectRatio: "1/1" }}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Connection lines */}
              {[
                [100, 100, 100, 40],
                [100, 100, 150, 70],
                [100, 100, 140, 130],
                [100, 100, 60, 130],
                [100, 100, 50, 70],
                [100, 100, 100, 160],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                  strokeDasharray="3,3" />
              ))}
              {/* Center node: Lac */}
              <circle cx="100" cy="100" r="18" fill={C.red} opacity="0.9" />
              <text x="100" y="96" textAnchor="middle" fontSize="7" fill="white" style={{ fontFamily: "'DM Mono', monospace" }}>ครั่ง</text>
              <text x="100" y="105" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.7)" style={{ fontFamily: "'DM Mono', monospace" }}>LAC</text>

              {/* Outer nodes */}
              {[
                { id: "mahidol", x: 100, y: 40, label: "มหิดล", color: C.blue },
                { id: "gov", x: 150, y: 70, label: "ภาครัฐ", color: C.amber },
                { id: "private", x: 140, y: 130, label: "เอกชน", color: C.red },
                { id: "school", x: 60, y: 130, label: "โรงเรียน", color: "#2E7D32" },
                { id: "farmers", x: 50, y: 70, label: "เกษตรกร", color: C.wood },
                { id: "community", x: 100, y: 162, label: "ชุมชน", color: C.muted },
              ].map((node) => (
                <g key={node.id} onClick={() => setActiveNode(activeNode === node.id ? null : node.id)} className="cursor-pointer">
                  <circle cx={node.x} cy={node.y} r="14"
                    fill={activeNode === node.id ? node.color : `${node.color}25`}
                    stroke={node.color} strokeWidth="1.5" />
                  <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize="5.5" fill={activeNode === node.id ? "#fff" : node.color}
                    style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: "600" }}>
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Active node detail */}
          <div>
            {active ? (
              <div key={active.id} className="rounded-2xl p-8 h-full animate-scaleIn" style={{ background: C.dark }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `${active.color}25`, border: `1px solid ${active.color}40` }}>
                    {active.icon}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: active.color }}>{active.en}</p>
                    <h3 className="font-display text-2xl font-semibold" style={{ color: C.cream }}>{active.label}</h3>
                    <span className="font-body text-xs px-2 py-0.5 rounded" style={{ background: `${active.color}20`, color: active.color, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                      {active.role}
                    </span>
                  </div>
                </div>
                <p className="font-body text-base leading-relaxed" style={{ color: "rgba(243,235,221,0.78)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
                  {active.desc}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center border-2 border-dashed"
                style={{ borderColor: "rgba(90,64,48,0.18)", minHeight: "280px" }}>
                <span className="text-4xl mb-4">🫂</span>
                <p className="font-display text-xl font-semibold mb-2" style={{ color: C.dark }}>เลือกองค์กร</p>
                <p className="font-body text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>คลิกที่โหนดบนแผนภาพ<br />เพื่อดูบทบาทในเครือข่าย</p>
              </div>
            )}
          </div>
        </div>

        {/* Network nodes list */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {network.map(n => (
            <button key={n.id} onClick={() => setActiveNode(activeNode === n.id ? null : n.id)}
              className="rounded-xl p-5 text-left transition-all duration-200 border"
              style={{ background: activeNode === n.id ? C.dark : "#fff", borderColor: activeNode === n.id ? n.color : "rgba(90,64,48,0.12)" }}>
              <span className="text-2xl block mb-2">{n.icon}</span>
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase mb-0.5" style={{ color: n.color }}>{n.role}</p>
              <p className="font-body text-sm font-semibold" style={{ color: activeNode === n.id ? C.cream : C.dark, fontFamily: "'Noto Sans Thai', sans-serif" }}>{n.label}</p>
            </button>
          ))}
        </div>

        {/* Themes */}
        <SectionHead eyebrow="แนวคิดหลัก" title="ธีมความร่วมมือ" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {themes.map(t => (
            <div key={t.label} className="rounded-xl p-6 flex items-start gap-4 border"
              style={{ background: `${t.color}08`, borderColor: `${t.color}25` }}>
              <span className="text-3xl flex-shrink-0">{t.icon}</span>
              <div>
                <p className="font-display font-semibold text-lg mb-1" style={{ color: C.dark }}>{t.label}</p>
                <p className="font-body text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing message */}
        <div className="rounded-2xl p-10 text-center" style={{ background: C.dark }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: C.amber }}>
            FINAL MESSAGE
          </p>
          <h3 className="font-display text-3xl font-semibold mb-5" style={{ color: C.cream }}>
            จากวิทยาศาสตร์<br />
            <span style={{ color: C.amber }}>กลับสู่คน</span>
          </h3>
          <p className="font-body text-lg max-w-[600px] mx-auto leading-relaxed mb-8" style={{ color: "rgba(243,235,221,0.72)", fontFamily: "'Noto Sans Thai', sans-serif" }}>
            ครั่งไม่ได้เป็นแค่วัตถุดิบทางวิทยาศาสตร์ แต่เป็นสายสัมพันธ์ที่เชื่อมแมลงตัวเล็ก ต้นไม้ เกษตรกร ชุมชน และโลกที่ยั่งยืน เข้าด้วยกัน
          </p>
          <button onClick={() => navigate("home")}
            className="px-8 py-4 rounded-lg font-body font-semibold text-base transition-all hover:scale-[1.02]"
            style={{ background: C.red, color: C.cream, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            กลับสู่หน้าหลัก
          </button>
        </div>
      </SectionWrap>

      <Footer navigate={navigate} />
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [heroVisible, setHeroVisible] = useState(true);

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (page !== "home") setHeroVisible(false);
  }, [page]);

  return (
    <div style={{ background: C.cream }} className="min-h-full">
      <Nav current={page} navigate={navigate as (p: Page) => void} heroVisible={heroVisible} />
      {page === "home" && <HomePage navigate={navigate as (p: Page) => void} setHeroVisible={setHeroVisible} />}
      {page === "what-is-lac" && <WhatIsLacPage navigate={navigate as (p: Page) => void} />}
      {page === "life-cycle" && <LifeCyclePage navigate={navigate as (p: Page) => void} />}
      {page === "habitat" && <HabitatPage navigate={navigate as (p: Page) => void} />}
      {page === "host-plants" && <HostPlantsPage navigate={navigate as (p: Page) => void} />}
      {page === "lac-farming" && <LacFarmingPage navigate={navigate as (p: Page) => void} />}
      {page === "farmers-choice" && <FarmersChoicePage navigate={navigate as (p: Page) => void} />}
      {page === "lampang-lac" && <LampangLacPage navigate={navigate as (p: Page) => void} />}
      {page === "lac-product" && <LacProductPage navigate={navigate as (p: Page) => void} />}
      {page === "product-innovation" && <ProductInnovationPage navigate={navigate as (p: Page) => void} />}
      {page === "lac-around-us" && <LacAroundUsPage navigate={navigate as (p: Page) => void} />}
      {page === "carbon-footprint" && <CarbonFootprintPage navigate={navigate as (p: Page) => void} />}
      {page === "community" && <CommunityPage navigate={navigate as (p: Page) => void} />}
    </div>
  );
}
