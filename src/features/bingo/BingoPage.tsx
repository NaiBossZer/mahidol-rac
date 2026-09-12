import React from "react";
import { Link } from "react-router-dom";
import LacBingoGame from "@/features/bingo/LacBingoGame";
import { AppNavbar } from "@/layout/AppNavbar";

export function BingoPage() {
  return (
    <div data-rac-theme="play" className="flex h-[100dvh] flex-col overflow-hidden bg-rac-surface font-rac-sans text-slate-800 selection:bg-rac-lac selection:text-white">
      <AppNavbar />
      <main className="flex min-h-0 flex-1 flex-col px-2 py-2 sm:px-3">
        <div className="mb-1 flex shrink-0 items-center justify-between gap-2 text-[9px] text-slate-500 sm:text-[10px]">
          <Link to="/" className="font-semibold text-slate-600 transition-colors hover:text-rac-lac">← กลับสู่หน้าแรก</Link>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-semibold text-rac-lac">🎲 Lac Bingo Rally</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden"><LacBingoGame /></div>
      </main>
    </div>
  );
}

export default BingoPage;
