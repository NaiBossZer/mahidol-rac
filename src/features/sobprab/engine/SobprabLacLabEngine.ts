export type HostTree = "jamjuree" | "thongkwao";
export type SeasonCycle = "sai" | "pi";
export type MordantType = "alum" | "iron";

export interface FieldResult {
  yieldKg: number;
  purity: number;
}

export interface ColorResult {
  h: number;
  s: number;
  l: number;
  css: string;
  label: string;
}

export interface SobprabSimulationState {
  hostTree: HostTree;
  season: SeasonCycle;
  temperature: number;
  biocontrol: number;
  pH: number;
  mordant: MordantType;
  processRunning: boolean;
}

export type SobprabAction =
  | { type: "set_host_tree"; value: HostTree }
  | { type: "set_season"; value: SeasonCycle }
  | { type: "set_temperature"; value: number }
  | { type: "set_biocontrol"; value: number }
  | { type: "set_ph"; value: number }
  | { type: "set_mordant"; value: MordantType }
  | { type: "set_process_running"; value: boolean }
  | { type: "reset" };

export const HOST_CONFIG: Record<HostTree, { baseYield: number; basePurity: number }> = {
  jamjuree: { baseYield: 45, basePurity: 70 },
  thongkwao: { baseYield: 30, basePurity: 85 },
};

export const SEASON_CONFIG: Record<SeasonCycle, { yieldMul: number; purityAdj: number }> = {
  sai: { yieldMul: 0.9, purityAdj: 5 },
  pi: { yieldMul: 1.15, purityAdj: -5 },
};

export const PH_COLOR_POINTS: ReadonlyArray<{ ph: number; h: number; s: number; l: number }> = [
  { ph: 3.0, h: 330, s: 75, l: 62 },
  { ph: 4.5, h: 338, s: 70, l: 55 },
  { ph: 5.0, h: 355, s: 65, l: 42 },
  { ph: 7.5, h: 360, s: 60, l: 33 },
  { ph: 8.0, h: 285, s: 50, l: 35 },
  { ph: 10.0, h: 265, s: 55, l: 24 },
];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calcField(
  hostTree: HostTree,
  season: SeasonCycle,
  temperature: number,
  biocontrol: number,
): FieldResult {
  const host = HOST_CONFIG[hostTree];
  const seasonConfig = SEASON_CONFIG[season];
  const safeTemperature = clamp(temperature, 10, 45);
  const safeBiocontrol = clamp(biocontrol, 0, 100);
  const tempFactor = Math.max(0.3, Math.min(1.15, 1 - Math.abs(safeTemperature - 27.5) / 20));
  const pestControlFactor = safeBiocontrol / 100;
  const yieldKg = host.baseYield * seasonConfig.yieldMul * tempFactor * (0.6 + 0.4 * pestControlFactor);
  const purity = clamp(
    host.basePurity + seasonConfig.purityAdj + safeBiocontrol * 0.15 - (100 - safeBiocontrol) * 0.05,
    50,
    99,
  );

  return {
    yieldKg: Math.round(yieldKg * 10) / 10,
    purity: Math.round(purity),
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function getFabricColor(pH: number, mordant: MordantType): ColorResult {
  const safePH = clamp(pH, 3, 10);
  let p0 = PH_COLOR_POINTS[0]!;
  let p1 = PH_COLOR_POINTS[PH_COLOR_POINTS.length - 1]!;

  for (let index = 0; index < PH_COLOR_POINTS.length - 1; index += 1) {
    const current = PH_COLOR_POINTS[index]!;
    const next = PH_COLOR_POINTS[index + 1]!;
    if (safePH >= current.ph && safePH <= next.ph) {
      p0 = current;
      p1 = next;
      break;
    }
  }

  const t = p1.ph === p0.ph ? 0 : (safePH - p0.ph) / (p1.ph - p0.ph);
  let h = lerp(p0.h, p1.h, t);
  let s = lerp(p0.s, p1.s, t);
  let l = lerp(p0.l, p1.l, t);

  if (mordant === "alum") {
    s = Math.min(95, s + 8);
    l = Math.min(88, l + 8);
  } else {
    s = Math.max(15, s - 15);
    l = Math.max(12, l - 16);
  }

  h = ((h % 360) + 360) % 360;
  let label = "เฉดสีม่วงแดง/ม่วงคล้ำ (Reddish Violet)";
  if (safePH <= 4.5) label = "Laccaic Acid A/B — เฉดสีชมพูสด (Crimson Pink)";
  else if (safePH <= 7.5) label = "สีย้อมแดงครั่งโบราณ (Rich Lac Red)";

  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
    css: `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`,
    label,
  };
}

export function calcBCGScore(field: FieldResult, biocontrol: number, pH: number): { total: number; tier: string } {
  const yieldScore = Math.min(field.yieldKg / 60, 1) * 30;
  const purityScore = (field.purity / 100) * 30;
  const biocontrolScore = (clamp(biocontrol, 0, 100) / 100) * 20;
  const chemistryScore = 10 + (pH >= 5 && pH <= 7.5 ? 10 : 5);
  const total = Math.round(clamp(yieldScore + purityScore + biocontrolScore + chemistryScore, 0, 100));

  let tier = "ยังไม่ปลดล็อกตรา";
  if (total >= 90) tier = "ระดับเพชร";
  else if (total >= 80) tier = "ระดับทอง";
  else if (total >= 70) tier = "ระดับเงิน";
  return { total, tier };
}

export function getInitialSobprabState(): SobprabSimulationState {
  return {
    hostTree: "jamjuree",
    season: "sai",
    temperature: 28,
    biocontrol: 60,
    pH: 6,
    mordant: "alum",
    processRunning: true,
  };
}

export function sobprabReducer(
  state: SobprabSimulationState,
  action: SobprabAction,
): SobprabSimulationState {
  switch (action.type) {
    case "set_host_tree":
      return { ...state, hostTree: action.value };
    case "set_season":
      return { ...state, season: action.value };
    case "set_temperature":
      return { ...state, temperature: clamp(action.value, 10, 45) };
    case "set_biocontrol":
      return { ...state, biocontrol: clamp(action.value, 0, 100) };
    case "set_ph":
      return { ...state, pH: clamp(action.value, 3, 10) };
    case "set_mordant":
      return { ...state, mordant: action.value };
    case "set_process_running":
      return { ...state, processRunning: action.value };
    case "reset":
      return getInitialSobprabState();
    default:
      return state;
  }
}
