import { Link, useParams } from "react-router-dom";
import { getLacPage } from "@/features/lac/lacInformationArchitecture";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { DataVisualization } from "@/features/home/components/DataVisualization";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";

export function LacPage() {
  const { slug = "" } = useParams();
  const page = getLacPage(slug);

  if (!page) {
    return (
      <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-rac-lac">LAC LEARNING CENTER</p>
          <h1 className="mt-2 text-3xl font-bold">ไม่พบหน้าการเรียนรู้</h1>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white">กลับหน้าแรก</Link>
        </div>
      </main>
    );
  }

  if (slug === "knowledge") {
    return (
      <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">ความรู้เรื่องครั่ง</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">ภาพรวมความรู้เรื่องครั่ง</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">สำรวจองค์ความรู้หลักที่เชื่อมโยงตั้งแต่ความรู้พื้นฐาน ระบบนิเวศ การเพาะเลี้ยง ไปจนถึงการแปรรูปและการใช้ประโยชน์จากครั่ง</p>
          </div>
          <LacKnowledgeCards />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link>
            <Link to="/lac/what-is-lac" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">เริ่มจาก ครั่งคืออะไร</Link>
          </div>
        </div>
      </main>
    );
  }

  if (slug === "center-overview") {
    return (
      <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
        <RacContainer>
          <RacSection className="py-0">
            <RacSectionHeader eyebrow="REGIONAL INTELLIGENCE" title="ข้อมูลและภาพรวมศูนย์เรียนรู้" description="มุมมองข้อมูลที่ช่วยเชื่อมโยงองค์ความรู้กับบริบทพื้นที่และการพัฒนาอย่างยั่งยืน" />
            <div className="mt-8"><DataVisualization /></div>
          </RacSection>
        </RacContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">{page.section.toUpperCase()}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{page.title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">โครงสร้างหน้านี้ถูกกำหนดไว้ใน LAC Information Architecture และจะเติมเนื้อหาจริงในขั้น Knowledge UX ของโครงการ</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link>
          <Link to="/lac/knowledge" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">ความรู้เรื่องครั่ง</Link>
          <Link to="/bingo" className="rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90">ไป Learning Games</Link>
        </div>
      </div>
    </main>
  );
}
