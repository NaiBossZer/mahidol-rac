import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      
      <div>
        {/* 1. Header Banner / Hero Section (ใส่ Backdrop Background) */}
        <header 
          className="relative bg-cover bg-center bg-no-repeat text-white py-20 px-4 text-center overflow-hidden"
          style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
        >
          {/* Overlay ปรับให้อ่านข้อความง่ายขึ้น */}
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

        {/* 2. ส่วนความรู้เกี่ยวกับครั่ง (Shellac Knowledge) */}
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

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800 mt-12">
        <p>© 2026 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
      </footer>

    </div>
  );
}
