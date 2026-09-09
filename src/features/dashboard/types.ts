export interface SurveyResponse {
  timestamp?: string;
  ageGroup?: string;
  affiliation?: string;
  feedback?: string;
  [key: string]: string | number | undefined;
}

export type ScoreItem = {
  key: string;
  title: string;
  category: string;
  avg: number;
};

export type FeedbackItem = {
  text: string;
  affiliation: string;
  status: "positive" | "followup" | "urgent" | "general";
  tag: string;
};
