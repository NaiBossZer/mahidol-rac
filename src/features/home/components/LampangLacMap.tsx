const districts = [
  { no: "01", name: "วังเหนือ", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "02", name: "แจ้ห่ม", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "03", name: "เมืองปาน", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "04", name: "งาว", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "05", name: "สบปราบ", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "06", name: "เสริมงาม", note: "พื้นที่ข้อมูลครั่ง" },
  { no: "07", name: "ห้างฉัตร", note: "พื้นที่ข้อมูลครั่ง" },
];

export function LampangLacMap() {
  return (
    <section id="lampang-map" className="scroll-mt-24 bg-[#f3eadb] px-4 py-14 sm:py-20" aria-labelledby="lampang-map-title">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-rac-lac sm:text-xs sm:tracking-[0.2em]">LAMPANG LAC MAP</p>
            <h2 id="lampang-map-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">ครั่งกับพื้นที่ลำปาง</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">เชื่อมโยงองค์ความรู้เรื่องครั่งกับพื้นที่ที่มีข้อมูลในศูนย์เรียนรู้ เพื่อมองเห็นบริบทของเกษตรกรและเครือข่ายการผลิตในจังหวัดลำปาง</p>
            <div className="mt-5 rounded-2xl border border-rac-lac/15 bg-white/70 p-4 text-sm leading-6 text-slate-600 sm:mt-6">
              <span className="font-semibold text-slate-900">หมายเหตุ:</span> รายการนี้เป็นพื้นที่อ้างอิงจากข้อมูลเนื้อหาของศูนย์ ไม่ใช่แผนที่ภูมิศาสตร์สำหรับนำทาง
            </div>
          </div>
          <div className="min-w-0 rounded-[2rem] border border-[#6f3d2e]/15 bg-[#fffaf1] p-3 shadow-sm sm:p-7">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#6f3d2e]/10 bg-[#efe1cc] p-4 sm:p-7">
              <div className="absolute inset-0 opacity-40" aria-hidden="true">
                <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full border border-rac-lac/20" />
                <div className="absolute right-[14%] top-[12%] h-32 w-32 rounded-full border border-rac-lac/15" />
                <div className="absolute bottom-[8%] left-[35%] h-40 w-40 rounded-full border border-rac-lac/15" />
              </div>
              <div className="relative grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {districts.map((district) => (
                  <div key={district.no} className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 ${district.name === "งาว" ? "border-rac-lac/40 bg-rac-lac/10" : "border-[#6f3d2e]/10 bg-white/70"}`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rac-lac font-mono text-xs font-bold text-white">{district.no}</span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">อ.{district.name}</p>
                      <p className="truncate text-xs text-slate-500">{district.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 rounded-2xl border border-dashed border-rac-lac/30 bg-white/60 p-4 text-center sm:mt-5">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-rac-lac sm:text-xs sm:tracking-[0.16em]">LAMPANG LAC NETWORK</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">พื้นที่เรียนรู้ → เกษตรกร → ทรัพยากร → ผลิตภัณฑ์</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
