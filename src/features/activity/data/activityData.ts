import type { Activity } from "../types";

export const activityData: Activity[] = [];

export const ACTIVITY_STORAGE_KEY = "rac_activity_content_v1";

export function loadActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return activityData;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Activity[]) : activityData;
  } catch {
    return activityData;
  }
}

export function saveActivities(items: Activity[]) {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(items));
}
