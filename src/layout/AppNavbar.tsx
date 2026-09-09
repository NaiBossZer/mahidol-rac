import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { LAC_INFORMATION_ARCHITECTURE } from "@/features/lac/lacInformationArchitecture";

const PRIMARY_NAV = [
  { label: "หน้าแรก", href: "/" },
  { label: "ความรู้", sectionIds: ["knowledge", "environment"] },
  { label: "ผลิตภัณฑ์", sectionIds: ["product"] },
  { label: "เกษตรกรและชุมชน", sectionIds: ["lampang", "community"] },
  {
    label: "เกมการเรียนรู้",
    gameLinks: [
      { label: "Sobprab Lac Lab", href: "/sobprab-lac-lab" },
      { label: "Lac Bingo", href: "/bingo" },
    ],
  },
  { label: "แบบประเมินความพึงพอใจ", href: "/survey" },
  { label: "ผลสรุปแบบประเมินความพึงพอใจ", href: "/dashboard" },
];

const getSections = (sectionIds: string[]) =>
  sectionIds
    .map((id) => LAC_INFORMATION_ARCHITECTURE.find((section) => section.id === id))
    .filter((section): section is (typeof LAC_INFORMATION_ARCHITECTURE)[number] => Boolean(section));

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isGameActive = location.pathname === "/sobprab-lac-lab" || location.pathname === "/bingo";
  const isNavGroupActive = (sectionIds: string[]) =>
    getSections(sectionIds).some((section) =>
      section.pages.some((page) => location.pathname === `/lac/${page.slug}`),
    );

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenSection(null);
  };

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
              <span className="mt-0.5 block truncate text-[9px] font-medium leading-tight text-rac-gold xl:text-[10px]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 xl:flex">
            {PRIMARY_NAV.map((item) => {
              if ("href" in item) {
                return (
                  <Link key={item.href} to={item.href} className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${isActive(item.href) ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}>
                    {item.label}
                  </Link>
                );
              }

              if ("gameLinks" in item) {
                return (
                  <div key={item.label} className="relative shrink-0" onMouseEnter={() => setOpenSection(item.label)} onMouseLeave={() => setOpenSection(null)}>
                    <button type="button" onClick={() => setOpenSection((value) => value === item.label ? null : item.label)} className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${isGameActive ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`} aria-expanded={openSection === item.label}>
                      {item.label}<ChevronDown size={13} className={`shrink-0 transition-transform ${openSection === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === item.label && (
                      <div className="absolute right-0 top-full w-56 pt-2">
                        <div className="rounded-xl border border-white/10 bg-rac-blue-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                          {item.gameLinks.map((game) => (
                            <Link key={game.href} to={game.href} onClick={closeMenus} className={`block rounded-lg px-2.5 py-2.5 text-xs transition ${isActive(game.href) ? "bg-rac-lac/15 font-semibold text-cyan-300" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}>
                              {game.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const sections = getSections(item.sectionIds);
              const active = isNavGroupActive(item.sectionIds);
              return (
                <div key={item.label} className="relative shrink-0" onMouseEnter={() => setOpenSection(item.label)} onMouseLeave={() => setOpenSection(null)}>
                  <button type="button" onClick={() => setOpenSection((value) => value === item.label ? null : item.label)} className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs transition 2xl:px-2.5 ${active ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`} aria-expanded={openSection === item.label}>
                    {item.label}<ChevronDown size={13} className={`shrink-0 transition-transform ${openSection === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === item.label && (
                    <div className="absolute right-0 top-full w-64 pt-2">
                      <div className="rounded-xl border border-white/10 bg-rac-blue-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                        {sections.map((section) => (
                          <div key={section.id} className="mb-1 last:mb-0">
                            <p className="px-2.5 pb-1 pt-1 text-[9px] font-semibold leading-snug text-rac-gold">{section.description}</p>
                            {section.pages.map((page) => (
                              <Link key={page.slug} to={`/lac/${page.slug}`} onClick={closeMenus} className={`block rounded-lg px-2.5 py-2 text-xs transition ${location.pathname === `/lac/${page.slug}` ? "bg-rac-lac/15 font-semibold text-cyan-300" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}>
                                {page.title}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="shrink-0 rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rac-gold xl:hidden" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}>
            {isMobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="max-h-[80vh] overflow-y-auto border-t border-white/10 pb-4 pt-3 xl:hidden">
            <div className="grid gap-1">
              {PRIMARY_NAV.map((item) => {
                if ("href" in item) {
                  return <Link key={item.href} to={item.href} onClick={closeMenus} className={`rounded-xl px-4 py-3 text-sm ${isActive(item.href) ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}>{item.label}</Link>;
                }

                if ("gameLinks" in item) {
                  return (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.02]">
                      <button type="button" onClick={() => setOpenSection((value) => value === item.label ? null : item.label)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${isGameActive ? "text-rac-gold" : "text-white"}`} aria-expanded={openSection === item.label}>
                        {item.label}<ChevronDown size={16} className={`transition-transform ${openSection === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {openSection === item.label && (
                        <div className="space-y-1 px-2 pb-2">
                          {item.gameLinks.map((game) => (
                            <Link key={game.href} to={game.href} onClick={closeMenus} className={`block rounded-lg px-3 py-2 text-sm ${isActive(game.href) ? "bg-rac-lac/15 text-cyan-300" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                              {game.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const sections = getSections(item.sectionIds);
                return (
                  <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.02]">
                    <button type="button" onClick={() => setOpenSection((value) => value === item.label ? null : item.label)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${isNavGroupActive(item.sectionIds) ? "text-rac-gold" : "text-white"}`} aria-expanded={openSection === item.label}>
                      {item.label}<ChevronDown size={16} className={`transition-transform ${openSection === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === item.label && (
                      <div className="space-y-2 px-2 pb-2">
                        {sections.map((section) => (
                          <div key={section.id}>
                            <p className="px-3 py-1 text-[10px] leading-snug text-rac-gold">{section.description}</p>
                            {section.pages.map((page) => (
                              <Link key={page.slug} to={`/lac/${page.slug}`} onClick={closeMenus} className={`block rounded-lg px-3 py-2 text-sm ${location.pathname === `/lac/${page.slug}` ? "bg-rac-lac/15 text-cyan-300" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{page.title}</Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AppNavbar;
