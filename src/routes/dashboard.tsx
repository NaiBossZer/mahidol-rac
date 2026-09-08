import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec";

interface SurveyResponse {
  timestamp?: string;
  ageGroup?: string;
  affiliation?: string;
  feedback?: string;
  [key: string]: string | number | undefined;
}

const QUESTION_MAP: Record<string, { title: string; category: string }> = {
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
};

const COLOR_PALETTE = ["#0A2E4D", "#801818", "#2D5A27", "#F5B800", "#0284c7", "#7c3aed", "#e11d48"];
const MONTH_NAMES = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedAge, setSelectedAge] = useState("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState("ALL");

  useEffect(() => {
    if (sessionStorage.getItem("dashboard_auth") !== "true") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleResetFilter = () => {
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
    setSelectedAge("ALL");
    setSelectedAffiliation("ALL");
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, { method: "GET", redirect: "follow" });
      if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อ Google Apps Script ได้");
      const json = await res.json();

      if (Array.isArray(json)) {
        const valid = json.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            Object.values(item).some(
              (v) => v !== null && v !== undefined && String(v).trim() !== "",
            ),
        );
        setData(valid);
      } else {
        setData([]);
      }

      const now = new Date();
      setLastUpdated(
        `${now.getDate()} ส.ค. ${now.getFullYear() + 543} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      );
    } catch {
      setErrorMsg("ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณากด Refresh อีกครั้ง");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const parseNum = (v: unknown): number => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  // Filter options derived from dataset
  const availableYears = useMemo(() => {
    const s = new Set<string>();
    data.forEach(
      (d) =>
        d.timestamp &&
        !isNaN(new Date(d.timestamp).getTime()) &&
        s.add(new Date(d.timestamp).getFullYear().toString()),
    );
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, [data]);

  const availableMonths = useMemo(() => {
    const s = new Set<number>();
    data.forEach((d) => {
      if (d.timestamp) {
        const date = new Date(d.timestamp);
        if (
          !isNaN(date.getTime()) &&
          (selectedYear === "ALL" || date.getFullYear().toString() === selectedYear)
        ) {
          s.add(date.getMonth());
        }
      }
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [data, selectedYear]);

  const ageGroupList = useMemo(
    () => Array.from(new Set(data.map((d) => d.ageGroup?.trim()).filter(Boolean))) as string[],
    [data],
  );
  const affiliationsList = useMemo(
    () => Array.from(new Set(data.map((d) => d.affiliation?.trim() || "ไม่ระบุ"))),
    [data],
  );

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          if (selectedYear !== "ALL" && d.getFullYear().toString() !== selectedYear) return false;
          if (selectedMonth !== "ALL" && d.getMonth().toString() !== selectedMonth) return false;
        }
      }
      if (selectedAge !== "ALL" && (item.ageGroup?.trim() || "") !== selectedAge) return false;
      if (
        selectedAffiliation !== "ALL" &&
        (item.affiliation?.trim() || "ไม่ระบุ") !== selectedAffiliation
      )
        return false;
      return true;
    });
  }, [data, selectedYear, selectedMonth, selectedAge, selectedAffiliation]);

  // Question Scores Calculation
  const itemScores = useMemo(() => {
    return Object.entries(QUESTION_MAP).map(([key, info]) => {
      let sum = 0,
        count = 0;
      filteredData.forEach((item) => {
        const val = parseNum(item[key]);
        if (val > 0) {
          sum += val;
          count++;
        }
      });
      return {
        key,
        title: info.title,
        category: info.category,
        avg: count > 0 ? parseFloat((sum / count).toFixed(2)) : 0,
      };
    });
  }, [filteredData]);

  // Scores grouped by Category
  const categoryGroupedScores = useMemo(() => {
    const groups: Record<string, { category: string; items: typeof itemScores }> = {};
    itemScores.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = { category: item.category, items: [] };
      groups[item.category]!.items.push(item);
    });

    return Object.values(groups)
      .map((g) => {
        const avg = g.items.length
          ? parseFloat((g.items.reduce((acc, i) => acc + i.avg, 0) / g.items.length).toFixed(2))
          : 0;
        return { ...g, avg, items: [...g.items].sort((a, b) => b.avg - a.avg) };
      })
      .sort((a, b) => b.avg - a.avg);
  }, [itemScores]);

  // Summary Metrics
  const cardMetrics = useMemo(() => {
    if (!itemScores.length || !filteredData.length) return null;
    const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
    const rawGrandAvg = itemScores.reduce((acc, curr) => acc + curr.avg, 0) / itemScores.length;
    return {
      highest: sorted[0]!,
      lowest: sorted[sorted.length - 1]!,
      grandAvgPercent: Math.round((rawGrandAvg / 5) * 100),
      totalQuestions: itemScores.length,
    };
  }, [itemScores, filteredData]);

  // Affiliation Breakdown for Donut Chart
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
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length]!,
    }));
  }, [filteredData]);

  // Feedback Text Analysis
  const feedbackAnalysis = useMemo(() => {
    const raw = filteredData
      .filter((d) => d.feedback && d.feedback.trim() !== "")
      .map((d) => ({ text: d.feedback!.trim(), affiliation: d.affiliation || "ไม่ระบุ" }));

    let positiveCount = 0,
      followUpCount = 0,
      urgentCount = 0;
    const topicCounts: Record<string, number> = {
      การให้บริการ: 0,
      "กิจกรรม/การเรียนรู้": 0,
      "สิ่งแวดล้อม/สถานที่": 0,
      "อุปกรณ์/สื่อ": 0,
    };

    const parsedList = raw.map((item) => {
      const t = item.text.toLowerCase();
      let status: "positive" | "followup" | "urgent" | "general" = "positive";
      let tag = "ทั่วไป";

      if (
        t.includes("ด่วน") ||
        t.includes("ปรับปรุง") ||
        t.includes("แย่") ||
        t.includes("เสีย") ||
        t.includes("ช้า")
      ) {
        status = "urgent";
        urgentCount++;
      } else if (
        t.includes("ควร") ||
        t.includes("อยากให้") ||
        t.includes("ติดตาม") ||
        t.includes("เพิ่ม")
      ) {
        status = "followup";
        followUpCount++;
      } else if (
        t.includes("ดี") ||
        t.includes("ประทับใจ") ||
        t.includes("ชอบ") ||
        t.includes("เยี่ยม") ||
        t.includes("ขอบคุณ")
      ) {
        status = "positive";
        positiveCount++;
      }

      if (
        t.includes("บริการ") ||
        t.includes("พนักงาน") ||
        t.includes("ต้อนรับ") ||
        t.includes("เจ้าหน้าที่")
      ) {
        tag = "การให้บริการ";
        topicCounts["การให้บริการ"]!++;
      } else if (
        t.includes("จอดรถ") ||
        t.includes("สถานที่") ||
        t.includes("ห้อง") ||
        t.includes("แอร์") ||
        t.includes("สะอาด")
      ) {
        tag = "สิ่งแวดล้อม/สถานที่";
        topicCounts["สิ่งแวดล้อม/สถานที่"]!++;
      } else if (
        t.includes("อุปกรณ์") ||
        t.includes("สื่อ") ||
        t.includes("ไมค์") ||
        t.includes("สไลด์")
      ) {
        tag = "อุปกรณ์/สื่อ";
        topicCounts["อุปกรณ์/สื่อ"]!++;
      } else {
        tag = "กิจกรรม/การเรียนรู้";
        topicCounts["กิจกรรม/การเรียนรู้"]!++;
      }

      return { ...item, status, tag };
    });

    return {
      total: raw.length,
      positiveCount,
      followUpCount,
      urgentCount,
      topicCounts,
      maxTopicCount: Math.max(...Object.values(topicCounts), 1),
      latestList: parsedList.slice(0, 5),
    };
  }, [filteredData]);

  const getScoreBadge = (score: number) => {
    if (score >= 4.5)
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-[#2D5A27] font-semibold border border-emerald-200">
          🟢 ดีมากที่สุด
        </span>
      );
    if (score >= 3.5)
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-[#0A2E4D] font-semibold border border-sky-200">
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
      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-[#801818] font-semibold border border-rose-200">
        🔴 ควรปรับปรุง
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-['Mitr'] selection:bg-[#801818] selection:text-white flex flex-col justify-between">
      {/* Shared Navbar */}
      <AppNavbar />

      <main className="grow py-6 sm:py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 w-full">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#002D62] via-[#801818] to-[#961E1E] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-[#F5B800] font-bold text-[10px] tracking-wider px-3 py-0.5 rounded-full uppercase border border-white/20">
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
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-[#801818] text-xs font-semibold flex items-center justify-between">
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
              onClick={handleResetFilter}
              className="text-slate-500 hover:text-[#801818] font-semibold text-xs transition-colors cursor-pointer bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200"
            >
              ✕ ล้างตัวกรอง
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Year Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-[#0A2E4D] font-bold">📅 ปี:</span>
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
                <span className="text-[#0A2E4D] font-bold">🗓️ เดือน:</span>
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
                <span className="text-[#0A2E4D] font-bold">🎂 ช่วงอายุ:</span>
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
                <span className="text-[#0A2E4D] font-bold">📌 สังกัด:</span>
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
              <span className="text-[#801818] font-bold font-mono text-sm">
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
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0A2E4D] flex items-center justify-center text-lg font-bold">
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
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F5B800] flex items-center justify-center text-lg font-bold">
                ⭐
              </div>
              <p className="text-xs text-slate-500 font-semibold">คะแนนเฉลี่ยรวม (ร้อยละ)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#F5B800] font-mono">
                  {cardMetrics.grandAvgPercent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                คำนวณจาก {cardMetrics.totalQuestions} หัวข้อประเมิน
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#801818] flex items-center justify-center text-lg font-bold">
                🏅
              </div>
              <p className="text-xs text-slate-500 font-semibold">หัวข้อที่ได้คะแนนสูงสุด</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {cardMetrics.highest.title}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#801818] font-mono">
                  {cardMetrics.highest.avg.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">/ 5.00</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2D5A27] flex items-center justify-center text-lg font-bold">
                🛠️
              </div>
              <p className="text-xs text-slate-500 font-semibold">หัวข้อที่ควรพัฒนาต่อ</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {cardMetrics.lowest.title}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#2D5A27] font-mono">
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
            <h2 className="text-sm font-bold text-[#0A2E4D] border-b border-slate-100 pb-3 flex items-center gap-2">
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
                      <span className="w-2.5 h-2.5 rounded-full bg-[#801818]" />
                      <span>ด้าน{catGroup.category}</span>
                    </div>
                    <div className="bg-white px-2.5 py-0.5 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-400 text-[11px] mr-1">เฉลี่ย:</span>
                      <span className="font-mono font-bold text-[#801818]">
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
              <h2 className="text-sm font-bold text-[#0A2E4D] border-b border-slate-100 pb-3 flex items-center gap-2">
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
                      <p className="text-2xl font-bold text-[#0A2E4D] font-mono">
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
              <p className="text-2xl font-bold text-[#0A2E4D] font-mono">
                {feedbackAnalysis.total}
              </p>
              <p className="text-xs font-semibold text-[#0A2E4D]">🔵 ข้อเสนอแนะทั้งหมด</p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-[#2D5A27] font-mono">
                {feedbackAnalysis.positiveCount}
              </p>
              <p className="text-xs font-semibold text-[#2D5A27]">🟢 เชิงบวก / ชื่นชม</p>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-amber-800 font-mono">
                {feedbackAnalysis.followUpCount}
              </p>
              <p className="text-xs font-semibold text-amber-900">🟡 ควรติดตาม</p>
            </div>
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-2xl font-bold text-[#801818] font-mono">
                {feedbackAnalysis.urgentCount}
              </p>
              <p className="text-xs font-semibold text-[#801818]">🔴 ควรปรับปรุงเร่งด่วน</p>
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
                          className="h-full bg-[#0A2E4D] rounded-full transition-all duration-500"
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
                        bg: "bg-emerald-100 text-[#2D5A27] border-emerald-200",
                        label: "🟢 ชื่นชม",
                      },
                      followup: {
                        bg: "bg-amber-100 text-amber-800 border-amber-200",
                        label: "🟡 ควรติดตาม",
                      },
                      urgent: {
                        bg: "bg-rose-100 text-[#801818] border-rose-200",
                        label: "🔴 เร่งด่วน",
                      },
                      general: {
                        bg: "bg-sky-100 text-[#0A2E4D] border-sky-200",
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
      <footer className="bg-[#071F34] text-slate-300 py-8 border-t border-slate-800 mt-12 text-center text-xs">
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
