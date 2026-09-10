import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../src/", import.meta.url);
const forbidden = [
  { label: "Google Apps Script endpoint", pattern: /script\.google\.com\/macros\/s\//i },
  { label: "legacy activity column date", pattern: /(?:activities|\.from\(["']activities["']\))[\s\S]{0,180}\bdate\b/i },
  { label: "legacy activity column cover_image", pattern: /cover_image/i },
  { label: "RAC activity admin route", pattern: /\/admin\/activity(?:["'`]|\b)/i },
  { label: "RAC satisfaction admin route", pattern: /\/admin\/activity-satisfaction(?:["'`]|\b)/i },
  { label: "RAC survey export admin route", pattern: /\/admin\/survey-export(?:["'`]|\b)/i },
  { label: "service role credential in browser source", pattern: /service_role|SUPABASE_SERVICE_ROLE/i },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const path = join(dir.pathname, entry.name);
    if (entry.isDirectory()) files.push(...await walk(new URL(`${path}/`)));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const files = await walk(root);
const findings = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) findings.push(`${file.replace(process.cwd() + "/", "")} -> ${rule.label}`);
  }
}

if (findings.length) {
  console.error("Phase 8 architecture audit FAILED:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Phase 8 architecture audit PASSED (${files.length} source files scanned).`);
