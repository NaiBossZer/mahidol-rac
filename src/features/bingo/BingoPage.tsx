import React from "react";
import { Link } from "react-router-dom";
import LacBingoGame from "@/features/bingo/LacBingoGame";
import { AppNavbar } from "@/layout/AppNavbar";

export function BingoPage() {
  return (
    <div
      data-rac-theme="play"
      className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr'] selection:bg-rac-lac selection:text-white flex flex-col justify-between"
    >
      {/* ==================== NAVBAR (Action F: Shared Component) ==================== */}
      <AppNavbar />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="grow py-6 sm:py-8 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <Link
            to="/"
            className="hover:text-rac-lac transition-colors flex items-center gap-1.5 font-semibold text-slate-600"
          >
            <span>←</span> กลับสู่หน้าแรก
          </Link>
          <span className="text-rac-lac font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            🎲 ห้องกิจกรรมบิงโกครั่งสบปราบ
          </span>
        </div>

        {/* Lac Bingo Game Component */}
        <div className="w-full">
          <LacBingoGame />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-rac-blue-deep text-slate-300 py-10 border-t border-slate-800 mt-16 space-y-3 text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
            งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์
            มหาวิทยาลัยมหิดล จังหวัดลำปาง
          </p>
          <p className="text-slate-500 text-xs font-mono">
            © 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default BingoPage;
