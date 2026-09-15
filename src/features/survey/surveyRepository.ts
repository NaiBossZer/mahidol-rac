import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SURVEY_CONTRACT_VERSION } from "./surveyDataContract";

const requiredNumber = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  if (raw === null || raw === "") {
    throw new Error(`กรุณาตอบแบบประเมินให้ครบทุกข้อ`);
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`คะแนนประเมินไม่ถูกต้อง (ต้องอยู่ระหว่าง 1 ถึง 5)`);
  }
  return value;
};

const requiredText = (params: URLSearchParams, key: string, label: string) => {
  const value = params.get(key)?.trim() ?? "";
  if (!value) throw new Error(`กรุณากรอกข้อมูล${label}ให้ครบถ้วน`);
  return value;
};

export async function saveSurveySubmission(params: URLSearchParams) {
  if (!isSupabaseConfigured || !supabase) {
    console.error("Survey submission aborted: Supabase client is not configured");
    throw new Error("ระบบบันทึกแบบประเมินยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ");
  }

  const activityId = params.get("activity_id")?.trim() ?? "";
  if (!activityId) {
    throw new Error("ไม่พบรหัสกิจกรรม กรุณาเปิดแบบประเมินจากกิจกรรมที่กำหนด");
  }

  const consent = params.get("pdpa_consent") === "true";
  if (!consent) {
    throw new Error("กรุณายอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว (PDPA)");
  }

  const payload = {
    activity_id: activityId,
    contract_version: params.get("survey_contract") || SURVEY_CONTRACT_VERSION,
    submitted_at: params.get("submitted_at") || new Date().toISOString(),
    age_group: requiredText(params, "ageGroup", "ช่วงอายุ"),
    affiliation: requiredText(params, "affiliation", "หน่วยงานที่สังกัด"),
    ever_joined: requiredText(params, "everJoined", "ประวัติการเข้าร่วมกิจกรรม"),
    channels: requiredText(params, "channels", "ช่องทางการรับทราบข้อมูล"),
    p2_location: requiredNumber(params, "p2_location"),
    p2_schedule: requiredNumber(params, "p2_schedule"),
    p2_readiness: requiredNumber(params, "p2_readiness"),
    p2_reception: requiredNumber(params, "p2_reception"),
    p2_overall: requiredNumber(params, "p2_overall"),
    p3_interest: requiredNumber(params, "p3_interest"),
    p3_content: requiredNumber(params, "p3_content"),
    p3_clarity: requiredNumber(params, "p3_clarity"),
    p3_benefit: requiredNumber(params, "p3_benefit"),
    p3_application: requiredNumber(params, "p3_application"),
    p4_knowledge: requiredNumber(params, "p4_knowledge"),
    p4_inspiration: requiredNumber(params, "p4_inspiration"),
    p4_community_resource: requiredNumber(params, "p4_communityResource"),
    p4_future_return: requiredNumber(params, "p4_futureReturn"),
    feedback: params.get("feedback")?.trim() ?? "",
    pdpa_consent: true,
  };

  // Anonymous users are intentionally not allowed to SELECT survey responses.
  // Do not chain .select() here: PostgREST would require SELECT permission after INSERT.
  const { error } = await supabase.from("survey_responses").insert(payload);

  if (error) {
    console.error("Survey submission failed:", error);
    throw new Error("ไม่สามารถบันทึกแบบประเมินได้ กรุณาลองใหม่อีกครั้ง");
  }

  return { success: true };
}
