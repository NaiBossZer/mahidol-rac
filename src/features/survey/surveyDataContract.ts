export const SURVEY_CONTRACT_VERSION = "7.2" as const;

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
  everJoined: string;
  channels: string;
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
  const value = new URLSearchParams(search).get("activity");
  return value?.trim() || null;
}

export function withSurveyActivityContext(
  url: string,
  context: SurveyActivityContext,
): string {
  const target = new URL(url);
  target.searchParams.set("activity_id", context.activityId);
  target.searchParams.set("survey_contract", SURVEY_CONTRACT_VERSION);
  return target.toString();
}
