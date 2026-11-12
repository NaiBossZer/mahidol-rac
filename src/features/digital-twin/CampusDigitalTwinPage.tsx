import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import {
  ArrowLeft, Building2, Camera, ChevronRight, Compass, Leaf, MapPin,
  RotateCcw, Search, ShieldCheck, Sprout, Trees, Waves, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppNavbar from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";

type SiteKind = "building" | "greenhouse" | "field" | "garden" | "water" | "security" | "utility";
type SiteZone = {
  id: number; name: string; description: string; x: number; y: number; kind: SiteKind;
};

const SITE_ZONES: SiteZone[] = [
  { id: 1, name: "สำนักงาน", description: "อาคารบริหารและประสานงานศูนย์ฯ", x: 68, y: 18, kind: "building" },
  { id: 2, name: "โรงผักยกแคร่", description: "แปลงปลูกผักยกแคร่เพื่อการศึกษาวิจัย", x: 74, y: 22, kind: "greenhouse" },
  { id: 3, name: "สถานีตรวจวัดคุณภาพอากาศ", description: "จุดตรวจวัดดัชนีคุณภาพอากาศและสิ่งแวดล้อม", x: 72, y: 32, kind: "utility" },
  { id: 4, name: "แปลงผักตามฤดูกาล", description: "แปลงสาธิตการปลูกผักหมุนเวียน", x: 60, y: 28, kind: "field" },
  { id: 5, name: "โรงเพาะชำ 1", description: "โรงเรือนเพาะกล้าไม้และขยายพันธุ์พืช 1", x: 38, y: 12, kind: "greenhouse" },
  { id: 6, name: "โรงเพาะชำ 2", description: "โรงเรือนเพาะกล้าไม้และขยายพันธุ์พืช 2", x: 59, y: 12, kind: "greenhouse" },
  { id: 7, name: "อาคารเครื่องมือช่าง", description: "อาคารเก็บรักษาและซ่อมบำรุงเครื่องมือเกษตร", x: 56, y: 5, kind: "utility" },
  { id: 8, name: "สวนสัก", description: "แปลงสาธิตการปลูกและอนุรักษ์ไม้สัก", x: 47, y: 4, kind: "garden" },
  { id: 9, name: "บ้านพักรับรอง", description: "อาคารพักรับรองสำหรับคณะทำงานและวิทยากร", x: 45, y: 22, kind: "building" },
  { id: 10, name: "ป้อมยาม", description: "จุดตรวจและรักษาความปลอดภัยเข้า-ออก", x: 68, y: 41, kind: "security" },
  { id: 11, name: "แปลงพืชสวนครัว/สมุนไพร", description: "แปลงสาธิตการปลูกพืชผักสวนครัวและสมุนไพรพื้นบ้าน", x: 45, y: 33, kind: "field" },
  { id: 12, name: "โรงเก็บของ/สินค้าเกษตร", description: "อาคารจัดเก็บผลผลิตและอุปกรณ์การเกษตร", x: 44, y: 41, kind: "utility" },
  { id: 13, name: "ห้องปฏิบัติการ/ลานประชุม", description: "ศูนย์เรียนรู้และห้องปฏิบัติการครั่งครบวงจร", x: 42, y: 48, kind: "building" },
  { id: 14, name: "แปลงไม้โตเร็ว (ยูคาฯ)", description: "แปลงสาธิตการปลูกไม้โตเร็วเพื่อการใช้ประโยชน์", x: 68, y: 68, kind: "garden" },
  { id: 15, name: "แปลงไม้ผล", description: "แปลงสาธิตการปลูกไม้ผลผสมผสาน มะม่วง มะนาว และกล้วย", x: 62, y: 68, kind: "garden" },
  { id: 16, name: "โรงปุ๋ยหมักอินทรีย์", description: "ศูนย์ผลิตและสาธิตการทำปุ๋ยหมักอินทรีย์", x: 40, y: 72, kind: "utility" },
  { id: 17, name: "อาคารพักรับรอง", description: "อาคารที่พักสำหรับผู้เข้าร่วมอบรมและผู้เยี่ยมชม", x: 58, y: 90, kind: "building" },
  { id: 18, name: "สวนมะขาม", description: "แปลงปลูกและสาธิตการดูแลสวนมะขาม", x: 36, y: 88, kind: "garden" },
  { id: 19, name: "สวนจามจุรี", description: "พื้นที่แปลงปลูกและเลี้ยงครั่งบนต้นจามจุรี", x: 23, y: 35, kind: "garden" },
  { id: 20, name: "สระน้ำ", description: "แหล่งน้ำธรรมชาติเพื่อการเกษตรภายในศูนย์ฯ", x: 47, y: 46, kind: "water" },
  { id: 21, name: "สวนไผ่", description: "แปลงสาธิตการปลูกและขยายพันธุ์ไผ่สายพันธุ์ต่างๆ", x: 23, y: 63, kind: "garden" },
  { id: 22, name: "สวนพะยูง", description: "แปลงอนุรักษ์และปลูกไม้พะยูง", x: 23, y: 50, kind: "garden" },
  { id: 23, name: "สวนกล้วย", description: "แปลงสาธิตการปลูกกล้วยสายพันธุ์ต่างๆ", x: 30, y: 18, kind: "garden" },
  { id: 24, name: "สวนโกโก้", description: "แปลงทดลองและสาธิตการปลูกโกโก้", x: 25, y: 18, kind: "garden" },
  { id: 25, name: "สวนมะม่วงหิมพานต์", description: "แปลงสาธิตการปลูกมะม่วงหิมพานต์", x: 19, y: 18, kind: "garden" },
];

const KIND_LABEL: Record<SiteKind, string> = {
  building: "อาคาร", greenhouse: "โรงเรือน", field: "แปลงเกษตร",
  garden: "พื้นที่สีเขียว", water: "แหล่งน้ำ", security: "ความปลอดภัย", utility: "สาธารณูปโภค",
};
const KIND_COLOR: Record<SiteKind, string> = {
  building: "#8b5e3c", greenhouse: "#4c9a75", field: "#a6a64c",
  garden: "#3d8054", water: "#4b9bb4", security: "#c45b4a", utility: "#8b8d94",
};
const point = (zone: SiteZone) => ({ x: (zone.x - 46) * 0.17, z: (zone.y - 48) * 0.17 });

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 0.84, 7]} /><meshStandardMaterial color="#806044" /></mesh>
      <mesh position={[0, 1.15, 0]} castShadow><sphereGeometry args={[0.62, 10, 8]} /><meshStandardMaterial color="#477d4d" roughness={1} /></mesh>
      <mesh position={[-0.22, 1.48, 0.08]} castShadow><sphereGeometry args={[0.38, 9, 7]} /><meshStandardMaterial color="#5b9259" roughness={1} /></mesh>
    </group>
  );
}

