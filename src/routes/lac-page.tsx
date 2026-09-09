import { Link, useParams } from "react-router-dom";
import { getLacPage } from "@/features/lac/lacInformationArchitecture";
import { LacKnowledgeCards } from "@/features/home/LacKnowledgeCards";
import { RacContainer } from "@/components/rac";

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
    intro: "ทำความเข้าใจครั่งจากแมลงครั่ง ต้นพิงอาศัย และเรซินธรรมชาติ",
    video: "/intro-lac.mp4",
    objectives: ["รู้จักแมลงครั่ง", "เข้าใจต้นพิงอาศัย", "เข้าใจการเกิดเรซินและครั่ง"],
    facts: ["ครั่งเป็นยางธรรมชาติ", "แมลงครั่งอาศัยบนกิ่งไม้", "เรซินสีแดงคือจุดเริ่มต้นของครั่ง"],
    takeaway: "แมลงครั่ง → ต้นพิงอาศัย → น้ำเลี้ยง → Resin → ครั่ง",
  },
  "life-cycle": {
    no: "02", code: "LIFE CYCLE", title: "วงจรชีวิต",
    intro: "ติดตามการเปลี่ยนแปลงของแมลงครั่งตั้งแต่ระยะเริ่มต้นจนถึงตัวเต็มวัย",
    video: null,
    objectives: ["เห็นลำดับวงจรชีวิต", "เข้าใจแต่ละระยะ", "เชื่อมโยงกับการเพาะเลี้ยง"],
    facts: ["ตัวผู้ประมาณ 55–60 วัน", "ตัวเมียให้ตัวอ่อนประมาณ 200–500 ตัว", "วงจรชีวิตเชื่อมโยงกับการสร้างเรซิน"],
    takeaway: "ไข่ → ตัวอ่อน → ตัวผู้/ตัวเมีย → รุ่นใหม่",
  },
  habitat: {
    no: "03", code: "HABITAT & HOST PLANTS", title: "ระบบนิเวศ & ต้นพิงอาศัย",
    intro: "มองความสัมพันธ์ระหว่างแมลงครั่ง ต้นพิงอาศัย น้ำเลี้ยง และสภาพแวดล้อม",
    video: null,
    objectives: ["เห็นองค์ประกอบของระบบ", "เข้าใจความสัมพันธ์แมลงกับพืช", "เชื่อมโยงสภาพแวดล้อม"],
    facts: ["แมลงครั่งอาศัยบนกิ่งไม้", "ต้นพิงอาศัยเป็นแหล่งน้ำเลี้ยง", "สภาพแวดล้อมเกี่ยวข้องกับการเจริญเติบโต"],
    takeaway: "แมลง + ต้นพิงอาศัย + น้ำเลี้ยง + สภาพแวดล้อม",
  },
  "host-plants": {
    no: "04", code: "HOST PLANTS", title: "ต้นพิงอาศัย",
    intro: "ทำความรู้จักต้นไม้ที่ครั่งอาศัยและดูดกินน้ำเลี้ยง",
    video: null,
    objectives: ["รู้จักต้นพิงอาศัย", "เปรียบเทียบชนิดพืช", "เข้าใจบทบาทของต้นไม้"],
    facts: ["จามจุรี", "ลิ้นจี่ และ ลำไย", "พุทรา ปันแถ/แถ/แข และถั่วมะแฮะ"],
    takeaway: "ต้นพิงอาศัยคือฐานที่ครั่งใช้ดำรงชีวิต",
  },
  "lac-farming": {
    no: "05", code: "LAC FARMING", title: "การเพาะเลี้ยงครั่ง",
    intro: "จากชีววิทยาสู่การปฏิบัติ: เตรียมพันธุ์ ดูแล และเก็บเกี่ยว",
    video: null,
    objectives: ["เข้าใจการเตรียมพันธุ์", "เข้าใจการดูแล", "เข้าใจการเก็บเกี่ยว"],
    facts: ["เตรียมพันธุ์", "ดูแลระหว่างเพาะเลี้ยง", "เก็บเกี่ยวในช่วงที่เหมาะสม"],
    takeaway: "เตรียมพันธุ์ → ดูแล → เก็บเกี่ยว → แปรรูป",
  },
} as const;

type LessonSlug = keyof typeof lessonPages;

function LessonNavigator({ current }: { current: LessonSlug }) {
  return (
    <nav aria-label="เส้นทางการเรียนรู้" className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {journey.map((item) => {
        const active = item.href === `/lac/${current}`;
        return (
          <Link key={item.number} to={item.href} aria-current={active ? "page" : undefined}
            className={`min-w-0 rounded-xl border px-2 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3328] sm:px-3 ${active ? "border-[#8f3328]/45 bg-[#8f3328]/10" : "border-[#8f3328]/10 bg-white/55 hover:bg-white"}`}>
            <p className="font-mono text-[9px] text-[#8f3328] sm:text-[10px]">{item.number}</p>
            <p className="mt-0.5 truncate text-[10px] leading-4 text-slate-700 sm:text-xs">{item.title}</p>
          </Link>
        );
      })}
    </nav>
  );
}

