import React from "react";
import {
  Check,
  CheckCircle2,
  TreeDeciduous,
  Package,
  Sparkles,
  FlaskConical,
  Pill,
  MapPin,
  Clock,
  Bug,
  Building2,
  Leaf,
  Palette,
  Layers as LayersIcon,
} from "lucide-react";
import { BingoTile } from "../../types/bingo";
import { getCategoryStyle } from "../../data/bingoKeywords";

const ICON_MAP: Record<string, React.ElementType> = {
  TreeDeciduous,
  Package,
  Sparkles,
  FlaskConical,
  Pill,
  MapPin,
  LayersIcon,
  Clock,
  Bug,
  Building2,
  Leaf,
  Palette,
};

interface BingoTileCardProps {
  tile: BingoTile;
  index: number;
  isInWinningLine: boolean;
  onClick: (tile: BingoTile) => void;
}

export const BingoTileCard: React.FC<BingoTileCardProps> = ({
  tile,
  index,
  isInWinningLine,
  onClick,
}) => {
  const categoryStyle = getCategoryStyle(tile.category);
  const IconComponent = ICON_MAP[tile.iconName] || Sparkles;

  const ariaLabel = `ช่องที่ ${index + 1}: ${tile.keyword} หมวดหมู่ ${categoryStyle.label} สถานะ: ${
    tile.isMarked
      ? isInWinningLine
        ? "ปลดล็อกแล้ว อยู่ในสายบิงโก"
        : "ปลดล็อกแล้ว"
      : "ยังไม่ได้ปลดล็อก คลิกเพื่อตอบคำถาม"
  }`;

  return (
    <button
      onClick={() => onClick(tile)}
      aria-label={ariaLabel}
      className={`relative text-left p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px] cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-[#801818] ${
        tile.isMarked
          ? isInWinningLine
            ? "bg-gradient-to-br from-amber-50 to-rose-50 border-amber-400 shadow-md ring-2 ring-amber-300 transform scale-[1.02]"
            : "bg-emerald-50/80 border-emerald-400 text-slate-800 shadow-sm"
          : "bg-white border-slate-200 hover:border-[#801818]/40 hover:bg-slate-50/60 shadow-xs"
      } ${tile.isHighlighted ? "ring-4 ring-[#F5B800] animate-pulse" : ""}`}
    >
      {/* Top Row: Category Tag & Icon */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyle.bg}`}
        >
          {categoryStyle.label}
        </span>

        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
            tile.isMarked ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {tile.isMarked ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <IconComponent className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Middle: Keyword Title */}
      <div className="my-1.5">
        <h3
          className={`text-xs sm:text-sm font-bold leading-tight ${
            tile.isMarked ? "text-slate-900" : "text-slate-800 group-hover:text-[#801818]"
          }`}
        >
          {tile.keyword}
        </h3>
        <p className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
          {tile.shortDesc}
        </p>
      </div>

      {/* Bottom Indicator */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 w-full">
        <span className="font-mono">#{index + 1}</span>
        <span className="text-[9px] font-semibold text-slate-500">
          {tile.isMarked ? (
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> ปลดล็อก
            </span>
          ) : (
            <span className="group-hover:text-[#801818] transition-colors">คลิกทาย ›</span>
          )}
        </span>
      </div>

      {/* Winning Glow Overlay */}
      {isInWinningLine && (
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5B800] rounded-full border border-white flex items-center justify-center text-[8px] font-black text-slate-900 shadow"
        >
          ★
        </div>
      )}
    </button>
  );
};
