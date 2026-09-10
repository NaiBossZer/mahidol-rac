import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin, QrCode, ScanLine, Sparkles } from "lucide-react";
import type { BingoTile } from "@/types/bingo";

export interface BingoRallyPoint {
  id: string;
  title: string;
  subtitle: string;
  keywordId: string;
  badge: string;
}

export const BINGO_RALLY_POINTS: BingoRallyPoint[] = [
  { id: "insect", title: "จุดแมลงครั่ง", subtitle: "Kerria lacca", keywordId: "kerria-lacca", badge: "01" },
  { id: "host-tree", title: "จุดต้นพืชอาศัย", subtitle: "ต้นจามจุรี", keywordId: "jamjuree", badge: "02" },
  { id: "alum", title: "จุดสารส้ม", subtitle: "Alum / Mordant", keywordId: "alum", badge: "03" },
  { id: "shellac", title: "จุดเชลแล็ก", subtitle: "Shellac", keywordId: "shellac", badge: "04" },
  { id: "lifecycle", title: "จุดวงจรครั่ง", subtitle: "ฤดูการเลี้ยง", keywordId: "sai-season", badge: "05" },
  { id: "harvest", title: "จุดเก็บเกี่ยว", subtitle: "Sticklac → Seedlac", keywordId: "sticklac", badge: "06" },
  { id: "natural-dye", title: "จุดสีย้อม", subtitle: "Laccaic Acid", keywordId: "natural-dye", badge: "07" },
  { id: "bcg", title: "จุดครั่งครบวงจร", subtitle: "BCG / Products", keywordId: "bcg-model", badge: "08" },
];

interface BingoRallyPanelProps {
  boardTiles: BingoTile[];
  activeQuestionId: string | null;
  isFullBingo: boolean;
  onScanPoint: (point: BingoRallyPoint) => void;
}

export const BingoRallyPanel: React.FC<BingoRallyPanelProps> = ({ boardTiles, activeQuestionId, isFullBingo, onScanPoint }) => {
  const [scannedPoints, setScannedPoints] = useState<string[]>([]);

  const pointById = useMemo(() => new Map(BINGO_RALLY_POINTS.map((point) => [point.id, point])), []);
  const scannedCount = scannedPoints.length;
  const markedRallyCount = BINGO_RALLY_POINTS.filter((point) => boardTiles.some((tile) => tile.id === point.keywordId && tile.isMarked)).length;

  const openPoint = useCallback((point: BingoRallyPoint) => {
    setScannedPoints((current) => current.includes(point.id) ? current : [...current, point.id]);
    onScanPoint(point);
  }, [onScanPoint]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("rallyPoint") ?? params.get("rally");
    if (!pointId) return;
    const point = pointById.get(pointId);
    if (point) openPoint(point);
  }, [openPoint, pointById]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="Lac Bingo Rally">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rac-lac/10 text-rac-lac"><ScanLine className="h-5 w-5" /></div>
          <div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-900">Lac Bingo Rally</h3><p className="truncate text-[10px] text-slate-500">สแกน QR ตามจุดนิทรรศการ</p></div>
        </div>
        <div className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">{scannedCount}/8 จุด</div>
      </div>

      <div className="mt-3 grid min-h-0 grid-cols-2 gap-1.5 overflow-hidden sm:grid-cols-4">
        {BINGO_RALLY_POINTS.map((point) => {
          const tile = boardTiles.find((item) => item.id === point.keywordId);
          const scanned = scannedPoints.includes(point.id);
          const completed = Boolean(tile?.isMarked);
          const active = activeQuestionId === point.keywordId;
          return (
            <button key={point.id} type="button" onClick={() => openPoint(point)} disabled={isFullBingo || !tile} className={`group relative min-h-16 rounded-xl border p-2 text-left transition ${completed ? "border-emerald-300 bg-emerald-50" : active ? "border-rac-gold bg-amber-50" : scanned ? "border-rac-lac/30 bg-rac-lac/5" : "border-slate-200 bg-slate-50 hover:border-rac-lac/40 hover:bg-white"} disabled:cursor-default`}>
              <span className="absolute right-1.5 top-1.5 text-[9px] font-bold text-slate-400">{point.badge}</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-800"><QrCode className="h-3 w-3 text-rac-lac" />{point.title}</span>
              <span className="mt-0.5 block truncate text-[9px] text-slate-500">{point.subtitle}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold">{completed ? <><CheckCircle2 className="h-3 w-3 text-emerald-600" />ปลดล็อกแล้ว</> : scanned ? <><Sparkles className="h-3 w-3 text-amber-500" />สแกนแล้ว</> : <><MapPin className="h-3 w-3 text-slate-400" />ยังไม่สแกน</>}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 rounded-xl bg-slate-900 px-3 py-2 text-[10px] leading-relaxed text-slate-200">
        <span className="font-bold text-amber-300">MISSION:</span> เดินชมบอร์ดจริง → สแกน QR → ตอบคำถาม → ช่องที่ตรงกันจะถูกมาร์กอัตโนมัติ
        <span className="ml-1 text-slate-400">({markedRallyCount}/8 จุดมาร์กแล้ว)</span>
      </div>
    </section>
  );
};
