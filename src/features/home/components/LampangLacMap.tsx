import { useEffect, useRef } from "react";

const districts = [
  { no: "01", name: "วังเหนือ", note: "พื้นที่ข้อมูลครั่ง", lat: 19.1442, lng: 99.6387 },
  { no: "02", name: "แจ้ห่ม", note: "พื้นที่ข้อมูลครั่ง", lat: 18.7453, lng: 99.6571 },
  { no: "03", name: "เมืองปาน", note: "พื้นที่ข้อมูลครั่ง", lat: 18.7909, lng: 99.4541 },
  { no: "04", name: "งาว", note: "พื้นที่ข้อมูลครั่ง", lat: 18.7595, lng: 99.9530 },
  { no: "05", name: "สบปราบ", note: "พื้นที่ข้อมูลครั่ง", lat: 17.8986, lng: 99.3408 },
  { no: "06", name: "เสริมงาม", note: "พื้นที่ข้อมูลครั่ง", lat: 18.0941, lng: 99.1730 },
  { no: "07", name: "ห้างฉัตร", note: "พื้นที่ข้อมูลครั่ง", lat: 18.3431, lng: 99.2755 },
] as const;

declare global { interface Window { L?: any } }

export function LampangLacMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any; let cancelled = false;
    const loadLeaflet = async () => {
      if (!document.querySelector('link[data-lac-leaflet="true"]')) { const link = document.createElement("link"); link.rel = "stylesheet"; link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; link.dataset.lacLeaflet = "true"; document.head.appendChild(link); }
      if (!window.L) await new Promise<void>((resolve, reject) => { const script = document.createElement("script"); script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.async = true; script.onload = () => resolve(); script.onerror = () => reject(new Error("Leaflet failed to load")); document.head.appendChild(script); });
      if (cancelled || !mapRef.current || !window.L) return;
      map = window.L.map(mapRef.current, { scrollWheelZoom: false }).setView([18.42, 99.52], 8.5);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 18 }).addTo(map);
      districts.forEach((district) => { const marker = window.L.circleMarker([district.lat, district.lng], { radius: 8, color: "#8f3328", weight: 2, fillColor: "#c58a3a", fillOpacity: 0.95 }).addTo(map); marker.bindPopup(`<strong>อ.${district.name}</strong><br/>${district.note}`); });
      map.fitBounds(districts.map((d) => [d.lat, d.lng]), { padding: [28, 28] });
    };
    loadLeaflet().catch(() => { if (mapRef.current) mapRef.current.innerHTML = '<div class="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">ไม่สามารถโหลดแผนที่ออนไลน์ได้ กรุณาดูรายการพื้นที่ด้านล่าง</div>'; });
    return () => { cancelled = true; if (map) map.remove(); };
  }, []);

  return (
    <section id="lampang-map" className="scroll-mt-24 bg-[#f3eadb] px-4 py-14 sm:py-20" aria-labelledby="lampang-map-title">
      <div className="mx-auto max-w-6xl"><div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10">
        <div><p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-rac-lac sm:text-[10px] sm:tracking-[0.2em]">05 — LAMPANG LAC MAP</p><h2 id="lampang-map-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">ครั่งกับพื้นที่ลำปาง</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">เชื่อมโยงองค์ความรู้เรื่องครั่งกับพื้นที่ที่มีข้อมูลในศูนย์เรียนรู้ เพื่อมองเห็นบริบทของเกษตรกรและเครือข่ายการผลิตในจังหวัดลำปาง</p><div className="mt-5 rounded-2xl border border-rac-lac/15 bg-white/70 p-4 text-sm leading-6 text-slate-600 sm:mt-6"><span className="font-semibold text-slate-900">MARKS:</span> จุดแสดงตำแหน่งระดับอำเภอของพื้นที่ที่ระบุในข้อมูลเนื้อหาของศูนย์</div></div>
        <div className="overflow-hidden rounded-[2rem] border border-[#6f3d2e]/15 bg-white p-3 shadow-sm sm:p-5"><div ref={mapRef} className="h-[360px] w-full overflow-hidden rounded-[1.5rem] bg-[#efe1cc] sm:h-[430px]" aria-label="แผนที่จังหวัดลำปางพร้อมตำแหน่งพื้นที่ข้อมูลครั่ง" /><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{districts.map((district) => <div key={district.no} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#6f3d2e]/10 bg-[#fffaf1] p-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rac-lac text-[10px] font-bold text-white">{district.no}</span><span className="truncate text-xs font-semibold text-slate-800">อ.{district.name}</span></div>)}</div></div>
      </div></div>
    </section>
  );
}