function Building({ zone, active, onSelect }: { zone: SiteZone; active: boolean; onSelect: () => void }) {
  const p = point(zone);
  const greenhouse = zone.kind === "greenhouse";
  const w = zone.id === 13 ? 1.5 : 1.08;
  const d = zone.id === 13 ? 1.2 : 0.9;
  return (
    <group position={[p.x, 0, p.z]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh position={[0, 0.08, 0]} receiveShadow><boxGeometry args={[w + 0.22, 0.16, d + 0.22]} /><meshStandardMaterial color={active ? "#e8b96a" : "#c7bba7"} /></mesh>
      {greenhouse ? (
        <group>
          <mesh position={[0, 0.78, 0]} castShadow><boxGeometry args={[w, 1.35, d]} /><meshPhysicalMaterial color="#a9d6c2" transparent opacity={0.42} roughness={0.2} /></mesh>
          <mesh position={[0, 1.48, 0]}><boxGeometry args={[w + 0.1, 0.09, d + 0.1]} /><meshStandardMaterial color="#647c72" /></mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.58, 0]} castShadow><boxGeometry args={[w, 1.0, d]} /><meshStandardMaterial color={active ? "#f2dfb8" : "#e7e1d5"} roughness={0.86} /></mesh>
          <mesh position={[0, 1.16, 0]} castShadow><coneGeometry args={[Math.max(w, d) * 0.78, 0.56, 4]} /><meshStandardMaterial color={active ? "#9e4939" : "#8f5144"} roughness={0.9} /></mesh>
          <mesh position={[0, 0.48, d / 2 + 0.006]}><planeGeometry args={[0.22, 0.52]} /><meshStandardMaterial color="#607c8b" /></mesh>
        </group>
      )}
      <mesh position={[0, 0.18, d / 2 + 0.35]}><boxGeometry args={[0.42, 0.035, 0.48]} /><meshStandardMaterial color="#b8a68c" /></mesh>
    </group>
  );
}

