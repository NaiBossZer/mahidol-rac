import React, { useState } from "react";
import { Link } from "react-router-dom";
import LacBingoGame from "@/components/LacBingoGame";

export function BingoPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-['Mitr'] selection:bg-[#801818] selection:text-white flex flex-col justify-between">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#0A2E4D] text-white shadow-md border-b-2 border-[#801818]">
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
                      e.currentTarget.parentElement!.innerText = "🌍 Envi";
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
                      e.currentTarget.parentElement!.innerText = "🏛️ Mahidol";
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
                      e.currentTarget.parentElement!.innerText = "🤝 Social";
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

            {/* Right: Nav Links */}
            <div className="hidden xl:flex items-center space-x-6 text-xs sm:text-sm font-normal text-slate-200 shrink-0">
              <Link to="/" className="hover:text-[#F5B800] transition-colors py-1">
                หน้าแรก
              </Link>
              <Link to="/bingo" className="text-[#F5B800] font-bold py-1 flex items-center gap-1">
                <span>🎲</span> เกมบิงโก
              </Link>
              <Link to="/survey" className="hover:text-[#F5B800] transition-colors py-1">
                แบบสอบถาม
              </Link>
              <Link to="/dashboard" className="hover:text-[#F5B800] transition-colors py-1">
                สรุปผลแบบประเมิน
              </Link>
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
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white"
              >
                หน้าแรก
              </Link>
              <Link
                to="/bingo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg bg-[#801818] font-bold text-white"
              >
                🎲 เกมบิงโกห้องเรียนรู้
              </Link>
              <Link
                to="/survey"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white"
              >
                แบบสอบถาม
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white"
              >
                สรุปผลแบบประเมินความพึงพอใจ
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="grow py-6 sm:py-8 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <Link
            to="/"
            className="hover:text-[#801818] transition-colors flex items-center gap-1.5 font-semibold text-slate-600"
          >
            <span>←</span> กลับสู่หน้าแรก
          </Link>
          <span className="text-[#801818] font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            🎲 ห้องกิจกรรมบิงโกครั่งสบปราบ
          </span>
        </div>

        {/* Lac Bingo Game Component */}
        <div className="w-full">
          <LacBingoGame />
        </div>
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

export default BingoPage;
