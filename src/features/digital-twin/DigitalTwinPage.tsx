import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  Leaf,
  LoaderCircle,
  MapPin,
  Move3D,
  RotateCcw,
  Settings,
  Sprout,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { LEARNING_ZONES, type LearningZone, type ZoneIcon } from "./data/zones";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface ModelViewerElement extends HTMLElement {
  loaded?: boolean;
  getDimensions?: () => Vector3;
  getBoundingBoxCenter?: () => Vector3;
  jumpCameraToGoal?: () => void;
  resetTurntableRotation?: () => void;
}

const ICONS: Record<ZoneIcon, LucideIcon> = {
  book: BookOpen,
  bug: Bug,
  sprout: Sprout,
  settings: Settings,
  flask: FlaskConical,
  users: Users,
  leaf: Leaf,
};

const DEFAULT_CENTER: Vector3 = { x: 0, y: 0, z: 0 };
const DEFAULT_DIMENSIONS: Vector3 = { x: 2, y: 2, z: 2 };

function formatVector(value: Vector3) {
  return [value.x, value.y, value.z].map((part) => Number(part.toFixed(3))).join(" ");
}

function calculateHotspot(zone: LearningZone, center: Vector3, dimensions: Vector3): Vector3 {
  return {
    x: center.x + zone.modelPosition.x * dimensions.x,
    y: center.y + zone.modelPosition.height * dimensions.y,
    z: center.z + zone.modelPosition.z * dimensions.z,
  };
}

function buildHotspotMap(center: Vector3, dimensions: Vector3) {
  return Object.fromEntries(
    LEARNING_ZONES.map((zone) => [zone.id, calculateHotspot(zone, center, dimensions)]),
  ) as Record<string, Vector3>;
}

