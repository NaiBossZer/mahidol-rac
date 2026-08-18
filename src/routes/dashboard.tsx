import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
      if (!isAuth) {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: DashboardPage,
});

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec";

interface SurveyResponse {
  timestamp?: string;
  ageGroup?: string;
  affiliation?: string;
  everJoined?: string;
  channels?: string;
  p2_location?: number | string;
  p2_schedule?: number | string;
  p2_readiness?: number | string;
  p2_reception?: number | string;
  p2_overall?: number | string;
  p3_interest?: number | string;
  p3_content?: number | string;
  p3_clarity?: number | string;
  p3_benefit?: number | string;
  p3_application?: number | string;
  p4_knowledge?: number | string;
  p4_inspiration?: number | string;
  p4_communityResource?: number | string;
  p4_futureReturn?: number | string;
  feedback?: string;
}

const QUESTION_MAP: Record<keyof SurveyResponse, { title: string; category: string }> = {
  p2_location: { title: "ความเหมาะสมของสถานที่", category: "การจัดงาน" },
  p2_schedule: { title: "ความเหมาะสมของระยะเวลา", category: "การจัดงาน" },
  p2_readiness: { title: "ความพร้อมของอุปกรณ์/สื่อ", category: "การจัดงาน" },
  p2_reception: { title: "การต้อนรับและการอำนวยความสะดวก", category: "การจัดงาน" },
  p2_overall: { title: "ภาพรวมการจัดกิจกรรม", category: "การจัดงาน" },
  p3_interest: { title: "ความน่าสนใจของเนื้อหา", category: "เนื้อหา/การเรียนรู้" },
  p3_content: { title: "ความสมบูรณ์ครบถ้วนของเนื้อหา", category: "เนื้อหา/การเรียนรู้" },
  p3_clarity: { title: "ความชัดเจนในการถ่ายทอด", category: "เนื้อหา/การเรียนรู้" },
  p3_benefit: { title: "ประโยชน์ที่ได้รับ", category: "เนื้อหา/การเรียนรู้" },
  p3_application: { title: "การนำไปประยุกต์ใช้", category: "เนื้อหา/การเรียนรู้" },
  p4_knowledge: { title: "ความรู้ความเข้าใจที่เพิ่มขึ้น", category: "ผลกระทบ" },
  p4_inspiration: { title: "แรงบันดาลใจในการต่อยอด", category: "ผลกระทบ" },
  p4_communityResource: { title: "การเป็นแหล่งเรียนรู้ของชุมชน", category: "ผลกระทบ" },
  p4_futureReturn: { title: "ความสนใจเข้าร่วมอีกในอนาคต", category: "ผลกระทบ" },
  timestamp: { title: "", category: "" },
  ageGroup: { title: "", category: "" },
  affiliation: { title: "", category: "" },
  everJoined: { title: "", category: "" },
  channels: { title: "", category: "" },
  feedback: { title: "", category: "" },
};

