import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, Pencil, Trash2, Upload, GripVertical, Eye, EyeOff, Loader2 } from "lucide-react";
import { getActivities, saveActivity, deleteActivity, uploadActivityImage, removeActivityImage } from "./data/activityRepository";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Activity, ActivityStatus } from "./types";

const blank = (): Activity => ({ id: crypto.randomUUID(), title: "", date: new Date().toISOString().slice(0, 10), category: "", coverImage: "", images: [], objective: "", keyActivities: [""], outcomes: "", participants: "", status: "draft" });

export function ActivityAdminPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setItems(await getActivities()); }
    catch (error) { setMessage(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const persist = async (activity: Activity) => {
    setBusy(true);
    try {
      const saved = await saveActivity(activity);
      setItems((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setMessage("บันทึกข้อมูลแล้ว");
      setEditing(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ — ตรวจสอบ Supabase Auth และ RLS"); }
    finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm("ลบกิจกรรมนี้หรือไม่?")) return;
    setBusy(true);
    try { await deleteActivity(id); setItems((current) => current.filter((x) => x.id !== id)); setMessage("ลบข้อมูลแล้ว"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "ลบไม่สำเร็จ"); }
    finally { setBusy(false); }
  };

  const toggleStatus = (item: Activity) => void persist({ ...item, status: item.status === "published" ? "draft" : "published" });
  const published = useMemo(() => items.filter((x) => x.status === "published").length, [items]);

  return (
    <div data-rac-theme="executive" className="min-h-screen bg-rac-surface font-['Mitr'] text-slate-800">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4"><div><Link to="/dashboard" className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rac-lac"><ArrowLeft className="size-3" /> กลับ Dashboard</Link><h1 className="text-xl font-black">จัดการกิจกรรมและเนื้อหา</h1><p className="text-xs text-slate-500">เผยแพร่ {published} / {items.length} รายการ • เพิ่มรูปภาพได้หลายรูป</p></div><button disabled={busy} onClick={() => setEditing(blank())} className="inline-flex items-center gap-2 rounded-xl bg-rac-lac px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-50"><ImagePlus className="size-4" /> เพิ่มกิจกรรม</button></div></header>
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        {!isSupabaseConfigured && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">ยังไม่ได้ตั้งค่า Supabase — ระบบจะใช้ localStorage ชั่วคราวสำหรับทดสอบ</div>}
        {message && <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold">{message}</div>}
        {loading ? <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-sm text-slate-500"><Loader2 className="mr-2 size-4 animate-spin" />กำลังโหลดข้อมูล...</div> : !items.length ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><ImagePlus className="mx-auto size-10 text-slate-300" /><h2 className="mt-3 font-bold">ยังไม่มีกิจกรรม</h2><p className="mt-1 text-xs text-slate-500">เริ่มจากเพิ่มกิจกรรมแรก แล้วอัปโหลดรูปภาพจากหน้านี้</p><button onClick={() => setEditing(blank())} className="mt-4 rounded-xl bg-rac-lac px-4 py-2 text-xs font-bold text-white">+ เพิ่มกิจกรรม</button></div> : <div className="grid gap-4 lg:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex gap-4 p-4"><div className="aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">{item.coverImage ? <img src={item.coverImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] text-slate-400">No image</div>}</div><div className="min-w-0 flex-1"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.status === "published" ? "เผยแพร่" : "ร่าง"}</span><h2 className="mt-1 line-clamp-2 font-bold">{item.title || "ไม่มีชื่อกิจกรรม"}</h2><p className="text-[11px] text-slate-400">{item.date} • {item.images.length} รูป</p><div className="mt-3 flex flex-wrap gap-2"><button disabled={busy} onClick={() => setEditing(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-slate-50"><Pencil className="size-3" /> แก้ไข</button><button disabled={busy} onClick={() => toggleStatus(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-slate-50">{item.status === "published" ? <EyeOff className="size-3" /> : <Eye className="size-3" />} {item.status === "published" ? "ซ่อน" : "เผยแพร่"}</button><button disabled={busy} onClick={() => void remove(item.id)} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"><Trash2 className="size-3" /> ลบ</button></div></div></div></article>)}</div>}
      </main>
      {editing && <ActivityEditor activity={editing} onChange={setEditing} onSave={() => void persist(editing)} onCancel={() => setEditing(null)} busy={busy} />}
    </div>
  );
}

function ActivityEditor({ activity, onChange, onSave, onCancel, busy }: { activity: Activity; onChange: (v: Activity) => void; onSave: () => void; onCancel: () => void; busy: boolean }) {
  const update = <K extends keyof Activity>(key: K, value: Activity[K]) => onChange({ ...activity, [key]: value });
  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 20);
    const urls = await Promise.all(accepted.map((file) => uploadActivityImage(file, activity.id)));
    const images = [...activity.images, ...urls];
    onChange({ ...activity, images, coverImage: activity.coverImage || images[0] || "" });
  };
  const removeImage = (i: number) => { const removed = activity.images[i]; const images = activity.images.filter((_, idx) => idx !== i); void removeActivityImage(removed); onChange({ ...activity, images, coverImage: activity.coverImage === removed ? (images[0] || "") : activity.coverImage }); };
  const moveImage = (i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= activity.images.length) return; const images = [...activity.images]; [images[i], images[j]] = [images[j], images[i]]; onChange({ ...activity, images, coverImage: activity.coverImage || images[0] || "" }); };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"><div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><div><h2 className="font-black">{activity.title ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h2><p className="text-[11px] text-slate-400">เนื้อหานี้แสดงบนหน้าเว็บเมื่อเลือก “เผยแพร่”</p></div><div className="flex gap-2"><button onClick={onCancel} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">ยกเลิก</button><button disabled={busy} onClick={onSave} className="inline-flex items-center gap-2 rounded-xl bg-rac-lac px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{busy && <Loader2 className="size-3 animate-spin" />}บันทึก</button></div></div><div className="space-y-5 p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="ชื่อกิจกรรม"><input value={activity.title} onChange={e => update("title", e.target.value)} /></Field><Field label="วันที่"><input type="date" value={activity.date} onChange={e => update("date", e.target.value)} /></Field><Field label="หมวดหมู่"><input value={activity.category || ""} onChange={e => update("category", e.target.value)} placeholder="เช่น Workshop, Outreach" /></Field><Field label="สถานะ"><select value={activity.status} onChange={e => update("status", e.target.value as ActivityStatus)}><option value="draft">ร่าง</option><option value="published">เผยแพร่</option></select></Field></div><Field label="วัตถุประสงค์"><textarea value={activity.objective} onChange={e => update("objective", e.target.value)} rows={3} /></Field><Field label="กิจกรรมสำคัญ"><div className="space-y-2">{activity.keyActivities.map((v, i) => <div key={i} className="flex gap-2"><input value={v} onChange={e => { const a = [...activity.keyActivities]; a[i] = e.target.value; update("keyActivities", a); }} placeholder={`กิจกรรมที่ ${i + 1}`} /><button onClick={() => update("keyActivities", activity.keyActivities.filter((_, x) => x !== i))} className="rounded-lg border border-slate-200 px-3 text-xs">ลบ</button></div>)}<button onClick={() => update("keyActivities", [...activity.keyActivities, ""])} className="text-xs font-bold text-rac-lac">+ เพิ่มหัวข้อ</button></div></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="ผลลัพธ์"><textarea value={activity.outcomes} onChange={e => update("outcomes", e.target.value)} rows={4} /></Field><Field label="ผู้เข้าร่วม"><textarea value={activity.participants} onChange={e => update("participants", e.target.value)} rows={4} /></Field></div><div><div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold">รูปภาพกิจกรรม</label><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"><Upload className="size-4" /> เพิ่มรูปภาพ<input type="file" accept="image/*" multiple className="hidden" onChange={e => { void addFiles(e.target.files); e.currentTarget.value = ""; }} /></label></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{activity.images.map((src, i) => <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"><img src={src} alt="" className="aspect-video w-full object-cover" /><div className="absolute inset-x-1 bottom-1 flex gap-1"><button title="ตั้งเป็นภาพปก" onClick={() => update("coverImage", src)} className={`flex-1 rounded bg-white/90 px-1 py-1 text-[9px] font-bold ${activity.coverImage === src ? "text-rac-lac" : "text-slate-600"}`}>{activity.coverImage === src ? "ภาพปก" : "ตั้งเป็นปก"}</button><button title="เลื่อนซ้าย" onClick={() => moveImage(i, -1)} className="rounded bg-white/90 px-1"><GripVertical className="size-3" /></button><button title="ลบรูป" onClick={() => removeImage(i)} className="rounded bg-white/90 px-1 text-rose-600"><Trash2 className="size-3" /></button></div></div>)}{!activity.images.length && <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400">กด “เพิ่มรูปภาพ” เพื่ออัปโหลดขึ้น Supabase Storage</div>}</div><p className="mt-2 text-[10px] text-slate-400">รองรับหลายรูป • Storage bucket: activity-images • ภาพแรกเป็นปกอัตโนมัติ</p></div></div></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1.5 text-xs font-bold text-slate-700">{label}<div className="font-normal [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-xs [&_input]:outline-none [&_input]:focus:border-rac-lac [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-slate-200 [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-xs [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-xs [&_textarea]:outline-none [&_textarea]:focus:border-rac-lac">{children}</div></label> }
