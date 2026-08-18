import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <div>
        {/* 1. Header Banner / Hero Section */}
        <header
          className="relative bg-cover bg-center bg-no-repeat text-white py-20 px-4 text-center overflow-hidden"
          style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
        >
          <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-[1px]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur-sm">
              โครงการห้องการเรียนรู้ครั่งครบวงจร
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              ศูนย์เรียนรู้และองค์ความรู้ "ครั่ง"
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto font-light drop-shadow">
              คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/survey"
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                📝 ทำแบบประเมินความพึงพอใจ
              </Link>
              <Link
                to="/dashboard"
                className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl border border-emerald-500/40 backdrop-blur-sm transition-all active:scale-95"
              >
                📊 ดูสรุปผล Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* 2. ส่วนวิดีโอแนะนำห้องเรียนรู้ครั่ง (HTML5 Video จาก public) */}
        <section className="bg-white dark:bg-slate-800/50 py-12 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                🎬 วิดีโอแนะนำห้องการเรียนรู้ครั่ง
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                รับชมวิดีโอแนะนำศูนย์เรียนรู้และกิจกรรมการเรียนรู้ครั่งครบวงจร
              </p>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 bg-black">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
              >
                <source src="/intro-lac.mp4" type="video/mp4" />
                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
              </video>
            </div>
          </div>
        </section>

        {/* 3. ส่วน Data Visualization */}
        <LacDataVisualization />

        {/* 4. ส่วนความรู้เกี่ยวกับครั่ง (Shellac Knowledge) */}
        <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
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
                นำไปแปรรูปเป็น Shellac ใช้ในอุตสาหกรรมเคลือบเงาไม้ สารเคลือบผิวผลไม้ เคลือบยาเม็ด เคลือบลูกอม และอุตสาหกรรมสี
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
        </main>
      </div>

      {/* 5. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800 mt-12">
        <p>© 2026 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
      </footer>
    </div>
  );
}

{/* Component Data Visualization */}
function LacDataVisualization() {
  const [activeTab, setActiveTab] = useState<"farmers" | "efficiency">("farmers");

  const compositions = [
    { name: "ชัน/เรซิน (Resin)", percent: "68-90%", value: 80, color: "bg-emerald-600" },
    { name: "สีสกัด (Dye)", percent: "2-10%", value: 10, color: "bg-rose-500" },
    { name: "ขี้ผึ้ง (Wax)", percent: "5-6%", value: 6, color: "bg-amber-500" },
    { name: "แร่ธาตุ (Mineral)", percent: "3-7%", value: 5, color: "bg-sky-500" },
    { name: "น้ำ (Water)", percent: "2-3%", value: 3, color: "bg-slate-400" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          📊 สถิติและข้อมูลการผลิตครั่ง จ.ลำปาง
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          ข้อมูลเชิงสถิติ นิเวศวิทยา และศักยภาพการผลิตครั่งในพื้นที่
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            ศูนย์กลางการผลิตใหญ่ที่สุด
          </p>
          <h3 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mt-1">
            อ.งาว (บ้านบ่อสี่เหลี่ยม)
          </h3>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3">
            300,000 <span className="text-base font-normal text-slate-600 dark:text-slate-400">กก./ปี</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            สร้างรายได้เฉลี่ย 4.5 แสนบาท/ครอบครัว/ปี
          </p>
        </div>

        <div className="bg-sky-50 dark:bg-sky-950/40 p-6 rounded-2xl border border-sky-200 dark:border-sky-800 shadow-sm">
          <p className="text-xs font-semibold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
            ประสิทธิภาพการผลิตสูงสุด
          </p>
          <h3 className="text-2xl font-bold text-sky-950 dark:text-sky-100 mt-1">
            อ.สบปราบ
          </h3>
          <p className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-3">
            อันดับ 1
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            วัดจากผลผลิตที่ได้ต่อกิโลกรัมพันธุ์ (ตามด้วย อ.เสริมงาม, อ.ห้างฉัตร)
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            พืชอาศัยยอดนิยม
          </p>
          <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
            ต้นจามจุรี (ก้ามปู)
          </h3>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-3">
            Top 1
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            เรือนยอดโปร่ง แตกกิ่งเร็ว เหมาะกับการเลี้ยงครั่งมากที่สุด
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              📍 อันดับพื้นที่การผลิต จ.ลำปาง
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab("farmers")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "farmers"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                ผู้เลี้ยงมากสุด
              </button>
              <button
                onClick={() => setActiveTab("efficiency")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "efficiency"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                ประสิทธิภาพสูงสุด
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {activeTab === "farmers" ? (
              <>
                <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-slate-700/50 rounded-xl border border-emerald-100 dark:border-slate-600">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">🥇 อันดับ 1: อ.วังเหนือ</span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full font-semibold">เกษตรกรมากที่สุด</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥈 อันดับ 2: อ.แจ้ห่ม</span>
                  <span className="text-xs text-slate-500">ยุทธศาสตร์การผลิต</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥉 อันดับ 3: อ.เมืองปาน</span>
                  <span className="text-xs text-slate-500">ยุทธศาสตร์การผลิต</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-sky-50/50 dark:bg-slate-700/50 rounded-xl border border-sky-100 dark:border-slate-600">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">🥇 อันดับ 1: อ.สบปราบ</span>
                  <span className="text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-2.5 py-1 rounded-full font-semibold">ผลผลิต/กก.พันธุ์ สูงสุด</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥈 อันดับ 2: อ.เสริมงาม</span>
                  <span className="text-xs text-slate-500">อัตราการรอดสูง</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥉 อันดับ 3: อ.ห้างฉัตร</span>
                  <span className="text-xs text-slate-500">อัตราการรอดสูง</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              🧪 สัดส่วนองค์ประกอบของครั่งดิบ (Sticklac)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              สัดส่วนสารธรรมชาติที่สกัดได้จากรังครั่ง
            </p>
          </div>

          <div className="space-y-4">
            {compositions.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>{item.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.percent}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
