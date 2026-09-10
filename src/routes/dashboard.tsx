import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardPage as BaseDashboardPage } from "@/features/dashboard/DashboardPage";
import { ExecutiveActivityContext } from "@/features/dashboard/components/ExecutiveActivityContext";
import { supabase } from "@/lib/supabase";

type ActivityOption = {
  id: string;
  title: string;
  date: string;
  status: "draft" | "published";
  category: string | null;
  cover_image: string | null;
};

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [responseCount, setResponseCount] = useState(0);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingCount, setLoadingCount] = useState(true);
  const selectedActivity = new URLSearchParams(location.search).get("activity") || "ALL";
  const selectedActivityInfo = selectedActivity === "ALL"
    ? null
    : activities.find((activity) => activity.id === selectedActivity) || null;

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) {
        setLoadingActivities(false);
        setLoadingCount(false);
        return;
      }

      const { data } = await supabase
        .from("activities")
        .select("id,title,date,status,category,cover_image")
        .order("date", { ascending: false });

      if (active) {
        setActivities((data ?? []) as ActivityOption[]);
        setLoadingActivities(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCount = async () => {
      if (!supabase) {
        setResponseCount(0);
        setLoadingCount(false);
        return;
      }

      setLoadingCount(true);
      let query = supabase.from("survey_responses").select("id", { count: "exact", head: true });
      if (selectedActivity !== "ALL") query = query.eq("activity_id", selectedActivity);
      const { count } = await query;

      if (active) {
        setResponseCount(count ?? 0);
        setLoadingCount(false);
      }
    };
    void loadCount();
    return () => { active = false; };
  }, [selectedActivity]);

  const changeActivity = (activityId: string) => {
    const params = new URLSearchParams(location.search);
    if (activityId === "ALL") params.delete("activity");
    else params.set("activity", activityId);
    navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-rac-surface font-['Mitr']">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="rounded-lg bg-rose-50 px-2 py-1 text-rac-lac">📌 EVENT FILTER</span>
            <span className="hidden text-slate-400 sm:inline">วิเคราะห์ผลตามกิจกรรม / ครั้ง</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-500" htmlFor="dashboard-activity-filter">กิจกรรม</label>
            <select
              id="dashboard-activity-filter"
              aria-label="กรองตามกิจกรรม"
              disabled={loadingActivities}
              value={selectedActivity}
              onChange={(e) => changeActivity(e.target.value)}
              className="min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-rac-lac"
            >
              <option value="ALL">ทุกกิจกรรม / ทุกครั้ง</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>{activity.title} • {activity.date}</option>
              ))}
            </select>
            {selectedActivity !== "ALL" && (
              <button type="button" onClick={() => changeActivity("ALL")} className="rounded-xl border border-slate-200 px-2.5 py-2 text-[11px] font-semibold text-slate-500 hover:bg-slate-50">ล้าง</button>
            )}
          </div>
        </div>
      </div>

      <ExecutiveActivityContext
        activity={selectedActivityInfo}
        responseCount={responseCount}
        loading={loadingCount || loadingActivities}
      />

      <BaseDashboardPage key={selectedActivity} />
    </div>
  );
}
