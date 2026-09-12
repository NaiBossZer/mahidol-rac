import React from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "@/layout/AppNavbar";
import SobprabLacLabGame from "@/features/home/SobprabLacLabGame";

export function SobprabLacLabPage() {
  return (
    <div data-rac-theme="play" className="min-h-screen bg-rac-surface text-slate-800 font-rac-sans flex flex-col">
      <AppNavbar />
      <main className="grow w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-6">
          <Link to="/" className="text-xs font-semibold text-slate-600 transition-colors hover:text-rac-lac">← กลับสู่หน้าแรก</Link>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rac-lac">🧪 Sobprab Lac Lab</span>
        </div>
        <SobprabLacLabGame />
      </main>
      <footer className="mt-8 border-t border-slate-800 bg-rac-blue-deep py-8 text-center text-slate-300">
        <p className="px-4 text-xs leading-relaxed sm:text-sm">งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง</p>
      </footer>
    </div>
  );
}

export default SobprabLacLabPage;
