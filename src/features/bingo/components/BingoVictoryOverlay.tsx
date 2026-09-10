import React, { useEffect, useRef } from "react";
import { CheckCircle2, Clock3, RotateCcw, Save, Sparkles, Trophy } from "lucide-react";

interface BingoVictoryOverlayProps {
  isOpen: boolean;
  score: number;
  lines: number;
  accuracy: number;
  formattedTime: string;
  teamName: string;
  isSaved: boolean;
  onSave: () => void;
  onReplay: () => void;
}

export const BingoVictoryOverlay: React.FC<BingoVictoryOverlayProps> = ({
  isOpen,
  score,
  lines,
  accuracy,
  formattedTime,
  teamName,
  isSaved,
  onSave,
  onReplay,
}) => {
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    replayRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onReplay();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onReplay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="bingo-victory-title">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border-2 border-amber-300 bg-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl" />
        <div className="bg-gradient-to-br from-rac-blue-light via-rac-lac to-rac-lac-dark px-6 pb-7 pt-8 text-center text-white sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white/30 bg-white/15 shadow-lg">
            <Trophy className="h-11 w-11 text-amber-300" aria-hidden="true" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Full Bingo Complete</p>
          <h2 id="bingo-victory-title" className="mt-1 text-2xl font-bold sm:text-3xl">🎉 พิชิตบิงโกครั่งสำเร็จ!</h2>
          <p className="mt-2 text-sm text-white/80">ปลดล็อกครบทั้ง 16 ช่อง • {teamName.trim() || "ทีมนิรนาม"}</p>
        </div>

        <div className="space-y-4 p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric icon={<Trophy className="h-4 w-4" />} label="คะแนน" value={score.toLocaleString()} />
            <Metric icon={<Sparkles className="h-4 w-4" />} label="สายบิงโก" value={`${lines}/10`} />
            <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="แม่นยำ" value={`${accuracy}%`} />
            <Metric icon={<Clock3 className="h-4 w-4" />} label="เวลา" value={formattedTime} />
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-bold">Knowledge Mission Complete</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">เรียนรู้คำสำคัญครบ 16 เรื่องผ่านการตอบคำถาม และสะสมโบนัสจากสายบิงโกกับ Full Bingo แล้ว</p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button ref={replayRef} onClick={onReplay} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rac-lac">
              <RotateCcw className="h-4 w-4" /> เล่นกระดานใหม่
            </button>
            <button onClick={onSave} disabled={isSaved} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rac-lac px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-rac-lac-dark disabled:cursor-default disabled:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400">
              {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isSaved ? "บันทึกคะแนนแล้ว" : "บันทึกคะแนน"}
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-400">กด Esc เพื่อเริ่มกระดานใหม่</p>
        </div>
      </div>
    </div>
  );
};

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white text-rac-lac shadow-sm">{icon}</div>
      <p className="mt-1 text-[10px] font-medium text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
