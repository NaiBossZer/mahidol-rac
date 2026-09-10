import React, { useEffect, useRef } from "react";
import { CheckCircle2, Clock3, RotateCcw, Save, Sparkles, Trophy, TimerOff } from "lucide-react";

interface BingoVictoryOverlayProps {
  isOpen: boolean;
  isFullBingo: boolean;
  isTimeUp: boolean;
  score: number;
  lines: number;
  accuracy: number;
  formattedTime: string;
  timeBonus: number;
  teamName: string;
  isSaved: boolean;
  onSave: () => void;
  onReplay: () => void;
}

export const BingoVictoryOverlay: React.FC<BingoVictoryOverlayProps> = ({ isOpen, isFullBingo, isTimeUp, score, lines, accuracy, formattedTime, timeBonus, teamName, isSaved, onSave, onReplay }) => {
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    replayRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onReplay(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onReplay]);

  if (!isOpen) return null;
  const title = isFullBingo ? "🎉 พิชิตบิงโกครั่งสำเร็จ!" : "⏱️ หมดเวลาภารกิจ!";
  const eyebrow = isFullBingo ? "LAC BINGO COMPLETE" : "TIME LIMIT REACHED";
  const message = isFullBingo ? "ปลดล็อกครบทั้ง 16 ช่องและผ่านภารกิจบิงโก" : "ครบ 5 นาทีแล้ว สรุปผลการเรียนรู้และคะแนนรอบนี้";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="bingo-victory-title">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border-2 border-amber-300/70 bg-slate-900 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="bg-gradient-to-br from-slate-900 via-rac-blue to-rac-lac px-6 pb-7 pt-8 text-center sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-300/40 bg-white/10 shadow-lg"><Trophy className="h-11 w-11 text-amber-300" aria-hidden="true" /></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{eyebrow}</p>
          <h2 id="bingo-victory-title" className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-white/75">{message} • {teamName.trim() || "ทีมนิรนาม"}</p>
        </div>

        <div className="space-y-4 p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric icon={<Trophy className="h-4 w-4" />} label="Lac Master Score" value={score.toLocaleString()} />
            <Metric icon={<Sparkles className="h-4 w-4" />} label="BINGO" value={`${lines}/10`} />
            <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="แม่นยำ" value={`${accuracy}%`} />
            <Metric icon={<Clock3 className="h-4 w-4" />} label="เวลา" value={formattedTime} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3"><p className="text-[10px] text-amber-200/70">Time Bonus</p><p className="mt-0.5 text-lg font-black text-amber-300">+{timeBonus}</p></div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] text-slate-400">สถานะ</p><p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-emerald-300">{isTimeUp ? <TimerOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} {isTimeUp ? "หมดเวลา" : "BINGO!"}</p></div>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            <p className="font-bold">Knowledge Mission Result</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/75">คะแนนคิดจากตอบถูก × 10, หักตอบผิด × 5, โบนัสสายบิงโก × 50 และ Time Bonus ตามเวลาที่เหลือ</p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button ref={replayRef} onClick={onReplay} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400"><RotateCcw className="h-4 w-4" /> เล่นกระดานใหม่</button>
            <button onClick={onSave} disabled={isSaved} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-300 disabled:cursor-default disabled:bg-emerald-500 disabled:text-white focus:outline-none focus:ring-2 focus:ring-amber-300">{isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}{isSaved ? "บันทึกคะแนนแล้ว" : "บันทึกคะแนน"}</button>
          </div>
          <p className="text-center text-[11px] text-slate-500">กด Esc เพื่อเริ่มกระดานใหม่</p>
        </div>
      </div>
    </div>
  );
};

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"><div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-amber-300">{icon}</div><p className="mt-1 text-[10px] font-medium text-slate-400">{label}</p><p className="truncate text-sm font-bold text-white">{value}</p></div>;
}
