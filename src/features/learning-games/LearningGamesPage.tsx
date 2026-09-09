import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "@/layout/AppNavbar";

const SobprabLacLabGame = lazy(() => import("@/features/home/SobprabLacLabGame"));
const LacBingoGame = lazy(() => import("@/features/bingo/LacBingoGame"));

function GameFallback() {
  return (
    <div
      className="min-h-64 rounded-3xl border border-slate-200 bg-white/70"
      aria-label="Loading game"
    />
  );
}

export function LearningGamesPage() {
  return (
    <div
      data-rac-theme="play"
      className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr'] selection:bg-rac-lac selection:text-white"
    >
      <AppNavbar />

      <main>
        <header className="border-b border-rac-lac/10 bg-rac-blue-deep px-4 py-14 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-rac-blue-deep"
            >
              <span aria-hidden="true">←</span>
              กลับสู่ LAC Learning Center
            </Link>

            <div className="mt-10 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.24em] text-rac-lac">LAC LEARNING GAMES</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
                เรียนรู้เรื่องครั่งผ่านการเล่น
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                ทดลอง ตัดสินใจ แก้ปัญหา และค้นพบผลลัพธ์ผ่านกิจกรรมเชิงโต้ตอบของศูนย์การเรียนรู้ครั่งสบปราบ
              </p>
            </div>
          </div>
        </header>

        <section className="px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="featured-games-title">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-rac-lac">FEATURED EXPERIENCES</p>
              <h2 id="featured-games-title" className="mt-2 text-2xl font-bold sm:text-3xl">
                เลือกประสบการณ์การเรียนรู้
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                แต่ละเกมออกแบบให้เรียนรู้จากการลงมือทำ ไม่ใช่เพียงการอ่านคำตอบ
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-rac-lac/5 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-rac-lac px-3 py-1 text-white">EXPERIMENT</span>
                    <span className="rounded-full border border-rac-lac/20 px-3 py-1 text-rac-lac">SIMULATION</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-800 sm:text-2xl">
                    🧪 เกมจำลองวิทยาศาสตร์ครั่งสบปราบ
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    ทดลองเลือกต้นโฮสต์ ฤดูกาล อุณหภูมิ การควบคุมศัตรู และกระบวนการแปรรูป แล้วดูผลลัพธ์ของการทดลอง
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <Suspense fallback={<GameFallback />}>
                    <SobprabLacLabGame />
                  </Suspense>
                </div>
              </article>

              <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-amber-50/60 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-rac-lac px-3 py-1 text-white">CLASSROOM</span>
                    <span className="rounded-full border border-amber-200 px-3 py-1 text-amber-700">QUIZ + BINGO</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-800 sm:text-2xl">
                    🎲 เกมบิงโกวิทยาศาสตร์ครั่งสบปราบ
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    ท้าทายความรู้ครั่งผ่านกระดาน 4×4 พร้อมคำถาม พิธีกรพี่ M-Guide การตรวจจับบิงโก และระบบคะแนน
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <Suspense fallback={<GameFallback />}>
                    <LacBingoGame />
                  </Suspense>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6" aria-labelledby="learning-loop-title">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-rac-lac">LEARNING LOOP</p>
            <h2 id="learning-loop-title" className="mt-2 text-2xl font-bold">เล่น → ได้ผลลัพธ์ → ค้นพบ → เรียนรู้ต่อ</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {[
                ["01", "เลือก", "เลือกเกมหรือสถานการณ์"],
                ["02", "ทดลอง", "ลงมือทำและตัดสินใจ"],
                ["03", "ค้นพบ", "ดูผลลัพธ์และข้อสังเกต"],
                ["04", "ต่อยอด", "กลับไปศึกษาองค์ความรู้"],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-slate-200 bg-rac-surface p-5 text-left">
                  <span className="font-mono text-xs text-rac-lac">{number}</span>
                  <h3 className="mt-2 font-bold text-slate-800">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6" aria-labelledby="more-experiences-title">
          <div className="mx-auto max-w-6xl rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-rac-lac">MORE EXPERIENCES</p>
            <h2 id="more-experiences-title" className="mt-2 text-xl font-bold">พื้นที่สำหรับเกมและกิจกรรมใหม่</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              หน้า Learning Games รองรับการเพิ่มประสบการณ์การเรียนรู้ในอนาคต โดยไม่ทำให้หน้าแรกต้องรับภาระของเกมทั้งหมด
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-rac-blue-deep py-10 text-center text-slate-300">
        <div className="mx-auto max-w-5xl space-y-2 px-4">
          <p className="text-xs leading-relaxed sm:text-sm">
            งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
          </p>
          <p className="font-mono text-xs text-slate-500">
            © 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LearningGamesPage;
