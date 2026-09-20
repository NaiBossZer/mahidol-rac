import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SURVEY_CONTRACT_VERSION } from "./surveyDataContract";

export type SurveyQuestion = {
  id: string;
  survey_id: string;
  section_key: string;
  question_text: string;
  question_type: "rating" | "text" | "single_choice" | "multi_choice";
  required: boolean;
  order_index: number;
  options: unknown;
  scale_min: number;
  scale_max: number;
  active: boolean;
};

export type PublishedSurvey = {
  id: string;
  occurrence_id: string;
  anonymous: boolean;
  welcome_text: string | null;
  open_at: string | null;
  close_at: string | null;
  activity_id: string;
  occurrence_no: number;
  start_at: string;
  activity_title: string;
  activity_date: string | null;
  questions: SurveyQuestion[];
};

export type SurveyAnswerValue = number | string | string[];

const SECTION_TITLES: Record<string, string> = {
  general: "ตอนที่ 1 ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม",
  opening: "ตอนที่ 2 ความพึงพอใจต่อการจัดพิธีเปิด",
  learning: "ตอนที่ 3 ความพึงพอใจต่อห้องการเรียนรู้ครั่งครบวงจร",
  outcomes: "ตอนที่ 4 ผลที่ได้รับและข้อเสนอแนะ",
  feedback: "ข้อเสนอแนะเพิ่มเติม",
};

function asOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const label = record.label ?? record.title ?? record.value;
      return typeof label === "string" ? [label] : [];
    }
    return [];
  });
}

function sectionTitle(sectionKey: string) {
  return SECTION_TITLES[sectionKey] ?? sectionKey.replace(/[_-]+/g, " ");
}

function legacyRatingField(sectionKey: string, questionIndex: number): string | null {
  const maps: Record<string, string[]> = {
    opening: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
    learning: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
    outcomes: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
  };
  return maps[sectionKey]?.[questionIndex] ?? null;
}

function isOpen(survey: Pick<PublishedSurvey, "open_at" | "close_at">) {
  const now = Date.now();
  return (
    (!survey.open_at || now >= Date.parse(survey.open_at)) &&
    (!survey.close_at || now <= Date.parse(survey.close_at))
  );
}

export function getSectionTitle(sectionKey: string) {
  return sectionTitle(sectionKey);
}

export function getQuestionOptions(question: SurveyQuestion) {
  return asOptions(question.options);
}

export async function getPublishedSurvey(activityId: string): Promise<PublishedSurvey | null> {
  if (!activityId) return null;
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("ระบบแบบประเมินยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ");
  }

  const { data: occurrences, error: occurrenceError } = await supabase
    .from("activity_occurrences")
    .select("id,activity_id,occurrence_no,start_at,status")
    .eq("activity_id", activityId)
    .not("status", "in", "(cancelled,archived)")
    .order("occurrence_no", { ascending: false })
    .limit(1);

  if (occurrenceError) throw occurrenceError;
  const occurrence = occurrences?.[0];
  if (!occurrence) return null;

  const { data: surveys, error: surveyError } = await supabase
    .from("occurrence_surveys")
    .select("id,occurrence_id,anonymous,welcome_text,open_at,close_at,enabled,created_at")
    .eq("occurrence_id", occurrence.id)
    .eq("enabled", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (surveyError) throw surveyError;
  const survey = surveys?.[0];
  if (!survey) return null;

  const { data: questions, error: questionError } = await supabase
    .from("survey_questions")
    .select(
      "id,survey_id,section_key,question_text,question_type,required,order_index,options,scale_min,scale_max,active",
    )
    .eq("survey_id", survey.id)
    .eq("active", true)
    .order("order_index", { ascending: true });

  if (questionError) throw questionError;

  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .select("id,title,activity_date,status")
    .eq("id", activityId)
    .maybeSingle();

  if (activityError) throw activityError;
  if (!activity || !["published", "completed"].includes(String(activity.status))) return null;

  const result: PublishedSurvey = {
    id: String(survey.id),
    occurrence_id: String(survey.occurrence_id),
    anonymous: Boolean(survey.anonymous),
    welcome_text: typeof survey.welcome_text === "string" ? survey.welcome_text : null,
    open_at: survey.open_at ? String(survey.open_at) : null,
    close_at: survey.close_at ? String(survey.close_at) : null,
    activity_id: String(occurrence.activity_id),
    occurrence_no: Number(occurrence.occurrence_no ?? 1),
    start_at: String(occurrence.start_at),
    activity_title: String(activity.title ?? ""),
    activity_date: activity.activity_date ? String(activity.activity_date) : null,
    questions: (questions ?? []) as SurveyQuestion[],
  };

  return isOpen(result) ? result : null;
}

