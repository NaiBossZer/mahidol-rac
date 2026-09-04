import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreeDeciduous, Flower2, Sun, CloudRain, Thermometer, ShieldCheck, Bug,
  FlaskConical, Palette, Shirt, Sparkles, Award, Trophy, Leaf, Factory,
  Package, Pill, Hammer, TrendingUp, CheckCircle2, Info, ArrowRight,
  Beaker, Droplets, Play, Pause, Star, Boxes, Apple
} from "lucide-react";

// ============================================================
// Types
// ============================================================
type HostTree = "jamjuree" | "thongkwao";
type SeasonCycle = "sai" | "pi";
type MordantType = "alum" | "iron";

interface FieldResult {
  yieldKg: number;
  purity: number;
}

interface ColorResult {
  h: number;
  s: number;
  l: number;
  css: string;
  label: string;
}

// ============================================================
// Constants
// ============================================================
const HOST_INFO: Record<HostTree, { name: string; icon: React.ElementType; desc: string; baseYield: number; basePurity: number }> = {
  jamjuree: { name: "ต้นจามจุรี", icon: TreeDeciduous, desc: "ให้ผลผลิตครั่งสูง เติบโตเร็ว เหมาะเลี้ยงเชิงพาณิชย์", baseYield: 45, basePurity: 70 },
  thongkwao: { name: "ต้นทองกวาว", icon: Flower2, desc: "ให้สีแดงสดบริสุทธิ์สูง เหมาะสกัดสีย้อมคุณภาพพรีเมียม", baseYield: 30, basePurity: 85 },
};

const SEASON_INFO: Record<SeasonCycle, { name: string; icon: React.ElementType; desc: string; yieldMul: number; purityAdj: number }> = {
  sai: { name: "ครั่งฤดูสาย (พ.ย.-มิ.ย.)", icon: Sun, desc: "รอบยาว อากาศแห้ง ครั่งสะสมเนื้อดี ความบริสุทธิ์สูง", yieldMul: 0.9, purityAdj: 5 },
  pi: { name: "ครั่งฤดูปี (พ.ค.-พ.ย.)", icon: CloudRain, desc: "รอบสั้น ฝนชุก เติบโตไว แต่เสี่ยงศัตรูพืชมากขึ้น", yieldMul: 1.15, purityAdj: -5 },
};

const MORDANT_INFO: Record<MordantType, { name: string; icon: React.ElementType; desc: string }> = {
  alum: { name: "สารส้ม (Al³⁺)", icon: Sparkles, desc: "เพิ่มความสว่างสดใสของสี เหมาะกับผ้าฝ้าย/ผ้าไหมโทนสด" },
  iron: { name: "น้ำสนิมเหล็ก (Fe³⁺)", icon: Hammer, desc: "ปรับสีให้เข้มขึ้น ทึบขึ้น สไตล์ผ้าย้อมโบราณ" },
};

// สี Laccaic Acid ตามค่า pH (จุดอ้างอิงสำหรับ interpolate)
const PH_COLOR_POINTS: { ph: number; h: number; s: number; l: number }[] = [
  { ph: 3.0, h: 330, s: 75, l: 62 },
  { ph: 4.5, h: 338, s: 70, l: 55 },
  { ph: 5.0, h: 355, s: 65, l: 42 },
  { ph: 7.5, h: 360, s: 60, l: 33 },
  { ph: 8.0, h: 285, s: 50, l: 35 },
  { ph: 10.0, h: 265, s: 55, l: 24 },
];

