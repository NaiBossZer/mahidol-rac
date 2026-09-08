export type BingoCategory = "biology" | "chemistry" | "product" | "locality";

export interface BingoTile {
  id: string;
  keyword: string;
  category: BingoCategory;
  iconName: string;
  shortDesc: string;
  fact: string;
  isMarked: boolean;
  isHighlighted?: boolean;
}

export interface QuestionCard {
  id: string;
  targetKeywordId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface WinningLine {
  type: "row" | "col" | "diag";
  index: number;
  indices: number[];
  label: string;
}

export interface LeaderboardEntry {
  id: string;
  teamName: string;
  score: number;
  lines: number;
  accuracy: number;
  timeSpent: string;
  date: string;
}

export type HostEmotion = "idle" | "happy" | "thinking" | "excited" | "concerned";
