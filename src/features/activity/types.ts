export type ActivityStatus = "draft" | "published";

export interface Activity {
  id: string;
  title: string;
  date: string;
  category?: string;
  coverImage: string;
  images: string[];
  objective: string;
  keyActivities: string[];
  outcomes: string;
  participants: string;
  status: ActivityStatus;
  createdAt?: string;
  updatedAt?: string;
}
