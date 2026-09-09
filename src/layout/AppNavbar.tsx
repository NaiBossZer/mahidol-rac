import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-rac-blue text-white shadow-md border-b-2 border-rac-lac">
      <nav className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logos & Title */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/envi-logo.jpg"
                  alt="Envi Mahidol Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerText = "🌍 Envi";
                    }
                  }}
                />
              </div>

              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/mahidol-logo.png"
                  alt="Mahidol University Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerText = "🏛️ Mahidol";
                    }
                  }}
                />
              </div>

              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/social-engagement-logo.png"
                  alt="Social Engagement Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerText = "🤝 Social";
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-[1px] h-8 sm:h-10 bg-white/20 shrink-0 hidden sm:block"></div>

            <div className="hidden sm:block">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-snug">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-rac-gold block leading-tight mt-0.5">
                คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
              </span>
            </div>
          </div>

          {/* Right: Nav Links */}
          <div className="hidden xl:flex items-center space-x-6 text-xs sm:text-sm font-normal text-slate-200 shrink-0">
            <Link
              to="/"
              className={`py-1 transition-colors ${
                isActive("/") ? "text-rac-gold font-bold" : "hover:text-rac-gold"
              }`}
            >
              หน้าแรก
            </Link>
            <Link
              to="/bingo"
              className={`py-1 flex items-center gap-1 transition-colors ${
                isActive("/bingo") ? "text-rac-gold font-bold" : "hover:text-rac-gold"
              }`}
            >
              <span>🎲</span> เกมบิงโก
            </Link>
            <Link
              to="/survey"
              className={`py-1 transition-colors ${
                isActive("/survey") ? "text-rac-gold font-bold" : "hover:text-rac-gold"
              }`}
            >
              แบบสอบถาม
            </Link>
            <Link
              to="/dashboard"
              className={`py-1 transition-colors ${
                isActive("/dashboard") ? "text-rac-gold font-bold" : "hover:text-rac-gold"
              }`}
            >
              สรุปผลแบบประเมิน
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="xl:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-rac-gold focus:outline-none focus:ring-2 focus:ring-rac-gold rounded-lg"
              aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-white/15 space-y-2 text-sm font-normal">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-white/15 text-rac-gold font-bold"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              หน้าแรก
            </Link>
            <Link
              to="/bingo"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                isActive("/bingo")
                  ? "bg-rac-lac font-bold text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              🎲 เกมบิงโกห้องเรียนรู้
            </Link>
            <Link
              to="/survey"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                isActive("/survey")
                  ? "bg-white/15 text-rac-gold font-bold"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              แบบสอบถาม
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                isActive("/dashboard")
                  ? "bg-white/15 text-rac-gold font-bold"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              สรุปผลแบบประเมินความพึงพอใจ
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AppNavbar;
