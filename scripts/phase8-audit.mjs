import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const forbidden = [
  { label: "Google Apps Script endpoint", pattern: /script\.google\.com\/macros\/s\//i },
  { label: "legacy activity date column", pattern: /from\(["']activities["']\)[\s\S]{0,120}(?:select\([^)]*\bdate\b|order\(["']date["'])/i },
  { label: "legacy activity cover_image column", pattern: /from\(["']activities["']\)[\s\S]{0,120}cover_image/i },
  { label: "RAC activity admin route", pattern: /["'`]\/admin\/(?:activity(?:["'`]|\/)|activity-satisfaction|survey-export)/i },
  { label: "service role credential in browser source", pattern: /service_role|SUPABASE_SERVICE_ROLE/i },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const files = await walk(root);
const findings = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) findings.push(`${relative(process.cwd(), file)} -> ${rule.label}`);
  }
}

if (findings.length) {
  console.error("Phase 8 architecture audit FAILED:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Phase 8 architecture audit PASSED (${files.length} source files scanned).`);
