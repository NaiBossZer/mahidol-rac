// src/data/scriptRegistry.ts
import { GameScript } from "@/types/onboarding";
import { sobprabLacScript } from "./scripts/sobprabLacScript";

export const SCRIPT_REGISTRY: Record<string, GameScript> = {
  "sobprab-lac": sobprabLacScript,
};

export function getScript(gameId: string): GameScript {
  const script = SCRIPT_REGISTRY[gameId];
  if (!script) throw new Error(`ไม่พบสคริปต์สำหรับเกม: ${gameId}`);
  return script;
}
