import React from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, TreeDeciduous, Package, Sparkles, FlaskConical, Pill, MapPin, Clock, Bug, Building2, Leaf, Palette, Layers as LayersIcon, LockKeyhole } from "lucide-react";
import { BingoTile } from "../../types/bingo";
import { getCategoryStyle } from "@/features/bingo/bingoKeywords";

const ICON_MAP: Record<string, React.ElementType> = { TreeDeciduous, Package, Sparkles, FlaskConical, Pill, MapPin, LayersIcon, Clock, Bug, Building2, Leaf, Palette };

interface BingoTileCardProps {
  tile: BingoTile;
  index: number;
  isInWinningLine: boolean;
  onClick: (tile: BingoTile) => void;
}

export const BingoTileCard: React.FC<BingoTileCardProps> = ({ tile, index, isInWinningLine, onClick }) => {
  const categoryStyle = getCategoryStyle(tile.category);
  const IconComponent = ICON_MAP[tile.iconName] || Sparkles;
  const ariaLabel = `ช่องที่ ${index + 1}: ${tile.keyword} หมวดหมู่ ${categoryStyle.label} สถานะ: ${tile.isMarked ? (isInWinningLine ? "ปลดล็อกแล้ว อยู่ในสายบิงโก" : "ปลดล็อกแล้ว") : "ล็อกอยู่ คลิกเพื่อตอบคำถาม"}`;

  return (
    <motion.button
      type="button"
      onClick={() => onClick(tile)}
      aria-label={ariaLabel}
      whileHover={tile.isMarked ? { scale: 1.02 } : { scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24, mass: 0.5 }}
      className={`relative min-h-0 h-full w-full overflow-hidden rounded-2xl border-2 p-2.5 text-left select-none focus:outline-none focus:ring-2 focus:ring-amber-400 sm:p-3 ${
        tile.isMarked
          ? isInWinningLine
            ? "border-amber-300 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40"
            : "border-amber-400 bg-gradient-to-br from-amber-500/20 to-rose-500/20 text-amber-100 shadow-lg shadow-amber-500/20"
          : "border-slate-700 bg-slate-800/80 text-slate-300 shadow-sm hover:border-amber-500/50"
      } ${tile.isHighlighted ? "ring-4 ring-amber-300/70" : ""}`}
    >
      {tile.isHighlighted && <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1] }} transition={{ duration: 0.75 }} className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-300/15" aria-hidden="true" />}
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold sm:text-[9px] ${tile.isMarked ? "border-amber-300/30 bg-white/10 text-amber-100" : categoryStyle.bg}`}>{categoryStyle.label}</span>
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${tile.isMarked ? "bg-white/15 text-amber-200" : "bg-slate-900/70 text-slate-500"}`}>
            {tile.isMarked ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <LockKeyhole className="h-3.5 w-3.5" />}
          </div>
        </div>

        <div className="my-1 min-h-0">
          <h3 className={`line-clamp-2 text-[clamp(0.7rem,2vw,1rem)] font-bold leading-tight ${tile.isMarked ? (isInWinningLine ? "text-slate-950" : "text-amber-100") : "text-slate-200"}`}>{tile.keyword}</h3>
          <p className={`mt-0.5 line-clamp-1 text-[9px] sm:text-[10px] ${tile.isMarked ? "text-amber-100/70" : "text-slate-500"}`}>{tile.shortDesc}</p>
        </div>

        <div className={`flex items-center justify-between border-t pt-1 text-[9px] ${tile.isMarked ? "border-white/15" : "border-slate-700"}`}>
          <span className="font-mono opacity-60">#{index + 1}</span>
          <span className={`flex items-center gap-0.5 font-semibold ${tile.isMarked ? (isInWinningLine ? "text-slate-950" : "text-amber-200") : "text-slate-500"}`}>
            {tile.isMarked ? <><CheckCircle2 className="h-3 w-3" /> ปลดล็อก</> : <>ล็อก · ทาย ›</>}
          </span>
        </div>
      </div>
      {isInWinningLine && <div aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-amber-300 text-[9px] font-black text-slate-950 shadow">★</div>}
    </motion.button>
  );
};
