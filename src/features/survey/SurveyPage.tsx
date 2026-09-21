import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Loader2, RefreshCw } from "lucide-react";
import { getSurveyActivityId } from "./surveyDataContract";
import {
  getOpenSurveyActivities,
  getPublishedSurvey,
  getQuestionOptions,
  getSectionTitle,
  type OpenSurveyActivity,
  type PublishedSurvey,
  type SurveyAnswerValue,
  saveSurveySubmission,
} from "./surveyRepository";

const AGE_GROUPS = [
  "0 - 10 ปี",
  "11 - 20 ปี",
  "21 - 30 ปี",
  "31 - 40 ปี",
  "41 - 50 ปี",
  "51 - 60 ปี",
  "มากกว่า 60 ปี",
];

const AFFILIATIONS = [
  "หน่วยงานภาครัฐ (เช่น อบต./เทศบาล/อำเภอ)",
  "ภาคประชาชน/ชุมชน/ผู้นำชุมชน",
  "ภาคการศึกษา/สถานศึกษา",
  "อื่นๆ",
];

const CHANNEL_OPTIONS = [
  "FACEBOOK",
  "LINE",
  "WEBSITE ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ ม.มหิดล",
  "อื่นๆ",
];

type Step = "loading" | "pdpa" | "survey" | "submitting" | "submitted";

