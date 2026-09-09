import { useState } from "react";
import { LAC_RANKINGS, LAC_STATS } from "@/features/home/data/homeData";
import { RacBadge, RacCard } from "@/components/rac";

export function DataVisualization() {
  const [activeTab, setActiveTab] = useState<"farmers" | "efficiency">("farmers");
  const ranking = activeTab === "farmers" ? LAC_RANKINGS.farmers : LAC_RANKINGS.efficiency;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RacCard variant="lac" className="space-y-2 bg-gradient-to-br from-rose-50 to-white">
          <p className="rac-label text-rac-lac">ศูนย์กลางการผลิตใหญ่สุด</p>
          <h3 className="rac-display text-xl font-bold text-rac-blue">
            {LAC_STATS.production.location}
          </h3>
          <p className="rac-data text-3xl font-bold text-rac-lac">
            {LAC_STATS.production.value}{" "}
            <span className="text-sm text-slate-600">{LAC_STATS.production.unit}</span>
          </p>
        </RacCard>
        <RacCard variant="default" className="space-y-2 bg-gradient-to-br from-emerald-50 to-white">
          <p className="rac-label text-rac-green">ประสิทธิภาพสูงสุด</p>
          <h3 className="rac-display text-xl font-bold text-rac-blue">
            {LAC_STATS.efficiency.location}
          </h3>
          <p className="rac-data text-3xl font-bold text-rac-green">อันดับ 1</p>
        </RacCard>
        <RacCard variant="default" className="space-y-2 bg-gradient-to-br from-amber-50 to-white">
          <p className="rac-label text-amber-800">พืชอาศัยยอดนิยม</p>
          <h3 className="rac-display text-xl font-bold text-rac-blue">{LAC_STATS.host.location}</h3>
          <p className="rac-data text-3xl font-bold text-amber-700">TOP 1</p>
        </RacCard>
      </div>

      <RacCard variant="default" className="space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="rac-label text-rac-lac">Regional Intelligence</p>
            <h3 className="rac-display text-lg sm:text-xl font-bold text-rac-blue">
              📍 อันดับพื้นที่การผลิต จ.ลำปาง
            </h3>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl font-semibold text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("farmers")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "farmers" ? "bg-rac-lac text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              ผู้เลี้ยงมากสุด
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("efficiency")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "efficiency" ? "bg-rac-green text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              ประสิทธิภาพสูงสุด
            </button>
          </div>
        </div>
        <div className="space-y-3 font-semibold text-sm">
          {ranking.map((item, index) => (
            <div
              key={item}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${index === 0 ? "border-rac-lac/20 bg-rose-50/70" : "border-slate-100 bg-slate-50"}`}
            >
              <span className={index === 0 ? "font-bold text-rac-blue" : "text-slate-700"}>
                {item}
              </span>
              {index === 0 ? (
                <RacBadge tone={activeTab === "farmers" ? "brand" : "green"}>
                  {activeTab === "farmers" ? "เกษตรกรมากที่สุด" : "ผลผลิตสูงสุด"}
                </RacBadge>
              ) : (
                <span className="text-xs font-normal text-slate-500">พื้นที่ยุทธศาสตร์</span>
              )}
            </div>
          ))}
        </div>
      </RacCard>
    </div>
  );
}
