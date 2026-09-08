import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Dices,
  Award,
  Star,
  Volume2,
  VolumeX,
  Tv,
  Layers,
  Clock,
} from "lucide-react";

import {
  BingoTile,
  QuestionCard,
  WinningLine,
  LeaderboardEntry,
  HostEmotion,
} from "../types/bingo";
import { BINGO_KEYWORDS_POOL } from "../data/bingoKeywords";
import { QUESTION_DECK } from "../data/questionDeck";
import { playChime } from "../utils/soundEngine";
import { BingoConfetti } from "./bingo/BingoConfetti";
import { MGuidePopup } from "./bingo/MGuidePopup";
import { BingoTileCard } from "./bingo/BingoTileCard";
import { TileInspectModal } from "./bingo/TileInspectModal";

// True Fisher-Yates Uniform Shuffle algorithm
function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}

const generateInitialTiles = (): BingoTile[] => {
  return shuffleArray(BINGO_KEYWORDS_POOL).map((item) => ({
    ...item,
    isMarked: false,
    isHighlighted: false,
  }));
};

export const LacBingoGame: React.FC = () => {
  // State 1: Board tiles (16 items for 4x4 matrix)
  const [boardTiles, setBoardTiles] = useState<BingoTile[]>(generateInitialTiles);

  // State 2: Game Flow & Host
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hostMode, setHostMode] = useState<"player" | "screen">("player");
  const [activeQuestion, setActiveQuestion] = useState<QuestionCard | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hostEmotion, setHostEmotion] = useState<HostEmotion>("idle");

  // State 3: Scoring
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showBingoBanner, setShowBingoBanner] = useState<boolean>(false);
  const [isFullBingo, setIsFullBingo] = useState<boolean>(false);

  // State 4: Selected Tile for Inspection Modal
  const [inspectTile, setInspectTile] = useState<BingoTile | null>(null);

  // State 5: Team Name & Local Leaderboard
  const [teamName, setTeamName] = useState<string>("ทีมนักวิจัยน้อย สบปราบ");
  const [isSavedToLeaderboard, setIsSavedToLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "1",
      teamName: "ทีมนิเวศครั่งมหิดล",
      score: 1850,
      lines: 4,
      accuracy: 100,
      timeSpent: "3:45",
      date: "วันนี้",
    },
    {
      id: "2",
      teamName: "กลุ่มวิสาหกิจครั่งสบปราบ",
      score: 1400,
      lines: 3,
      accuracy: 92,
      timeSpent: "4:12",
      date: "วันนี้",
    },
    {
      id: "3",
      teamName: "ชมรมสีย้อมธรรมชาติลำปาง",
      score: 1100,
      lines: 2,
      accuracy: 85,
      timeSpent: "5:00",
      date: "เมื่อวาน",
    },
  ]);

  // Timer simulation
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }, []);

  // ==========================================================================
  // Action A (FIX): Check Winning Bingo Lines without Infinite Loop
  // Derived state with useMemo - NO setBoardTiles calls inside!
  // ==========================================================================
  const completedLines = useMemo<WinningLine[]>(() => {
    const lines: WinningLine[] = [];

    // 4 Horizontal Rows
    for (let r = 0; r < 4; r++) {
      const indices = [r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3];
      if (indices.every((i) => boardTiles[i]?.isMarked)) {
        lines.push({
          type: "row",
          index: r + 1,
          indices,
          label: `แนวนอนแถวที่ ${r + 1}`,
        });
      }
    }

    // 4 Vertical Columns
    for (let c = 0; c < 4; c++) {
      const indices = [c, c + 4, c + 8, c + 12];
      if (indices.every((i) => boardTiles[i]?.isMarked)) {
        lines.push({
          type: "col",
          index: c + 1,
          indices,
          label: `แนวตั้งแถวที่ ${c + 1}`,
        });
      }
    }

    // 2 Diagonals
    const diag1 = [0, 5, 10, 15]; // Top-left to Bottom-right
    if (diag1.every((i) => boardTiles[i]?.isMarked)) {
      lines.push({
        type: "diag",
        index: 1,
        indices: diag1,
        label: "แนวทแยง (ซ้ายบน ↘ ขวาล่าง)",
      });
    }

    const diag2 = [3, 6, 9, 12]; // Top-right to Bottom-left
    if (diag2.every((i) => boardTiles[i]?.isMarked)) {
      lines.push({
        type: "diag",
        index: 2,
        indices: diag2,
        label: "แนวทแยง (ขวาบน ↙ ซ้ายล่าง)",
      });
    }

    return lines;
  }, [boardTiles]);

  // Set of indices belonging to any winning line (derived, instant, no state mutation)
  const winningIndices = useMemo(() => {
    const set = new Set<number>();
    completedLines.forEach((l) => l.indices.forEach((idx) => set.add(idx)));
    return set;
  }, [completedLines]);

  // Detect newly formed winning lines for Banner + Audio + Bonus
  const previousLineCountRef = useRef<number>(0);

  useEffect(() => {
    if (completedLines.length > previousLineCountRef.current) {
      const newLineCount = completedLines.length - previousLineCountRef.current;
      setScore((s) => s + newLineCount * 500); // 500 bonus points per line
      setShowBingoBanner(true);
      setHostEmotion("excited");

      if (soundEnabled) {
        playChime("bingo");
      }

      // If full 16 tiles marked
      if (boardTiles.every((t) => t.isMarked)) {
        setIsFullBingo(true);
        setScore((s) => s + 2000); // Grand blackout bonus
      }

      const timeout = setTimeout(() => {
        setShowBingoBanner(false);
      }, 5000);
      previousLineCountRef.current = completedLines.length;
      return () => clearTimeout(timeout);
    }

    previousLineCountRef.current = completedLines.length;
  }, [completedLines, boardTiles, soundEnabled]);

  // ==========================================================================
  // Action Handlers
  // ==========================================================================

  // 1. Draw Random Question from Host (พี่ M-Guide) with Action E guard
  const handleDrawQuestion = useCallback(() => {
    if (isPopupOpen) return; // Prevent double-triggering

    if (soundEnabled) playChime("draw");

    const unmarkedKeywords = new Set(boardTiles.filter((t) => !t.isMarked).map((t) => t.id));
    let availableQuestions = QUESTION_DECK.filter((q) => unmarkedKeywords.has(q.targetKeywordId));

    if (availableQuestions.length === 0) {
      availableQuestions = QUESTION_DECK;
    }

    const randomQuestion =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    if (!randomQuestion) return;

    setActiveQuestion(randomQuestion);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setHostEmotion("thinking");
    setIsPopupOpen(true);
  }, [isPopupOpen, soundEnabled, boardTiles]);

  // 2. Click specific tile on board to challenge its question or view facts
  const handleTileClick = useCallback(
    (tile: BingoTile) => {
      if (soundEnabled) playChime("click");

      if (tile.isMarked) {
        setInspectTile(tile);
        return;
      }

      const matchedQuestion = QUESTION_DECK.find((q) => q.targetKeywordId === tile.id);
      if (matchedQuestion) {
        setActiveQuestion(matchedQuestion);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setIsCorrect(null);
        setHostEmotion("thinking");
        setIsPopupOpen(true);
      } else {
        setInspectTile(tile);
      }
    },
    [soundEnabled],
  );

  // 3. Submit Answer to Host (fixing stale streak calculation)
  const handleAnswerSubmit = useCallback(
    (optionIndex: number) => {
      if (!activeQuestion || isAnswerChecked) return;

      setSelectedOption(optionIndex);
      setIsAnswerChecked(true);
      setQuestionsAnswered((n) => n + 1);

      const isAnsCorrect = optionIndex === activeQuestion.correctIndex;
      setIsCorrect(isAnsCorrect);

      if (isAnsCorrect) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setCorrectAnswers((n) => n + 1);
        const bonusStreak = nextStreak * 20;
        setScore((s) => s + 100 + bonusStreak);
        setHostEmotion("happy");
        if (soundEnabled) playChime("correct");

        const targetId = activeQuestion.targetKeywordId;

        // Mark the target tile on the board
        setBoardTiles((prev) =>
          prev.map((tile) =>
            tile.id === targetId ? { ...tile, isMarked: true, isHighlighted: true } : tile,
          ),
        );

        // Remove highlight after 2.5s
        setTimeout(() => {
          setBoardTiles((prev) =>
            prev.map((tile) => (tile.id === targetId ? { ...tile, isHighlighted: false } : tile)),
          );
        }, 2500);
      } else {
        setStreak(0);
        setHostEmotion("concerned");
        if (soundEnabled) playChime("wrong");
      }
    },
    [activeQuestion, isAnswerChecked, streak, soundEnabled],
  );

  // 4. Reset & Reshuffle Board
  const handleReshuffleBoard = useCallback(() => {
    if (soundEnabled) playChime("click");
    const confirm = window.confirm("ต้องการสุ่มคำศัพท์ใหม่และเริ่มกระดานใหม่ใช่หรือไม่?");
    if (!confirm) return;

    setBoardTiles(generateInitialTiles());
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setShowBingoBanner(false);
    setIsFullBingo(false);
    setIsSavedToLeaderboard(false);
    setSecondsElapsed(0);
    previousLineCountRef.current = 0;
    setHostEmotion("idle");
  }, [soundEnabled]);

  // 5. Save Score to Leaderboard
  const handleSaveScore = useCallback(() => {
    if (isSavedToLeaderboard) return;
    const accuracy =
      questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 100;
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      teamName: teamName.trim() || "ทีมนิรนาม",
      score,
      lines: completedLines.length,
      accuracy,
      timeSpent: formatTimer(secondsElapsed),
      date: "วันนี้",
    };

    setLeaderboard((prev) => [newEntry, ...prev].sort((a, b) => b.score - a.score));
    setIsSavedToLeaderboard(true);
    if (soundEnabled) playChime("correct");
  }, [
    isSavedToLeaderboard,
    questionsAnswered,
    correctAnswers,
    teamName,
    score,
    completedLines.length,
    formatTimer,
    secondsElapsed,
    soundEnabled,
  ]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 py-6 font-['Mitr',sans-serif] text-slate-800">
      {/* Visual Confetti for Win */}
      <BingoConfetti active={showBingoBanner || isFullBingo} />

      {/* ==================================================================== */}
      {/* 1. Header & Host Dashboard Bar */}
      {/* ==================================================================== */}
      <header className="bg-white border-2 border-[#801818]/20 rounded-3xl p-4 sm:p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title & Brand */}
          <div className="flex items-center gap-3.5 text-center lg:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#801818] to-[#002D62] text-white flex items-center justify-center shadow-lg shadow-[#801818]/20 shrink-0">
              <Dices className="w-7 h-7 sm:w-8 sm:h-8 text-[#F5B800] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="bg-[#801818]/10 text-[#801818] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#801818]/20">
                  4x4 BINGO SYSTEM
                </span>
                <span className="text-xs text-slate-500 font-medium">ห้องเรียนรู้ครั่งสบปราบ</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                เกมบิงโกวิทยาศาสตร์ครั่งสบปราบ
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                พิชิตคำถามจาก พี่ M-Guide • ปลดล็อก 16 คีย์เวิร์ด • บิงโก 4 ช่องแถวตรงหรือทแยง
              </p>
            </div>
          </div>

          {/* Action Bar (View Switcher, Reshuffle, Audio) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Host Screen / Player View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setHostMode("player")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  hostMode === "player"
                    ? "bg-[#801818] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>มุมมองกระดาน</span>
              </button>
              <button
                onClick={() => setHostMode("screen")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  hostMode === "screen"
                    ? "bg-[#002D62] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>หน้าจอใหญ่ (Host Screen)</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "bg-slate-100 text-slate-400 border-slate-200"
              }`}
              title={soundEnabled ? "ปิดเสียงเอฟเฟกต์" : "เปิดเสียงเอฟเฟกต์"}
              aria-label={soundEnabled ? "ปิดเสียงเอฟเฟกต์" : "เปิดเสียงเอฟเฟกต์"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reshuffle Button */}
            <button
              onClick={handleReshuffleBoard}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>สุ่มกระดานใหม่</span>
            </button>

            {/* Primary Action: Draw Question with Debounce Guard (Action E) */}
            <button
              onClick={handleDrawQuestion}
              disabled={isPopupOpen}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isPopupOpen
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#801818] to-[#A02020] hover:from-[#600C0C] hover:to-[#801818] text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <Dices className="w-4 h-4 text-[#F5B800]" />
              <span>สุ่มจับการ์ดคำถาม (พี่ M-Guide)</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">คะแนนรวม</p>
              <p className="text-lg sm:text-xl font-bold text-[#801818]">
                {score.toLocaleString()} แต้ม
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">คำถามตอบถูก</p>
              <p className="text-lg sm:text-xl font-bold text-slate-800">
                {correctAnswers} / {questionsAnswered}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">จำนวนแถวบิงโก</p>
              <p className="text-lg sm:text-xl font-bold text-rose-600">
                {completedLines.length} / 10 แถว
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">เวลาที่เล่น</p>
              <p className="text-lg sm:text-xl font-bold text-[#002D62]">
                {formatTimer(secondsElapsed)} นาที
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. BINGO BANNER EFFECT with Action D Accessibility aria-live */}
      {/* ==================================================================== */}
      {showBingoBanner && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 bg-gradient-to-r from-[#F5B800] via-[#801818] to-[#002D62] p-1 rounded-3xl shadow-xl animate-bounce"
        >
          <div className="bg-white rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <span className="bg-[#801818] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BINGO WINNER!
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  🎉 ยินดีด้วย! สำเร็จสายบิงโก{" "}
                  {completedLines[completedLines.length - 1]?.label || ""}
                </h3>
                <p className="text-xs text-slate-600">
                  รับคะแนนโบนัส +500 แต้ม! สะสมสายบิงโกให้ครบทั้งกระดานเพื่อพิชิตคะแนนสูงสุด
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBingoBanner(false)}
              className="bg-[#801818] hover:bg-[#600C0C] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              เล่นต่อเลย!
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MAIN GAME CONTENT (HOST DISPLAY SCREEN vs PLAYER BOARD) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: 4x4 Bingo Board Canvas (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Board Container Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            {/* Header info of the board */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#801818] animate-ping" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  ตารางบิงโก 4x4 (คลิกช่องเพื่อดูความรู้หรือตอบคำถาม)
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>มาร์กแล้ว {boardTiles.filter((t) => t.isMarked).length}/16 ช่อง</span>
              </div>
            </div>

            {/* 4x4 Bingo Matrix Grid using Modular BingoTileCard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              {boardTiles.map((tile, idx) => (
                <BingoTileCard
                  key={tile.id}
                  tile={tile}
                  index={idx}
                  isInWinningLine={winningIndices.has(idx)}
                  onClick={handleTileClick}
                />
              ))}
            </div>

            {/* Board Legend */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ชีววิทยา
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> เคมีสีย้อม
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> แปรรูป
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> ชุมชนสบปราบ
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                *สร้างสายบิงโกได้ทั้งแนวนอน แนวตั้ง และแนวทแยง (รวม 10 แบบ)
              </span>
            </div>
          </div>

          {/* Winning Lines Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  สายบิงโกที่ทำสำเร็จ ({completedLines.length}/10)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                โบนัสสายละ +500 แต้ม
              </span>
            </div>

            {completedLines.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                ยังไม่มีสายบิงโกต่อเนื่อง ตอบคำถามเพื่อมาร์กช่องให้ครบ 4 ช่องในแนวเดียวกัน!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {completedLines.map((line, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{line.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Host Mascot & Classroom Dashboard (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Host M-Guide Stage Card */}
          <div className="bg-gradient-to-br from-[#002D62] via-[#0A2E4D] to-[#801818] rounded-3xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  BINGO HOST ON STAGE
                </span>
              </div>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                สดจากสบปราบ
              </span>
            </div>

            {/* Mascot Visual Display */}
            <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm relative">
              <div className="w-32 h-36 relative flex items-center justify-center">
                <img
                  src={`/assets/characters/prof-mahidol/${hostEmotion}.svg`}
                  alt="พี่ M-Guide"
                  className="w-full h-full object-contain filter drop-shadow-md transform transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const p = e.currentTarget.parentElement;
                    if (p && !p.querySelector(".host-fallback")) {
                      const div = document.createElement("div");
                      div.className = "host-fallback text-5xl flex items-center justify-center";
                      div.innerText = "👨‍🏫🌾";
                      p.appendChild(div);
                    }
                  }}
                />
              </div>

              <div className="text-center mt-2">
                <h4 className="font-bold text-sm text-white">พี่ M-Guide (อาจารย์มหิดล)</h4>
                <p className="text-[11px] text-amber-200">พิธีกรห้องเรียนรู้ครั่งสบปราบ</p>
              </div>
            </div>

            {/* Host Live Message */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 text-xs leading-relaxed text-slate-200">
              <span className="font-bold text-amber-300">💬 พี่ M-Guide กล่าว: </span>
              {completedLines.length > 0
                ? `เก่งมากครับ! ปลดล็อกบิงโกไปแล้ว ${completedLines.length} สาย สู้ต่อเพื่อสะสมคะแนนสูงสุด!`
                : streak > 1
                  ? `ตอบถูกต่อเนื่อง ${streak} ข้อแล้ว! ลุยต่อเลย ช่องบิงโกใกล้เต็มแล้วครับ`
                  : "กดปุ่ม 'สุ่มจับการ์ดคำถาม' เพื่อตอบคำถามและปลดล็อกช่องบนกระดานให้ครบ 4 ช่องต่อกัน!"}
            </div>

            {/* Primary Action Button with Action E guard */}
            <button
              onClick={handleDrawQuestion}
              disabled={isPopupOpen}
              className={`w-full font-bold py-3 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isPopupOpen
                  ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                  : "bg-[#F5B800] hover:bg-amber-400 text-[#002D62] transform hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>จับการ์ดคำถามรอบถัดไป</span>
            </button>
          </div>

          {/* Leaderboard Card & Score Submission */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#801818]" />
                <h3 className="font-bold text-slate-900 text-sm">ตารางคะแนน (Leaderboard)</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                ประจำวันนี้
              </span>
            </div>

            {/* Input Team Name & Save Button */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-semibold text-slate-600 block">
                บันทึกคะแนนในนามกลุ่ม / ทีม:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="กรอกชื่อทีมของคุณ..."
                  disabled={isSavedToLeaderboard}
                  className="grow bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#801818]"
                />
                <button
                  onClick={handleSaveScore}
                  disabled={isSavedToLeaderboard || score === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    isSavedToLeaderboard
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default"
                      : "bg-[#801818] hover:bg-[#600C0C] text-white"
                  }`}
                >
                  {isSavedToLeaderboard ? "บันทึกแล้ว" : "บันทึก"}
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    idx === 0
                      ? "bg-amber-50/70 border-amber-200 text-amber-900 font-semibold"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        idx === 0
                          ? "bg-amber-400 text-amber-950"
                          : idx === 1
                            ? "bg-slate-300 text-slate-800"
                            : idx === 2
                              ? "bg-amber-700 text-white"
                              : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[130px]">{entry.teamName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">{entry.lines} แถว</span>
                    <span className="font-bold text-[#801818] font-mono">{entry.score} pt</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 text-center">
              *คะแนนคำนวณจากความเร็ว ความแม่นยำ และแถวบิงโก
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. TILE INSPECTION MODAL (Action C & D Modular & Accessible) */}
      {/* ==================================================================== */}
      <TileInspectModal tile={inspectTile} onClose={() => setInspectTile(null)} />

      {/* ==================================================================== */}
      {/* 5. POPUP OVERLAY: พี่ M-Guide Host Quiz System (Action C, D, E) */}
      {/* ==================================================================== */}
      <MGuidePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        question={activeQuestion}
        onAnswer={handleAnswerSubmit}
        selectedOption={selectedOption}
        isAnswerChecked={isAnswerChecked}
        isCorrect={isCorrect}
        onNextQuestion={handleDrawQuestion}
        emotion={hostEmotion}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};

export default LacBingoGame;
