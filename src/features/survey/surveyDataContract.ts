export const SURVEY_CONTRACT_VERSION = "8.0" as const;

export interface SurveyActivityContext {
  activityId: string;
  activityTitle?: string;
  activityDate?: string;
}

export interface SurveySubmissionContract {
  contractVersion: typeof SURVEY_CONTRACT_VERSION;
  activityId: string;
  submittedAt: string;
  ageGroup: string;
  affiliation: string;
  channels: string;
  everJoined: string;
  p2_location: number;
  p2_schedule: number;
  p2_readiness: number;
  p2_reception: number;
  p2_overall: number;
  p3_interest: number;
  p3_content: number;
  p3_clarity: number;
  p3_benefit: number;
  p3_application: number;
  p4_knowledge: number;
  p4_inspiration: number;
  p4_communityResource: number;
  p4_futureReturn: number;
  feedback: string;
  pdpaConsent: boolean;
}

export function getSurveyActivityId(search = window.location.search): string | null {
  const params = new URLSearchParams(search);
  const value = params.get("activity") ?? params.get("activity_id");
  return value?.trim() || null;
}

export function withSurveyActivityContext(url: string, context: SurveyActivityContext): string {
  const target = new URL(url);
  target.searchParams.set("activity", context.activityId);
  target.searchParams.set("activity_id", context.activityId);
  target.searchParams.set("survey_contract", SURVEY_CONTRACT_VERSION);
  return target.toString();
}