function SiteMarker({ zone, selected, showLabel, onSelect }: { zone: SiteZone; selected: boolean; showLabel: boolean; onSelect: () => void }) {
  const p = point(zone);
  return (
    <group position={[p.x, zone.kind === "water" ? 0.22 : 0.1, p.z]}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(); }} position={[0, 0.22, 0]}>
        <sphereGeometry args={[selected ? 0.22 : 0.14, 16, 12]} />
        <meshStandardMaterial color={selected ? "#f4b942" : KIND_COLOR[zone.kind]} emissive={selected ? "#f4b942" : "#000000"} emissiveIntensity={selected ? 0.35 : 0} />
      </mesh>
      <Html position={[0, 0.55, 0]} center distanceFactor={13} style={{ pointerEvents: "none" }}>
        <div className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold shadow-md ${selected ? "border-amber-300 bg-amber-400 text-slate-950" : "border-white/80 bg-slate-900/75 text-white"}`}>{zone.id}</div>
      </Html>
    </group>
  );
}

function CampusScene({ selectedId, showLabels, onSelect }: { selectedId: number; showLabels: boolean; onSelect: (id: number) => void }) {
  const treePositions = useMemo(() => Array.from({ length: 72 }, (_, i) => {
    const angle = i * 2.399;
    const radius = 7.3 + (i % 7) * 0.38;
    return [Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius] as [number, number];
  }), []);
  return (
    <>
      <color attach="background" args={["#dce8e4"]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[8, 13, 7]} intensity={2.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Environment preset="park" />
      <group position={[0, -0.2, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[17, 22]} /><meshStandardMaterial color="#b7c8a4" roughness={1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
          <planeGeometry args={[15.4, 20.2]} /><meshStandardMaterial color="#a8bd91" roughness={1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><planeGeometry args={[1.0, 20.1]} /><meshStandardMaterial color="#c9b99e" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}><planeGeometry args={[15.2, 0.8]} /><meshStandardMaterial color="#c9b99e" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0.03, 0.5]}><planeGeometry args={[0.55, 19.4]} /><meshStandardMaterial color="#c9b99e" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.3, 0.03, -0.5]}><planeGeometry args={[0.55, 19.4]} /><meshStandardMaterial color="#c9b99e" /></mesh>
        <mesh position={[point(SITE_ZONES[19]).x, 0.1, point(SITE_ZONES[19]).z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 48]} /><meshStandardMaterial color="#62a6bd" roughness={0.22} metalness={0.1} />
        </mesh>
        {treePositions.map(([x, z], i) => <Tree key={i} x={x} z={z} scale={0.72 + (i % 4) * 0.12} />)}
        {SITE_ZONES.filter(z => ["building", "greenhouse", "utility", "security"].includes(z.kind)).map(zone =>
          <Building key={zone.id} zone={zone} active={selectedId === zone.id} onSelect={() => onSelect(zone.id)} />
        )}
        {SITE_ZONES.filter(z => z.kind === "field").map(zone => {
          const p = point(zone);
          return <group key={zone.id} position={[p.x, 0.06, p.z]}>
            {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(i - 2) * 0.18, 0.13, 0]}><boxGeometry args={[0.07, 0.26, 0.78]} /><meshStandardMaterial color="#658d48" /></mesh>)}
            <mesh position={[0, 0.02, 0]}><boxGeometry args={[1.1, 0.06, 1.05]} /><meshStandardMaterial color="#8b795b" /></mesh>
          </group>;
        })}
        {SITE_ZONES.filter(z => z.kind === "garden").map((zone, i) => {
          const p = point(zone);
          return <group key={zone.id} position={[p.x, 0, p.z]}>
            {Array.from({ length: 5 }, (_, j) => <Tree key={j} x={(j % 3 - 1) * 0.42} z={(Math.floor(j / 3) - 0.5) * 0.58} scale={0.52 + (i % 3) * 0.08} />)}
          </group>;
        })}
        {SITE_ZONES.map(zone => <SiteMarker key={zone.id} zone={zone} selected={selectedId === zone.id} showLabel={showLabels} onSelect={() => onSelect(zone.id)} />)}
      </group>
      <ContactShadows position={[0, -0.18, 0]} opacity={0.28} scale={22} blur={2.5} far={8} />
      <OrbitControls makeDefault minDistance={8} maxDistance={24} maxPolarAngle={Math.PI / 2.08} minPolarAngle={0.25} enableDamping dampingFactor={0.08} />
    </>
  );
}

export function CampusDigitalTwinPage() {
  const [selectedId, setSelectedId] = useState(13);
  const [filter, setFilter] = useState<SiteKind | "all">("all");
  const [query, setQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const selected = SITE_ZONES.find(z => z.id === selectedId) ?? SITE_ZONES[12];
  const filtered = SITE_ZONES.filter(z => (filter === "all" || z.kind === filter) && (z.name.includes(query) || z.description.includes(query)));
  const stats = [
    { label: "จุดสำรวจ", value: "25", icon: MapPin },
    { label: "อาคารและโรงเรือน", value: "8", icon: Building2 },
    { label: "พื้นที่สีเขียว", value: "8", icon: Trees },
    { label: "พื้นที่เกษตร", value: "2", icon: Sprout },
  ];
  return (
    <div className="min-h-screen bg-[#edf2ee] text-slate-900">
      <AppNavbar />
      <main className="mx-auto max-w-[1800px] px-3 py-4 sm:px-5 lg:px-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/knowledge" className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"><ArrowLeft size={14} /> กลับคลังความรู้ครั่ง</Link>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-emerald-800"><span className="rounded-full bg-emerald-100 px-3 py-1">DIGITAL TWIN · PHASE 1</span><span className="text-slate-500">WHOLE-SITE CONCEPT</span></div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Mahidol Lampang Integrated Digital Center</h1>
            <p className="mt-1 text-sm text-slate-600">โมเดลสามมิติจำลองพื้นที่ศูนย์เรียนรู้และพื้นที่ปฏิบัติการ อ.สบปราบ จ.ลำปาง</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"><span className="h-2 w-2 rounded-full bg-amber-400" /> SIMULATION MODE · HYBRID READY</div>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-800"><Icon size={17} /></span><span><strong className="block text-lg leading-5">{value}</strong><span className="text-[11px] text-slate-500">{label}</span></span></div>)}
        </div>
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-slate-300 bg-[#dce8e4] shadow-sm sm:min-h-[660px]">
            <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"><Compass size={15} className="text-emerald-800" /> มุมมองพื้นที่ 3 มิติ · ลากเพื่อหมุน / scroll เพื่อซูม</div>
            <button onClick={() => setShowLabels(v => !v)} className="absolute right-3 top-3 z-10 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">{showLabels ? "ซ่อนป้ายชื่อ" : "แสดงป้ายชื่อ"}</button>
            <Canvas shadows camera={{ position: [13, 15, 17], fov: 40 }}>
              <CampusScene selectedId={selectedId} showLabels={showLabels} onSelect={setSelectedId} />
            </Canvas>
            <div className="absolute bottom-3 left-3 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[10px] text-slate-600 shadow-sm">ต้นแบบเชิงแนวคิด · ตำแหน่งและมิติอาคารยังไม่ใช่แบบสำรวจจริง</div>
            <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-2 rounded-xl border border-white/80 bg-white/90 p-2 shadow-sm">
              {(["building","greenhouse","field","garden","water","security"] as SiteKind[]).map(k => <span key={k} className="flex items-center gap-1 text-[9px] text-slate-600"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: KIND_COLOR[k] }} />{KIND_LABEL[k]}</span>)}
            </div>
          </section>
          <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center justify-between"><h2 className="font-bold">สำรวจพื้นที่ศูนย์ฯ</h2><span className="text-xs text-slate-500">{filtered.length} / 25 จุด</span></div>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"><Search size={15} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาพื้นที่..." className="w-full bg-transparent text-xs outline-none" />{query && <button onClick={() => setQuery("")}><X size={14} /></button>}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {([{id:"all",label:"ทั้งหมด"},{id:"building",label:"อาคาร"},{id:"greenhouse",label:"โรงเรือน"},{id:"field",label:"แปลงเกษตร"},{id:"garden",label:"สวน"},{id:"water",label:"แหล่งน้ำ"},{id:"security",label:"ความปลอดภัย"},{id:"utility",label:"สาธารณูปโภค"}] as const).map(item => <button key={item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${filter === item.id ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>)}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {filtered.map(zone => <button key={zone.id} onClick={() => setSelectedId(zone.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${selectedId === zone.id ? "bg-emerald-50 ring-1 ring-emerald-200" : "hover:bg-slate-50"}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: KIND_COLOR[zone.kind] }}>{zone.id.toString().padStart(2,"0")}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-xs">{zone.name}</strong><span className="mt-0.5 block truncate text-[10px] text-slate-500">{KIND_LABEL[zone.kind]}</span></span>
                <ChevronRight size={15} className="text-slate-400" />
              </button>)}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800"><MapPin size={13} /> Selected location · {selected.id.toString().padStart(2,"0")}</div>
              <h3 className="mt-2 text-base font-bold">{selected.name}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{selected.description}</p>
              <div className="mt-3 flex items-center justify-between"><span className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: KIND_COLOR[selected.kind] }}>{KIND_LABEL[selected.kind]}</span><span className="text-[10px] text-slate-400">Concept coordinates</span></div>
            </div>
          </aside>
        </div>
        <section className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={17} className="text-emerald-700" /> Facility & Safety</div><p className="mt-2 text-xs leading-5 text-slate-500">เตรียมเชื่อมสถานะอาคาร รายการตรวจสอบ ความเสี่ยง และงานแก้ไขจากระบบ Facility-Safety</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-sm font-bold"><Sprout size={17} className="text-emerald-700" /> Smart Farm & IoT</div><p className="mt-2 text-xs leading-5 text-slate-500">เตรียมเชื่อม Sensor, V-NET2.0, สภาพแวดล้อม และข้อมูลแปลงเกษตร</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-sm font-bold"><Waves size={17} className="text-emerald-700" /> Environment & Utilities</div><p className="mt-2 text-xs leading-5 text-slate-500">เตรียมเชื่อมข้อมูลน้ำ พลังงาน คุณภาพอากาศ และระบบสาธารณูปโภค</p></div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
