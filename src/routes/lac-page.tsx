import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
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

const lessonPages = {
  "what-is-lac": {
    no: "01", code: "WHAT IS LAC?", title: "ครั่งคืออะไร?",
    intro: "เริ่มจากสิ่งมีชีวิตตัวเล็ก ทำความเข้าใจครั่งและเรซินธรรมชาติที่แมลงครั่งผลิตขึ้น",
    eyebrow: "ความรู้พื้นฐาน", sectionTitle: "จากสิ่งมีชีวิตตัวเล็กสู่ครั่ง",
    sectionDescription: "เรียนรู้ความสัมพันธ์พื้นฐานระหว่างแมลงครั่ง ต้นพิงอาศัย น้ำเลี้ยง และเรซิน",
    objectives: ["รู้จักแมลงครั่ง", "เข้าใจต้นพิงอาศัย", "เข้าใจการเกิดเรซินและครั่ง"],
    facts: ["ครั่งเป็นยางธรรมชาติ", "แมลงครั่งอาศัยอยู่บนกิ่งไม้", "เรซินสีแดงคือจุดเริ่มต้นของครั่ง"],
    takeaway: "แมลงครั่ง → ต้นพิงอาศัย → ดูดน้ำเลี้ยง → สร้าง Resin → ครั่ง",
  },
  "life-cycle": {
    no: "02", code: "LIFE CYCLE", title: "วงจรชีวิต",
    intro: "ติดตามการเปลี่ยนแปลงของแมลงครั่ง ตั้งแต่ระยะเริ่มต้นจนถึงตัวเต็มวัยและการสร้างรุ่นใหม่",
    eyebrow: "วงจรชีวิต", sectionTitle: "จากไข่สู่ตัวเต็มวัย",
    sectionDescription: "เนื้อหาในระบบอธิบายวงจรชีวิตผ่าน 4 ระยะหลักของแมลงครั่ง",
    objectives: ["เห็นลำดับวงจรชีวิต", "เข้าใจความแตกต่างของแต่ละระยะ", "เชื่อมโยงวงจรชีวิตกับการเพาะเลี้ยง"],
    facts: ["ตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน", "ตัวเมียให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว", "วงจรชีวิตเชื่อมโยงกับการสร้างเรซิน"],
    takeaway: "ไข่ → ตัวอ่อน → ตัวผู้/ตัวเมีย → ตัวเต็มวัย → รุ่นใหม่",
  },
  habitat: {
    no: "03", code: "HABITAT & HOST PLANTS", title: "ระบบนิเวศ & ต้นพิงอาศัย",
    intro: "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นพิงอาศัย น้ำเลี้ยง สภาพแวดล้อม และการเจริญเติบโต",
    eyebrow: "ระบบความสัมพันธ์", sectionTitle: "ครั่งไม่ได้อยู่เพียงลำพัง",
    sectionDescription: "มองระบบของครั่งเป็นความสัมพันธ์ระหว่างสิ่งมีชีวิต พืชอาศัย และสภาพแวดล้อม",
    objectives: ["มองเห็นองค์ประกอบของระบบ", "เข้าใจความสัมพันธ์แมลงกับพืช", "เชื่อมโยงสภาพแวดล้อมกับการเจริญเติบโต"],
    facts: ["แมลงครั่งอาศัยอยู่บนกิ่งไม้", "ต้นพิงอาศัยเป็นแหล่งน้ำเลี้ยง", "สภาพแวดล้อมเกี่ยวข้องกับการเจริญเติบโต"],
    takeaway: "แมลงครั่ง + ต้นพิงอาศัย + น้ำเลี้ยง + สภาพแวดล้อม = ระบบการดำรงชีวิต",
  },
  "host-plants": {
    no: "04", code: "HOST PLANTS", title: "ต้นพิงอาศัย",
    intro: "ทำความรู้จักต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงจากพืช",
    eyebrow: "Host Plant", sectionTitle: "ต้นไม้ที่ใช้เลี้ยงครั่ง",
    sectionDescription: "สำรวจรายชื่อต้นพิงอาศัยที่ปรากฏอยู่ในองค์ความรู้ของระบบ",
    objectives: ["รู้จักต้นพิงอาศัย", "เปรียบเทียบชนิดพืชที่พบในองค์ความรู้", "เข้าใจบทบาทของต้นไม้ต่อครั่ง"],
    facts: ["จามจุรี", "ลิ้นจี่ และ ลำไย", "พุทรา ปันแถ/แถ/แข และถั่วมะแฮะ"],
    takeaway: "ต้นพิงอาศัยคือฐานที่ครั่งใช้ดำรงชีวิตและดูดกินน้ำเลี้ยง",
  },
  "lac-farming": {
    no: "05", code: "LAC FARMING", title: "การเพาะเลี้ยงครั่ง",
    intro: "ต่อยอดจากชีววิทยาสู่การปฏิบัติ ทำความเข้าใจการเตรียมพันธุ์ การดูแล และการเก็บเกี่ยว",
    eyebrow: "การเพาะเลี้ยง", sectionTitle: "จากการเตรียมพันธุ์สู่การเก็บเกี่ยว",
    sectionDescription: "เปลี่ยนความเข้าใจเรื่องครั่งให้เห็นเป็นลำดับการปฏิบัติ",
    objectives: ["เข้าใจการเตรียมพันธุ์", "เข้าใจการดูแลระหว่างเพาะเลี้ยง", "เข้าใจแนวทางการเก็บเกี่ยว"],
    facts: ["เริ่มจากการเตรียมพันธุ์", "ดูแลในระหว่างการเพาะเลี้ยง", "เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม"],
    takeaway: "เตรียมพันธุ์ → ดูแล → เก็บเกี่ยว → นำไปแปรรูป",
  },
} as const;

