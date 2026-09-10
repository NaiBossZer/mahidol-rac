import { existsSync, readFileSync } from "node:fs";

const files = [
  "index.html",
  "src/main.tsx",
  "vite.config.ts",
  "package.json",
  "src/features/bingo/LacBingoGame.tsx",
  "src/features/bingo/BingoPage.tsx",
  "src/features/bingo/engine/LacBingoEngine.ts",
  "src/features/bingo/engine/useLacBingoEngine.ts",
  "src/features/bingo/questionDeck.ts",
  "src/features/bingo/bingoKeywords.ts",
  "src/features/bingo/components/MGuidePopup.tsx",
  "src/features/bingo/components/BingoVictoryOverlay.tsx",
  "src/features/bingo/components/BingoRallyPanel.tsx",
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
const bingoGame = readFileSync("src/features/bingo/LacBingoGame.tsx", "utf8");
const bingoPage = readFileSync("src/features/bingo/BingoPage.tsx", "utf8");
const rallyPanel = readFileSync("src/features/bingo/components/BingoRallyPanel.tsx", "utf8");
const questionDeck = readFileSync("src/features/bingo/questionDeck.ts", "utf8");
const keywordPool = readFileSync("src/features/bingo/bingoKeywords.ts", "utf8");
const mGuidePopup = readFileSync("src/features/bingo/components/MGuidePopup.tsx", "utf8");
const victoryOverlay = readFileSync("src/features/bingo/components/BingoVictoryOverlay.tsx", "utf8");

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
check("question modal has Escape handling", mGuidePopup.includes('e.key === "Escape"'));
check("question modal locks background scroll", mGuidePopup.includes('document.body.style.overflow = "hidden"'));
check("question modal announces answer feedback", mGuidePopup.includes('aria-live="polite"'));
check("victory overlay is accessible", victoryOverlay.includes('role="dialog"') && victoryOverlay.includes('aria-modal="true"'));
check("victory overlay supports keyboard replay", victoryOverlay.includes('e.key === "Escape"'));
check("Rally exposes 8 exhibition points", (rallyPanel.match(/id: "/g) || []).length === 8);
check("Rally accepts QR deep-link point", rallyPanel.includes('params.get("rallyPoint")') && rallyPanel.includes('params.get("rally")'));
check("Rally opens the mapped bingo question", bingoGame.includes("onScanPoint={handleRallyScan}") && bingoGame.includes("actions.drawQuestionForTile(point.keywordId)"));
check("Bingo page has no page scroll", bingoPage.includes("h-[100dvh] flex-col overflow-hidden"));
check("Bingo game uses no-scroll viewport", bingoGame.includes("h-full min-h-0 w-full overflow-hidden"));
check("scoreboard redesigned as podium + Top 5", bingoGame.includes("Top 5") && bingoGame.includes("🥇") && bingoGame.includes("ทีมของคุณ"));
check("victory overlay is integrated", bingoGame.includes("<BingoVictoryOverlay") && bingoGame.includes("onReplay={actions.reshuffle}"));

console.log(`Smoke test: ${failed ? "FAIL" : "PASS"}`);
process.exitCode = failed ? 1 : 0;
