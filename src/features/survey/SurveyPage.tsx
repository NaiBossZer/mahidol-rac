import { useMemo, useState } from "react";
import { getSurveyActivityId } from "./surveyDataContract";
import { saveSurveySubmission } from "./surveyRepository";

const AGE_GROUPS = ["0 - 10 ปี", "11 - 20 ปี", "21 - 30 ปี", "31 - 40 ปี", "41 - 50 ปี", "51 - 60 ปี", "มากกว่า 60 ปี"];
const AFFILIATIONS = ["หน่วยงานภาครัฐ (เช่น อบต./เทศบาล/อำเภอ)", "ภาคประชาชน/ชุมชน/ผู้นำชุมชน", "ภาคการศึกษา/สถานศึกษา", "อื่นๆ"];
const CHANNEL_OPTIONS = ["FACEBOOK", "LINE", "WEBSITE ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ ม.มหิดล", "อื่นๆ"];

const QUESTION_SECTIONS = [
  {
    title: "ตอนที่ 2 ความพึงพอใจต่อการจัดพิธีเปิด",
    items: [
      ["p2_location", "ความเหมาะสมของสถานที่จัดงาน"],
      ["p2_schedule", "ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน"],
      ["p2_readiness", "ความพร้อมและความเป็นระเบียบของสถานที่"],
      ["p2_reception", "การต้อนรับและการอำนวยความสะดวกของเจ้าหน้าที่"],
      ["p2_overall", "ความพึงพอใจต่อการจัดพิธีเปิดโดยรวม"],
    ],
  },
  {
    title: "ตอนที่ 3 ความพึงพอใจต่อห้องการเรียนรู้ครั่งครบวงจร",
    items: [
      ["p3_interest", "ความน่าสนใจของห้องการเรียนรู้และนิทรรศการ"],
      ["p3_content", "ความเหมาะสมและความครบถ้วนของเนื้อหา"],
      ["p3_clarity", "ความชัดเจนและเข้าใจง่ายของสื่อการเรียนรู้"],
      ["p3_benefit", "ประโยชน์ขององค์ความรู้ที่ได้รับ"],
      ["p3_application", "ความสามารถในการนำความรู้ไปใช้หรือต่อยอด"],
    ],
  },
  {
    title: "ตอนที่ 4 ผลที่ได้รับและข้อเสนอแนะ",
    items: [
      ["p4_knowledge", "ท่านได้รับความรู้และความเข้าใจเกี่ยวกับครั่งเพิ่มขึ้น"],
      ["p4_inspiration", "กิจกรรมสามารถสร้างแรงบันดาลใจในการอนุรักษ์และพัฒนาครั่ง"],
      ["p4_communityResource", "ห้องการเรียนรู้สามารถใช้เป็นแหล่งเรียนรู้สำหรับชุมชนและผู้สนใจได้"],
      ["p4_futureReturn", "ท่านมีความสนใจเข้าร่วมกิจกรรมหรือกลับมาใช้ห้องการเรียนรู้อีกในอนาคต"],
    ],
  },
] as const;

const RATING_KEYS = QUESTION_SECTIONS.flatMap((section) => section.items.map(([key]) => key));
type RatingKey = (typeof RATING_KEYS)[number];
type Ratings = Record<RatingKey, number | null>;
const EMPTY_RATINGS = Object.fromEntries(RATING_KEYS.map((key) => [key, null])) as Ratings;

