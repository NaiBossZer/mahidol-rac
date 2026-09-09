import { Link, useParams } from "react-router-dom";
import { getLacPage } from "@/features/lac/lacInformationArchitecture";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { RacContainer, RacSectionHeader } from "@/components/rac";

const journey = [
  { number: "01", title: "ครั่งคืออะไร?", href: "/lac/what-is-lac" },
  { number: "02", title: "วงจรชีวิต", href: "/lac/life-cycle" },
  { number: "03", title: "ระบบนิเวศ & ต้นพิงอาศัย", href: "/lac/habitat" },
  { number: "04", title: "ต้นพิงอาศัย", href: "/lac/host-plants" },
  { number: "05", title: "การเพาะเลี้ยงครั่ง", href: "/lac/lac-farming" },
] as const;

const stages = [
  ["🥚", "ไข่", "จุดเริ่มต้นของวงจรชีวิตแมลงครั่ง"],
  ["🐛", "ตัวอ่อน", "ตัวอ่อนเกาะบนพืชอาศัยและดูดกินน้ำเลี้ยงจากพืช"],
  ["🪰", "ตัวผู้", "ระยะตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน"],
  ["🪲", "ตัวเมีย", "ตัวเมียเจริญเติบโตและให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว"],
] as const;

const hostPlants = [
  "จามจุรี", "ลิ้นจี่", "ลำไย", "พุทรา", "ปันแถ/แถ/แข", "ถั่วมะแฮะ",
] as const;

const farmingSteps = [
  ["01", "เตรียมพันธุ์", "ต่อยอดจากชีววิทยาสู่การปฏิบัติ โดยเริ่มจากการเตรียมพันธุ์"],
  ["02", "ดูแล", "ทำความเข้าใจการดูแลในระหว่างการเพาะเลี้ยง"],
  ["03", "เก็บเกี่ยว", "เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม โดยเก็บทั้งกิ่งหรือขูดเรซินออก"],
] as const;

const detailPages = {
  "life-cycle": {
    no: "02",
    code: "LIFE CYCLE",
    title: "วงจรชีวิตครั่ง",
    intro: "สำรวจแต่ละช่วงของวงจรชีวิต ตั้งแต่ไข่จนถึงตัวเต็มวัย ผ่านลำดับการเรียนรู้ที่เชื่อมโยงกับการเพาะเลี้ยงครั่ง",
    sectionEyebrow: "วงจรชีวิต",
    sectionTitle: "จากไข่สู่ตัวเต็มวัย",
    sectionDescription: "เนื้อหาที่มีอยู่ในระบบอธิบายวงจรชีวิตผ่าน 4 ระยะหลักของแมลงครั่ง",
  },
  habitat: {
    no: "03",
    code: "HABITAT & HOST PLANTS",
    title: "ระบบนิเวศ & ต้นพิงอาศัย",
    intro: "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นพิงอาศัย สภาพแวดล้อม และการเจริญเติบโต",
    sectionEyebrow: "ระบบความสัมพันธ์",
    sectionTitle: "ครั่งไม่ได้อยู่เพียงลำพัง",
    sectionDescription: "องค์ความรู้ใน repository วางความสัมพันธ์ไว้ระหว่างแมลงครั่ง พืชอาศัย และสภาพแวดล้อม",
  },
  "host-plants": {
    no: "04",
    code: "HOST PLANTS",
    title: "ต้นพิงอาศัย",
    intro: "ทำความรู้จักต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงจากพืช",
    sectionEyebrow: "Host Plant",
    sectionTitle: "ต้นไม้ที่ใช้เลี้ยงครั่ง",
    sectionDescription: "รายชื่อต้นพิงอาศัยที่ปรากฏอยู่ในองค์ความรู้ของระบบ",
  },
  "lac-farming": {
    no: "05",
    code: "LAC FARMING",
    title: "การเพาะเลี้ยงครั่ง",
    intro: "ต่อยอดจากชีววิทยาสู่การปฏิบัติ ทำความเข้าใจการเตรียมพันธุ์ การดูแล และการเก็บเกี่ยว",
    sectionEyebrow: "การเพาะเลี้ยง",
    sectionTitle: "จากการเตรียมพันธุ์สู่การเก็บเกี่ยว",
    sectionDescription: "โครงสร้างใน repository แบ่งการเรียนรู้เป็นการเตรียมพันธุ์ การดูแล และการเก็บเกี่ยว",
  },
} as const;

