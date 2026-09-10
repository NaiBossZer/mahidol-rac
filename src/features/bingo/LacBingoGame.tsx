import React, { useEffect, useCallback } from "react";
import { Award, CheckCircle2, Clock, Dices, Layers, RefreshCw, Sparkles, Trophy, Tv, Volume2, VolumeX } from "lucide-react";
import type { BingoTile } from "@/types/bingo";
import { playChime } from "@/features/bingo/soundEngine";
import { BingoConfetti } from "@/features/bingo/components/BingoConfetti";
import { BingoRallyPanel, type BingoRallyPoint } from "@/features/bingo/components/BingoRallyPanel";
import { BingoVictoryOverlay } from "@/features/bingo/components/BingoVictoryOverlay";
import { BingoWinningLines } from "@/features/bingo/components/BingoWinningLines";
import { MGuidePopup } from "@/features/bingo/components/MGuidePopup";
import { BingoTileCard } from "@/features/bingo/components/BingoTileCard";
import { TileInspectModal } from "@/features/bingo/components/TileInspectModal";
import { useLacBingoEngine } from "@/features/bingo/engine/useLacBingoEngine";
import { BINGO_RULES } from "@/features/bingo/engine/LacBingoEngine";

export const LacBingoGame: React.FC = () => {
  const { state, completedLines, winningIndices, accuracy, formattedTime, liveTimeBonus, actions } = useLacBingoEngine();
  const isPopupOpen = state.activeQuestion !== null;

  useEffect(() => {
    if (!state.showBingoBanner) return;
    const timer = window.setTimeout(actions.hideBingoBanner, 3500);
    return () => window.clearTimeout(timer);
  }, [state.showBingoBanner, actions.hideBingoBanner]);

  const handleDrawQuestion = useCallback(() => {
    if (isPopupOpen || state.isGameOver) return;
    if (state.soundEnabled) playChime("draw");
    actions.drawQuestion();
  }, [actions, isPopupOpen, state.isGameOver, state.soundEnabled]);

  const handleTileClick = useCallback((tile: BingoTile) => {
    if (state.isGameOver) return;
    if (state.soundEnabled) playChime("click");
    if (tile.isMarked) {
      actions.inspectTile(tile);
      return;
    }
    const question = actions.drawQuestionForTile(tile.id);
    if (!question) actions.inspectTile(tile);
  }, [actions, state.isGameOver, state.soundEnabled]);

  const handleReshuffle = useCallback(() => {
    if (state.soundEnabled) playChime("click");
    if (window.confirm("ต้องการสุ่มคำศัพท์ใหม่และเริ่มกระดานใหม่ใช่หรือไม่?")) actions.reshuffle();
  }, [actions, state.soundEnabled]);

  const handleNextQuestion = useCallback(() => {
    actions.closeQuestion();
    window.setTimeout(handleDrawQuestion, 0);
  }, [actions, handleDrawQuestion]);

  const handleRallyScan = useCallback((point: BingoRallyPoint) => {
    if (state.isGameOver || state.activeQuestion) return;
    if (state.soundEnabled) playChime("draw");
    actions.drawQuestionForTile(point.keywordId);
  }, [actions, state.activeQuestion, state.isGameOver, state.soundEnabled]);

  const markedCount = state.boardTiles.filter((tile) => tile.isMarked).length;

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-slate-950 font-['Mitr',sans-serif] text-slate-100">
      <BingoConfetti active={state.showBingoBanner || state.isFullBingo} />
      <header className="mb-2 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 shadow-xl shadow-black/20 backdrop-blur sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-amber-500/20"><Dices className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="flex items-center gap-2"><span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-300">4×4 LAC BINGO</span><span className="hidden text-[9px] text-slate-500 sm:inline">ห้องเรียนรู้ครั่งครบวงจร · สบปราบ</span></div><h1 className="truncate text-base font-bold leading-tight text-white sm:text-xl">Lac Bingo Rally & M-Guide Quest</h1><p className="hidden text-[10px] text-slate-400 sm:block">เดินชม → สแกน QR → ตอบคำถาม → ปลดล็อก → สร้าง BINGO</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden rounded-xl border border-amber-400/15 bg-amber-400/5 px-2 py-1.5 text-center sm:block"><p className="text-[9px] text-amber-300/60">SCORE</p><p className="text-sm font-black text-amber-300">{state.score.toLocaleString()}</p></div>
            <div className={`hidden rounded-xl border px-2 py-1.5 text-center sm:block ${state.secondsElapsed >= 270 ? "border-rose-400/30 bg-rose-400/10" : "border-white/10 bg-white/5"}`}><p className="text-[9px] text-slate-500">TIME</p><p className={`text-sm font-bold ${state.secondsElapsed >= 270 ? "text-rose-300" : "text-slate-200"}`}>{formattedTime}/5:00</p></div>
            <button onClick={() => actions.setSoundEnabled(!state.soundEnabled)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10" aria-label="เสียง">{state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</button>
            <button onClick={() => actions.setHostMode(state.hostMode === "player" ? "screen" : "player")} className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[10px] font-bold text-slate-300 sm:flex">{state.hostMode === "player" ? <Tv className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}{state.hostMode === "player" ? "จอใหญ่" : "กระดาน"}</button>
            <button onClick={handleReshuffle} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10" aria-label="สุ่มกระดานใหม่"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={handleDrawQuestion} disabled={isPopupOpen || state.isGameOver} className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-[10px] font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 sm:px-3.5 sm:text-xs"><Dices className="h-3.5 w-3.5" />สุ่มคำถาม</button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5 border-t border-white/10 pt-2 sm:gap-2">
          <Stat icon={<Trophy className="h-3.5 w-3.5" />} label="Lac Score" value={`${state.score.toLocaleString()}`} />
          <Stat icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="ตอบถูก" value={`${state.correctAnswers}/${state.questionsAnswered}`} />
          <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label="BINGO" value={`${completedLines.length}/${BINGO_RULES.victoryLineCount}`} />
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Time Bonus" value={`+${liveTimeBonus}`} />
        </div>
      </header>

      {state.showBingoBanner && !state.isGameOver && <div role="status" aria-live="polite" className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs shadow-lg shadow-amber-500/10"><span className="font-black text-amber-300">🎉 BINGO! {completedLines.at(-1)?.label ?? ""}</span><span className="text-amber-200">+{BINGO_RULES.lineBonus} โบนัสสาย</span><button onClick={actions.hideBingoBanner} className="rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-slate-950">เล่นต่อ</button></div>}

      <main className="grid h-[calc(100%-86px)] min-h-0 grid-cols-1 gap-2 lg:grid-cols-12">
        <section className="flex min-h-0 flex-col gap-2 lg:col-span-8">
          <div className="min-h-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/85 p-2.5 shadow-xl shadow-black/20 backdrop-blur sm:p-3">
            <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-1.5 text-xs font-bold text-slate-200 sm:text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />ตารางบิงโก 4×4</h2><span className="text-[10px] text-slate-500">ปลดล็อก {markedCount}/16 · เป้าหมาย {BINGO_RULES.victoryLineCount} สาย</span></div>
            <div className="relative h-[calc(100%-28px)]">
              <div className="grid h-full grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2">
                {state.boardTiles.map((tile, idx) => <BingoTileCard key={tile.id} tile={tile} index={idx} isInWinningLine={winningIndices.has(idx)} onClick={handleTileClick} />)}
              </div>
              <BingoWinningLines lines={completedLines} />
            </div>
          </div>
          <div className="h-[132px] min-h-[132px] lg:h-[142px] lg:min-h-[142px]"><BingoRallyPanel boardTiles={state.boardTiles} activeQuestionId={state.activeQuestion?.targetKeywordId ?? null} isFullBingo={state.isGameOver} onScanPoint={handleRallyScan} /></div>
        </section>

        <aside className="grid min-h-0 grid-cols-1 gap-2 lg:col-span-4 lg:grid-rows-[1fr_1fr]">
          <div className="relative min-h-0 overflow-hidden rounded-2xl border border-amber-300/10 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-3 text-white shadow-xl">
            <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">M-GUIDE ON STAGE</span><span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-slate-300">สบปราบ</span></div>
            <div className="flex h-[calc(100%-42px)] items-center gap-3"><img src={`/assets/characters/prof-mahidol/${state.hostEmotion}.svg`} alt="พี่ M-Guide" className="h-28 w-24 shrink-0 object-contain sm:h-32 sm:w-28" onError={(e) => { e.currentTarget.style.display = "none"; }} /><div className="min-w-0"><h3 className="text-sm font-bold">พี่ M-Guide</h3><p className="mt-0.5 text-[9px] text-amber-200/70">พิธีกรภารกิจตามรอยนิทรรศการ</p><p className="mt-2 rounded-xl border border-white/10 bg-white/5 p-2 text-[10px] leading-relaxed text-slate-300">{state.isTimeUp ? "หมดเวลาแล้วครับ! มาดูผลลัพธ์และความรู้ที่สะสมกัน" : completedLines.length > 0 ? `เก่งมากครับ! ได้ ${completedLines.length} สายบิงโกแล้ว` : state.streak > 1 ? `ตอบถูกต่อเนื่อง ${state.streak} ข้อ!` : "สแกน QR ตามจุดนิทรรศการ แล้วตอบคำถามครับ"}</p><button onClick={handleDrawQuestion} disabled={isPopupOpen || state.isGameOver} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2 text-[10px] font-bold text-slate-950 disabled:bg-slate-700 disabled:text-slate-500"><Dices className="h-3.5 w-3.5" />จับการ์ดคำถาม</button></div></div>
          </div>

          <div className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-1.5 text-xs font-bold text-white"><Award className="h-4 w-4 text-amber-300" />ตารางคะแนน · Top 5</h3><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold text-emerald-300">LOCAL</span></div>
            <div className="mt-2 flex gap-1.5"><input type="text" value={state.teamName} onChange={(e) => actions.setTeamName(e.target.value)} disabled={state.isSavedToLeaderboard} maxLength={60} aria-label="ชื่อทีม" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-amber-400/50" placeholder="ชื่อทีมของคุณ" /><button onClick={actions.saveScore} disabled={!state.isGameOver || state.isSavedToLeaderboard} className="rounded-xl bg-amber-400 px-2.5 py-1.5 text-[10px] font-bold text-slate-950 disabled:bg-slate-800 disabled:text-slate-600">{state.isSavedToLeaderboard ? "บันทึกแล้ว" : "บันทึก"}</button></div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">{state.leaderboard.slice(0, 3).map((entry, idx) => <div key={entry.id} className={`rounded-xl border p-2 text-center ${idx === 0 ? "border-amber-300/50 bg-amber-300/10" : "border-white/10 bg-white/5"}`}><div className="text-sm">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div><p className="truncate text-[9px] font-bold text-slate-300">{entry.teamName}</p><p className="text-sm font-black text-amber-300">{entry.score.toLocaleString()}</p><p className="text-[8px] text-slate-500">{entry.lines} สาย · {entry.accuracy}%</p></div>)}</div>
            <div className="mt-2 space-y-1">{state.leaderboard.slice(3, 5).map((entry, idx) => <div key={entry.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-2 py-1.5 text-[9px]"><span className="max-w-[60%] truncate text-slate-400">{idx + 4}. {entry.teamName}</span><span className="font-bold text-amber-300">{entry.score.toLocaleString()} pt</span></div>)}</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-black/30 p-2 text-center"><div><p className="text-[8px] text-slate-600">ทีมของคุณ</p><p className="truncate text-[9px] font-bold text-white">{state.teamName || "ทีมนิรนาม"}</p></div><div><p className="text-[8px] text-slate-600">แม่นยำ</p><p className="text-xs font-bold text-amber-300">{accuracy}%</p></div><div><p className="text-[8px] text-slate-600">สถานะ</p><p className="text-[9px] font-bold text-emerald-300">{state.isTimeUp ? "TIME UP" : state.isGameOver ? "BINGO!" : "กำลังเล่น"}</p></div></div>
          </div>
        </aside>
      </main>

      <TileInspectModal tile={state.inspectTile} onClose={() => actions.inspectTile(null)} />
      <MGuidePopup isOpen={isPopupOpen} onClose={actions.closeQuestion} question={state.activeQuestion} onAnswer={actions.submitAnswer} selectedOption={state.selectedOption} isAnswerChecked={state.isAnswerChecked} isCorrect={state.isCorrect} onNextQuestion={handleNextQuestion} emotion={state.hostEmotion} soundEnabled={state.soundEnabled} />
      <BingoVictoryOverlay isOpen={state.isGameOver} isFullBingo={state.isFullBingo} isTimeUp={state.isTimeUp} score={state.score} lines={completedLines.length} accuracy={accuracy} formattedTime={formattedTime} timeBonus={state.timeBonus} teamName={state.teamName} isSaved={state.isSavedToLeaderboard} onSave={actions.saveScore} onReplay={actions.reshuffle} />
    </div>
  );
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-300">{icon}</div><div className="min-w-0"><p className="text-[8px] text-slate-600">{label}</p><p className="truncate text-xs font-bold text-slate-200">{value}</p></div></div>;
}

export default LacBingoGame;