// ============================================================
// Calculation Helpers
// ============================================================
function calcField(hostTree: HostTree, season: SeasonCycle, temperature: number, biocontrol: number): FieldResult {
  const host = HOST_INFO[hostTree];
  const seasonCfg = SEASON_INFO[season];
  const tempFactor = Math.max(0.3, Math.min(1.15, 1 - Math.abs(temperature - 27.5) / 20));
  const pestControlFactor = biocontrol / 100;
  const yieldKg = host.baseYield * seasonCfg.yieldMul * tempFactor * (0.6 + 0.4 * pestControlFactor);
  let purity = host.basePurity + seasonCfg.purityAdj + biocontrol * 0.15 - (100 - biocontrol) * 0.05;
  purity = Math.max(50, Math.min(99, purity));
  return { yieldKg: Math.round(yieldKg * 10) / 10, purity: Math.round(purity) };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getFabricColor(pH: number, mordant: MordantType): ColorResult {
  let p0 = PH_COLOR_POINTS[0];
  let p1 = PH_COLOR_POINTS[PH_COLOR_POINTS.length - 1];
  for (let i = 0; i < PH_COLOR_POINTS.length - 1; i++) {
    if (pH >= PH_COLOR_POINTS[i].ph && pH <= PH_COLOR_POINTS[i + 1].ph) {
      p0 = PH_COLOR_POINTS[i];
      p1 = PH_COLOR_POINTS[i + 1];
      break;
    }
  }
  const t = p1.ph === p0.ph ? 0 : (pH - p0.ph) / (p1.ph - p0.ph);
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

  let label = "";
  if (pH <= 4.5) label = "Laccaic Acid A/B — เฉดสีชมพูสด (Crimson Pink)";
  else if (pH <= 7.5) label = "สีย้อมแดงครั่งโบราณ (Rich Lac Red)";
  else label = "เฉดสีม่วงแดง/ม่วงคล้ำ (Reddish Violet)";

  return { h: Math.round(h), s: Math.round(s), l: Math.round(l), css: `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`, label };
}

function calcBCGScore(field: FieldResult, biocontrol: number, pH: number): { total: number; tier: string } {
  const yieldScore = Math.min(field.yieldKg / 60, 1) * 30;
  const purityScore = (field.purity / 100) * 30;
  const biocontrolScore = (biocontrol / 100) * 20;
  const chemistryScore = 10 + (pH >= 5 && pH <= 7.5 ? 10 : 5);
  const total = Math.round(Math.max(0, Math.min(100, yieldScore + purityScore + biocontrolScore + chemistryScore)));
  let tier = "ยังไม่ปลดล็อกตรา";
  if (total >= 90) tier = "ระดับเพชร";
  else if (total >= 80) tier = "ระดับทอง";
  else if (total >= 70) tier = "ระดับเงิน";
  return { total, tier };
}

// ============================================================
// Sub Components
// ============================================================
const SelectCard: React.FC<{
  active: boolean; icon: React.ElementType; title: string; desc: string; color: string; onClick: () => void;
}> = ({ active, icon: Icon, title, desc, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 text-left rounded-xl border-2 p-4 transition"
    style={{
      borderColor: active ? color : "#E2E8F0",
      backgroundColor: active ? `${color}15` : "white",
    }}
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-5 h-5" style={{ color }} />
      <span className="font-semibold text-slate-800 text-sm">{title}</span>
    </div>
    <p className="text-xs text-slate-500">{desc}</p>
  </button>
);

const StatBox: React.FC<{ icon: React.ElementType; label: string; value: string; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" style={{ color }} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
    <span className="text-lg font-bold text-slate-800">{value}</span>
  </div>
);

const FlowNode: React.FC<{ x: number; y: number; w: number; h: number; icon: React.ElementType; label: string; color: string }> = ({
  x, y, w, h, icon: Icon, label, color,
}) => (
  <foreignObject x={x} y={y} width={w} height={h}>
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border-2 shadow-sm px-2 text-center" style={{ borderColor: color }}>
      <Icon className="w-7 h-7 mb-1" style={{ color }} />
      <span className="text-[11px] font-medium text-slate-700 leading-tight">{label}</span>
    </div>
  </foreignObject>
);

const FlowPath: React.FC<{ d: string; active: boolean; color: string }> = ({ d, active, color }) => (
  <g>
    <path d={d} fill="none" stroke="#CBD5E1" strokeWidth={3} strokeLinecap="round" />
    {active && (
      <circle r={5} fill={color}>
        <animateMotion dur="2s" repeatCount="indefinite" path={d} />
      </circle>
    )}
  </g>
);

// ============================================================
// Main Component
// ============================================================
const SobprabLacLabGame: React.FC = () => {
  const [hostTree, setHostTree] = useState<HostTree>("jamjuree");
  const [season, setSeason] = useState<SeasonCycle>("sai");
  const [temperature, setTemperature] = useState<number>(28);
  const [biocontrol, setBiocontrol] = useState<number>(60);
  const [pH, setPH] = useState<number>(6);
  const [mordant, setMordant] = useState<MordantType>("alum");
  const [processRunning, setProcessRunning] = useState<boolean>(true);

  const field = useMemo(() => calcField(hostTree, season, temperature, biocontrol), [hostTree, season, temperature, biocontrol]);
  const fabric = useMemo(() => getFabricColor(pH, mordant), [pH, mordant]);
  const bcg = useMemo(() => calcBCGScore(field, biocontrol, pH), [field, biocontrol, pH]);

  const badgeUnlocked = bcg.total >= 70;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-6 h-6" style={{ color: "#16A34A" }} />
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#002D62" }}>
              ศูนย์การเรียนรู้ครั่งสบปราบ
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium" style={{ color: "#9E2A2B" }}>
            มหาวิทยาลัยมหิดล วิทยาเขตนครลำปาง — Sobprab Lac Science &amp; BCG Innovation Simulator
          </p>
        </div>

        {/* FEATURE 1: Field Simulation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="w-5 h-5" style={{ color: "#16A34A" }} />
            <h2 className="font-semibold text-lg text-slate-800">1. จำลองแปลงเลี้ยงครั่งสบปราบ</h2>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">เลือกต้นโฮสต์</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {(Object.keys(HOST_INFO) as HostTree[]).map((key) => (
                <SelectCard
                  key={key}
                  active={hostTree === key}
                  icon={HOST_INFO[key].icon}
                  title={HOST_INFO[key].name}
                  desc={HOST_INFO[key].desc}
                  color="#16A34A"
                  onClick={() => setHostTree(key)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">เลือกรอบฤดูกาล</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {(Object.keys(SEASON_INFO) as SeasonCycle[]).map((key) => (
                <SelectCard
                  key={key}
                  active={season === key}
                  icon={SEASON_INFO[key].icon}
                  title={SEASON_INFO[key].name}
                  desc={SEASON_INFO[key].desc}
                  color="#F2A900"
                  onClick={() => setSeason(key)}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4" style={{ color: "#C0392B" }} /> อุณหภูมิ
                </label>
                <span className="text-sm font-bold text-slate-700">{temperature}°C</span>
              </div>
              <input type="range" min={15} max={40} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-red-600" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" style={{ color: "#16A34A" }} /> การควบคุมแตนเบียน (Biological Control)
                </label>
                <span className="text-sm font-bold text-slate-700">{biocontrol}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={biocontrol} onChange={(e) => setBiocontrol(Number(e.target.value))} className="w-full accent-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <StatBox icon={Package} label="ผลผลิตครั่งดิบ (Sticklac)" value={`${field.yieldKg} kg`} color="#9E2A2B" />
            <StatBox icon={CheckCircle2} label="เกรดความบริสุทธิ์" value={`${field.purity}%`} color="#16A34A" />
          </div>
        </div>

        {/* FEATURE 2: Chemistry Lab */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" style={{ color: "#E84393" }} />
            <h2 className="font-semibold text-lg text-slate-800">2. ห้องปฏิบัติการสี Laccaic Acid &amp; pH Chemistry</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                    <Beaker className="w-4 h-4" style={{ color: "#E84393" }} /> ค่า pH สารละลาย
                  </label>
                  <span className="text-sm font-bold text-slate-700">{pH.toFixed(1)}</span>
                </div>
                <input type="range" min={3} max={10} step={0.1} value={pH} onChange={(e) => setPH(Number(e.target.value))} className="w-full" style={{ accentColor: "#E84393" }} />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>3.0 (กรด)</span><span>6.5 (กลาง)</span><span>10.0 (ด่าง)</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">เลือกสารมอร์ดอนต์ (Mordant)</p>
                <div className="flex flex-col gap-3">
                  {(Object.keys(MORDANT_INFO) as MordantType[]).map((key) => (
                    <SelectCard
                      key={key}
                      active={mordant === key}
                      icon={MORDANT_INFO[key].icon}
                      title={MORDANT_INFO[key].name}
                      desc={MORDANT_INFO[key].desc}
                      color="#002D62"
                      onClick={() => setMordant(key)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <p className="text-xs text-pink-700">{fabric.label}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <p className="text-sm font-medium text-slate-600 self-start flex items-center gap-1.5">
                <Shirt className="w-4 h-4" /> แผ่นผ้าจำลอง (Fabric Canvas)
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-24 h-32 rounded-lg border border-slate-300 bg-[#F5F0E8]" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px)"
                  }} />
                  <span className="text-[11px] text-slate-400">ก่อนย้อม</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300" />
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ backgroundColor: fabric.css }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-32 rounded-lg border border-slate-300 shadow-inner"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 6px)"
                    }}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">หลังย้อม</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                HSL: {fabric.h}°, {fabric.s}%, {fabric.l}% · มอร์ดอนต์: {MORDANT_INFO[mordant].name}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 3: Flow Diagram */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5" style={{ color: "#002D62" }} />
              <h2 className="font-semibold text-lg text-slate-800">3. กระบวนการแปรรูปครั่งสบปราบ</h2>
            </div>
            <button
              onClick={() => setProcessRunning((r) => !r)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border-2 transition"
              style={{ borderColor: "#002D62", color: processRunning ? "white" : "#002D62", backgroundColor: processRunning ? "#002D62" : "white" }}
            >
              {processRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {processRunning ? "หยุดเดินเครื่อง" : "เริ่มเดินเครื่อง"}
            </button>
          </div>

          <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-3 overflow-x-auto">
            <svg viewBox="0 0 960 320" className="w-full min-w-[880px] h-80">
              <FlowPath d="M140,160 L170,160" active={processRunning} color="#9E2A2B" />
              <FlowPath d="M300,160 L330,160" active={processRunning} color="#9E2A2B" />
              <FlowPath d="M460,150 L500,150 L500,60 L520,60" active={processRunning} color="#E84393" />
              <FlowPath d="M670,60 L730,60" active={processRunning} color="#E84393" />
              <FlowPath d="M460,170 L500,170 L500,260 L520,260" active={processRunning} color="#F2A900" />
              <FlowPath d="M670,260 L730,260" active={processRunning} color="#F2A900" />

              <FlowNode x={10} y={115} w={130} h={90} icon={Package} label="ครั่งกิ่ง (Sticklac)" color="#9E2A2B" />
              <FlowNode x={170} y={115} w={130} h={90} icon={Hammer} label="บดและล้าง" color="#9E2A2B" />
              <FlowNode x={330} y={115} w={130} h={90} icon={Boxes} label="ครั่งเม็ด (Seedlac)" color="#9E2A2B" />

              <FlowNode x={520} y={15} w={150} h={90} icon={FlaskConical} label="สกัดสาร Laccaic Acid" color="#E84393" />
              <FlowNode x={730} y={15} w={170} h={90} icon={Palette} label="ผงสีย้อม / สีผสมอาหาร" color="#E84393" />

              <FlowNode x={520} y={215} w={150} h={90} icon={Droplets} label="สกัดเรซิน Shellac + Lac Wax" color="#F2A900" />
              <FlowNode x={730} y={215} w={170} h={90} icon={Sparkles} label="สารเคลือบผิว BCG" color="#F2A900" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500">
            <span className="flex items-center gap-1"><Apple className="w-4 h-4 text-red-500" /> เคลือบผิวผลไม้</span>
            <span className="flex items-center gap-1"><Pill className="w-4 h-4 text-sky-500" /> เคลือบเม็ดยา</span>
            <span className="flex items-center gap-1"><Hammer className="w-4 h-4 text-amber-700" /> เคลือบงานไม้</span>
          </div>
        </div>

        {/* FEATURE 4: BCG Score & Badge */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: "#F2A900" }} />
            <h2 className="font-semibold text-lg text-slate-800">4. Sobprab Science Master Score &amp; BCG Badge</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">คะแนนรวม</span>
                <span className="text-2xl font-bold" style={{ color: "#002D62" }}>{bcg.total}/100</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: badgeUnlocked ? "#16A34A" : "#F2A900" }}
                  animate={{ width: `${bcg.total}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-slate-500">สถานะ: <span className="font-semibold text-slate-700">{bcg.tier}</span></p>

              <AnimatePresence>
                {badgeUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl p-3"
                  >
                    <Award className="w-10 h-10 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-700 text-sm">ปลดล็อกตราสัญลักษณ์!</p>
                      <p className="text-xs text-amber-600">RAC Sobprab Eco-Innovator — {bcg.tier}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-600" /> ประโยชน์ทางเคมีและเศรษฐกิจชุมชนสบปราบ
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" /> ครั่งเป็นทรัพยากรชีวภาพสร้างรายได้เสริมให้เกษตรกรสบปราบ</li>
                <li className="flex items-start gap-2"><Palette className="w-3.5 h-3.5 text-pink-500 mt-0.5 shrink-0" /> Laccaic Acid ใช้เป็นสีผสมอาหารธรรมชาติ ปลอดภัยกว่าสีสังเคราะห์</li>
                <li className="flex items-start gap-2"><Pill className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" /> Shellac ใช้เคลือบผลไม้และเม็ดยา ช่วยยืดอายุการเก็บรักษา</li>
                <li className="flex items-start gap-2"><Hammer className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" /> Lac Wax ใช้ในอุตสาหกรรมขัดเงาไม้และเครื่องหนัง</li>
                <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" /> โมเดล BCG หมุนเวียนทรัพยากรท้องถิ่น สร้างมูลค่าเพิ่ม ลดของเสีย</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobprabLacLabGame;