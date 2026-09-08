import React, { useEffect } from "react";
import {
  Sparkles,
  TreeDeciduous,
  Package,
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

interface TileInspectModalProps {
  tile: BingoTile | null;
  onClose: () => void;
}

export const TileInspectModal: React.FC<TileInspectModalProps> = ({ tile, onClose }) => {
  useEffect(() => {
    if (!tile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tile, onClose]);

  if (!tile) return null;

  const categoryStyle = getCategoryStyle(tile.category);
  const IconComponent = ICON_MAP[tile.iconName] || Sparkles;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tile-inspect-title"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#801818]/10 text-[#801818] flex items-center justify-center">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 id="tile-inspect-title" className="text-base font-bold text-slate-900">
                {tile.keyword}
              </h3>
              <span className="text-[10px] text-slate-400">{categoryStyle.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#801818]"
            aria-label="ปิดหน้าต่างข้อมูล"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#801818] uppercase tracking-wider">
            💡 ความรู้ประจำช่อง:
          </p>
          <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
            {tile.fact}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            สถานะ:{" "}
            <span
              className={tile.isMarked ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}
            >
              {tile.isMarked ? "✓ ปลดล็อกเรียบร้อย" : "ยังไม่ได้ปลดล็อก"}
            </span>
          </span>
          <button
            onClick={onClose}
            className="bg-[#801818] hover:bg-[#600C0C] text-white px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            รับทราบ
          </button>
        </div>
      </div>
    </div>
  );
};
