import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { LAC_INFORMATION_ARCHITECTURE } from "@/features/lac/lacInformationArchitecture";

const UTILITY_NAV = [
  { label: "หน้าแรก", href: "/", route: true },
  { label: "แบบสอบถาม", href: "/survey", route: true },
];

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (sectionId: string) =>
    LAC_INFORMATION_ARCHITECTURE.find((section) => section.id === sectionId)?.pages.some(
      (page) => location.pathname === `/lac/${page.slug}`,
    ) ?? false;

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenSection(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-rac-blue/95 text-white shadow-lg backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 lg:px-6" aria-label="เมนูหลัก">
        <div className="flex min-h-[68px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenus} className="flex min-w-0 items-center gap-3 rounded-xl py-1 focus:outline-none focus:ring-2 focus:ring-rac-gold">
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:h-11 sm:w-11"><img src="/envi-logo.jpg" alt="Envi Mahidol" className="h-full w-full object-contain" /></div>
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:h-11 sm:w-11"><img src="/mahidol-logo.png" alt="Mahidol University" className="h-full w-full object-contain" /></div>
              <div className="hidden h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:flex"><img src="/social-engagement-logo.png" alt="Social Engagement" className="h-full w-full object-contain" /></div>
            </div>
            <span className="hidden h-9 w-px bg-white/20 sm:block" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold leading-snug text-white sm:text-sm">งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ</span>
              <span className="mt-0.5 hidden text-[10px] font-medium leading-tight text-rac-gold sm:block sm:text-xs">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {UTILITY_NAV.map((item) => (
              <Link key={item.href} to={item.href} className={`rounded-lg px-3 py-2 text-sm transition ${isActive(item.href) ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>
                {item.label}
              </Link>
            ))}
            {LAC_INFORMATION_ARCHITECTURE.filter((section) => section.id !== "games").map((section) => {
              const active = isSectionActive(section.id);
              return (
                <div key={section.id} className="relative" onMouseEnter={() => setOpenSection(section.id)} onMouseLeave={() => setOpenSection(null)}>
                  <button type="button" onClick={() => setOpenSection((value) => value === section.id ? null : section.id)} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`} aria-expanded={openSection === section.id}>
                    {section.label}<ChevronDown size={15} className={`transition-transform ${openSection === section.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === section.id && (
                    <div className="absolute right-0 top-full w-64 pt-2">
                      <div className="rounded-2xl border border-white/10 bg-rac-blue-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold tracking-[0.16em] text-rac-gold">{section.description}</p>
                        {section.pages.map((page) => (
                          <Link key={page.slug} to={`/lac/${page.slug}`} onClick={closeMenus} className={`block rounded-xl px-3 py-2.5 text-sm transition ${location.pathname === `/lac/${page.slug}` ? "bg-rac-lac/15 font-semibold text-cyan-300" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}>
                            {page.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link to="/bingo" className={`rounded-lg px-3 py-2 text-sm transition ${isActive("/bingo") ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>Learning Games</Link>
            <Link to="/dashboard" className={`ml-1 inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold transition ${isActive("/dashboard") ? "border-rac-gold bg-rac-gold/10 text-rac-gold" : "border-white/15 text-white hover:border-rac-gold hover:text-rac-gold"}`}>Dashboard</Link>
          </div>

          <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rac-gold xl:hidden" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="max-h-[80vh] overflow-y-auto border-t border-white/10 pb-4 pt-3 xl:hidden">
            <div className="grid gap-1">
              {UTILITY_NAV.map((item) => (
                <Link key={item.href} to={item.href} onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${isActive(item.href) ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>{item.label}</Link>
              ))}
              {LAC_INFORMATION_ARCHITECTURE.filter((section) => section.id !== "games").map((section) => (
                <div key={section.id} className="rounded-xl border border-white/5 bg-white/[0.02]">
                  <button type="button" onClick={() => setOpenSection((value) => value === section.id ? null : section.id)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-white" aria-expanded={openSection === section.id}>
                    {section.label}<ChevronDown size={16} className={`transition-transform ${openSection === section.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === section.id && <div className="space-y-1 px-2 pb-2">{section.pages.map((page) => <Link key={page.slug} to={`/lac/${page.slug}`} onClick={closeMenus} className={`block rounded-lg px-3 py-2 text-sm ${location.pathname === `/lac/${page.slug}` ? "bg-rac-lac/15 text-cyan-300" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{page.title}</Link>)}</div>}
                </div>
              ))}
              <Link to="/bingo" onClick={closeMenus} className="rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Learning Games</Link>
              <Link to="/dashboard" onClick={closeMenus} className="mt-1 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-rac-gold hover:text-rac-gold">Dashboard</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AppNavbar;
