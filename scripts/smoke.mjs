import { existsSync, readFileSync } from "node:fs";

const files = [
  "index.html",
  "src/main.tsx",
  "vite.config.ts",
  "package.json",
  "src/features/bingo/LacBingoGame.tsx",
  "src/features/bingo/engine/LacBingoEngine.ts",
  "src/features/bingo/engine/useLacBingoEngine.ts",
  "src/features/bingo/questionDeck.ts",
  "src/features/bingo/bingoKeywords.ts",
];
let failed = 0;

function check(label, condition) {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}`);
  if (!condition) failed++;
}

for (const file of files) check(file, existsSync(file));

const packageText = readFileSync("package.json", "utf8");
for (const forbidden of [
  "@tanstack/react-start",
  "@tanstack/react-router",
  "@lovable.dev/vite-tanstack-config",
  "nitro",
]) {
  check(`no ${forbidden}`, !packageText.includes(forbidden));
}

const bingoEngine = readFileSync("src/features/bingo/engine/LacBingoEngine.ts", "utf8");
const bingoHook = readFileSync("src/features/bingo/engine/useLacBingoEngine.ts", "utf8");
const questionDeck = readFileSync("src/features/bingo/questionDeck.ts", "utf8");
const keywordPool = readFileSync("src/features/bingo/bingoKeywords.ts", "utf8");

const questionTargets = [...questionDeck.matchAll(/targetKeywordId:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const keywordIds = [...keywordPool.matchAll(/id:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const uniqueTargets = new Set(questionTargets);
const uniqueKeywords = new Set(keywordIds);

check("Bingo board rule is 4x4 / 16 tiles", bingoEngine.includes("tileCount: 16") && bingoEngine.includes("gridSize: 4"));
check("Bingo has exactly 10 winning lines", bingoEngine.includes("lineCount: 10"));
check("question deck has 16 target mappings", questionTargets.length === 16);
check("question targets are unique", uniqueTargets.size === questionTargets.length);
check("keyword pool has 16 unique ids", keywordIds.length === 16 && uniqueKeywords.size === 16);
check("engine blocks marked-target questions", bingoEngine.includes("if (!targetTile || targetTile.isMarked) return state;"));
check("engine stops timer at victory", bingoEngine.includes("case \"tick\": return state.isFullBingo ? state"));
check("hook prevents leaderboard save before victory", bingoHook.includes("if (!state.isFullBingo || state.isSavedToLeaderboard"));
check("question deck keeps one question per tile", questionTargets.length === keywordIds.length && uniqueTargets.size === uniqueKeywords.size);

console.log(`Smoke test: ${failed ? "FAIL" : "PASS"}`);
process.exitCode = failed ? 1 : 0;
