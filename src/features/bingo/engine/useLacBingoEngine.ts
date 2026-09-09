import { useCallback, useEffect, useReducer, useRef } from "react";
import { BINGO_KEYWORDS_POOL } from "@/features/bingo/bingoKeywords";
import { QUESTION_DECK } from "@/features/bingo/questionDeck";
import type { BingoTile, LeaderboardEntry } from "@/types/bingo";
import {
  calculateAccuracy,
  calculateWinningLines,
  createBingoBoard,
  formatBingoTimer,
  getInitialBingoState,
  getNextQuestion,
  getWinningIndices,
  lacBingoReducer,
  shuffleBingoTiles,
} from "./LacBingoEngine";

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", teamName: "ทีมนิเวศครั่งมหิดล", score: 1850, lines: 4, accuracy: 100, timeSpent: "3:45", date: "วันนี้" },
  { id: "2", teamName: "กลุ่มวิสาหกิจครั่งสบปราบ", score: 1400, lines: 3, accuracy: 92, timeSpent: "4:12", date: "วันนี้" },
  { id: "3", teamName: "ชมรมสีย้อมธรรมชาติลำปาง", score: 1100, lines: 2, accuracy: 85, timeSpent: "5:00", date: "เมื่อวาน" },
];

function createInitialBoard(): BingoTile[] {
  return createBingoBoard(BINGO_KEYWORDS_POOL);
}

export function useLacBingoEngine() {
  const [state, dispatch] = useReducer(lacBingoReducer, undefined, () => getInitialBingoState(createInitialBoard(), DEFAULT_LEADERBOARD));
  const pendingOptionRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.phase === "victory") return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.phase]);

  useEffect(() => {
    const highlighted = state.boardTiles.filter((tile) => tile.isHighlighted);
    if (highlighted.length === 0) return;
    const timerIds = highlighted.map((tile) => window.setTimeout(() => dispatch({ type: "clear_tile_highlight", tileId: tile.id }), 2500));
    return () => timerIds.forEach((timerId) => window.clearTimeout(timerId));
  }, [state.boardTiles]);

  const completedLines = calculateWinningLines(state.boardTiles);
  const winningIndices = getWinningIndices(completedLines);
  const accuracy = calculateAccuracy(state.correctAnswers, state.questionsAnswered);
  const formattedTime = formatBingoTimer(state.secondsElapsed);

  const drawQuestion = useCallback(() => {
    if (state.activeQuestion) return null;
    const question = getNextQuestion(state.boardTiles, QUESTION_DECK);
    if (!question) return null;
    dispatch({ type: "draw_question", question });
    return question;
  }, [state.activeQuestion, state.boardTiles]);

  const selectOption = useCallback((optionIndex: number) => {
    pendingOptionRef.current = optionIndex;
    dispatch({ type: "select_option", optionIndex });
  }, []);

  const submitAnswer = useCallback((optionIndex?: number) => {
    const selected = optionIndex ?? pendingOptionRef.current;
    dispatch({ type: "submit_answer", optionIndex: selected ?? undefined });
    pendingOptionRef.current = null;
  }, []);

  const closeQuestion = useCallback(() => {
    pendingOptionRef.current = null;
    dispatch({ type: "close_question" });
  }, []);
  const reshuffle = useCallback(() => {
    pendingOptionRef.current = null;
    dispatch({ type: "reset", boardTiles: createInitialBoard() });
  }, []);
  const setTeamName = useCallback((teamName: string) => dispatch({ type: "set_team_name", teamName }), []);
  const inspectTile = useCallback((tile: BingoTile | null) => dispatch({ type: "inspect_tile", tile }), []);
  const setSoundEnabled = useCallback((enabled: boolean) => dispatch({ type: "set_sound_enabled", enabled }), []);
  const setHostMode = useCallback((mode: "player" | "screen") => dispatch({ type: "set_host_mode", mode }), []);

  const saveScore = useCallback(() => {
    if (state.isSavedToLeaderboard || state.score <= 0) return;
    dispatch({ type: "save_score", entry: {
      id: Date.now().toString(), teamName: state.teamName.trim() || "ทีมนิรนาม", score: state.score,
      lines: completedLines.length, accuracy, timeSpent: formattedTime, date: "วันนี้",
    }});
  }, [accuracy, completedLines.length, formattedTime, state.isSavedToLeaderboard, state.score, state.teamName]);

  return {
    state, dispatch, completedLines, winningIndices, accuracy, formattedTime,
    actions: { drawQuestion, selectOption, submitAnswer, closeQuestion, reshuffle, setTeamName, saveScore, inspectTile, setSoundEnabled, setHostMode },
    utilities: { shuffleBingoTiles },
  };
}
