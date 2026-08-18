import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

// ⚠️ ใช้ URL Google Script ของคุณ
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXq8rPQ/exec";

export function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?action=read`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <Link to="/" className="text-xs font-semibold text-emerald-600 hover:underline">
              ← กลับหน้าหลักองค์ความรู้ครั่ง
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              📊 สรุปผลการตอบแบบประเมิน (Dashboard)
            </h1>
          </div>
          <div className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-lg shadow-sm">
            ผู้ตอบแบบประเมิน: {data.length} คน
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
            กำลังดึงข้อมูล Real-time จาก Google Sheets...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
            ยังไม่มีข้อมูลการตอบแบบประเมิน
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white text-sm">
              รายการความคิดเห็นและข้อเสนอแนะล่าสุด
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {data.slice().reverse().map((row, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      {row["หน่วยงานที่สังกัด"] || "ทั่วไป"} ({row["ช่วงอายุ"] || "-"})
                    </span>
                    <span>{new Date(row["Timestamp"]).toLocaleString("th-TH")}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                    {row["ข้อเสนอแนะเพิ่มเติม"] ? `"${row["ข้อเสนอแนะเพิ่มเติม"]}"` : "ไม่มีข้อเสนอแนะเพิ่มเติม"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
