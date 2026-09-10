export type ActivityStatus = "draft" | "published" | "archived";

/**
 * RAC presentation model backed by the central Portal activities table.
 * The database contract is activity_date / featured_image.
 */
export interface Activity {
  id: string;
  title: string;
  activityDate: string;
  category?: string;
  featuredImage: string;
  images: string[];
  objective: string;
  keyActivities: string[];
  outcomes: string;
  participants: string;
  status: ActivityStatus;
  createdAt?: string;
  updatedAt?: string;
}
