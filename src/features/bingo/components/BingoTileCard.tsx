import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, LockKeyhole } from "lucide-react";
import { BingoTile } from "../../types/bingo";
import { getCategoryStyle } from "@/features/bingo/bingoKeywords";

interface BingoTileCardProps {
  tile: BingoTile;
  index: number;
  isInWinningLine: boolean;
  onClick: (tile: BingoTile) => void;
}

export const BingoTileCard: React.FC<BingoTileCardProps> = ({ tile, index, isInWinningLine, onClick }) => {
  const categoryStyle = getCategoryStyle(tile.category);
  const ariaLabel = `ช่องที่ ${index + 1}: ${tile.keyword} หมวดหมู่ ${categoryStyle.label} สถานะ: ${tile.isMarked ? (isInWinningLine ? "ปลดล็อกแล้ว อยู่ในสายบิงโก" : "ปลดล็อกแล้ว") : "ล็อกอยู่ คลิกเพื่อตอบคำถาม"}`;

  return (
    <motion.button
      type="button"
      onClick={() => onClick(tile)}
      aria-label={ariaLabel}
      whileHover={tile.isMarked ? { scale: 1.02 } : { scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24, mass: 0.5 }}
      className={`relative min-h-0 h-full w-full overflow-hidden rounded-2xl border-2 p-3 text-center select-none focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:p-4 ${
        tile.isMarked
          ? isInWinningLine
            ? "border-white bg-cyan-100 text-slate-950 shadow-lg shadow-cyan-300/40"
            : "border-lime-200 bg-lime-100 text-slate-950 shadow-lg shadow-lime-300/30"
          : "border-white/70 bg-slate-950 text-white shadow-sm hover:border-cyan-300 hover:bg-slate-900"
      } ${tile.isHighlighted ? "ring-4 ring-cyan-200/90" : ""}`}
    >
      {tile.isHighlighted && <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1] }} transition={{ duration: 0.75 }} className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-200/20" aria-hidden="true" />}

      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tile.isMarked ? "bg-slate-950/10 text-slate-950" : "bg-white/10 text-white"}`} aria-hidden="true">
          {tile.isMarked ? <Check className="h-4 w-4 stroke-[3]" /> : <LockKeyhole className="h-4 w-4" />}
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center px-1 sm:px-2">
        <h3 className={`w-full break-words text-center text-[clamp(1.25rem,2.25vw,1.9rem)] font-black leading-[1.08] tracking-tight text-balance ${tile.isMarked ? "text-slate-950" : "text-white"}`}>{tile.keyword}</h3>
      </div>

      {isInWinningLine && <div aria-hidden="true" className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950/20 bg-white text-xs font-black text-slate-950 shadow">★</div>}
    </motion.button>
  );
};
