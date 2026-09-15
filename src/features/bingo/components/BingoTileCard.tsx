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
      className={`relative min-h-0 h-full w-full overflow-hidden rounded-2xl border-2 p-2.5 text-left select-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:p-3 ${
        tile.isMarked
          ? isInWinningLine
            ? "border-amber-200 bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/40"
            : "border-amber-300 bg-amber-950/80 text-white shadow-lg shadow-amber-500/20"
          : "border-slate-600 bg-slate-950 text-white shadow-sm hover:border-amber-400 hover:bg-slate-900"
      } ${tile.isHighlighted ? "ring-4 ring-amber-200/80" : ""}`}
    >
      {tile.isHighlighted && <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1] }} transition={{ duration: 0.75 }} className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-300/15" aria-hidden="true" />}
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold sm:text-[9px] ${tile.isMarked ? "border-white/30 bg-white/10 text-white" : categoryStyle.bg}`}>{categoryStyle.label}</span>
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${tile.isMarked ? "bg-white/15 text-white" : "bg-slate-800 text-slate-300"}`}>
            {tile.isMarked ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <LockKeyhole className="h-3.5 w-3.5" />}
          </div>
        </div>

        <div className="my-1 min-h-0">
          <h3 className={`line-clamp-2 text-[clamp(0.78rem,2vw,1.05rem)] font-bold leading-snug tracking-tight ${tile.isMarked ? (isInWinningLine ? "text-slate-950" : "text-white") : "text-white"}`}>{tile.keyword}</h3>
          <p className={`mt-1 line-clamp-1 text-[10px] leading-snug sm:text-[11px] ${tile.isMarked ? (isInWinningLine ? "text-slate-950/75" : "text-white/80") : "text-slate-300"}`}>{tile.shortDesc}</p>
        </div>

        <div className={`flex items-center justify-between border-t pt-1.5 text-[9px] ${tile.isMarked ? "border-white/20" : "border-slate-700"}`}>
          <span className="font-mono font-semibold opacity-80">#{index + 1}</span>
          <span className={`flex items-center gap-0.5 font-bold ${tile.isMarked ? "text-white" : "text-slate-200"}`}>
            {tile.isMarked ? <><CheckCircle2 className="h-3 w-3" /> ปลดล็อก</> : <>ล็อก · ทาย ›</>}
          </span>
        </div>
      </div>
      {isInWinningLine && <div aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-amber-300 text-[9px] font-black text-slate-950 shadow">★</div>}
    </motion.button>
  );
};
