import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type FacilitySummary = {
  buildings: number;
  openWorkOrders: number;
  totalWorkOrders: number;
  inspections: number;
  updatedAt: string;
};

export async function getFacilitySummary(): Promise<FacilitySummary | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const [buildings, workOrders, inspections] = await Promise.all([
    supabase.from("buildings").select("id", { count: "exact", head: true }),
    supabase.from("work_orders").select("id, status"),
    supabase.from("inspections").select("id", { count: "exact", head: true }),
  ]);

  const firstError = buildings.error ?? workOrders.error ?? inspections.error;
  if (firstError) {
    console.error("Failed to load Facility-Safety summary", firstError);
    return null;
  }

  const orders = workOrders.data ?? [];
  const openStatuses = new Set(["open", "pending", "in_progress", "assigned"]);
  return {
    buildings: buildings.count ?? 0,
    openWorkOrders: orders.filter((row) => openStatuses.has(String(row.status).toLowerCase())).length,
    totalWorkOrders: orders.length,
    inspections: inspections.count ?? 0,
    updatedAt: new Date().toISOString(),
  };
}
