import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "หน้าแรก", href: "/", type: "route" as const },
  { label: "องค์ความรู้", href: "/#cards-section", type: "anchor" as const },
  { label: "แบบสอบถาม", href: "/survey", type: "route" as const },
];

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleAnchorClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") return;
    const id = href.split("#")[1];
    if (id) window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-rac-blue/95 text-white shadow-lg backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 lg:px-6" aria-label="เมนูหลัก">
        <div className="flex min-h-[68px] items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-xl py-1 focus:outline-none focus:ring-2 focus:ring-rac-gold">
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:h-11 sm:w-11">
                <img src="/envi-logo.jpg" alt="Envi Mahidol" className="h-full w-full object-contain" />
              </div>
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:h-11 sm:w-11">
                <img src="/mahidol-logo.png" alt="Mahidol University" className="h-full w-full object-contain" />
              </div>
              <div className="hidden h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:flex">
                <img src="/social-engagement-logo.png" alt="Social Engagement" className="h-full w-full object-contain" />
              </div>
            </div>

            <span className="hidden h-9 w-px bg-white/20 sm:block" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold leading-snug text-white sm:text-sm">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
              </span>
              <span className="mt-0.5 hidden text-[10px] font-medium leading-tight text-rac-gold sm:block sm:text-xs">
                คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.type === "route" && isActive(item.href);
              if (item.type === "route") {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`rounded-lg px-3 py-2 text-sm transition ${active ? "bg-white/10 font-bold text-rac-gold" : "text-slate-200 hover:bg-white/10 hover:text-rac-gold"}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => handleAnchorClick(item.href)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-rac-gold"
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/dashboard"
              className={`ml-2 inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold transition ${isActive("/dashboard") ? "border-rac-gold bg-rac-gold/10 text-rac-gold" : "border-white/15 text-white hover:border-rac-gold hover:text-rac-gold"}`}
            >
              Dashboard
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rac-gold xl:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="border-t border-white/10 pb-4 pt-3 xl:hidden">
            <div className="grid gap-1">
              {NAV_ITEMS.map((item) =>
                item.type === "route" ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm ${isActive(item.href) ? "bg-white/10 font-bold text-rac-gold" : "text-white hover:bg-white/10"}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleAnchorClick(item.href)}
                    className="rounded-xl px-4 py-3 text-sm text-white hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 flex items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-rac-gold hover:text-rac-gold"
              >
                Dashboard
                <ChevronDown size={16} className="-rotate-90" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AppNavbar;