const COLOR_PALETTE = ["#0284c7", "#6366f1", "#a855f7", "#ec4899", "#f97316", "#10b981", "#f59e0b"];

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [timeRange, setTimeRange] = useState<string>("ALL");
  const [selectedAge, setSelectedAge] = useState<string>("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("ALL");
  
  const [feedbackSearch, setFeedbackSearch] = useState<string>("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
    if (!isAuth) {
      navigate({ to: "/login" });
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate({ to: "/login", replace: true });
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, { method: "GET", redirect: "follow" });
      if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้");
      const json = await res.json();

      if (Array.isArray(json)) {
        const validData = json.filter((item: any) => {
          if (!item || typeof item !== "object") return false;
          return Object.values(item).some(
            (val) => val !== null && val !== undefined && String(val).trim() !== ""
          );
        });
        setData(validData);
      } else {
        setData([]);
      }

      const now = new Date();
      setLastUpdated(
        `${now.getDate()} ส.ค. ${now.getFullYear() + 543} ${now
          .getHours()
          .toString()
          .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setErrorMsg("ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณากด Refresh อีกครั้ง");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const parseNum = (val: any): number => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const ageGroupList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.ageGroup?.trim()) set.add(item.ageGroup.trim());
    });
    return Array.from(set);
  }, [data]);

  const affiliationsList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => set.add(item.affiliation?.trim() || "ไม่ระบุ"));
    return Array.from(set);
  }, [data]);

  const filteredData = useMemo(() => {
    const now = new Date();

    return data.filter((item) => {
      if (timeRange !== "ALL" && item.timestamp) {
        const itemDate = new Date(item.timestamp);
        if (!isNaN(itemDate.getTime())) {
          const diffTime = Math.abs(now.getTime() - itemDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (timeRange === "WEEK" && diffDays > 7) return false;
          if (timeRange === "MONTH" && diffDays > 30) return false;
          if (timeRange === "YEAR" && diffDays > 365) return false;
        }
      }

      if (selectedAge !== "ALL") {
        const itemAge = item.ageGroup?.trim() || "";
        if (itemAge !== selectedAge) return false;
      }

      if (selectedAffiliation !== "ALL") {
        const itemAff = item.affiliation?.trim() || "ไม่ระบุ";
        if (itemAff !== selectedAffiliation) return false;
      }

      return true;
    });
  }, [data, timeRange, selectedAge, selectedAffiliation]);

  const itemScores = useMemo(() => {
    const keys = Object.keys(QUESTION_MAP).filter(
      (k) => QUESTION_MAP[k as keyof SurveyResponse].title !== ""
    ) as (keyof SurveyResponse)[];

    return keys.map((key) => {
      let sum = 0;
      let count = 0;
      filteredData.forEach((item) => {
        const val = parseNum(item[key]);
        if (val > 0) {
          sum += val;
          count++;
        }
      });
      const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
      return {
        key,
        title: QUESTION_MAP[key].title,
        category: QUESTION_MAP[key].category,
        avg,
      };
    });
  }, [filteredData]);

  const executiveInsights = useMemo(() => {
    if (itemScores.length === 0 || filteredData.length === 0) return null;
    const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const grandAvg = (
      itemScores.reduce((acc, curr) => acc + curr.avg, 0) / itemScores.length
    ).toFixed(2);

    return { highest, lowest, grandAvg };
  }, [itemScores, filteredData]);

  const affiliationBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach((item) => {
      const key = item.affiliation?.trim() || "ไม่ระบุ";
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = filteredData.length || 1;
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percent: parseFloat(((count / total) * 100).toFixed(1)),
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));
  }, [filteredData]);

  const searchedFeedback = useMemo(() => {
    return filteredData.filter(
      (d) =>
        d.feedback?.trim() &&
        d.feedback.toLowerCase().includes(feedbackSearch.toLowerCase())
    );
  }, [filteredData, feedbackSearch]);

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">ดีมากที่สุด</span>;
    if (score >= 3.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold border border-blue-200">ดีมาก</span>;
    if (score >= 2.5) return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-200">ปานกลาง</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold border border-red-200">ควรปรับปรุง</span>;
  };

  const renderPieChart = () => {
    if (affiliationBreakdown.length === 0) return null;

    let accumulatedPercent = 0;
    return (
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {affiliationBreakdown.map((item, idx) => {
            const strokeDasharray = `${item.percent} ${100 - item.percent}`;
            const strokeDashoffset = -accumulatedPercent;
            accumulatedPercent += item.percent;

            return (
              <circle
                key={idx}
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke={item.color}
                strokeWidth="4.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute text-center pointer-events-none">
          <p className="text-xl font-black text-amber-600 font-mono">{filteredData.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">คนทั้งหมด</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans selection:bg-amber-100 selection:text-amber-900">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-600 transition-colors flex items-center gap-1 font-semibold">
            ← Back to home
          </Link>
          <span className="text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 shadow-sm">
            Viewing Fixed Google Sheets
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs text-center font-medium shadow-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Header Banner - โทนขาวสว่าง ขอบทองอ่อน */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img
                src="https://mahidol.ac.th/wp-content/uploads/2020/06/mahidol-logo-gold.png"
                alt="Mahidol Logo"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 tracking-wider uppercase">Mahidol University</p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
              </h1>
              <p className="text-xs text-slate-500 tracking-wider mt-0.5 font-medium">
                EXECUTIVE ANALYTICS & SATISFACTION INSIGHT
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-slate-100 lg:border-t-0 pt-3 lg:pt-0">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}></span>
                <span className={`text-xs font-bold ${loading ? "text-amber-600" : "text-emerald-600"}`}>
                  {loading ? "CONNECTING..." : "LIVE / CONNECTED"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Last Updated: {lastUpdated || "กำลังโหลด..."}</p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* 🎨 Multi-Filter Bar - โทนขาวสว่าง สะอาดตา */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            
            {/* Filter 1: ช่วงเวลา */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
              <span className="text-amber-700 font-bold">📅 ช่วงเวลา:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium text-xs"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="WEEK">รายสัปดาห์ (7 วันล่าสุด)</option>
                <option value="MONTH">รายเดือน (30 วันล่าสุด)</option>
                <option value="YEAR">รายปี (365 วันล่าสุด)</option>
              </select>
            </div>

            {/* Filter 2: ช่วงอายุ */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
              <span className="text-amber-700 font-bold">🎂 ช่วงอายุ:</span>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium text-xs"
              >
                <option value="ALL">ทุกช่วงอายุ</option>
                {ageGroupList.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: สังกัด */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors">
              <span className="text-amber-700 font-bold">📌 สังกัด:</span>
              <select
                value={selectedAffiliation}
                onChange={(e) => setSelectedAffiliation(e.target.value)}
                className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium text-xs max-w-[180px] truncate"
              >
                <option value="ALL">ทั้งหมด ({data.length} คน)</option>
                {affiliationsList.map((aff) => (
                  <option key={aff} value={aff}>{aff}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex items-center justify-end gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 self-start md:self-auto font-medium">
            <span className="text-slate-500">แสดงผลข้อมูล:</span>
            <span className="text-amber-600 font-bold font-mono text-sm">{filteredData.length}</span>
            <span className="text-slate-400">/ {data.length} รายการ</span>
          </div>
        </div>

        {/* Executive Summary Box - กล่องไฮไลต์โทนทอง/ส้มสว่าง */}
        {executiveInsights && (
          <div className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-white border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-700 tracking-wider uppercase flex items-center gap-1.5">
                💡 Executive Insight Summary
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                คะแนนภาพรวมเฉลี่ยเท่ากับ <span className="text-emerald-600 font-bold text-sm">{executiveInsights.grandAvg} / 5.00</span> 
                โดยหัวข้อที่ได้คะแนนสูงสุดคือ <span className="text-amber-800 font-bold">"{executiveInsights.highest.title}" ({executiveInsights.highest.avg})</span> 
                และส่วนที่ควรพัฒนาคือ <span className="text-amber-800 font-bold">"{executiveInsights.lowest.title}" ({executiveInsights.lowest.avg})</span>
              </p>
            </div>
          </div>
        )}

        {/* Visual Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Custom Horizontal Bar Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5">
              📊 คะแนนความพึงพอใจแยกรายหัวข้อ (คะแนนเต็ม 5.00)
            </h2>
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-2">
              {itemScores.map((item, idx) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 truncate max-w-[80%] font-semibold">{item.title}</span>
                    <span className="font-mono font-bold text-amber-600">{item.avg.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        width: `${(item.avg / 5) * 100}%`,
                        backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5">
              🍕 สัดส่วนผู้ตอบจำแนกตามหน่วยงาน
            </h2>
            
            {renderPieChart()}

            <div className="space-y-2 pt-2 border-t border-slate-100 max-h-[160px] overflow-y-auto pr-1">
              {affiliationBreakdown.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 truncate font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono shrink-0">{item.count} คน ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Scorecard Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5">
            📋 ตารางคะแนนสรุปอย่างละเอียด (DETAILED SCORECARD)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">หมวดหมู่</th>
                  <th className="py-2.5 px-3">หัวข้อประเมิน</th>
                  <th className="py-2.5 px-3 text-center">คะแนนเฉลี่ย (5.00)</th>
                  <th className="py-2.5 px-3 text-center">ระดับคุณภาพ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itemScores.map((item) => (
                  <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-amber-700">{item.category}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{item.title}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 text-sm">{item.avg.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center">{getScoreBadge(item.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              💬 FEEDBACK & SUGGESTIONS ({searchedFeedback.length} ข้อเสนอแนะ)
            </h2>
            <input
              type="text"
              placeholder="🔍 ค้นหาในข้อเสนอแนะ..."
              value={feedbackSearch}
              onChange={(e) => setFeedbackSearch(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-500 w-full sm:w-64 shadow-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {searchedFeedback.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center col-span-2">ไม่พบข้อเสนอแนะที่ตรงตามเงื่อนไข</p>
            ) : (
              searchedFeedback.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1 hover:border-amber-300 transition-colors">
                  <div className="flex justify-between items-center text-[10px] text-amber-700 font-mono font-semibold">
                    <span>{item.affiliation || "ไม่ระบุสังกัด"}</span>
                    <span>{item.timestamp || "N/A"}</span>
                  </div>
                  <p className="text-slate-800 italic">"{item.feedback}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
