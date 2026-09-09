import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const KNOWLEDGE_LINKS = [
  { label: "ครั่งคืออะไร?", href: "/lac/what-is-lac" },
  { label: "วงจรชีวิต", href: "/lac/life-cycle" },
  { label: "ระบบนิเวศ & ต้นพิงอาศัย", href: "/lac/habitat" },
  { label: "ต้นพิงอาศัย", href: "/lac/host-plants" },
  { label: "การเพาะเลี้ยงครั่ง", href: "/lac/lac-farming" },
];

const GAME_LINKS = [
  { label: "Sobprab Lac Lab", href: "/sobprab-lac-lab" },
  { label: "Lac Bingo", href: "/bingo" },
];

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  };

  const isKnowledgeActive = KNOWLEDGE_LINKS.some((item) => location.pathname === item.href);
  const isGameActive = GAME_LINKS.some((item) => location.pathname === item.href);
  const isApplicationActive = location.pathname === "/lac/application";

  const menuButton = (label: string, active: boolean) => (
    <button type="button" onClick={() => setOpenMenu((value) => value === label ? null : label)} className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${active ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`} aria-expanded={openMenu === label}>
      {label}<ChevronDown size={13} className={`shrink-0 transition-transform ${openMenu === label ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-rac-blue/95 text-white shadow-lg backdrop-blur-md">
      <nav className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-5" aria-label="เมนูหลัก">
        <div className="flex min-h-[60px] items-center justify-between gap-3">
          <Link to="/" onClick={closeMenus} className="flex min-w-0 shrink-0 items-center gap-2 rounded-xl py-1 focus:outline-none focus:ring-2 focus:ring-rac-gold">
            <div className="flex shrink-0 items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-sm sm:h-10 sm:w-10"><img src="/envi-logo.jpg" alt="Envi Mahidol" className="h-full w-full object-contain" /></div>
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-sm sm:h-10 sm:w-10"><img src="/mahidol-logo.png" alt="Mahidol University" className="h-full w-full object-contain" /></div>
              <div className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-sm md:flex"><img src="/social-engagement-logo.png" alt="Social Engagement" className="h-full w-full object-contain" /></div>
            </div>
            <span className="hidden h-8 w-px bg-white/20 sm:block" />
            <span className="hidden max-w-[250px] min-w-0 lg:block xl:max-w-[280px]">
              <span className="block truncate text-[11px] font-semibold leading-snug text-white xl:text-xs">งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ</span>
              <span className="mt-0.5 block truncate text-[9px] font-medium leading-tight text-rac-gold xl:text-[10px]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 xl:flex">
            <Link to="/" className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${location.pathname === "/" ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>หน้าแรก</Link>
            <div className="relative shrink-0" onMouseEnter={() => setOpenMenu("ความรู้")} onMouseLeave={() => setOpenMenu(null)}>
              {menuButton("ความรู้", isKnowledgeActive)}
              {openMenu === "ความรู้" && <div className="absolute right-0 top-full w-64 pt-2"><div className="rounded-xl border border-white/10 bg-rac-blue-deep/95 p-2 shadow-2xl backdrop-blur-xl">{KNOWLEDGE_LINKS.map((item) => <Link key={item.href} to={item.href} onClick={closeMenus} className={`block rounded-lg px-2.5 py-2 text-xs transition ${location.pathname === item.href ? "bg-rac-lac/15 font-semibold text-cyan-300" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}>{item.label}</Link>)}</div></div>}
            </div>
            <Link to="/lac/application" className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${isApplicationActive ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>จากครั่งสู่การใช้ประโยชน์</Link>
            <div className="relative shrink-0" onMouseEnter={() => setOpenMenu("เกมการเรียนรู้")} onMouseLeave={() => setOpenMenu(null)}>
              {menuButton("เกมการเรียนรู้", isGameActive)}
              {openMenu === "เกมการเรียนรู้" && <div className="absolute right-0 top-full w-56 pt-2"><div className="rounded-xl border border-white/10 bg-rac-blue-deep/95 p-2 shadow-2xl backdrop-blur-xl">{GAME_LINKS.map((game) => <Link key={game.href} to={game.href} onClick={closeMenus} className={`block rounded-lg px-2.5 py-2.5 text-xs transition ${location.pathname === game.href ? "bg-rac-lac/15 font-semibold text-cyan-300" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}>{game.label}</Link>)}</div></div>}
            </div>
            <Link to="/survey" className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${location.pathname === "/survey" ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>แบบประเมินความพึงพอใจ</Link>
            <Link to="/dashboard" className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${location.pathname === "/dashboard" ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>ผลสรุปแบบประเมินความพึงพอใจ</Link>
          </div>

          <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="shrink-0 rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rac-gold xl:hidden" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}>
            {isMobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {isMobileMenuOpen && <div id="mobile-navigation" className="max-h-[80vh] overflow-y-auto border-t border-white/10 pb-4 pt-3 xl:hidden"><div className="grid gap-1">
          <Link to="/" onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${location.pathname === "/" ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>หน้าแรก</Link>
          <div className="rounded-xl border border-white/5 bg-white/[0.02]"><button type="button" onClick={() => setOpenMenu((value) => value === "ความรู้" ? null : "ความรู้")} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${isKnowledgeActive ? "text-rac-gold" : "text-white"}`} aria-expanded={openMenu === "ความรู้"}>ความรู้<ChevronDown size={16} className={`transition-transform ${openMenu === "ความรู้" ? "rotate-180" : ""}`} /></button>{openMenu === "ความรู้" && <div className="space-y-1 px-2 pb-2">{KNOWLEDGE_LINKS.map((item) => <Link key={item.href} to={item.href} onClick={closeMenus} className={`block rounded-lg px-3 py-2 text-sm ${location.pathname === item.href ? "bg-rac-lac/15 text-cyan-300" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{item.label}</Link>)}</div>}</div>
          <Link to="/lac/application" onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${isApplicationActive ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>จากครั่งสู่การใช้ประโยชน์</Link>
          <div className="rounded-xl border border-white/5 bg-white/[0.02]"><button type="button" onClick={() => setOpenMenu((value) => value === "เกมการเรียนรู้" ? null : "เกมการเรียนรู้")} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${isGameActive ? "text-rac-gold" : "text-white"}`} aria-expanded={openMenu === "เกมการเรียนรู้"}>เกมการเรียนรู้<ChevronDown size={16} className={`transition-transform ${openMenu === "เกมการเรียนรู้" ? "rotate-180" : ""}`} /></button>{openMenu === "เกมการเรียนรู้" && <div className="space-y-1 px-2 pb-2">{GAME_LINKS.map((game) => <Link key={game.href} to={game.href} onClick={closeMenus} className={`block rounded-lg px-3 py-2 text-sm ${location.pathname === game.href ? "bg-rac-lac/15 text-cyan-300" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{game.label}</Link>)}</div>}</div>
          <Link to="/survey" onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${location.pathname === "/survey" ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>แบบประเมินความพึงพอใจ</Link>
          <Link to="/dashboard" onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${location.pathname === "/dashboard" ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>ผลสรุปแบบประเมินความพึงพอใจ</Link>
        </div></div>}
      </nav>
    </header>
  );
};

export default AppNavbar;
