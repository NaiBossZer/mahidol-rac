import React, { useEffect, useCallback } from "react";
import { Award, CheckCircle2, Clock, Dices, Layers, RefreshCw, Sparkles, Star, Trophy, Tv, Volume2, VolumeX } from "lucide-react";
import type { BingoTile } from "@/types/bingo";
import { playChime } from "@/features/bingo/soundEngine";
import { BingoConfetti } from "@/features/bingo/components/BingoConfetti";
import { BingoRallyPanel, type BingoRallyPoint } from "@/features/bingo/components/BingoRallyPanel";
import { BingoVictoryOverlay } from "@/features/bingo/components/BingoVictoryOverlay";
import { MGuidePopup } from "@/features/bingo/components/MGuidePopup";
import { BingoTileCard } from "@/features/bingo/components/BingoTileCard";
import { TileInspectModal } from "@/features/bingo/components/TileInspectModal";
import { useLacBingoEngine } from "@/features/bingo/engine/useLacBingoEngine";

export const LacBingoGame: React.FC = () => {
  const { state, completedLines, winningIndices, accuracy, formattedTime, actions } = useLacBingoEngine();
  const isPopupOpen = state.activeQuestion !== null;

  useEffect(() => {
    if (!state.showBingoBanner) return;
    const timer = window.setTimeout(actions.hideBingoBanner, 4500);
    return () => window.clearTimeout(timer);
  }, [state.showBingoBanner, actions.hideBingoBanner]);

  const handleDrawQuestion = useCallback(() => {
    if (isPopupOpen || state.isFullBingo) return;
    if (state.soundEnabled) playChime("draw");
    actions.drawQuestion();
  }, [actions, isPopupOpen, state.isFullBingo, state.soundEnabled]);

  const handleTileClick = useCallback((tile: BingoTile) => {
    if (state.soundEnabled) playChime("click");
    if (tile.isMarked) {
      actions.inspectTile(tile);
      return;
    }
    const question = actions.drawQuestionForTile(tile.id);
    if (!question) actions.inspectTile(tile);
  }, [actions, state.soundEnabled]);

  const handleReshuffle = useCallback(() => {
    if (state.soundEnabled) playChime("click");
    if (window.confirm("ต้องการสุ่มคำศัพท์ใหม่และเริ่มกระดานใหม่ใช่หรือไม่?")) actions.reshuffle();
  }, [actions, state.soundEnabled]);

  const handleNextQuestion = useCallback(() => {
    actions.closeQuestion();
    window.setTimeout(handleDrawQuestion, 0);
  }, [actions, handleDrawQuestion]);

  const handleRallyScan = useCallback((point: BingoRallyPoint) => {
    if (state.isFullBingo || state.activeQuestion) return;
    if (state.soundEnabled) playChime("draw");
    actions.drawQuestionForTile(point.keywordId);
  }, [actions, state.activeQuestion, state.isFullBingo, state.soundEnabled]);

  return (
    <div className="h-full min-h-0 w-full overflow-hidden font-['Mitr',sans-serif] text-slate-800">
      <BingoConfetti active={state.showBingoBanner || state.isFullBingo} />

      <header className="mb-2 rounded-2xl border border-rac-lac/15 bg-white px-3 py-2 shadow-sm sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rac-lac to-rac-blue-light text-rac-gold shadow"><Dices className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="flex items-center gap-2"><span className="rounded-full bg-rac-lac/10 px-2 py-0.5 text-[9px] font-bold text-rac-lac">4×4 BINGO</span><span className="hidden text-[9px] text-slate-400 sm:inline">ห้องเรียนรู้ครั่งสบปราบ</span></div><h1 className="truncate text-base font-bold leading-tight text-slate-900 sm:text-xl">Lac Bingo Rally & M-Guide Quest</h1><p className="hidden text-[10px] text-slate-500 sm:block">เดินชม → สแกน QR → ตอบคำถาม → ปลดล็อกช่องบิงโก</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden rounded-xl bg-slate-100 px-2 py-1.5 text-center sm:block"><p className="text-[9px] text-slate-400">คะแนน</p><p className="text-sm font-bold text-rac-lac">{state.score.toLocaleString()}</p></div>
            <div className="hidden rounded-xl bg-amber-50 px-2 py-1.5 text-center sm:block"><p className="text-[9px] text-amber-500">Rally</p><p className="text-sm font-bold text-amber-700">{state.boardTiles.filter((tile) => tile.isMarked).length}/16</p></div>
            <button onClick={() => actions.setSoundEnabled(!state.soundEnabled)} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600" aria-label="เสียง">{state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</button>
            <button onClick={() => actions.setHostMode(state.hostMode === "player" ? "screen" : "player")} className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] font-bold text-slate-600 sm:flex">{state.hostMode === "player" ? <Tv className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}{state.hostMode === "player" ? "จอใหญ่" : "กระดาน"}</button>
            <button onClick={handleReshuffle} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600" aria-label="สุ่มกระดานใหม่"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={handleDrawQuestion} disabled={isPopupOpen || state.isFullBingo} className="flex items-center gap-1.5 rounded-xl bg-rac-lac px-3 py-2 text-[10px] font-bold text-white shadow-sm disabled:bg-slate-300 sm:px-3.5 sm:text-xs"><Dices className="h-3.5 w-3.5" />สุ่มคำถาม</button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5 border-t border-slate-100 pt-2 sm:gap-2">
          <Stat icon={<Trophy className="h-3.5 w-3.5" />} label="คะแนน" value={`${state.score.toLocaleString()}`} />
          <Stat icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="ตอบถูก" value={`${state.correctAnswers}/${state.questionsAnswered}`} />
          <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label="สายบิงโก" value={`${completedLines.length}/10`} />
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="เวลา" value={formattedTime} />
        </div>
      </header>

      {state.showBingoBanner && !state.isFullBingo && (
        <div role="status" aria-live="polite" className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          <span className="font-bold text-amber-900">🎉 BINGO! {completedLines.at(-1)?.label ?? ""}</span><span className="text-amber-700">+500 โบนัสสาย</span><button onClick={actions.hideBingoBanner} className="rounded-lg bg-rac-lac px-2.5 py-1 text-[10px] font-bold text-white">เล่นต่อ</button>
        </div>
      )}

      <main className="grid h-[calc(100%-86px)] min-h-0 grid-cols-1 gap-2 lg:grid-cols-12">
        <section className="flex min-h-0 flex-col gap-2 lg:col-span-8">
          <div className="min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
            <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-rac-lac" />ตารางบิงโก 4×4</h2><span className="text-[10px] text-slate-500">มาร์กแล้ว {state.boardTiles.filter((tile) => tile.isMarked).length}/16</span></div>
            <div className="grid h-[calc(100%-28px)] grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2">
              {state.boardTiles.map((tile, idx) => <BingoTileCard key={tile.id} tile={tile} index={idx} isInWinningLine={winningIndices.has(idx)} onClick={handleTileClick} />)}
            </div>
          </div>
          <div className="h-[132px] min-h-[132px] lg:h-[142px] lg:min-h-[142px]">
            <BingoRallyPanel boardTiles={state.boardTiles} activeQuestionId={state.activeQuestion?.targetKeywordId ?? null} isFullBingo={state.isFullBingo} onScanPoint={handleRallyScan} />
          </div>
        </section>

        <aside className="grid min-h-0 grid-cols-1 gap-2 lg:col-span-4 lg:grid-rows-[1fr_1fr]">
          <div className="relative min-h-0 overflow-hidden rounded-2xl bg-gradient-to-br from-rac-blue-light via-rac-blue to-rac-lac p-3 text-white shadow-lg">
            <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">M-GUIDE ON STAGE</span><span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px]">สบปราบ</span></div>
            <div className="flex h-[calc(100%-42px)] items-center gap-3">
              <img src={`/assets/characters/prof-mahidol/${state.hostEmotion}.svg`} alt="พี่ M-Guide" className="h-28 w-24 shrink-0 object-contain sm:h-32 sm:w-28" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div className="min-w-0"><h3 className="text-sm font-bold">พี่ M-Guide</h3><p className="mt-0.5 text-[9px] text-amber-200">พิธีกรภารกิจตามรอยนิทรรศการ</p><p className="mt-2 rounded-xl border border-white/15 bg-white/10 p-2 text-[10px] leading-relaxed text-slate-200">{completedLines.length > 0 ? `เก่งมากครับ! ได้ ${completedLines.length} สายบิงโกแล้ว` : state.streak > 1 ? `ตอบถูกต่อเนื่อง ${state.streak} ข้อ!` : "สแกน QR ตามจุดนิทรรศการ แล้วตอบคำถามครับ"}</p><button onClick={handleDrawQuestion} disabled={isPopupOpen || state.isFullBingo} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-rac-gold py-2 text-[10px] font-bold text-rac-blue-light disabled:bg-slate-400"><Dices className="h-3.5 w-3.5" />จับการ์ดคำถาม</button></div>
            </div>
          </div>

          <div className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-900"><Award className="h-4 w-4 text-rac-lac" />ตารางคะแนน · Top 5</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">LIVE</span></div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {state.leaderboard.slice(0, 3).map((entry, idx) => <div key={entry.id} className={`rounded-xl border p-2 text-center ${idx === 0 ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50"}`}><div className="text-sm">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div><p className="truncate text-[9px] font-bold text-slate-700">{entry.teamName}</p><p className="text-sm font-black text-rac-lac">{entry.score.toLocaleString()}</p><p className="text-[8px] text-slate-400">{entry.lines} สาย · {entry.accuracy}%</p></div>)}
            </div>
            <div className="mt-2 space-y-1">{state.leaderboard.slice(3, 5).map((entry, idx) => <div key={entry.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 text-[9px]"><span className="max-w-[60%] truncate text-slate-600">{idx + 4}. {entry.teamName}</span><span className="font-bold text-rac-lac">{entry.score.toLocaleString()} pt</span></div>)}</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-900 p-2 text-center text-white"><div><p className="text-[8px] text-slate-400">ทีมของคุณ</p><p className="truncate text-[9px] font-bold">{state.teamName || "ทีมนิรนาม"}</p></div><div><p className="text-[8px] text-slate-400">แม่นยำ</p><p className="text-xs font-bold text-amber-300">{accuracy}%</p></div><div><p className="text-[8px] text-slate-400">สถานะ</p><p className="text-[9px] font-bold text-emerald-300">{state.isFullBingo ? "BINGO!" : "กำลังเล่น"}</p></div></div>
          </div>
        </aside>
      </main>

      <TileInspectModal tile={state.inspectTile} onClose={() => actions.inspectTile(null)} />
      <MGuidePopup isOpen={isPopupOpen} onClose={actions.closeQuestion} question={state.activeQuestion} onAnswer={actions.submitAnswer} selectedOption={state.selectedOption} isAnswerChecked={state.isAnswerChecked} isCorrect={state.isCorrect} onNextQuestion={handleNextQuestion} emotion={state.hostEmotion} soundEnabled={state.soundEnabled} />
      <BingoVictoryOverlay isOpen={state.isFullBingo} score={state.score} lines={completedLines.length} accuracy={accuracy} formattedTime={formattedTime} teamName={state.teamName} isSaved={state.isSavedToLeaderboard} onSave={actions.saveScore} onReplay={actions.reshuffle} />
    </div>
  );
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-1.5"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-rac-lac shadow-sm">{icon}</div><div className="min-w-0"><p className="text-[8px] text-slate-400">{label}</p><p className="truncate text-xs font-bold text-slate-800">{value}</p></div></div>;
}

export default LacBingoGame;
