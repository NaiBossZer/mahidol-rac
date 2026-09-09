import { useNavigate } from "react-router-dom";
import { AppNavbar } from "@/layout/AppNavbar";
import { useDashboardData } from "./hooks/useDashboardData";

export function DashboardPage() {
  const navigate = useNavigate();
  const dashboard = useDashboardData();
  const {
    loading,
    errorMsg,
    lastUpdated,
    fetchData,
    filteredData,
    itemScores,
    categoryGroupedScores,
    cardMetrics,
    affiliationBreakdown,
    feedbackAnalysis,
    availableYears,
    availableMonths,
    ageGroupList,
    affiliationsList,
    selectedYear,
    selectedMonth,
    selectedAge,
    selectedAffiliation,
    setSelectedYear,
    setSelectedMonth,
    setSelectedAge,
    setSelectedAffiliation,
    resetFilters,
  } = dashboard;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };
  const getScoreBadge = (score: number) => {
    if (score >= 4.5)
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-rac-green font-semibold border border-emerald-200">
          🟢 ดีมากที่สุด
        </span>
      );
    if (score >= 3.5)
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-rac-blue font-semibold border border-sky-200">
          🔵 ดีมาก
        </span>
      );
    if (score >= 2.5)
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-semibold border border-amber-200">
          🟡 ปานกลาง
        </span>
      );
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rac-lac font-semibold border border-rose-200">
        🔴 ควรปรับปรุง
      </span>
    );
  };

  return (
    <div
      data-rac-theme="executive"
      className="min-h-screen bg-rac-surface text-slate-800 font-['Mitr'] selection:bg-rac-lac selection:text-white flex flex-col justify-between"
    >
      {/* Shared Navbar */}
      <AppNavbar />

      <main className="grow py-6 sm:py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 w-full">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rac-blue-light via-rac-lac to-[#961E1E] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-rac-gold font-bold text-[10px] tracking-wider px-3 py-0.5 rounded-full uppercase border border-white/20">
              📊 Analytics Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ระบบสรุปผลการประเมินความพึงพอใจ
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 font-light">
              ศูนย์การเรียนรู้ครั่งสบปราบ • คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-white/15 lg:border-t-0 pt-3 lg:pt-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-xs font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}
                />
                <span className={loading ? "text-amber-200" : "text-emerald-200"}>
                  {loading ? "กำลังโหลด..." : "เชื่อมต่อสด (LIVE)"}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/80 mt-0.5">อัปเดต: {lastUpdated || "..."}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/25 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
              >
                🔄 รีเฟรช
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-900/60 border border-rose-400/40 text-rose-100 hover:bg-rose-900/90 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rac-lac text-xs font-semibold flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={fetchData} className="underline cursor-pointer">
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* Multi-Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>🎛️</span> ตัวกรองข้อมูลประเมินผล
            </h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-slate-500 hover:text-rac-lac font-semibold text-xs transition-colors cursor-pointer bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200"
            >
              ✕ ล้างตัวกรอง
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Year Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-rac-blue font-bold">📅 ปี:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth("ALL");
                  }}
                  className="bg-transparent outline-none cursor-pointer font-semibold text-xs text-slate-800"
                >
                  <option value="ALL">ทุกปี</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      พ.ศ. {Number(y) + 543} ({y})
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-rac-blue font-bold">🗓️ เดือน:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer font-semibold text-xs text-slate-800"
                >
                  <option value="ALL">ทุกเดือน</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m.toString()}>
                      {MONTH_NAMES[m]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-rac-blue font-bold">🎂 ช่วงอายุ:</span>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer font-semibold text-xs text-slate-800"
                >
                  <option value="ALL">ทุกช่วงอายุ</option>
                  {ageGroupList.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Affiliation Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-rac-blue font-bold">📌 สังกัด:</span>
                <select
                  value={selectedAffiliation}
                  onChange={(e) => setSelectedAffiliation(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer font-semibold text-xs text-slate-800 max-w-[160px] truncate"
                >
                  <option value="ALL">ทั้งหมด</option>
                  {affiliationsList.map((aff) => (
                    <option key={aff} value={aff}>
                      {aff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 font-medium self-end md:self-auto">
              <span className="text-slate-500">แสดงผล:</span>
              <span className="text-rac-lac font-bold font-mono text-sm">
                {filteredData.length}
              </span>
              <span className="text-slate-400">/ {data.length} รายการ</span>
            </div>
          </div>
        </div>

        {/* 4 Executive Metric Cards */}
        {cardMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-rac-blue flex items-center justify-center text-lg font-bold">
                📋
              </div>
              <p className="text-xs text-slate-500 font-semibold">จำนวนผู้ตอบแบบประเมิน</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800 font-mono">
                  {filteredData.length}
                </span>
                <span className="text-xs text-slate-400">คน</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">จากทั้งหมด {data.length} รายการ</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-rac-gold flex items-center justify-center text-lg font-bold">
                ⭐
              </div>
              <p className="text-xs text-slate-500 font-semibold">คะแนนเฉลี่ยรวม (ร้อยละ)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-rac-gold font-mono">
                  {cardMetrics.grandAvgPercent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                คำนวณจาก {cardMetrics.totalQuestions} หัวข้อประเมิน
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rac-lac flex items-center justify-center text-lg font-bold">
                🏅
              </div>
              <p className="text-xs text-slate-500 font-semibold">หัวข้อที่ได้คะแนนสูงสุด</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {cardMetrics.highest.title}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-rac-lac font-mono">
                  {cardMetrics.highest.avg.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">/ 5.00</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-rac-green flex items-center justify-center text-lg font-bold">
                🛠️
              </div>
              <p className="text-xs text-slate-500 font-semibold">หัวข้อที่ควรพัฒนาต่อ</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {cardMetrics.lowest.title}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-rac-green font-mono">
                  {cardMetrics.lowest.avg.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">/ 5.00</span>
              </div>
            </div>
          </div>
        )}

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Satisfaction Scores by Category */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-rac-blue border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📊</span> คะแนนความพึงพอใจแยกตามหมวดหมู่ (สูงสุด - ต่ำสุด)
            </h2>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {categoryGroupedScores.map((catGroup, gIdx) => (
                <div
                  key={catGroup.category}
                  className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-rac-lac" />
                      <span>ด้าน{catGroup.category}</span>
                    </div>
                    <div className="bg-white px-2.5 py-0.5 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-400 text-[11px] mr-1">เฉลี่ย:</span>
                      <span className="font-mono font-bold text-rac-lac">
                        {catGroup.avg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pl-1">
                    {catGroup.items.map((item, iIdx) => (
                      <div key={item.key} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-700 truncate max-w-[65%] font-medium">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800">
                              {item.avg.toFixed(2)}
                            </span>
                            {getScoreBadge(item.avg)}
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(item.avg / 5) * 100}%`,
                              backgroundColor:
                                COLOR_PALETTE[(gIdx * 3 + iIdx) % COLOR_PALETTE.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Affiliation Donut Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-rac-blue border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>🍕</span> สัดส่วนผู้ตอบจำแนกตามหน่วยงาน
              </h2>

              <div className="py-4">
                {affiliationBreakdown.length > 0 && (
                  <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {(() => {
                        let acc = 0;
                        return affiliationBreakdown.map((item, idx) => {
                          const dash = `${item.percent} ${100 - item.percent}`;
                          const offset = -acc;
                          acc += item.percent;
                          return (
                            <circle
                              key={idx}
                              cx="18"
                              cy="18"
                              r="15.91549430918954"
                              fill="transparent"
                              stroke={item.color}
                              strokeWidth="4.5"
                              strokeDasharray={dash}
                              strokeDashoffset={offset}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute text-center pointer-events-none">
                      <p className="text-2xl font-bold text-rac-blue font-mono">
                        {filteredData.length}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        คนทั้งหมด
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 max-h-[200px] overflow-y-auto pr-1">
              {affiliationBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center text-xs p-1 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 truncate font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono shrink-0 font-semibold">
                    {item.count} คน ({item.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback & Suggestions Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>💬</span> ข้อเสนอแนะและความคิดเห็นเพิ่มเติม
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              สรุปประเด็นความคิดเห็นจากผู้ตอบแบบสอบถามจริง
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-rac-blue font-mono">{feedbackAnalysis.total}</p>
              <p className="text-xs font-semibold text-rac-blue">🔵 ข้อเสนอแนะทั้งหมด</p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-rac-green font-mono">
                {feedbackAnalysis.positiveCount}
              </p>
              <p className="text-xs font-semibold text-rac-green">🟢 เชิงบวก / ชื่นชม</p>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-amber-800 font-mono">
                {feedbackAnalysis.followUpCount}
              </p>
              <p className="text-xs font-semibold text-amber-900">🟡 ควรติดตาม</p>
            </div>
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-rac-lac font-mono">
                {feedbackAnalysis.urgentCount}
              </p>
              <p className="text-xs font-semibold text-rac-lac">🔴 ควรปรับปรุงเร่งด่วน</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Topic Breakdown */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <span>🔎</span> ประเด็นสำคัญจำแนกตามเรื่อง
              </h3>
              <div className="space-y-3 pt-1">
                {Object.entries(feedbackAnalysis.topicCounts).map(([topic, count]) => {
                  const percent = Math.round((count / feedbackAnalysis.maxTopicCount) * 100);
                  return (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">{topic}</span>
                        <span className="font-mono font-bold text-slate-800">{count} เรื่อง</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rac-blue rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Latest Feedback List */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <span>🕐</span> ข้อเสนอแนะล่าสุดจากผู้เข้าร่วม
              </h3>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {feedbackAnalysis.latestList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    ไม่มีข้อเสนอแนะเพิ่มเติม
                  </p>
                ) : (
                  feedbackAnalysis.latestList.map((item, idx) => {
                    const statusMap = {
                      positive: {
                        bg: "bg-emerald-100 text-rac-green border-emerald-200",
                        label: "🟢 ชื่นชม",
                      },
                      followup: {
                        bg: "bg-amber-100 text-amber-800 border-amber-200",
                        label: "🟡 ควรติดตาม",
                      },
                      urgent: {
                        bg: "bg-rose-100 text-rac-lac border-rose-200",
                        label: "🔴 เร่งด่วน",
                      },
                      general: {
                        bg: "bg-sky-100 text-rac-blue border-sky-200",
                        label: "🔵 ทั่วไป",
                      },
                    };
                    const badge = statusMap[item.status];
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 shadow-2xs"
                      >
                        <p className="text-slate-800 leading-relaxed">"{item.text}"</p>
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium">
                            {item.tag}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto font-mono">
                            {item.affiliation}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-rac-blue-deep text-slate-300 py-8 border-t border-slate-800 mt-12 text-center text-xs">
        <p>
          งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์
          มหาวิทยาลัยมหิดล จังหวัดลำปาง
        </p>
        <p className="text-slate-500 font-mono mt-1">
          © 2026 Faculty of Environment and Resource Studies, Mahidol University.
        </p>
      </footer>
    </div>
  );
}

export default DashboardPage;