function LessonRoom({ slug }: { slug: LessonSlug }) {
  const lesson = lessonPages[slug];
  const index = journey.findIndex((item) => item.href === `/lac/${slug}`);
  const previous = index > 0 ? journey[index - 1] : null;
  const next = index < journey.length - 1 ? journey[index + 1] : null;

  return (
    <main className="h-[calc(100vh-60px)] overflow-hidden bg-[#f3eadb] text-slate-900">
      <RacContainer className="flex h-full flex-col px-3 sm:px-4">
        <header className="shrink-0 pt-3 sm:pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-[#8f3328] sm:text-[10px]">{lesson.no} — {lesson.code}</p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
              <p className="mt-1 hidden max-w-3xl truncate text-xs text-slate-600 sm:block">{lesson.intro}</p>
            </div>
            <span className="hidden shrink-0 rounded-full border border-[#8f3328]/15 bg-white/60 px-3 py-1.5 text-[10px] text-[#8f3328] sm:inline-flex">Interactive Lesson</span>
          </div>
          <div className="mt-3"><LessonNavigator current={slug} /></div>
        </header>

        <section className="min-h-0 flex-1 py-2.5 sm:py-3" aria-labelledby="lesson-room-title">
          <div className="grid h-full min-h-0 overflow-hidden rounded-[24px] bg-[#8f3328] lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.75fr)]">
            <div className="relative min-h-0 bg-black">
              {lesson.video ? (
                <video
                  className="h-full w-full object-contain bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={`Animation สำหรับบทเรียน ${lesson.title}`}
                >
                  <source src={lesson.video} type="video/mp4" />
                  เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                </video>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#f3eadb]/45 bg-[#f3eadb]/10 text-xl text-[#f3eadb] sm:h-16 sm:w-16 sm:text-2xl" aria-hidden="true">▶</div>
                    <p id="lesson-room-title" className="mt-3 text-sm font-semibold text-[#f3eadb]">Animation Room</p>
                    <p className="mt-1 text-[11px] text-[#f3eadb]/65">พื้นที่สำหรับ Animation / Motion Graphic</p>
                  </div>
                </div>
              )}
              {lesson.video && <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-sm">Animation Room</div>}
            </div>

            <aside className="min-h-0 overflow-hidden bg-[#f3eadb] p-4 text-slate-900 sm:p-5">
              <div>
                <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328]">LEARN</p>
                <ul className="mt-3 space-y-2">{lesson.objectives.map((objective) => <li key={objective} className="flex gap-2 text-xs leading-5 text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8f3328]" aria-hidden="true" /><span>{objective}</span></li>)}</ul>
              </div>
              <div className="mt-4 border-t border-[#8f3328]/15 pt-3">
                <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328]">KEY FACTS</p>
                <div className="mt-2 space-y-1.5">{lesson.facts.map((fact) => <p key={fact} className="rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-slate-700">{fact}</p>)}</div>
              </div>
              <div className="mt-4 border-t border-[#8f3328]/15 pt-3">
                <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#8f3328]">TAKEAWAY</p>
                <p className="mt-2 text-xs font-semibold leading-6 text-[#8f3328]">{lesson.takeaway}</p>
              </div>
            </aside>
          </div>
        </section>

        <footer className="shrink-0 pb-2.5 sm:pb-3">
          <div className="flex items-center justify-between gap-3">
            {previous ? <Link to={previous.href} className="min-w-0 truncate rounded-xl border border-[#8f3328]/15 bg-white/65 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3328]">← {previous.title}</Link> : <span />}
            {next ? <Link to={next.href} className="min-w-0 truncate rounded-xl bg-[#8f3328] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3328]">บทถัดไป: {next.title} →</Link> : <Link to="/" className="rounded-xl bg-[#8f3328] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3328]">กลับสู่ศูนย์การเรียนรู้ →</Link>}
          </div>
        </footer>
      </RacContainer>
    </main>
  );
}

export function LacPage() {
  const { slug = "" } = useParams();
  const page = getLacPage(slug);
  if (!page) return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm text-rac-lac">LAC LEARNING CENTER</p><h1 className="mt-2 text-3xl font-bold">ไม่พบหน้าการเรียนรู้</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-rac-blue px-4 py-2 text-sm font-semibold text-white">กลับหน้าแรก</Link></div></main>;
  if (slug === "knowledge") return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-3xl"><p className="text-xs font-semibold tracking-[0.18em] text-rac-lac">ความรู้เรื่องครั่ง</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">ภาพรวมความรู้เรื่องครั่ง</h1><p className="mt-3 text-slate-600">เลือกหัวข้อเพื่อเข้าสู่ห้องเรียนรู้แบบ Interactive Lesson</p></div><LacKnowledgeCards /></div></main>;
  if (["what-is-lac", "life-cycle", "habitat", "host-plants", "lac-farming"].includes(slug)) return <LessonRoom slug={slug as LessonSlug} />;
  return <main className="min-h-screen bg-rac-surface px-4 py-20 text-slate-900"><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8"><p className="text-sm font-semibold text-rac-lac">{page.title}</p><h1 className="mt-2 text-3xl font-bold">หน้านี้อยู่ระหว่างพัฒนา</h1><p className="mt-3 text-slate-600">องค์ความรู้ส่วนนี้จะเชื่อมเข้าสู่ LessonRoom ในขั้นถัดไป</p><Link to="/lac/knowledge" className="mt-6 inline-flex rounded-xl bg-rac-lac px-4 py-2 text-sm font-semibold text-white">กลับไปความรู้ทั้งหมด</Link></div></main>;
}
