import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "@/layout/AppNavbar";
import { supabase } from "@/lib/supabase";

type ActivityControl = {
  id: string;
  title: string;
  date: string;
  category: string | null;
  status: "draft" | "published";
  survey_enabled: boolean;
  survey_open_at: string | null;
  survey_close_at: string | null;
  survey_welcome_text: string | null;
};

type ResponseCount = { activity_id: string; count: number };

const formatThaiDate = (value: string | null) => value ? new Date(value).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }) : "ไม่กำหนด";
const toLocalInput = (value: string | null) => value ? new Date(value).toISOString().slice(0, 16) : "";

export function ActivitySatisfactionAdminPage() {
  const [activities, setActivities] = useState<ActivityControl[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<ActivityControl | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    if (!supabase) { setError("Supabase ยังไม่ได้ตั้งค่า"); setLoading(false); return; }
    setLoading(true); setError("");
    const [{ data: activityRows, error: activityError }, { data: responseRows, error: responseError }] = await Promise.all([
      supabase.from("activities").select("id,title,date,category,status,survey_enabled,survey_open_at,survey_close_at,survey_welcome_text").order("date", { ascending: false }),
      supabase.from("survey_responses").select("activity_id"),
    ]);
    if (activityError || responseError) {
      setError(activityError?.message || responseError?.message || "ไม่สามารถโหลดข้อมูลได้");
    } else {
      const nextActivities = (activityRows ?? []) as ActivityControl[];
      const nextCounts: Record<string, number> = {};
      ((responseRows ?? []) as ResponseCount[]).forEach((row) => { nextCounts[row.activity_id] = (nextCounts[row.activity_id] || 0) + 1; });
      setActivities(nextActivities); setCounts(nextCounts);
      if (!selectedId && nextActivities[0]) setSelectedId(nextActivities[0].id);
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const selected = useMemo(() => activities.find((item) => item.id === selectedId) || null, [activities, selectedId]);
  useEffect(() => { setDraft(selected); }, [selected]);

  const save = async () => {
    if (!supabase || !draft) return;
    setSaving(true); setMessage(""); setError("");
    const { data, error: saveError } = await supabase.from("activities").update({
      survey_enabled: draft.survey_enabled,
      survey_open_at: draft.survey_open_at || null,
      survey_close_at: draft.survey_close_at || null,
      survey_welcome_text: draft.survey_welcome_text?.trim() || null,
    }).eq("id", draft.id).select("id,title,date,category,status,survey_enabled,survey_open_at,survey_close_at,survey_welcome_text").single();
    if (saveError) setError(`บันทึกไม่สำเร็จ: ${saveError.message}`);
    else { const saved = data as ActivityControl; setActivities((items) => items.map((item) => item.id === saved.id ? saved : item)); setMessage("บันทึกการตั้งค่าแบบประเมินแล้ว"); }
    setSaving(false);
  };

  return (
    <div data-rac-theme="executive" className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr']">
      <AppNavbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <header className="rounded-3xl bg-gradient-to-r from-rac-blue-light via-rac-lac to-[#961E1E] p-6 text-white shadow-md">
          <div className="text-[10px] font-bold tracking-widest text-rac-gold">PHASE 7.4 • ADMIN CONTROL</div>
          <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><h1 className="text-2xl font-black">จัดการกิจกรรมและแบบประเมิน</h1><p className="mt-1 text-sm text-rose-100">ควบคุมสถานะ เปิด–ปิดช่วงเวลา ข้อความต้อนรับ และดูจำนวนผู้ตอบแยกรายกิจกรรม</p></div>
            <div className="flex gap-2"><Link to="/admin/activity" className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold">จัดการกิจกรรม</Link><Link to="/admin/survey-export" className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold">Export ข้อมูล</Link></div>
          </div>
        </header>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">⚠️ {error}</div>}
        {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">✓ {message}</div>}

        {loading ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500">กำลังโหลดข้อมูล...</div> : !activities.length ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500">ยังไม่มีกิจกรรม</div> : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">รายการกิจกรรม</h2><span className="text-[11px] text-slate-400">{activities.length} รายการ</span></div>
              <div className="space-y-2">
                {activities.map((activity) => <button type="button" key={activity.id} onClick={() => setSelectedId(activity.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedId === activity.id ? "border-rac-lac bg-rose-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-2"><span className="line-clamp-2 text-xs font-bold">{activity.title || "ไม่มีชื่อกิจกรรม"}</span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${activity.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{activity.status === "published" ? "เผยแพร่" : "ร่าง"}</span></div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400"><span>{activity.date}</span><span>📝 {counts[activity.id] || 0} คน</span></div>
                </button>)}
              </div>
            </section>

            {draft && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start"><div><span className="text-[10px] font-bold text-rac-lac">SATISFACTION CONTROL</span><h2 className="mt-1 text-lg font-black">{draft.title}</h2><p className="text-xs text-slate-500">{draft.date} • ตอบแบบประเมินแล้ว {counts[draft.id] || 0} คน</p></div><div className={`rounded-full px-3 py-1 text-xs font-bold ${draft.survey_enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{draft.survey_enabled ? "เปิดรับแบบประเมิน" : "ปิดรับแบบประเมิน"}</div></div>

              <div className="mt-5 space-y-5">
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"><span><span className="block text-sm font-bold">เปิดใช้งานแบบประเมิน</span><span className="block text-[11px] text-slate-500">ผู้เข้าร่วมจะสามารถส่งแบบประเมินของกิจกรรมนี้ได้</span></span><input type="checkbox" checked={draft.survey_enabled} onChange={(e) => setDraft({ ...draft, survey_enabled: e.target.checked })} className="size-5 accent-rac-lac" /></label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">เปิดรับตั้งแต่<input type="datetime-local" value={toLocalInput(draft.survey_open_at)} onChange={(e) => setDraft({ ...draft, survey_open_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-normal" /><span className="mt-1 block text-[10px] font-normal text-slate-400">ถ้าไม่กำหนด = เปิดทันที</span></label><label className="text-xs font-bold">ปิดรับถึง<input type="datetime-local" value={toLocalInput(draft.survey_close_at)} onChange={(e) => setDraft({ ...draft, survey_close_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-normal" /><span className="mt-1 block text-[10px] font-normal text-slate-400">ถ้าไม่กำหนด = ไม่หมดอายุ</span></label></div>
                <label className="block text-xs font-bold">ข้อความต้อนรับแบบประเมิน<textarea rows={4} value={draft.survey_welcome_text || ""} onChange={(e) => setDraft({ ...draft, survey_welcome_text: e.target.value })} placeholder="เช่น ขอบคุณที่เข้าร่วมกิจกรรม กรุณาสละเวลา 2–3 นาทีเพื่อประเมิน..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-normal" /></label>

                <div className="grid gap-3 sm:grid-cols-3"><a href={`/survey?activity=${encodeURIComponent(draft.id)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-bold hover:bg-slate-50">🔗 เปิดแบบประเมิน</a><Link to={`/dashboard?activity=${encodeURIComponent(draft.id)}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-bold hover:bg-slate-50">📊 ดู Dashboard กิจกรรม</Link><span className="rounded-xl bg-slate-50 px-4 py-3 text-center text-[10px] text-slate-500">เปิด: {formatThaiDate(draft.survey_open_at)}<br />ปิด: {formatThaiDate(draft.survey_close_at)}</span></div>
                <div className="flex justify-end border-t border-slate-100 pt-4"><button type="button" disabled={saving} onClick={() => void save()} className="rounded-xl bg-rac-lac px-5 py-2.5 text-xs font-bold text-white shadow-sm disabled:opacity-50">{saving ? "กำลังบันทึก..." : "💾 บันทึกการตั้งค่า"}</button></div>
              </div>
            </section>}
          </div>
        )}
      </main>
    </div>
  );
}
