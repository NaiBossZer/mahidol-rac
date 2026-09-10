import { useEffect, useMemo, useState } from "react";
import { AppNavbar } from "@/layout/AppNavbar";
import { supabase } from "@/lib/supabase";

type ActivityRow = { id: string; title: string; date: string };
type ResponseRow = Record<string, unknown> & {
  id: string;
  activity_id: string;
  submitted_at: string;
};

const exportColumns: Array<[string, string]> = [
  ["id", "Response ID"],
  ["activity_id", "Activity ID"],
  ["activity_title", "กิจกรรม"],
  ["activity_date", "วันที่กิจกรรม"],
  ["submitted_at", "วันที่ส่งแบบประเมิน"],
  ["age_group", "ช่วงอายุ"],
  ["affiliation", "สังกัด"],
  ["ever_joined", "เคยเข้าร่วม"],
  ["channels", "ช่องทางข่าวสาร"],
  ["p2_location", "สถานที่"],
  ["p2_schedule", "ระยะเวลา"],
  ["p2_readiness", "อุปกรณ์/สื่อ"],
  ["p2_reception", "การต้อนรับ"],
  ["p2_overall", "ภาพรวมการจัดกิจกรรม"],
  ["p3_interest", "ความน่าสนใจ"],
  ["p3_content", "ความครบถ้วนของเนื้อหา"],
  ["p3_clarity", "ความชัดเจน"],
  ["p3_benefit", "ประโยชน์"],
  ["p3_application", "การประยุกต์ใช้"],
  ["p4_knowledge", "ความรู้เพิ่มขึ้น"],
  ["p4_inspiration", "แรงบันดาลใจ"],
  ["p4_community_resource", "แหล่งเรียนรู้ชุมชน"],
  ["p4_future_return", "สนใจเข้าร่วมอีก"],
  ["feedback", "ข้อเสนอแนะ"],
  ["pdpa_consent", "PDPA Consent"],
];

const csvCell = (value: unknown) => {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};

export function SurveyExportAdminPage() {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [activityId, setActivityId] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!supabase) {
      setError("Supabase ยังไม่ได้ตั้งค่า");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const [activityResult, responseResult] = await Promise.all([
      supabase.from("activities").select("id,title,date").order("date", { ascending: false }),
      supabase.from("survey_responses").select("*").order("submitted_at", { ascending: false }),
    ]);
    if (activityResult.error || responseResult.error) {
      setError(activityResult.error?.message || responseResult.error?.message || "ไม่สามารถโหลดข้อมูลได้");
    } else {
      setActivities((activityResult.data ?? []) as ActivityRow[]);
      setResponses((responseResult.data ?? []) as ResponseRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const activityMap = useMemo(() => new Map(activities.map((a) => [a.id, a])), [activities]);
  const years = useMemo(
    () => Array.from(new Set(responses.map((r) => new Date(r.submitted_at).getFullYear()).filter(Boolean))).sort((a, b) => b - a),
    [responses],
  );

  const filtered = useMemo(
    () => responses.filter((row) => {
      if (activityId !== "ALL" && row.activity_id !== activityId) return false;
      if (year !== "ALL" && new Date(row.submitted_at).getFullYear() !== Number(year)) return false;
      return true;
    }),
    [responses, activityId, year],
  );

  const exportCsv = () => {
    const lines = [
      exportColumns.map(([, label]) => csvCell(label)).join(","),
      ...filtered.map((row) => exportColumns.map(([key]) => {
        if (key === "activity_title") return csvCell(activityMap.get(row.activity_id)?.title);
        if (key === "activity_date") return csvCell(activityMap.get(row.activity_id)?.date);
        return csvCell(row[key]);
      }).join(",")),
    ];
    const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `satisfaction-export-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr']">
      <AppNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="bg-gradient-to-r from-rac-blue-light via-rac-lac to-[#961E1E] text-white rounded-3xl p-6 shadow-md">
          <div className="text-xs font-semibold text-rac-gold mb-2">ADMIN • DATA EXPORT</div>
          <h1 className="text-2xl font-bold">ส่งออกข้อมูลผลการประเมิน</h1>
          <p className="text-sm text-rose-100 mt-1">ข้อมูลจาก Supabase โดยตรง • ไม่ผ่าน Google Sheets</p>
        </header>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">⚠️ {error}</div>}

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <label className="text-xs font-semibold text-slate-600">
              กิจกรรม
              <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="block mt-1 min-w-64 border rounded-xl px-3 py-2 bg-white">
                <option value="ALL">ทุกกิจกรรม</option>
                {activities.map((activity) => <option key={activity.id} value={activity.id}>{activity.title}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              ปี
              <select value={year} onChange={(e) => setYear(e.target.value)} className="block mt-1 min-w-36 border rounded-xl px-3 py-2 bg-white">
                <option value="ALL">ทุกปี</option>
                {years.map((item) => <option key={item} value={item}>{item + 543} ({item})</option>)}
              </select>
            </label>
            <button type="button" onClick={exportCsv} disabled={loading || filtered.length === 0} className="rounded-xl bg-rac-blue text-white px-5 py-2.5 font-semibold disabled:opacity-50">
              ⬇️ Export CSV ({filtered.length})
            </button>
            <button type="button" onClick={() => void load()} disabled={loading} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold disabled:opacity-50">
              🔄 รีเฟรช
            </button>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between">
            <h2 className="font-bold">ตัวอย่างข้อมูลที่จะส่งออก</h2>
            <span className="text-xs text-slate-500">{loading ? "กำลังโหลด..." : `${filtered.length} รายการ`}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50"><tr><th className="text-left p-3">วันที่</th><th className="text-left p-3">กิจกรรม</th><th className="text-left p-3">สังกัด</th><th className="text-left p-3">ช่วงอายุ</th><th className="text-left p-3">ข้อเสนอแนะ</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map((row) => <tr key={row.id} className="border-t border-slate-100"><td className="p-3">{new Date(row.submitted_at).toLocaleString("th-TH")}</td><td className="p-3">{activityMap.get(row.activity_id)?.title || row.activity_id}</td><td className="p-3">{String(row.affiliation || "-")}</td><td className="p-3">{String(row.age_group || "-")}</td><td className="p-3 max-w-md truncate">{String(row.feedback || "-")}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
