import type {
  BingoTile,
  HostEmotion,
  LeaderboardEntry,
  QuestionCard,
  WinningLine,
} from "@/types/bingo";

export type BingoHostMode = "player" | "screen";
export type LacBingoPhase = "ready" | "question" | "answering" | "answer-result" | "bingo" | "victory";

export interface LacBingoState {
  boardTiles: BingoTile[];
  soundEnabled: boolean;
  hostMode: BingoHostMode;
  activeQuestion: QuestionCard | null;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
  hostEmotion: HostEmotion;
  phase: LacBingoPhase;
  score: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  secondsElapsed: number;
  showBingoBanner: boolean;
  isFullBingo: boolean;
  inspectTile: BingoTile | null;
  teamName: string;
  isSavedToLeaderboard: boolean;
  leaderboard: LeaderboardEntry[];
}

export type LacBingoAction =
  | { type: "draw_question"; question: QuestionCard }
  | { type: "select_option"; optionIndex: number }
  | { type: "submit_answer"; optionIndex?: number }
  | { type: "close_question" }
  | { type: "set_sound_enabled"; enabled: boolean }
  | { type: "set_host_mode"; mode: BingoHostMode }
  | { type: "inspect_tile"; tile: BingoTile | null }
  | { type: "clear_tile_highlight"; tileId: string }
  | { type: "tick"; seconds?: number }
  | { type: "set_team_name"; teamName: string }
  | { type: "save_score"; entry: LeaderboardEntry }
  | { type: "hide_bingo_banner" }
  | { type: "reset"; boardTiles: BingoTile[] };

const GRID_SIZE = 4;
const LINE_LENGTH = 4;
const LINE_BONUS = 500;
const FULL_BINGO_BONUS = 2000;
const CORRECT_BASE_SCORE = 100;
const STREAK_SCORE = 20;

export function shuffleBingoTiles<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function createBingoBoard(items: readonly BingoTile[]): BingoTile[] {
  return shuffleBingoTiles(items).map((tile) => ({ ...tile, isMarked: false, isHighlighted: false }));
}

export function calculateWinningLines(boardTiles: readonly BingoTile[]): WinningLine[] {
  const lines: WinningLine[] = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    const indices = Array.from({ length: LINE_LENGTH }, (_, column) => row * GRID_SIZE + column);
    if (indices.every((index) => boardTiles[index]?.isMarked)) lines.push({ type: "row", index: row + 1, indices, label: `แนวนอนแถวที่ ${row + 1}` });
  }
  for (let column = 0; column < GRID_SIZE; column += 1) {
    const indices = Array.from({ length: LINE_LENGTH }, (_, row) => row * GRID_SIZE + column);
    if (indices.every((index) => boardTiles[index]?.isMarked)) lines.push({ type: "col", index: column + 1, indices, label: `แนวตั้งแถวที่ ${column + 1}` });
  }
  const diagonals = [
    { index: 1, indices: [0, 5, 10, 15], label: "แนวทแยง (ซ้ายบน ↘ ขวาล่าง)" },
    { index: 2, indices: [3, 6, 9, 12], label: "แนวทแยง (ขวาบน ↙ ซ้ายล่าง)" },
  ] as const;
  for (const diagonal of diagonals) if (diagonal.indices.every((index) => boardTiles[index]?.isMarked)) lines.push({ type: "diag", ...diagonal });
  return lines;
}

export function getWinningIndices(lines: readonly WinningLine[]): Set<number> {
  const indices = new Set<number>();
  lines.forEach((line) => line.indices.forEach((index) => indices.add(index)));
  return indices;
}

export function calculateAccuracy(correctAnswers: number, questionsAnswered: number): number {
  return questionsAnswered <= 0 ? 100 : Math.round((correctAnswers / questionsAnswered) * 100);
}

