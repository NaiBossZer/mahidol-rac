import { useState } from "react";
import { ZONES, Zone } from "../data/zones";

export function InteractiveMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
          แผนผังกิจกรรม ศูนย์ฯ อ.สบปราบ จ.ลำปาง
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          คลิกเลือกหมายเลขบนแผนที่เพื่อดูรายละเอียดกิจกรรม
        </p>
      </div>

      {/* กรอบรูปภาพแผนที่และหมุดกด */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <img
          src="/map-sobprab.jpg" /* ⚠️ ปรับชื่อไฟล์ให้ตรงกับรูปในโฟลเดอร์ public */
          alt="แผนผังศูนย์ฯ สบปราบ"
          className="w-full h-auto block"
        />

        {/* ปุ่มหมุดหมายเลข 1-25 */}
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all hover:scale-125 cursor-pointer z-10"
          >
            {zone.id}
          </button>
        ))}
      </div>

      {/* Pop-up แสดงรายละเอียดเมื่อกดเลือกโซน */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedZone.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedZone.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedZone.description}
            </p>

            <button
              onClick={() => setSelectedZone(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