export function SurveyPage() {
  const [survey, setSurvey] = useState<PublishedSurvey | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [surveyChoices, setSurveyChoices] = useState<OpenSurveyActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [agreed, setAgreed] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [affiliationOther, setAffiliationOther] = useState("");
  const [everJoined, setEverJoined] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [channelOther, setChannelOther] = useState("");
  const [answers, setAnswers] = useState<Record<string, SurveyAnswerValue>>({});

  const activityId = useMemo(() => getSurveyActivityId(), []);
  const effectiveActivityId = selectedActivityId ?? activityId;

  const groupedQuestions = useMemo(() => {
    if (!survey) return [];
    const groups = new Map<string, PublishedSurvey["questions"]>();
    for (const question of survey.questions) {
      const current = groups.get(question.section_key) ?? [];
      current.push(question);
      groups.set(question.section_key, current);
    }
    return [...groups.entries()];
  }, [survey]);

  async function loadSurvey(requestedActivityId = effectiveActivityId) {
    setStep("loading");
    setErrorMessage(null);
    try {
      if (!requestedActivityId) {
        const choices = await getOpenSurveyActivities();
        setSurveyChoices(choices);
        setSurvey(null);
        setStep("survey");
        if (choices.length === 0)
          setErrorMessage("ไม่พบกิจกรรมที่มีแบบประเมินเปิดใช้งานอยู่ในขณะนี้");
        return;
      }

      const loaded = await getPublishedSurvey(requestedActivityId);
      if (!loaded) {
        setSurvey(null);
        setErrorMessage(
          "ไม่พบแบบประเมินที่เปิดใช้งานสำหรับกิจกรรมนี้ หรือแบบประเมินปิดรับคำตอบแล้ว",
        );
        setStep("survey");
        return;
      }
      setSurvey(loaded);
      setStep("pdpa");
    } catch (error) {
      console.error("Failed to load published survey:", error);
      setSurvey(null);
      setErrorMessage("ไม่สามารถโหลดแบบประเมินจากระบบกลางได้ กรุณาลองใหม่อีกครั้ง");
      setStep("survey");
    }
  }

  useEffect(() => {
    void loadSurvey();
  }, [activityId, selectedActivityId]);

  function updateAnswer(questionId: string, value: SurveyAnswerValue | undefined) {
    setErrorMessage(null);
    setAnswers((current) => {
      const next = { ...current };
      if (value === undefined) delete next[questionId];
      else next[questionId] = value;
      return next;
    });
  }

  function toggleMultiChoice(questionId: string, value: string) {
    const current = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : [];
    updateAnswer(
      questionId,
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!survey) return;
    if (!agreed) {
      setErrorMessage("กรุณายอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว");
      return;
    }
    if (!ageGroup || !affiliation || !everJoined || channels.length === 0) {
      setErrorMessage("กรุณากรอกข้อมูลทั่วไปให้ครบถ้วน");
      return;
    }
    if (affiliation === "อื่นๆ" && !affiliationOther.trim()) {
      setErrorMessage("กรุณาระบุหน่วยงาน");
      return;
    }
    if (channels.includes("อื่นๆ") && !channelOther.trim()) {
      setErrorMessage("กรุณาระบุช่องทางอื่น");
      return;
    }

    const missingRequired = survey.questions.some((question) => {
      if (!question.required) return false;
      const value = answers[question.id];
      return (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      );
    });

    if (missingRequired) {
      setErrorMessage("กรุณาตอบคำถามที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    setStep("submitting");
    try {
      await saveSurveySubmission({
        survey,
        ageGroup,
        affiliation: affiliation === "อื่นๆ" ? affiliationOther.trim() : affiliation,
        everJoined,
        channels: channels
          .map((item) => (item === "อื่นๆ" ? channelOther.trim() : item))
          .join(", "),
        feedback: Object.entries(answers)
          .map(([questionId, value]) => {
            const question = survey.questions.find((item) => item.id === questionId);
            return question?.question_type === "text" && typeof value === "string" ? value : "";
          })
          .filter(Boolean)
          .join("\n"),
        answers,
      });
      setStep("submitted");
    } catch (error) {
      console.error("Survey submission failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถบันทึกแบบประเมินได้ กรุณาลองใหม่อีกครั้ง",
      );
      setStep("survey");
    }
  }

  if (step === "submitted" && survey) return <SuccessScreen />;

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-emerald-50/30 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-md">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            กำลังโหลดแบบประเมินล่าสุดจากระบบกลาง...
          </p>
        </div>
      </div>
    );
  }

  if (!survey) {
    if (!effectiveActivityId && surveyChoices.length > 0) {
      return (
        <div className="min-h-screen bg-emerald-50/30 px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-md sm:p-8">
            <div className="text-center">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                แบบประเมินกิจกรรม
              </span>
              <h1 className="mt-4 text-2xl font-extrabold text-slate-900">เลือกกิจกรรม</h1>
              <p className="mt-2 text-sm text-slate-600">
                เลือกกิจกรรมเพื่อเปิดแบบประเมินที่ใช้งานอยู่จากระบบกลาง
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {surveyChoices.map((choice) => (
                <button
                  key={choice.activity_id}
                  type="button"
                  onClick={() => {
                    setSelectedActivityId(choice.activity_id);
                    window.history.replaceState(
                      {},
                      "",
                      `/survey?activity=${encodeURIComponent(choice.activity_id)}`,
                    );
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <p className="font-semibold text-slate-900">{choice.survey_title}</p>
                  <p className="mt-1 text-xs text-slate-500">{choice.activity_title}</p>
                  {choice.activity_date && (
                    <p className="mt-1 text-xs text-slate-500">{choice.activity_date}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-emerald-50/30 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-md">
          <CircleAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">ไม่พบแบบประเมิน</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadSurvey()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  const activityDate = survey.activity_date
    ? new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(survey.activity_date))
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(survey.start_at));

  if (step === "pdpa") {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12"
        style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
        <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 border-b border-emerald-100 pb-4 text-center">
            <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              แบบประเมินกิจกรรม
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {survey.title || survey.activity_title}
            </h1>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">{activityDate}</p>
            <p className="mt-2 text-xs text-slate-500">รอบกิจกรรมที่ {survey.occurrence_no}</p>
          </div>

          {survey.welcome_text && (
            <div className="mb-5 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-800">
              {survey.welcome_text}
            </div>
          )}

          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            ข้อตกลงความเป็นส่วนตัว (PDPA)
          </h2>
          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-relaxed text-slate-700">
            ข้อมูลที่ท่านกรอกในแบบประเมินนี้จะนำไปใช้เพื่อการวิเคราะห์และปรับปรุงการจัดกิจกรรม
            โดยจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            และจะไม่เปิดเผยข้อมูลระบุตัวตนสู่สาธารณะ
          </div>

          <label className="mb-6 flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว
            </span>
          </label>

          <button
            type="button"
            disabled={!agreed}
            onClick={() => setStep("survey")}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ยอมรับและเริ่มทำแบบประเมิน
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-emerald-100 border-t-8 border-t-emerald-600 bg-white p-6 shadow-md sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {survey.title || survey.activity_title}
          </h1>
          <p className="mt-2 font-medium text-emerald-700">{activityDate}</p>
          <p className="mt-1 text-xs text-slate-500">{survey.activity_title}</p>
          <p className="mt-1 text-xs text-slate-500">
            แบบประเมินรอบกิจกรรมที่ {survey.occurrence_no} · {survey.questions.length} คำถาม
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 border-b border-slate-200 pb-2 text-lg font-bold text-emerald-700">
              ตอนที่ 1 ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม
            </h2>

            <FieldTitle>ช่วงอายุ (ปี)</FieldTitle>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AGE_GROUPS.map((item) => (
                <label key={item} className="option">
                  <input
                    type="radio"
                    name="ageGroup"
                    required
                    value={item}
                    checked={ageGroup === item}
                    onChange={() => setAgeGroup(item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <FieldTitle>หน่วยงานที่สังกัดอยู่</FieldTitle>
            <div className="space-y-2">
              {AFFILIATIONS.map((item) => (
                <label key={item} className="option border-0 p-0">
                  <input
                    type="radio"
                    name="affiliation"
                    required
                    value={item}
                    checked={affiliation === item}
                    onChange={() => setAffiliation(item)}
                  />
                  {item}
                </label>
              ))}
              {affiliation === "อื่นๆ" && (
                <input
                  required
                  value={affiliationOther}
                  onChange={(event) => setAffiliationOther(event.target.value)}
                  placeholder="ระบุหน่วยงานของคุณ..."
                  className="text-input"
                />
              )}
            </div>

            <FieldTitle>ท่านเคยเข้าร่วมกิจกรรมของโครงการนี้มาก่อนหรือไม่</FieldTitle>
            <div className="flex gap-6">
              {["เคย", "ไม่เคย"].map((item) => (
                <label key={item} className="option border-0 p-0">
                  <input
                    type="radio"
                    name="everJoined"
                    required
                    value={item}
                    checked={everJoined === item}
                    onChange={() => setEverJoined(item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <FieldTitle>ท่านทราบข่าวสารการจัดงานจากช่องทางใด (เลือกได้มากกว่า 1 ข้อ)</FieldTitle>
            <div className="space-y-2">
              {CHANNEL_OPTIONS.map((item) => (
                <label key={item} className="option border-0 p-0">
                  <input
                    type="checkbox"
                    checked={channels.includes(item)}
                    onChange={() => {
                      setChannels((current) =>
                        current.includes(item)
                          ? current.filter((value) => value !== item)
                          : [...current, item],
                      );
                      setErrorMessage(null);
                    }}
                  />
                  {item}
                </label>
              ))}
              {channels.includes("อื่นๆ") && (
                <input
                  required
                  value={channelOther}
                  onChange={(event) => setChannelOther(event.target.value)}
                  placeholder="ระบุช่องทางอื่น..."
                  className="text-input"
                />
              )}
            </div>
          </section>

          {groupedQuestions.map(([sectionKey, questions]) => (
            <section
              key={sectionKey}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-5 border-b border-slate-200 pb-2 text-lg font-bold text-emerald-700">
                {getSectionTitle(sectionKey)}
              </h2>

              {questions.map((question) => {
                const options = getQuestionOptions(question);
                const value = answers[question.id];

                return (
                  <div key={question.id} className="mb-5 last:mb-0">
                    <p className="text-sm font-medium text-slate-700">
                      {question.question_text}{" "}
                      {question.required && <span className="text-red-500">*</span>}
                    </p>

                    {question.question_type === "rating" && (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-xs text-slate-500">{question.scale_min}</span>
                        <div className="flex gap-3 sm:gap-6">
                          {Array.from(
                            { length: question.scale_max - question.scale_min + 1 },
                            (_, index) => question.scale_min + index,
                          ).map((score) => (
                            <label
                              key={score}
                              className="flex cursor-pointer flex-col items-center gap-1 text-xs text-slate-600"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                checked={value === score}
                                onChange={() => updateAnswer(question.id, score)}
                                required={question.required}
                              />
                              {score}
                            </label>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">{question.scale_max}</span>
                      </div>
                    )}

                    {question.question_type === "text" && (
                      <textarea
                        rows={4}
                        value={typeof value === "string" ? value : ""}
                        onChange={(event) => updateAnswer(question.id, event.target.value)}
                        className="text-input mt-3"
                        placeholder="กรอกคำตอบ..."
                        required={question.required}
                      />
                    )}

                    {question.question_type === "single_choice" && (
                      <div className="mt-3 space-y-2">
                        {options.map((option) => (
                          <label key={option} className="option">
                            <input
                              type="radio"
                              name={question.id}
                              checked={value === option}
                              onChange={() => updateAnswer(question.id, option)}
                              required={question.required}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}

                    {question.question_type === "multi_choice" && (
                      <div className="mt-3 space-y-2">
                        {options.map((option) => (
                          <label key={option} className="option">
                            <input
                              type="checkbox"
                              checked={Array.isArray(value) && value.includes(option)}
                              onChange={() => toggleMultiChoice(question.id, option)}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">ไม่สามารถส่งแบบประเมินได้</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={step === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === "submitting" && <Loader2 className="h-5 w-5 animate-spin" />}
            {step === "submitting" ? "กำลังส่งแบบประเมิน..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      </div>

      <style>
        {
          " .option{display:flex;align-items:center;gap:.5rem;padding:.5rem;border:1px solid #e2e8f0;border-radius:.5rem;font-size:.875rem}.text-input{width:100%;border:1px solid #cbd5e1;border-radius:.75rem;padding:.75rem;background:white;color:#0f172a}"
        }
      </style>
    </div>
  );
}

function FieldTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
      {children} <span className="text-red-500">*</span>
    </h3>
  );
}

function SuccessScreen() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/50 bg-white/95 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-emerald-800">ส่งแบบประเมินสำเร็จ</h2>
        <p className="text-slate-600">
          ขอบคุณสำหรับข้อมูล! ระบบได้รับผลการตอบแบบประเมินเรียบร้อยแล้ว
        </p>
      </div>
    </div>
  );
}