export function formatBingoTimer(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export function getInitialBingoState(boardTiles: BingoTile[], leaderboard: LeaderboardEntry[] = []): LacBingoState {
  return {
    boardTiles, soundEnabled: true, hostMode: "player", activeQuestion: null, selectedOption: null,
    isAnswerChecked: false, isCorrect: null, hostEmotion: "idle", phase: "ready", score: 0, streak: 0,
    questionsAnswered: 0, correctAnswers: 0, secondsElapsed: 0, showBingoBanner: false, isFullBingo: false,
    inspectTile: null, teamName: "ทีมนักวิจัยน้อย สบปราบ", isSavedToLeaderboard: false, leaderboard,
  };
}

export function lacBingoReducer(state: LacBingoState, action: LacBingoAction): LacBingoState {
  switch (action.type) {
    case "draw_question":
      return { ...state, activeQuestion: action.question, selectedOption: null, isAnswerChecked: false, isCorrect: null, hostEmotion: "thinking", phase: "answering", inspectTile: null };
    case "select_option":
      return state.isAnswerChecked ? state : { ...state, selectedOption: action.optionIndex };
    case "submit_answer": {
      if (!state.activeQuestion || state.isAnswerChecked) return state;
      const selectedOption = action.optionIndex ?? state.selectedOption;
      if (selectedOption === null || selectedOption === undefined) return state;
      const isCorrect = selectedOption === state.activeQuestion.correctIndex;
      const nextStreak = isCorrect ? state.streak + 1 : 0;
      const nextQuestionsAnswered = state.questionsAnswered + 1;
      const nextCorrectAnswers = state.correctAnswers + (isCorrect ? 1 : 0);
      let nextBoard = state.boardTiles;
      let nextScore = state.score;
      let showBingoBanner = false;
      let isFullBingo = state.isFullBingo;
      if (isCorrect) {
        const targetId = state.activeQuestion.targetKeywordId;
        nextBoard = state.boardTiles.map((tile) => tile.id === targetId ? { ...tile, isMarked: true, isHighlighted: true } : tile);
        nextScore += CORRECT_BASE_SCORE + nextStreak * STREAK_SCORE;
        const beforeLines = calculateWinningLines(state.boardTiles);
        const afterLines = calculateWinningLines(nextBoard);
        const newLines = Math.max(0, afterLines.length - beforeLines.length);
        if (newLines > 0) { nextScore += newLines * LINE_BONUS; showBingoBanner = true; }
        isFullBingo = nextBoard.length > 0 && nextBoard.every((tile) => tile.isMarked);
        if (isFullBingo && !state.isFullBingo) nextScore += FULL_BINGO_BONUS;
      }
      return {
        ...state, boardTiles: nextBoard, score: nextScore, streak: nextStreak,
        questionsAnswered: nextQuestionsAnswered, correctAnswers: nextCorrectAnswers,
        selectedOption, isAnswerChecked: true, isCorrect, hostEmotion: isCorrect ? "happy" : "concerned",
        showBingoBanner: showBingoBanner || state.showBingoBanner, isFullBingo,
        phase: isFullBingo ? "victory" : showBingoBanner ? "bingo" : "answer-result",
      };
    }
    case "close_question":
      return { ...state, activeQuestion: null, selectedOption: null, isAnswerChecked: false, isCorrect: null, phase: state.isFullBingo ? "victory" : "ready" };
    case "set_sound_enabled": return { ...state, soundEnabled: action.enabled };
    case "set_host_mode": return { ...state, hostMode: action.mode };
    case "inspect_tile": return { ...state, inspectTile: action.tile };
    case "clear_tile_highlight": return { ...state, boardTiles: state.boardTiles.map((tile) => tile.id === action.tileId ? { ...tile, isHighlighted: false } : tile) };
    case "tick": return { ...state, secondsElapsed: state.secondsElapsed + Math.max(0, action.seconds ?? 1) };
    case "set_team_name": return { ...state, teamName: action.teamName };
    case "save_score":
      return state.isSavedToLeaderboard ? state : { ...state, leaderboard: [action.entry, ...state.leaderboard].sort((a, b) => b.score - a.score), isSavedToLeaderboard: true };
    case "hide_bingo_banner": return { ...state, showBingoBanner: false, phase: state.isFullBingo ? "victory" : state.isAnswerChecked ? "answer-result" : "ready" };
    case "reset": return getInitialBingoState(action.boardTiles, state.leaderboard);
    default: return state;
  }
}

export function getNextQuestion(boardTiles: readonly BingoTile[], questionDeck: readonly QuestionCard[]): QuestionCard | null {
  const unmarked = new Set(boardTiles.filter((tile) => !tile.isMarked).map((tile) => tile.id));
  const available = questionDeck.filter((question) => unmarked.has(question.targetKeywordId));
  const pool = available.length > 0 ? available : questionDeck;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
