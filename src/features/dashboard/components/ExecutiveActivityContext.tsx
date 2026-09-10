type ExecutiveActivity = {
  id: string;
  title: string;
  activity_date: string;
  category: string | null;
  featured_image: string | null;
};

type Props = {
  activity: ExecutiveActivity | null;
  responseCount: number;
  loading: boolean;
};

export function ExecutiveActivityContext({ activity, responseCount, loading }: Props) {
  if (!activity) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6" aria-label="บริบทกิจกรรม">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rac-lac">Executive Activity Context</p>
              <h2 className="mt-1 text-base font-bold text-slate-800">ภาพรวมผลการประเมินทุกกิจกรรม</h2>
              <p className="mt-1 text-xs text-slate-500">เลือกกิจกรรม / ครั้งจาก Event Filter เพื่อดูบริบทและ KPI เฉพาะกิจกรรม</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
              <p className="text-[10px] font-semibold text-slate-400">ผู้ตอบแบบประเมินรวม</p>
              <p className="font-mono text-2xl font-bold text-rac-blue">{loading ? "—" : responseCount}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formattedDate = new Date(activity.activity_date).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6" aria-label="บริบทกิจกรรมที่เลือก">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.8fr)]">
          <div className="relative min-h-[190px] bg-slate-100">
            {activity.featured_image ? <img src={activity.featured_image} alt={`ภาพกิจกรรม ${activity.title}`} className="absolute inset-0 h-full w-full object-cover" loading="eager" /> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rac-blue-deep via-rac-lac to-[#961E1E] text-6xl" aria-hidden="true">🦋</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">EVENT • {activity.id.slice(0, 8)}</div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rac-lac">Executive Activity Context</p>
                <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{activity.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span>📅 {formattedDate}</span>{activity.category && <span>🏷️ {activity.category}</span>}</div>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-right ring-1 ring-rose-100"><p className="text-[10px] font-semibold text-rac-lac">Responses</p><p className="font-mono text-3xl font-bold text-rac-lac">{loading ? "—" : responseCount}</p><p className="text-[10px] text-slate-400">คน</p></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">สถานะบริบท</p><p className="mt-1 text-xs font-bold text-emerald-700">✓ กิจกรรมที่เลือก</p></div>
              <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">ตัวระบุหลัก</p><p className="mt-1 truncate font-mono text-[10px] font-bold text-slate-700">{activity.id}</p></div>
              <div className="col-span-2 rounded-2xl bg-slate-50 p-3 sm:col-span-1"><p className="text-[10px] text-slate-400">มุมมองผู้บริหาร</p><p className="mt-1 text-xs font-bold text-rac-blue">ผลประเมินรายครั้ง</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
