import type { Activity } from "../types";

export function ActivityCard({ activity, onOpen }: { activity: Activity; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group w-full text-left overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {activity.coverImage ? (
          <img src={activity.coverImage} alt={activity.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">ยังไม่มีรูปภาพ</div>
        )}
        {activity.category && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-rac-lac shadow">{activity.category}</span>}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[11px] font-semibold text-slate-400">{activity.date}</p>
        <h3 className="line-clamp-2 text-base font-bold text-slate-800 group-hover:text-rac-lac">{activity.title}</h3>
        <p className="text-xs font-semibold text-rac-lac">ดูรายละเอียด →</p>
      </div>
    </button>
  );
}