function LearningJourneyFooter({ current }: { current: string }) {
  const index = journey.findIndex((item) => item.href.endsWith(current));
  const next = index >= 0 ? journey[(index + 1) % journey.length] : journey[0];
  return (
    <section className="pb-16 pt-2 sm:pb-20">
      <div className="rounded-3xl bg-[#2f241d] p-6 text-[#f3ebdd] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#c58a3a]">LEARNING JOURNEY</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">ไปต่อในบทถัดไป</h2>
          </div>
          <Link to={next.href} className="inline-flex w-fit rounded-xl bg-[#8f3328] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a]">
            {next.title} →
          </Link>
        </div>
        <div className="mt-7 grid gap-2 sm:grid-cols-5">
          {journey.map((item) => {
            const active = item.href.endsWith(current);
            return (
              <Link key={item.number} to={item.href} className={`rounded-xl border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a] ${active ? "border-[#c58a3a]/50 bg-[#c58a3a]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                <p className="font-mono text-[10px] text-[#c58a3a]">{item.number}</p>
                <p className="mt-1 text-xs leading-5">{item.title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DetailShell({ slug }: { slug: keyof typeof detailPages }) {
  const page = detailPages[slug];
  const current = `/${slug}`;
  return (
    <main className="min-h-screen bg-[#f3eadb] text-slate-900">
      <section className="bg-[#2f241d] px-4 pb-14 pt-28 text-[#f3ebdd] sm:px-6 sm:pb-16">
        <RacContainer>
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#c58a3a]">{page.no} — {page.code}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f3ebdd]/75 sm:text-base">{page.intro}</p>
          </div>
        </RacContainer>
      </section>

      <RacContainer>
        <section className="py-12 sm:py-16">
          <RacSectionHeader eyebrow={page.sectionEyebrow} title={page.sectionTitle} description={page.sectionDescription} />
          {slug === "life-cycle" && <LifeCycleContent />}
          {slug === "habitat" && <HabitatContent />}
          {slug === "host-plants" && <HostPlantsContent />}
          {slug === "lac-farming" && <FarmingContent />}
        </section>
        <LearningJourneyFooter current={current} />
      </RacContainer>
    </main>
  );
}

function LifeCycleContent() {
  return (
    <div className="mt-8 grid gap-3 lg:grid-cols-2">
      {stages.map(([icon, title, text], index) => (
        <article key={title} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#c58a3a]/30 bg-[#faf7f0] text-2xl" aria-hidden="true">{icon}</div>
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index + 1}</p>
              <h3 className="mt-1 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          </div>
        </article>
      ))}
      <div className="lg:col-span-2 rounded-3xl bg-[#4b2b24] p-6 text-[#f3ebdd] sm:p-7">
        <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">KEY FACTS</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <p className="text-sm leading-7 text-[#f3ebdd]/80">ระยะตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน</p>
          <p className="text-sm leading-7 text-[#f3ebdd]/80">ตัวเมียให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว</p>
        </div>
      </div>
    </div>
  );
}

function HabitatContent() {
  const relations = [
    ["🐛", "แมลงครั่ง", "แมลงครั่งอาศัยอยู่บนกิ่งไม้และเป็นจุดเริ่มต้นของความสัมพันธ์ในระบบ"],
    ["🌳", "ต้นพิงอาศัย", "ต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงจากพืช"],
    ["💧", "น้ำเลี้ยง", "ครั่งดูดน้ำเลี้ยงจากกิ่งไม้พิงอาศัย และสารอาหารถูกแปรสภาพเป็นเรซินและสารอื่นๆ"],
    ["🌿", "สภาพแวดล้อม", "การเรียนรู้เชื่อมโยงต้นพิงอาศัย สภาพแวดล้อม และการเจริญเติบโตเข้าด้วยกัน"],
  ] as const;
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {relations.map(([icon, title, text], index) => (
        <article key={title} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6">
          <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index + 1}</p>
          <div className="mt-3 text-3xl" aria-hidden="true">{icon}</div>
          <h3 className="mt-3 text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
        </article>
      ))}
    </div>
  );
}

function HostPlantsContent() {
  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hostPlants.map((plant, index) => (
          <article key={plant} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index + 1}</p>
            <div className="mt-3 text-2xl" aria-hidden="true">🌿</div>
            <h3 className="mt-2 text-base font-bold">{plant}</h3>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-3xl bg-[#2f241d] p-6 text-[#f3ebdd] sm:p-7">
        <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">HOST PLANT</p>
        <p className="mt-3 text-sm leading-7 text-[#f3ebdd]/80">ต้นพิงอาศัยคือ ต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงจากพืช โดย repository ระบุทั้งจามจุรี ลิ้นจี่ ลำไย พุทรา ปันแถ/แถ/แข ถั่วมะแฮะ และอื่นๆ</p>
      </div>
    </div>
  );
}

function FarmingContent() {
  return (
    <div className="mt-8">
      <div className="grid gap-3 lg:grid-cols-3">
        {farmingSteps.map(([no, title, text]) => (
          <article key={no} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">{no}</p>
            <h3 className="mt-3 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-3xl bg-[#4b2b24] p-6 text-[#f3ebdd] sm:p-7">
        <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">HARVEST</p>
        <p className="mt-3 text-sm leading-7 text-[#f3ebdd]/80">เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม โดยเก็บทั้งกิ่งหรือขูดเรซินออก แล้วนำไปแปรรูปเป็นผลิตภัณฑ์ต่างๆ</p>
      </div>
    </div>
  );
}

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

  if (slug === "what-is-lac") {
    return (
      <main className="min-h-screen bg-[#f3eadb] text-slate-900">
        <section className="bg-[#2f241d] px-4 pb-14 pt-28 text-[#f3ebdd] sm:px-6 sm:pb-16">
          <RacContainer>
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#c58a3a]">01 — WHAT IS LAC?</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">ครั่งคืออะไร?</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f3ebdd]/75 sm:text-base">ทำความรู้จักครั่งในฐานะยางธรรมชาติจากแมลงครั่ง และเรซินที่เกิดขึ้นบนต้นพิงอาศัย</p>
            </div>
          </RacContainer>
        </section>
        <RacContainer>
          <section className="py-12 sm:py-16">
            <RacSectionHeader eyebrow="ความรู้พื้นฐาน" title="เริ่มจากสิ่งมีชีวิตตัวเล็ก" description="ครั่งเกิดขึ้นจากความสัมพันธ์ระหว่างแมลงครั่งกับต้นพิงอาศัย" />
            <div className="mt-7 max-w-4xl space-y-4 text-sm leading-8 text-slate-700 sm:text-[15px]">
              <p><strong className="font-semibold text-[#6d2f28]">ครั่ง (Lac)</strong> คือ ยางธรรมชาติที่ผลิตโดย <strong className="font-semibold text-[#6d2f28]">แมลงครั่ง</strong> ตัวจิ๋วชนิดหนึ่งที่อาศัยอยู่บนกิ่งไม้ โดยแมลงจะดูดน้ำเลี้ยงจากต้นไม้แล้วขับถ่ายยางสีแดง <strong className="font-semibold text-[#6d2f28]">"ชัน" (Resin)</strong> ออกมาห่อหุ้มตัวเพื่อป้องกันศัตรู ซึ่งสารนี้เองคือ <strong className="font-semibold text-[#6d2f28]">"ครั่ง"</strong> ที่นำมาใช้ประโยชน์ในอุตสาหกรรม</p>
            </div>
          </section>
          <section className="pb-16 pt-2 sm:pb-20">
            <div className="rounded-3xl bg-[#2f241d] p-6 text-[#f3ebdd] sm:p-8">
              <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#c58a3a]">LEARNING JOURNEY</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">ไปต่อในบทถัดไป</h2>
              <div className="mt-7 grid gap-2 sm:grid-cols-5">
                {journey.map((item, index) => (
                  <Link key={item.number} to={item.href} className={`rounded-xl border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a] ${index === 0 ? "border-[#c58a3a]/50 bg-[#c58a3a]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                    <p className="font-mono text-[10px] text-[#c58a3a]">{item.number}</p>
                    <p className="mt-1 text-xs leading-5">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </RacContainer>
      </main>
    );
  }

  if (slug === "life-cycle" || slug === "habitat" || slug === "host-plants" || slug === "lac-farming") {
    return <DetailShell slug={slug} />;
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