export async function saveSurveySubmission(input: {
  survey: PublishedSurvey;
  ageGroup: string;
  affiliation: string;
  everJoined: string;
  channels: string;
  feedback: string;
  answers: Record<string, SurveyAnswerValue>;
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("ระบบบันทึกแบบประเมินยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ");
  }

  const responseId = crypto.randomUUID();
  const legacyScores: Record<string, number | null> = {
    p2_location: null,
    p2_schedule: null,
    p2_readiness: null,
    p2_reception: null,
    p2_overall: null,
    p3_interest: null,
    p3_content: null,
    p3_clarity: null,
    p3_benefit: null,
    p3_application: null,
    p4_knowledge: null,
    p4_inspiration: null,
    p4_community_resource: null,
    p4_future_return: null,
  };

  const sectionCounters = new Map<string, number>();
  const answerRows: Array<Record<string, unknown>> = [];

  const missingRequired = input.survey.questions.some((question) => {
    if (!question.required) return false;
    const answer = input.answers[question.id];
    return (
      answer === undefined ||
      answer === null ||
      answer === "" ||
      (Array.isArray(answer) && answer.length === 0)
    );
  });

  if (missingRequired) {
    throw new Error("กรุณาตอบคำถามที่มีเครื่องหมาย * ให้ครบถ้วน");
  }

  for (const question of input.survey.questions) {
    const answer = input.answers[question.id];
    if (
      answer === undefined ||
      answer === null ||
      answer === "" ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      continue;
    }

    const sectionIndex = sectionCounters.get(question.section_key) ?? 0;
    sectionCounters.set(question.section_key, sectionIndex + 1);

    const legacyField = legacyRatingField(question.section_key, sectionIndex);
    if (legacyField && typeof answer === "number") {
      legacyScores[legacyField] = answer;
    }

    answerRows.push({
      response_id: responseId,
      question_id: question.id,
      answer_number: typeof answer === "number" ? answer : null,
      answer_text: typeof answer === "string" ? answer : null,
      answer_options: Array.isArray(answer) ? answer : [],
    });
  }

  const { error: responseError } = await supabase.from("survey_responses").insert({
    id: responseId,
    activity_id: input.survey.activity_id,
    occurrence_id: input.survey.occurrence_id,
    survey_id: input.survey.id,
    contract_version: SURVEY_CONTRACT_VERSION,
    submitted_at: new Date().toISOString(),
    age_group: input.ageGroup,
    affiliation: input.affiliation,
    ever_joined: input.everJoined,
    channels: input.channels,
    ...legacyScores,
    feedback: input.feedback.trim(),
    pdpa_consent: true,
  });

  if (responseError) {
    console.error("Survey response insert failed:", responseError);
    throw new Error("ไม่สามารถบันทึกแบบประเมินได้ กรุณาลองใหม่อีกครั้ง");
  }

  if (answerRows.length > 0) {
    const { error: answerError } = await supabase.from("survey_answers").insert(answerRows);
    if (answerError) {
      console.error("Survey answers insert failed:", answerError);
      throw new Error("บันทึกคำตอบไม่ครบถ้วน กรุณาลองใหม่อีกครั้ง");
    }
  }

  return { success: true, responseId };
}