export function SurveyPage() {
  const activityId = useMemo(() => getSurveyActivityId(), []);
  const [step, setStep] = useState<"pdpa" | "survey" | "submitting" | "submitted">("pdpa");
  const [agreed, setAgreed] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [affiliationOther, setAffiliationOther] = useState("");
  const [everJoined, setEverJoined] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [channelOther, setChannelOther] = useState("");
  const [ratings, setRatings] = useState<Ratings>(EMPTY_RATINGS);
  const [feedback, setFeedback] = useState("");

  const setRating = (key: RatingKey, value: number) => setRatings((current) => ({ ...current, [key]: value }));
  const toggleChannel = (value: string) => setChannels((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityId) {
      alert("ไม่พบรหัสกิจกรรม กรุณาเปิดแบบประเมินจากกิจกรรมที่กำหนด");
      return;
    }
    if (!ageGroup || !affiliation || !everJoined || channels.length === 0) {
      alert("กรุณากรอกข้อมูลทั่วไปให้ครบถ้วน");
      return;
    }
    if (channels.includes("อื่นๆ") && !channelOther.trim()) {
      alert("กรุณาระบุช่องทางอื่น");
      return;
    }
    if (affiliation === "อื่นๆ" && !affiliationOther.trim()) {
      alert("กรุณาระบุหน่วยงาน");
      return;
    }
    if (RATING_KEYS.some((key) => ratings[key] === null)) {
      alert("กรุณาตอบแบบประเมินความพึงพอใจให้ครบทุกข้อ");
      return;
    }

    setStep("submitting");
    try {
      const params = new URLSearchParams({
        activity_id: activityId,
        survey_contract: "8.0",
        submitted_at: new Date().toISOString(),
        pdpa_consent: "true",
        ageGroup,
        affiliation: affiliation === "อื่นๆ" ? affiliationOther.trim() : affiliation,
        everJoined,
        channels: channels.map((item) => item === "อื่นๆ" ? channelOther.trim() : item).join(", "),
        feedback: feedback.trim(),
      });
      RATING_KEYS.forEach((key) => params.set(key, String(ratings[key])));
      await saveSurveySubmission(params);
      setStep("submitted");
    } catch (error) {
      console.error("Survey submission failed", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      setStep("survey");
    }
  };

  if (step === "submitted") return <SuccessScreen />;

  if (step === "pdpa") {
    return (
      <div className="min-h-screen relative py-12 px-4 flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}>
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-2xl w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/50 dark:border-slate-700">
          <div className="border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">พิธีเปิด</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">ห้องการเรียนรู้ครั่งครบวงจร</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">วันที่ 21 สิงหาคม พ.ศ. 2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง</p>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">ข้อตกลงความเป็นส่วนตัว (PDPA)</h2>
          <div className="p-4 bg-emerald-50/80 dark:bg-slate-900/60 rounded-xl text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed border border-emerald-100/80">ข้อมูลที่ท่านกรอกในแบบประเมินนี้จะนำไปใช้เพื่อการวิเคราะห์และปรับปรุงการจัดกิจกรรมเท่านั้น โดยจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) และไม่มีการเปิดเผยข้อมูลระบุตัวตนสู่สาธารณะ</div>
          <label className="flex items-center gap-3 mb-6 cursor-pointer select-none"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" /><span className="text-sm font-medium text-slate-700 dark:text-slate-300">ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว</span></label>
          <div className="flex gap-4"><button type="button" onClick={() => { window.location.href = "/"; }} className="w-1/2 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">ไม่ยอมรับ</button><button type="button" disabled={!agreed || !activityId} onClick={() => setStep("survey")} className="w-1/2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">ยอมรับ</button></div>
          {!activityId && <p className="mt-4 text-center text-xs text-amber-700">แบบประเมินนี้ต้องเปิดจากลิงก์กิจกรรมที่มีรหัสกิจกรรม</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 border-t-8 border-t-emerald-600 border-x border-b border-emerald-100 dark:border-slate-700">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">แบบเก็บข้อมูลความพึงพอใจพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร</h1>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-2 font-medium">วันศุกร์ที่ 21 สิงหาคม พ.ศ. 2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="card space-y-5">
            <h2 className="section-title">ตอนที่ 1 ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม</h2>
            <FieldTitle>ช่วงอายุ (ปี)</FieldTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{AGE_GROUPS.map((item) => <label key={item} className="option"><input type="radio" name="ageGroup" required value={item} checked={ageGroup === item} onChange={() => setAgeGroup(item)} />{item}</label>)}</div>
            <FieldTitle>หน่วยงานที่สังกัดอยู่</FieldTitle>
            <div className="space-y-2">{AFFILIATIONS.map((item) => <label key={item} className="option border-0 p-0"><input type="radio" name="affiliation" required value={item} checked={affiliation === item} onChange={() => setAffiliation(item)} />{item}</label>)}{affiliation === "อื่นๆ" && <input required value={affiliationOther} onChange={(event) => setAffiliationOther(event.target.value)} placeholder="ระบุหน่วยงานของคุณ..." className="text-input" />}</div>
            <FieldTitle>ท่านเคยเข้าร่วมกิจกรรมของโครงการนี้มาก่อนหรือไม่</FieldTitle>
            <div className="flex gap-6">{["เคย", "ไม่เคย"].map((item) => <label key={item} className="option border-0 p-0"><input type="radio" name="everJoined" required value={item} checked={everJoined === item} onChange={() => setEverJoined(item)} />{item}</label>)}</div>
            <FieldTitle>ท่านทราบข่าวสารการจัดงานจากช่องทางใด (เลือกได้มากกว่า 1 ข้อ)</FieldTitle>
            <div className="space-y-2">{CHANNEL_OPTIONS.map((item) => <label key={item} className="option border-0 p-0"><input type="checkbox" checked={channels.includes(item)} onChange={() => toggleChannel(item)} />{item}</label>)}{channels.includes("อื่นๆ") && <input required value={channelOther} onChange={(event) => setChannelOther(event.target.value)} placeholder="ระบุช่องทางอื่น..." className="text-input" />}</div>
          </section>

          {QUESTION_SECTIONS.map((section) => <section key={section.title} className="card space-y-5"><h2 className="section-title">{section.title}</h2>{section.items.map(([key, title]) => <div key={key}><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title} <span className="text-red-500">*</span></p><Likert value={ratings[key]} onChange={(value) => setRating(key, value)} name={key} /></div>)}</section>)}

          <section className="card"><FieldTitle>ข้อเสนอแนะ/ความคิดเห็นเพิ่มเติม</FieldTitle><textarea rows={4} value={feedback} onChange={(event) => setFeedback(event.target.value)} className="text-input" placeholder="ข้อเสนอแนะเพิ่มเติม..." /></section>
          <button type="submit" disabled={step === "submitting"} className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white hover:bg-emerald-700 shadow-lg disabled:opacity-50">{step === "submitting" ? "กำลังบันทึกข้อมูล..." : "ส่งแบบประเมิน"}</button>
        </form>
      </div>
      <style>{`.card{background:white;border-radius:1rem;box-shadow:0 1px 3px rgb(0 0 0/.08);padding:1.5rem;border:1px solid #e2e8f0}.section-title{font-size:1.125rem;font-weight:700;color:#065f46;border-bottom:1px solid #e2e8f0;padding-bottom:.5rem}.option{display:flex;align-items:center;gap:.5rem;padding:.5rem;border:1px solid #e2e8f0;border-radius:.5rem;font-size:.875rem}.text-input{width:100%;border:1px solid #cbd5e1;border-radius:.75rem;padding:.75rem;background:white;color:#0f172a}.dark .card{background:#1e293b;border-color:#334155}.dark .section-title{color:#34d399;border-color:#334155}.dark .text-input{background:#0f172a;color:white;border-color:#475569}`}</style>
    </div>
  );
}

function FieldTitle({ children }: { children: React.ReactNode }) { return <h3 className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{children} <span className="text-red-500">*</span></h3>; }

function Likert({ name, value, onChange }: { name: string; value: number | null; onChange: (value: number) => void }) {
  return <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><span className="text-xs text-slate-500">มากที่สุด</span><div className="flex gap-3 sm:gap-6">{[5,4,3,2,1].map((score) => <label key={score} className="flex flex-col items-center gap-1 text-xs text-slate-600 cursor-pointer"><input type="radio" name={name} checked={value === score} onChange={() => onChange(score)} />{score}</label>)}</div><span className="text-xs text-slate-500">น้อยที่สุด</span></div>;
}

function SuccessScreen() {
  return <div className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}><div className="absolute inset-0 bg-slate-950/60" /><div className="relative z-10 max-w-md w-full text-center bg-white/95 p-8 rounded-2xl shadow-2xl"><div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div><h2 className="text-2xl font-bold text-emerald-800 mb-2">ขอบคุณสำหรับข้อมูล!</h2><p className="text-slate-600">ระบบได้รับผลการตอบแบบประเมินเรียบร้อยแล้ว</p></div></div>;
}
