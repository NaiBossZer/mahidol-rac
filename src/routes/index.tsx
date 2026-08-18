import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// ⚠️ ใช้ URL Google Script ของคุณ
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXq8rPQ/exec";

export function HomePage() {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      
      {/* 1. Header Banner / Hero Section */}
      <header className="bg-gradient-to-b from-emerald-800 to-emerald-600 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
            โครงการห้องการเรียนรู้ครั่งครบวงจร
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            ศูนย์เรียนรู้และองค์ความรู้ "ครั่ง"
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto font-light">
            คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/survey"
              className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              📝 ทำแบบประเมินความพึงพอใจ
            </Link>
            <a
              href="#dashboard"
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl border border-emerald-500/40 transition-all"
            >
              📊 ดูสรุปผล Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* 2. ส่วนความรู้เกี่ยวกับครั่ง (Shellac Knowledge) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-400">
              องค์ความรู้เกี่ยวกับครั่ง (Lac & Shellac)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              ทรัพยากรธรรมชาติที่มีคุณค่าทางเศรษฐกิจและการอนุรักษ์สิ่งแวดล้อมอย่างยั่งยืน
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center text-xl font-bold">
                🌱
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">ครั่งคืออะไร?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ยางธรรมชาติที่ขับออกมาจากแมลงครั่ง (Laccifer lacca) ซึ่งอาศัยอยู่ตามกิ่งไม้ของต้นไม้โฮสต์ เช่น ต้นก้ามปู (จามจุรี) และต้นพะยูง
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center text-xl font-bold">
                🏭
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">การนำไปใช้ประโยชน์</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                นำไปแปรรูปเป็น Shellac ใช้ในอุตสาหกรรมเคลือบเงาไม้ สารสารเคลือบผิวผลไม้ เคลือบยาเม็ด เคลือบลูกอม และอุตสาหกรรมสี
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center text-xl font-bold">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">ห้องเรียนรู้ครั่งครบวงจร</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                แหล่งถ่ายทอดเทคโนโลยีและการส่งเสริมการเลี้ยงครั่งอย่างมีมาตรฐาน เพื่อสร้างอาชีพและรายได้ที่ยั่งยืนให้แก่ชุมชน อ.สบปราบ
              </p>
            </div>
          </div>
        </section>

        {/* 3. ส่วน Dashboard สรุปผลประเมิน (Survey Dashboard Section) */}
        <section id="dashboard" className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-sm">
            <div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Real-time Data
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                สรุปผลการตอบแบบประเมินพิธีเปิด
              </h2>
            </div>
            <div className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-lg shadow-sm">
              ผู้ตอบแบบประเมิน: {data.length} คน
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
              กำลังโหลดข้อมูลสรุปผล...
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
              ยังไม่มีข้อมูลการตอบแบบประเมิน
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white text-sm">
                ข้อเสนอแนะและความคิดเห็นล่าสุดจากผู้เข้าร่วมงาน
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
                {data.slice().reverse().map((row, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors space-y-1">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{row["หน่วยงานที่สังกัด"] || "ทั่วไป"} ({row["ช่วงอายุ"] || "-"})</span>
                      <span>{new Date(row["Timestamp"]).toLocaleDateString("th-TH")}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {row["ข้อเสนอแนะเพิ่มเติม"] ? `"${row["ข้อเสนอแนะเพิ่มเติม"]}"` : "ไม่มีข้อเสนอแนะเพิ่มเติม"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>© 2026 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
      </footer>

    </div>
  );
}