export function DigitalTwinPage() {
  const [activeZoneId, setActiveZoneId] = useState(LEARNING_ZONES[0].id);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [positionStatus, setPositionStatus] = useState<"waiting" | "calculated" | "fallback">(
    "waiting",
  );
  const [completedZoneIds, setCompletedZoneIds] = useState<string[]>([]);
  const [hotspotPositions, setHotspotPositions] = useState<Record<string, Vector3>>(() =>
    buildHotspotMap(DEFAULT_CENTER, DEFAULT_DIMENSIONS),
  );

  const activeIndex = Math.max(
    0,
    LEARNING_ZONES.findIndex((zone) => zone.id === activeZoneId),
  );
  const activeZone = LEARNING_ZONES[activeIndex] ?? LEARNING_ZONES[0];
  const ActiveIcon = ICONS[activeZone.icon];
  const completedCount = completedZoneIds.length;
  const progress = Math.round((completedCount / LEARNING_ZONES.length) * 100);

  useEffect(() => {
    let cancelled = false;
    let model: ModelViewerElement | null = null;
    let attachListeners: (() => void) | undefined;

    const markLoaded = () => {
      if (cancelled || !model) return;
      setModelReady(true);
      setModelError(false);

      try {
        const dimensions = model.getDimensions?.();
        const center = model.getBoundingBoxCenter?.();
        if (
          dimensions &&
          center &&
          Number.isFinite(dimensions.x) &&
          Number.isFinite(dimensions.y) &&
          Number.isFinite(dimensions.z) &&
          dimensions.x > 0 &&
          dimensions.y > 0 &&
          dimensions.z > 0
        ) {
          setHotspotPositions(buildHotspotMap(center, dimensions));
          setPositionStatus("calculated");
          return;
        }
      } catch (error) {
        console.warn("Digital Twin: unable to inspect the model bounds.", error);
      }

      setHotspotPositions(buildHotspotMap(DEFAULT_CENTER, DEFAULT_DIMENSIONS));
      setPositionStatus("fallback");
    };

    const markError = () => {
      if (!cancelled) {
        setModelError(true);
        setModelReady(false);
      }
    };

    const attach = () => {
      if (cancelled) return;
      model = document.getElementById("digital-twin-model") as ModelViewerElement | null;
      if (!model) {
        markError();
        return;
      }
      model.addEventListener("load", markLoaded);
      model.addEventListener("error", markError);
      attachListeners = () => {
        model?.removeEventListener("load", markLoaded);
        model?.removeEventListener("error", markError);
      };
      if (model.loaded) markLoaded();
    };

    const scriptSelector = 'script[src*="model-viewer"]';
    let script = document.querySelector<HTMLScriptElement>(scriptSelector);
    if (!script) {
      script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      script.onerror = markError;
      document.head.appendChild(script);
    }

    customElements.whenDefined("model-viewer").then(attach).catch(markError);

    return () => {
      cancelled = true;
      attachListeners?.();
      if (script) script.onerror = null;
    };
  }, []);

  const focusZone = (zone: LearningZone) => {
    setActiveZoneId(zone.id);
    const model = document.getElementById("digital-twin-model") as ModelViewerElement | null;
    const position = hotspotPositions[zone.id];
    if (model && position) {
      model.setAttribute("camera-target", formatVector(position));
      model.jumpCameraToGoal?.();
    }
  };

  const resetView = () => {
    const model = document.getElementById("digital-twin-model") as ModelViewerElement | null;
    if (!model) return;
    model.setAttribute("camera-target", "auto auto auto");
    model.setAttribute("camera-orbit", "auto auto auto");
    model.resetTurntableRotation?.();
    model.jumpCameraToGoal?.();
  };

  const markZoneComplete = () => {
    setCompletedZoneIds((current) =>
      current.includes(activeZone.id) ? current : [...current, activeZone.id],
    );
    const nextZone = LEARNING_ZONES[activeIndex + 1];
    if (nextZone) focusZone(nextZone);
  };

  const viewerStatus = modelError
    ? "ไม่สามารถโหลดโมเดลได้"
    : !modelReady
      ? "กำลังโหลดโมเดล 3 มิติ…"
      : positionStatus === "calculated"
        ? "อ่านขอบเขตโมเดลแล้ว · ตรวจตำแหน่งโซนกับพื้นที่จริงก่อนใช้งาน"
        : "ใช้ตำแหน่งสำรอง · ต้องตรวจสอบตำแหน่งโซน";

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#073D32] text-white shadow-lg">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              aria-label="กลับหน้าแรก"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <ArrowLeft size={19} />
            </Link>
            <img
              src="/mahidol-logo.png"
              alt="Mahidol University"
              className="hidden h-10 w-10 rounded-lg bg-white p-1 object-contain sm:block"
            />
            <div className="min-w-0">
              <div className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 sm:text-xs">
                Mahidol Lampang · Digital Twin
              </div>
              <h1 className="truncate text-base font-bold sm:text-xl">
                ห้องการเรียนรู้ครั่งครบวงจร
              </h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-emerald-100 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.12)]" />
            สำรวจพื้นที่เรียนรู้
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-5 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="rounded-full bg-emerald-100 px-3 py-1">DIGITAL TWIN PREVIEW</span>
              <span className="text-slate-500">6 โซนการเรียนรู้</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              สำรวจห้องเรียนรู้ในรูปแบบ 3 มิติ
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              เลือกจุดบนโมเดลหรือการ์ดโซน เพื่อสำรวจเนื้อหาและเดินทางไปยังโซนถัดไปตามลำดับ
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
            <Move3D size={17} aria-hidden="true" className="text-emerald-700" />
            <span>ลากเพื่อหมุน · ล้อเมาส์เพื่อซูม · ใช้สองนิ้วบนมือถือ</span>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.9fr)]">
          <div className="min-w-0 overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div>
                <p className="text-sm font-bold text-slate-800">แผนผังห้องเรียนรู้ 3 มิติ</p>
                <p className="mt-0.5 text-xs text-slate-500">โมเดลห้องจริงจากไฟล์ GLB ของโครงการ</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoRotate((value) => !value)}
                  aria-pressed={autoRotate}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {autoRotate ? "หยุดหมุนอัตโนมัติ" : "หมุนอัตโนมัติ"}
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  aria-label="รีเซ็ตมุมมอง"
                  title="รีเซ็ตมุมมอง"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-[430px] bg-gradient-to-br from-slate-50 via-[#edf5f0] to-[#dfece4] sm:h-[550px] xl:h-[640px]">
              <model-viewer
                id="digital-twin-model"
                src="/rac-room3d.glb"
                alt="โมเดลสามมิติของห้องการเรียนรู้ครั่งครบวงจร"
                camera-controls
                touch-action="pan-y"
                shadow-intensity="1"
                exposure="1"
                interaction-prompt="auto"
                camera-orbit="auto auto auto"
                camera-target="auto auto auto"
                auto-rotate={autoRotate ? "" : undefined}
                style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
              >
                {LEARNING_ZONES.map((zone) => {
                  const position = hotspotPositions[zone.id];
                  const ZoneIconComponent = ICONS[zone.icon];
                  return (
                    <button
                      key={zone.id}
                      slot={"hotspot-" + zone.id}
                      data-position={position ? formatVector(position) : "0 0 0"}
                      data-normal="0 1 0"
                      type="button"
                      onClick={() => focusZone(zone)}
                      aria-label={"เลือกโซน " + zone.number + ": " + zone.title}
                      aria-pressed={activeZone.id === zone.id}
                      className="group flex max-w-[190px] items-center gap-2 rounded-full border-2 px-2.5 py-2 text-left text-xs font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/80 sm:px-3"
                      style={{
                        backgroundColor: zone.color,
                        borderColor: activeZone.id === zone.id ? "#FFFFFF" : zone.color,
                        boxShadow:
                          activeZone.id === zone.id
                            ? "0 0 0 3px " + zone.color + "66, 0 8px 22px #0f172a30"
                            : "0 5px 16px #0f172a30",
                      }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                        <ZoneIconComponent size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[9px] font-medium opacity-85">
                          โซน {zone.number}
                        </span>
                        <span className="block truncate">{zone.shortTitle}</span>
                      </span>
                    </button>
                  );
                })}
              </model-viewer>

              {!modelReady && !modelError && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur">
                    <LoaderCircle size={18} className="animate-spin text-emerald-700" />
                    กำลังเตรียมห้องเรียนรู้ 3 มิติ
                  </div>
                </div>
              )}

              {modelError && (
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-white/95 p-6 text-center shadow-lg">
                  <MapPin size={30} className="text-amber-700" />
                  <h3 className="mt-3 text-base font-bold">ไม่สามารถโหลดโมเดล 3 มิติได้</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    ตรวจสอบว่าไฟล์ /rac-room3d.glb อยู่ในโฟลเดอร์ public และสามารถเข้าถึงได้จากเว็บ
                    แล้วลองโหลดหน้านี้ใหม่
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    ลองอีกครั้ง
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span className="flex items-center gap-2">
                <span
                  className={
                    modelReady
                      ? "h-2 w-2 rounded-full bg-emerald-500"
                      : modelError
                        ? "h-2 w-2 rounded-full bg-red-500"
                        : "h-2 w-2 animate-pulse rounded-full bg-amber-500"
                  }
                />
                {viewerStatus}
              </span>
              <span>ตำแหน่ง Hotspot เป็นค่าเริ่มต้นและต้องปรับเทียบกับแผนผังจริง</span>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
            <div className="h-1.5" style={{ backgroundColor: activeZone.color }} />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ color: activeZone.color, backgroundColor: activeZone.color + "18" }}
                >
                  <ActiveIcon size={25} />
                </div>
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-bold"
                  style={{ color: activeZone.color, backgroundColor: activeZone.color + "18" }}
                >
                  โซน {activeZone.number} / {LEARNING_ZONES.length}
                </span>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">
                {activeZone.englishTitle}
              </p>
              <h3 className="mt-1 text-2xl font-bold leading-tight text-slate-900">
                {activeZone.title}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {activeZone.subtitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{activeZone.description}</p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock3 size={15} />
                เวลาเรียนรู้แนะนำ {activeZone.estimatedMinutes} นาที
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CheckCircle2 size={17} className="text-emerald-700" />
                  สิ่งที่ได้เรียนรู้
                </h4>
                <ul className="mt-3 space-y-3">
                  {activeZone.learningOutcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>ความคืบหน้าเส้นทางเรียนรู้</span>
                  <span>
                    {completedCount}/{LEARNING_ZONES.length} โซน
                  </span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={LEARNING_ZONES.length}
                  aria-valuenow={completedCount}
                  aria-label="ความคืบหน้าเส้นทางเรียนรู้"
                >
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: progress + "%" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={markZoneComplete}
                  disabled={completedZoneIds.length === LEARNING_ZONES.length}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08664F] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#07533F] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-default disabled:bg-emerald-800"
                >
                  {completedZoneIds.length === LEARNING_ZONES.length
                    ? "เรียนรู้ครบทุกโซนแล้ว"
                    : activeIndex < LEARNING_ZONES.length - 1
                      ? "เรียนรู้แล้ว · ไปโซนถัดไป"
                      : "จบเส้นทางการเรียนรู้"}
                  <ArrowRight size={17} />
                </button>
                <p className="mt-2 text-center text-[11px] leading-5 text-slate-400">
                  ความคืบหน้าจะอยู่ในเซสชันนี้และยังไม่บันทึกลงฐานข้อมูล
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section aria-labelledby="zone-list-title" className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                Choose your learning zone
              </p>
              <h2 id="zone-list-title" className="text-xl font-bold text-slate-900">
                เลือกโซนการเรียนรู้
              </h2>
            </div>
            <p className="text-xs text-slate-500">เลือกโซนได้โดยตรง หรือสำรวจตามลำดับ 1–6</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_ZONES.map((zone) => {
              const ZoneIconComponent = ICONS[zone.icon];
              const isActive = activeZone.id === zone.id;
              const isCompleted = completedZoneIds.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => focusZone(zone)}
                  aria-pressed={isActive}
                  className="group flex min-w-0 items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  style={{
                    borderColor: isActive ? zone.color : "#E2E8F0",
                    boxShadow: isActive ? "0 0 0 1px " + zone.color + "33" : undefined,
                  }}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ color: zone.color, backgroundColor: zone.color + "18" }}
                  >
                    <ZoneIconComponent size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      ZONE {String(zone.number).padStart(2, "0")}
                      {isCompleted && <CheckCircle2 size={13} className="text-emerald-600" />}
                    </span>
                    <span className="mt-1 block text-sm font-bold leading-5 text-slate-900">
                      {zone.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {zone.subtitle}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
                  />
                </button>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-slate-200 py-4 text-[11px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Mahidol Lampang · ห้องการเรียนรู้ครั่งครบวงจร</span>
          <span>Digital Twin MVP · Phase 0–3 · ไม่ส่งข้อมูลการใช้งานออกจากอุปกรณ์</span>
        </footer>
      </main>
    </div>
  );
}
