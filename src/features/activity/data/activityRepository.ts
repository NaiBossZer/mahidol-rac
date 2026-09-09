import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Activity } from "../types";
import { activityData, loadActivities as loadLocalActivities, saveActivities as saveLocalActivities } from "./activityData";

const BUCKET = "activity-images";

type ActivityRow = {
  id: string;
  title: string;
  date: string;
  category: string | null;
  cover_image: string | null;
  images: string[];
  objective: string;
  key_activities: string[];
  outcomes: string;
  participants: string;
  status: Activity["status"];
  created_at: string;
  updated_at: string;
};

function fromRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category || "",
    coverImage: row.cover_image || "",
    images: Array.isArray(row.images) ? row.images : [],
    objective: row.objective,
    keyActivities: Array.isArray(row.key_activities) ? row.key_activities : [],
    outcomes: row.outcomes,
    participants: row.participants,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(activity: Activity) {
  return {
    id: activity.id,
    title: activity.title.trim(),
    date: activity.date,
    category: activity.category?.trim() || null,
    cover_image: activity.coverImage || null,
    images: activity.images,
    objective: activity.objective,
    key_activities: activity.keyActivities.filter(Boolean),
    outcomes: activity.outcomes,
    participants: activity.participants,
    status: activity.status,
  };
}

export async function getActivities(): Promise<Activity[]> {
  if (!isSupabaseConfigured || !supabase) return loadLocalActivities();

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data as ActivityRow[]).map(fromRow);
}

export async function saveActivity(activity: Activity): Promise<Activity> {
  if (!isSupabaseConfigured || !supabase) {
    const items = loadLocalActivities();
    const next = items.some((item) => item.id === activity.id)
      ? items.map((item) => (item.id === activity.id ? activity : item))
      : [activity, ...items];
    saveLocalActivities(next);
    return activity;
  }

  const { data, error } = await supabase
    .from("activities")
    .upsert(toRow(activity), { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as ActivityRow);
}

export async function deleteActivity(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    saveLocalActivities(loadLocalActivities().filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadActivityImage(file: File, activityId: string): Promise<string> {
  if (!supabase || !isSupabaseConfigured) return fileToDataUrl(file);

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${activityId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function removeActivityImage(url: string): Promise<void> {
  if (!supabase || !isSupabaseConfigured || !url.includes(`/storage/v1/object/public/${BUCKET}/`)) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const path = url.split(marker)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([decodeURIComponent(path)]);
}

export function getInitialActivities(): Activity[] {
  return activityData;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
