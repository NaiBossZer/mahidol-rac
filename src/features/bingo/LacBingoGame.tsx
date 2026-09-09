import React, { useEffect, useCallback } from "react";
import {
  Award, CheckCircle2, Clock, Dices, Layers, RefreshCw, Sparkles,
  Star, Trophy, Tv, Volume2, VolumeX,
} from "lucide-react";
import type { BingoTile } from "@/types/bingo";
import { QUESTION_DECK } from "@/features/bingo/questionDeck";
import { playChime } from "@/features/bingo/soundEngine";
import { BingoConfetti } from "@/features/bingo/components/BingoConfetti";
import { MGuidePopup } from "@/features/bingo/components/MGuidePopup";
import { BingoTileCard } from "@/features/bingo/components/BingoTileCard";
import { TileInspectModal } from "@/features/bingo/components/TileInspectModal";
import { useLacBingoEngine } from "@/features/bingo/engine/useLacBingoEngine";

export const LacBingoGame: React.FC = () => {
  const { state, dispatch, completedLines, winningIndices, accuracy, formattedTime, actions } = useLacBingoEngine();
  const isPopupOpen = state.activeQuestion !== null;

  useEffect(() => {
    if (!state.showBingoBanner) return;
    const timer = window.setTimeout(() => dispatch({ type: "hide_bingo_banner" }), 5000);
    return () => window.clearTimeout(timer);
  }, [state.showBingoBanner, dispatch]);

  const handleDrawQuestion = useCallback(() => {
    if (isPopupOpen) return;
    if (state.soundEnabled) playChime("draw");
    actions.drawQuestion();
  }, [actions, isPopupOpen, state.soundEnabled]);

  const handleTileClick = useCallback((tile: BingoTile) => {
    if (state.soundEnabled) playChime("click");
    if (tile.isMarked) {
      actions.inspectTile(tile);
      return;
    }
    const question = QUESTION_DECK.find((item) => item.targetKeywordId === tile.id);
    if (question) dispatch({ type: "draw_question", question });
    else actions.inspectTile(tile);
  }, [actions, dispatch, state.soundEnabled]);

  const handleReshuffle = useCallback(() => {
    if (state.soundEnabled) playChime("click");
    if (window.confirm("ต้องการสุ่มคำศัพท์ใหม่และเริ่มกระดานใหม่ใช่หรือไม่?")) actions.reshuffle();
  }, [actions, state.soundEnabled]);

  const handleAnswer = useCallback((optionIndex: number) => {
    actions.selectOption(optionIndex);
    dispatch({ type: "select_option", optionIndex });
    actions.submitAnswer();
  }, [actions, dispatch]);

  const handleNextQuestion = useCallback(() => {
    actions.closeQuestion();
    window.setTimeout(handleDrawQuestion, 0);
  }, [actions, handleDrawQuestion]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-2 py-6 font-['Mitr',sans-serif] text-slate-800 sm:px-4">
      <BingoConfetti active={state.showBingoBanner || state.isFullBingo} />

      <header className="relative mb-6 overflow-hidden rounded-3xl border-2 border-rac-lac/20 bg-white p-4 shadow-md sm:p-6">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex items-center gap-3.5 text-center lg:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rac-lac to-rac-blue-light text-white shadow-lg shadow-rac-lac/20 sm:h-14 sm:w-14">
              <Dices className="h-7 w-7 text-rac-gold sm:h-8 sm:w-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-rac-lac/20 bg-rac-lac/10 px-2.5 py-0.5 text-xs font-bold text-rac-lac">4x4 BINGO SYSTEM</span>
                <span className="text-xs font-medium text-slate-500">ห้องเรียนรู้ครั่งสบปราบ</span>
              </div>
              <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-3xl">เกมบิงโกวิทยาศาสตร์ครั่งสบปราบ</h1>
              <p className="text-xs font-normal text-slate-500 sm:text-sm">พิชิตคำถามจาก พี่ M-Guide • ปลดล็อก 16 คีย์เวิร์ด • บิงโก 4 ช่องแถวตรงหรือทแยง</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
              <button onClick={() => actions.setHostMode("player")} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${state.hostMode === "player" ? "bg-rac-lac text-white shadow-sm" : "text-slate-600"}`}>
                <Layers className="h-3.5 w-3.5" />มุมมองกระดาน
              </button>
              <button onClick={() => actions.setHostMode("screen")} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${state.hostMode === "screen" ? "bg-rac-blue-light text-white shadow-sm" : "text-slate-600"}`}>
                <Tv className="h-3.5 w-3.5" />หน้าจอใหญ่
              </button>
            </div>
            <button onClick={() => actions.setSoundEnabled(!state.soundEnabled)} className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600" aria-label="เสียง">
              {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button onClick={handleReshuffle} className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">
              <RefreshCw className="h-3.5 w-3.5" />สุ่มกระดานใหม่
            </button>
            <button onClick={handleDrawQuestion} disabled={isPopupOpen} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rac-lac to-[#A02020] px-4 py-2.5 text-xs font-bold text-white shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-sm">
              <Dices className="h-4 w-4 text-rac-gold" />สุ่มจับการ์ดคำถาม
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <Stat icon={<Trophy className="h-5 w-5" />} label="คะแนนรวม" value={`${state.score.toLocaleString()} แต้ม`} tone="amber" />
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="คำถามตอบถูก" value={`${state.correctAnswers} / ${state.questionsAnswered}`} tone="emerald" />
          <Stat icon={<Sparkles className="h-5 w-5" />} label="จำนวนแถวบิงโก" value={`${completedLines.length} / 10 แถว`} tone="rose" />
          <Stat icon={<Clock className="h-5 w-5" />} label="เวลาที่เล่น" value={`${formattedTime} นาที`} tone="blue" />
        </div>
      </header>

      {state.showBingoBanner && (
        <div role="status" aria-live="polite" className="mb-6 rounded-3xl bg-gradient-to-r from-rac-gold via-rac-lac to-rac-blue-light p-1 shadow-xl">
          <div className="flex flex-col items-center justify-between gap-3 rounded-[22px] bg-white p-4 text-center sm:flex-row sm:p-5 sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><Trophy className="h-7 w-7" /></div>
              <div><span className="rounded-full bg-rac-lac px-2 py-0.5 text-[10px] font-bold text-white">BINGO WINNER!</span><h3 className="mt-0.5 text-lg font-bold text-slate-900">🎉 ยินดีด้วย! สำเร็จสายบิงโก {completedLines.at(-1)?.label ?? ""}</h3><p className="text-xs text-slate-600">รับคะแนนโบนัส +500 แต้ม!</p></div>
            </div>
            <button onClick={() => dispatch({ type: "hide_bingo_banner" })} className="rounded-xl bg-rac-lac px-4 py-2 text-xs font-semibold text-white">เล่นต่อเลย!</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg"><span className="h-3 w-3 animate-ping rounded-full bg-rac-lac" />ตารางบิงโก 4x4</h2>
              <span className="text-xs text-slate-500">มาร์กแล้ว {state.boardTiles.filter((t) => t.isMarked).length}/16 ช่อง</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
              {state.boardTiles.map((tile, idx) => <BingoTileCard key={tile.id} tile={tile} index={idx} isInWinningLine={winningIndices.has(idx)} onClick={handleTileClick} />)}
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>🟢 ชีววิทยา · 🩷 เคมีสีย้อม · 🟡 แปรรูป · 🔵 ชุมชนสบปราบ</span>
              <span className="text-[11px] text-slate-400">*แนวนอน แนวตั้ง และแนวทแยง รวม 10 แบบ</span>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-800"><Trophy className="h-4 w-4 text-amber-500" />สายบิงโกที่ทำสำเร็จ ({completedLines.length}/10)</h3><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">โบนัสสายละ +500</span></div>
            {completedLines.length === 0 ? <p className="rounded-xl bg-slate-50 p-3 text-center text-xs italic text-slate-400">ยังไม่มีสายบิงโกต่อเนื่อง ตอบคำถามเพื่อมาร์กช่อง!</p> : <div className="flex flex-wrap gap-2">{completedLines.map((line) => <span key={`${line.type}-${line.index}`} className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />{line.label}</span>)}</div>}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="relative space-y-4 overflow-hidden rounded-3xl bg-gradient-to-br from-rac-blue-light via-rac-blue to-rac-lac p-5 text-white shadow-lg">
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-amber-300">BINGO HOST ON STAGE</span><span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px]">สดจากสบปราบ</span></div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3">
              <img src={`/assets/characters/prof-mahidol/${state.hostEmotion}.svg`} alt="พี่ M-Guide" className="h-36 w-32 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <h4 className="mt-2 text-sm font-bold">พี่ M-Guide (อาจารย์มหิดล)</h4><p className="text-[11px] text-amber-200">พิธีกรห้องเรียนรู้ครั่งสบปราบ</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-xs leading-relaxed text-slate-200"><span className="font-bold text-amber-300">💬 พี่ M-Guide: </span>{completedLines.length > 0 ? `เก่งมากครับ! ปลดล็อกบิงโกแล้ว ${completedLines.length} สาย` : state.streak > 1 ? `ตอบถูกต่อเนื่อง ${state.streak} ข้อแล้ว!` : "กดสุ่มจับการ์ดคำถามเพื่อเริ่มเล่นครับ!"}</div>
            <button onClick={handleDrawQuestion} disabled={isPopupOpen} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rac-gold py-3 text-sm font-bold text-rac-blue-light disabled:bg-slate-400"><Dices className="h-4 w-4" />จับการ์ดคำถามรอบถัดไป</button>
          </div>

          <div className="space-y-4 rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Award className="h-5 w-5 text-rac-lac" />ตารางคะแนน</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">วันนี้</span></div>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3"><label className="block text-[11px] font-semibold text-slate-600">บันทึกคะแนนในนามทีม</label><div className="flex gap-2"><input type="text" value={state.teamName} onChange={(e) => actions.setTeamName(e.target.value)} disabled={state.isSavedToLeaderboard} className="grow rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800" /><button onClick={actions.saveScore} disabled={state.isSavedToLeaderboard || state.score === 0} className="rounded-xl bg-rac-lac px-3 py-1.5 text-xs font-bold text-white disabled:bg-emerald-100 disabled:text-emerald-700">{state.isSavedToLeaderboard ? "บันทึกแล้ว" : "บันทึก"}</button></div></div>
            <div className="space-y-2">{state.leaderboard.slice(0, 5).map((entry, idx) => <div key={entry.id} className={`flex items-center justify-between rounded-xl border p-2.5 text-xs ${idx === 0 ? "border-amber-200 bg-amber-50/70 text-amber-900" : "border-slate-100 bg-slate-50 text-slate-700"}`}><span className="truncate">{idx + 1}. {entry.teamName}</span><span className="font-mono font-bold text-rac-lac">{entry.score} pt</span></div>)}</div>
            <p className="pt-2 text-center text-[11px] text-slate-400">ความแม่นยำปัจจุบัน {accuracy}%</p>
          </div>
        </div>
      </div>

      <TileInspectModal tile={state.inspectTile} onClose={() => actions.inspectTile(null)} />
      <MGuidePopup
        isOpen={isPopupOpen}
        onClose={actions.closeQuestion}
        question={state.activeQuestion}
        onAnswer={handleAnswer}
        selectedOption={state.selectedOption}
        isAnswerChecked={state.isAnswerChecked}
        isCorrect={state.isCorrect}
        onNextQuestion={handleNextQuestion}
        emotion={state.hostEmotion}
        soundEnabled={state.soundEnabled}
      />
    </div>
  );
};

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "amber" | "emerald" | "rose" | "blue" }) {
  const tones = { amber: "bg-amber-100 text-amber-700", emerald: "bg-emerald-100 text-emerald-700", rose: "bg-rose-100 text-rose-700", blue: "bg-blue-100 text-blue-700" };
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5 sm:p-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div><div><p className="text-[11px] text-slate-500">{label}</p><p className="text-lg font-bold text-slate-800 sm:text-xl">{value}</p></div></div>;
}

export default LacBingoGame;