type LessonSlug = keyof typeof lessonPages;

function LessonNavigator({ current }: { current: LessonSlug }) {
  return (
    <nav aria-label="เส้นทางการเรียนรู้" className="mt-8 grid gap-2 sm:grid-cols-5">
      {journey.map((item) => {
        const active = item.href === `/lac/${current}`;
        return <Link key={item.number} to={item.href} aria-current={active ? "page" : undefined}
          className={`min-w-0 rounded-2xl border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a] ${active ? "border-[#c58a3a]/60 bg-[#c58a3a]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
          <p className="font-mono text-[10px] text-[#c58a3a]">{item.number}</p>
          <p className="mt-1 text-xs leading-5">{item.title}</p>
        </Link>;
      })}
    </nav>
  );
}

function LessonRoom({ slug, children }: { slug: LessonSlug; children: ReactNode }) {
  const lesson = lessonPages[slug];
  const index = journey.findIndex((item) => item.href === `/lac/${slug}`);
  const previous = index > 0 ? journey[index - 1] : null;
  const next = index < journey.length - 1 ? journey[index + 1] : null;
  return (
    <main className="min-h-screen bg-[#f3eadb] text-slate-900">
      <section className="bg-[#2f241d] px-4 pb-10 pt-24 text-[#f3ebdd] sm:px-6 sm:pb-12 sm:pt-28">
        <RacContainer><div className="max-w-4xl">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#c58a3a]">{lesson.no} — {lesson.code}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f3ebdd]/75 sm:text-base">{lesson.intro}</p>
        </div><LessonNavigator current={slug} /></RacContainer>
      </section>
      <RacContainer>
        <section className="py-8 sm:py-12" aria-labelledby="lesson-room-title">
          <div className="mb-5 flex items-end justify-between gap-4"><div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#8f3328]">LESSON ROOM</p>
            <h2 id="lesson-room-title" className="mt-2 text-2xl font-bold sm:text-3xl">ห้องเรียน Interactive</h2>
          </div><span className="hidden rounded-full border border-[#6d4a35]/15 bg-white/60 px-3 py-1.5 text-xs text-slate-500 sm:inline-flex">Animation / Motion Graphic</span></div>
          <div className="grid overflow-hidden rounded-[28px] bg-[#211914] lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
            <div className="relative aspect-video min-h-[240px] bg-[#30231c]"><div className="absolute inset-0 grid place-items-center"><div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#c58a3a]/40 bg-[#c58a3a]/10 text-2xl text-[#ead9c4]" aria-hidden="true">▶</div>
              <p className="mt-4 text-sm font-semibold text-[#f3ebdd]">พื้นที่ Animation</p><p className="mt-1 text-xs text-[#f3ebdd]/55">วิดีโอสำหรับบทเรียนนี้จะถูกเติมภายหลัง</p>
            </div></div><div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-black/35 px-4 py-3 text-xs text-white/60"><span>00:00</span><div className="h-1 flex-1 rounded-full bg-white/15" aria-hidden="true"><div className="h-full w-0 rounded-full bg-[#c58a3a]" /></div><span>Animation</span></div></div>
            <aside className="border-t border-white/10 p-5 text-[#f3ebdd] lg:border-l lg:border-t-0 sm:p-6"><p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">LEARNING OBJECTIVES</p>
              <ul className="mt-4 space-y-3">{lesson.objectives.map((objective) => <li key={objective} className="flex gap-3 text-sm leading-6 text-[#f3ebdd]/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c58a3a]" aria-hidden="true" /><span>{objective}</span></li>)}</ul>
              <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-semibold text-[#ead9c4]">เรียนรู้ด้วยภาพเป็นหลัก</p><p className="mt-2 text-xs leading-6 text-white/55">ข้อความด้านข้างทำหน้าที่เป็นตัวช่วย ไม่แย่งความสนใจจาก Animation</p></div>
            </aside>
          </div>
        </section>
        <section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="KEY FACTS" title="สิ่งสำคัญที่ควรจำ" description="สรุปข้อมูลหลักของบทเรียนให้เห็นได้หลังดู Animation" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">{lesson.facts.map((fact, index) => <article key={fact} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6"><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index + 1}</p><p className="mt-3 text-sm font-semibold leading-7 text-slate-800">{fact}</p></article>)}</div>
        </section>
        {children}
        <section className="pb-12 sm:pb-16"><div className="rounded-3xl bg-[#4b2b24] p-6 text-[#f3ebdd] sm:p-8"><p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">KEY TAKEAWAY</p><h2 className="mt-3 text-xl font-bold sm:text-2xl">จำภาพรวมของบทนี้</h2><p className="mt-5 break-words text-base font-semibold leading-8 text-[#ead9c4] sm:text-lg">{lesson.takeaway}</p></div></section>
        <section className="border-t border-[#6d4a35]/10 py-8 sm:py-10"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {previous ? <Link to={previous.href} className="rounded-2xl border border-[#6d4a35]/15 bg-white/60 px-4 py-3 text-sm font-semibold hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a]">← {previous.title}</Link> : <span />}
          {next ? <Link to={next.href} className="rounded-2xl bg-[#8f3328] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a]">บทถัดไป: {next.title} →</Link> : <Link to="/" className="rounded-2xl bg-[#8f3328] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58a3a]">กลับสู่ศูนย์การเรียนรู้ →</Link>}
        </div></section>
      </RacContainer>
    </main>
  );
}

function LifeCycleContent() {
  const stages = [["🥚", "ไข่", "จุดเริ่มต้นของวงจรชีวิตแมลงครั่ง"],["🐛", "ตัวอ่อน", "ตัวอ่อนเกาะบนพืชอาศัยและดูดกินน้ำเลี้ยงจากพืช"],["🪰", "ตัวผู้", "ระยะตัวผู้มีวงจรชีวิตประมาณ 55–60 วัน"],["🪲", "ตัวเมีย", "ตัวเมียเจริญเติบโตและให้กำเนิดตัวอ่อนรุ่นใหม่ประมาณ 200–500 ตัว"]] as const;
  return <section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="LIFE CYCLE MAP" title="4 ระยะหลัก" description="ดูวงจรชีวิตเป็นลำดับ เพื่อเชื่อมโยงกับการเพาะเลี้ยงครั่ง" /><div className="mt-6 grid gap-3 lg:grid-cols-4">{stages.map(([icon,title,text],index)=><article key={title} className="relative rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5"><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index+1}</p><div className="mt-4 grid h-12 w-12 place-items-center rounded-full border border-[#c58a3a]/30 bg-[#faf7f0] text-2xl" aria-hidden="true">{icon}</div><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}</div></section>;
}

function HabitatContent() {
  const relations = [["🐛", "แมลงครั่ง", "แมลงครั่งอาศัยอยู่บนกิ่งไม้และเป็นจุดเริ่มต้นของความสัมพันธ์ในระบบ"],["🌳", "ต้นพิงอาศัย", "ต้นไม้ที่ครั่งอาศัยอยู่และดูดกินน้ำเลี้ยงจากพืช"],["💧", "น้ำเลี้ยง", "ครั่งดูดน้ำเลี้ยงจากกิ่งไม้พิงอาศัย และสารอาหารถูกแปรสภาพเป็นเรซินและสารอื่นๆ"],["🌿", "สภาพแวดล้อม", "การเรียนรู้เชื่อมโยงต้นพิงอาศัย สภาพแวดล้อม และการเจริญเติบโตเข้าด้วยกัน"]] as const;
  return <section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="RELATION MAP" title="ความสัมพันธ์ในระบบ" description="อ่านจากสิ่งมีชีวิต ไปสู่พืช น้ำเลี้ยง และสภาพแวดล้อม" /><div className="mt-6 grid gap-3 sm:grid-cols-2">{relations.map(([icon,title,text],index)=><article key={title} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#faf7f0] text-2xl" aria-hidden="true">{icon}</div><div><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index+1}</p><h3 className="mt-1 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></div></div></article>)}</div></section>;
}

function HostPlantsContent() {
  const plants = ["จามจุรี", "ลิ้นจี่", "ลำไย", "พุทรา", "ปันแถ/แถ/แข", "ถั่วมะแฮะ"] as const;
  return <section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="HOST PLANT LIBRARY" title="ตัวอย่างต้นพิงอาศัย" description="รายชื่อที่ปรากฏในองค์ความรู้ของ repository" /><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{plants.map((plant,index)=><article key={plant} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5"><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index+1}</p><div className="mt-3 text-2xl" aria-hidden="true">🌿</div><h3 className="mt-2 text-base font-bold">{plant}</h3></article>)}</div></section>;
}

function FarmingContent() {
  const steps = [["01", "เตรียมพันธุ์", "ต่อยอดจากชีววิทยาสู่การปฏิบัติ โดยเริ่มจากการเตรียมพันธุ์"],["02", "ดูแล", "ทำความเข้าใจการดูแลในระหว่างการเพาะเลี้ยง"],["03", "เก็บเกี่ยว", "เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม โดยเก็บทั้งกิ่งหรือขูดเรซินออก"]] as const;
  return <section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="FARMING FLOW" title="ลำดับการเพาะเลี้ยง" description="มองการเพาะเลี้ยงเป็นขั้นตอนต่อเนื่องจากความรู้สู่การปฏิบัติ" /><div className="mt-6 grid gap-3 lg:grid-cols-3">{steps.map(([no,title,text])=><article key={no} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 sm:p-6"><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">{no}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}</div><div className="mt-5 rounded-3xl bg-[#2f241d] p-6 text-[#f3ebdd] sm:p-7"><p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#c58a3a]">HARVEST</p><p className="mt-3 text-sm leading-7 text-[#f3ebdd]/80">เก็บเกี่ยวครั่งจากกิ่งไม้ในช่วงที่เหมาะสม โดยเก็บทั้งกิ่งหรือขูดเรซินออก แล้วนำไปแปรรูปเป็นผลิตภัณฑ์ต่างๆ</p></div></section>;
}

export function LacPage() {
  const { slug = "" } = useParams();
  const page = getLacPage(slug);
  if (!page) return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm text-rac-lac">LAC LEARNING CENTER</p><h1 className="mt-2 text-3xl font-bold">ไม่พบหน้าการเรียนรู้</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white">กลับหน้าแรก</Link></div></main>;
  if (slug === "knowledge") return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-3xl"><p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">ความรู้เรื่องครั่ง</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">ภาพรวมความรู้เรื่องครั่ง</h1><p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">สำรวจองค์ความรู้หลักที่เชื่อมโยงตั้งแต่ความรู้พื้นฐาน ระบบนิเวศ การเพาะเลี้ยง ไปจนถึงการแปรรูปและการใช้ประโยชน์จากครั่ง</p></div><LacKnowledgeCards /><div className="mt-10 flex flex-wrap gap-3"><Link to="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link><Link to="/lac/what-is-lac" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">เริ่มจาก ครั่งคืออะไร</Link></div></div></main>;
  if (slug === "what-is-lac") return <LessonRoom slug="what-is-lac"><section className="pb-10 sm:pb-14"><RacSectionHeader eyebrow="VISUAL EXPLANATION" title="ครั่งเกิดขึ้นอย่างไร?" description="อ่านตามลำดับเดียวกับที่ Animation ควรเล่า" /><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{["🪲 แมลงครั่ง", "🌳 ต้นพิงอาศัย", "💧 ดูดน้ำเลี้ยง", "🔴 Resin / ชัน", "✨ ครั่ง"].map((item,index)=><article key={item} className="rounded-3xl border border-[#6d4a35]/15 bg-white/70 p-5 text-center"><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#8f3328]">0{index+1}</p><p className="mt-4 text-sm font-bold leading-7">{item}</p></article>)}</div><div className="mt-5 max-w-4xl text-sm leading-8 text-slate-700 sm:text-[15px]"><p><strong className="font-semibold text-[#6d2f28]">ครั่ง (Lac)</strong> คือ ยางธรรมชาติที่ผลิตโดย <strong className="font-semibold text-[#6d2f28]">แมลงครั่ง</strong> ตัวจิ๋วชนิดหนึ่งที่อาศัยอยู่บนกิ่งไม้ โดยแมลงจะดูดน้ำเลี้ยงจากต้นไม้แล้วขับถ่ายยางสีแดง <strong className="font-semibold text-[#6d2f28]">"ชัน" (Resin)</strong> ออกมาห่อหุ้มตัวเพื่อป้องกันศัตรู ซึ่งสารนี้เองคือ <strong className="font-semibold text-[#6d2f28]">"ครั่ง"</strong> ที่นำมาใช้ประโยชน์ในอุตสาหกรรม</p></div></section></LessonRoom>;
  if (slug === "life-cycle") return <LessonRoom slug="life-cycle"><LifeCycleContent /></LessonRoom>;
  if (slug === "habitat") return <LessonRoom slug="habitat"><HabitatContent /></LessonRoom>;
  if (slug === "host-plants") return <LessonRoom slug="host-plants"><HostPlantsContent /></LessonRoom>;
  if (slug === "lac-farming") return <LessonRoom slug="lac-farming"><FarmingContent /></LessonRoom>;
  return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"><p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">{page.section.toUpperCase()}</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">{page.title}</h1><p className="mt-4 text-sm leading-7 text-slate-600">โครงสร้างหน้านี้ถูกกำหนดไว้ใน LAC Information Architecture และจะเติมเนื้อหาจริงในขั้น Knowledge UX ของโครงการ</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">กลับหน้าแรก</Link><Link to="/lac/knowledge" className="rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white hover:opacity-90">ความรู้เรื่องครั่ง</Link></div></div></main>;
}
