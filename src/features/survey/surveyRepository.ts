import { supabase } from "@/lib/supabase";
import { SURVEY_CONTRACT_VERSION } from "./surveyDataContract";

const requiredNumber = (params: URLSearchParams, key: string) => {
  const value = Number(params.get(key));
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`Invalid survey rating: ${key}`);
  }
  return value;
};

const requiredText = (params: URLSearchParams, key: string) => {
  const value = params.get(key)?.trim() ?? "";
  if (!value) throw new Error(`Missing survey field: ${key}`);
  return value;
};

export async function saveSurveySubmission(params: URLSearchParams) {
  if (!supabase) throw new Error("Supabase is not configured");

  const activityId = requiredText(params, "activity_id");
  const consent = params.get("pdpa_consent") === "true";
  if (!consent) throw new Error("PDPA consent is required");

  const payload = {
    activity_id: activityId,
    contract_version: params.get("survey_contract") || SURVEY_CONTRACT_VERSION,
    submitted_at: params.get("submitted_at") || new Date().toISOString(),
    age_group: requiredText(params, "ageGroup"),
    affiliation: requiredText(params, "affiliation"),
    ever_joined: requiredText(params, "everJoined"),
    channels: requiredText(params, "channels"),
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

  const { data, error } = await supabase
    .from("survey_responses")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase survey submission failed", error);
    throw new Error("ไม่สามารถบันทึกผลการประเมินลงฐานข้อมูลได้");
  }

  return data.id as string;
}
