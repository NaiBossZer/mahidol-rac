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

const COLOR_PALETTE = ["#0A2E4D", "#801818", "#2D5A27", "#F5B800", "#0284c7", "#7c3aed", "#e11d48"];

const MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedAge, setSelectedAge] = useState<string>("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("ALL");

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

  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    data.forEach((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          yearSet.add(d.getFullYear().toString());
        }
      }
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [data]);

  const availableMonths = useMemo(() => {
    const monthSet = new Set<number>();
    data.forEach((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          if (selectedYear === "ALL" || d.getFullYear().toString() === selectedYear) {
            monthSet.add(d.getMonth());
          }
        }
      }
    });
    return Array.from(monthSet).sort((a, b) => a - b);
  }, [data, selectedYear]);

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
    return data.filter((item) => {
      if (item.timestamp) {
        const itemDate = new Date(item.timestamp);
        if (!isNaN(itemDate.getTime())) {
          if (selectedYear !== "ALL" && itemDate.getFullYear().toString() !== selectedYear) {
            return false;
          }
          if (selectedMonth !== "ALL" && itemDate.getMonth().toString() !== selectedMonth) {
            return false;
          }
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
  }, [data, selectedYear, selectedMonth, selectedAge, selectedAffiliation]);

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

  const categoryGroupedScores = useMemo(() => {
    const groups: Record<string, { category: string; avg: number; items: typeof itemScores }> = {};

    itemScores.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = { category: item.category, avg: 0, items: [] };
      }
      groups[item.category].items.push(item);
    });

    const resultList = Object.values(groups).map((group) => {
      const total = group.items.reduce((sum, i) => sum + i.avg, 0);
      const avg = group.items.length > 0 ? parseFloat((total / group.items.length).toFixed(2)) : 0;
      const sortedItems = [...group.items].sort((a, b) => b.avg - a.avg);

      return {
        ...group,
        avg,
        items: sortedItems,
      };
    });

    return resultList.sort((a, b) => b.avg - a.avg);
  }, [itemScores]);

  const cardMetrics = useMemo(() => {
    if (itemScores.length === 0 || filteredData.length === 0) return null;

    const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    const rawGrandAvg = itemScores.reduce((acc, curr) => acc + curr.avg, 0) / itemScores.length;
    const grandAvgPercent = Math.round((rawGrandAvg / 5) * 100);

    return {
      highest,
      lowest,
      grandAvgPercent,
      totalQuestions: itemScores.length,
    };
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

  const feedbackAnalysis = useMemo(() => {
    const rawFeedbacks = filteredData
      .filter((d) => d.feedback && d.feedback.trim() !== "")
      .map((d) => ({
        text: d.feedback!.trim(),
        affiliation: d.affiliation || "ไม่ระบุ",
        timestamp: d.timestamp || "N/A",
      }));

    let positiveCount = 0;
    let followUpCount = 0;
    let urgentCount = 0;
    let generalCount = 0;

    const topicCounts: Record<string, number> = {
      "การให้บริการ": 0,
      "กิจกรรม/การเรียนรู้": 0,
      "สิ่งแวดล้อม/สถานที่": 0,
      "อุปกรณ์/สื่อ": 0,
    };

    const parsedList = rawFeedbacks.map((item) => {
      const t = item.text.toLowerCase();
      let status: "positive" | "followup" | "urgent" | "general" = "positive";
      let tag = "ทั่วไป";

      if (t.includes("ด่วน") || t.includes("ปรับปรุง") || t.includes("แย่") || t.includes("เสีย") || t.includes("ช้า")) {
        status = "urgent";
        urgentCount++;
      } else if (t.includes("ควร") || t.includes("อยากให้") || t.includes("ติดตาม") || t.includes("เพิ่ม")) {
        status = "followup";
        followUpCount++;
      } else if (t.includes("ดี") || t.includes("ประทับใจ") || t.includes("ชอบ") || t.includes("เยี่ยม") || t.includes("ขอบคุณ")) {
        status = "positive";
        positiveCount++;
      } else {
        status = "general";
        generalCount++;
      }

      if (t.includes("บริการ") || t.includes("พนักงาน") || t.includes("ต้อนรับ") || t.includes("เจ้าหน้าที่")) {
        tag = "การให้บริการ";
        topicCounts["การให้บริการ"]++;
      } else if (t.includes("จอดรถ") || t.includes("สถานที่") || t.includes("ห้อง") || t.includes("แอร์") || t.includes("สะอาด")) {
        tag = "สิ่งแวดล้อม/สถานที่";
        topicCounts["สิ่งแวดล้อม/สถานที่"]++;
      } else if (t.includes("อุปกรณ์") || t.includes("สื่อ") || t.includes("ไมค์") || t.includes("สไลด์")) {
        tag = "อุปกรณ์/สื่อ";
        topicCounts["อุปกรณ์/สื่อ"]++;
      } else {
        tag = "กิจกรรม/การเรียนรู้";
        topicCounts["กิจกรรม/การเรียนรู้"]++;
      }

      return {
        ...item,
        status,
        tag,
      };
    });

    const maxTopicCount = Math.max(...Object.values(topicCounts), 1);

    return {
      total: rawFeedbacks.length,
      positiveCount,
      followUpCount,
      urgentCount,
      generalCount,
      topicCounts,
      maxTopicCount,
      latestList: parsedList.slice(0, 5),
    };
  }, [filteredData]);

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-[#2D5A27] font-semibold border border-emerald-200">🟢 ดีมากที่สุด</span>;
    if (score >= 3.5) return <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-[#0A2E4D] font-semibold border border-sky-200">🔵 ดีมาก</span>;
    if (score >= 2.5) return <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-semibold border border-amber-200">🟡 ปานกลาง</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-[#801818] font-semibold border border-rose-200">🔴 ควรปรับปรุง</span>;
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
          <p className="text-2xl font-bold text-[#0A2E4D] font-mono">{filteredData.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">คนทั้งหมด</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-['Mitr'] selection:bg-[#801818] selection:text-white flex flex-col justify-between">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#0A2E4D] text-white shadow-md border-b border-[#08233C]">
        <nav className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* ฝั่งซ้าย: โลโก้ 3 ตัว + ข้อความหน่วยงาน */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/envi-logo.jpg" alt="Envi Mahidol Logo" className="h-full object-contain" />
                </div>
                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/mahidol-logo.png" alt="Mahidol University Logo" className="h-full object-contain" />
                </div>
                <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/social-engagement-logo.png" alt="Social Engagement Logo" className="h-full object-contain" />
                </div>
              </div>

              <div className="w-[1px] h-8 sm:h-10 bg-white/20 shrink-0 hidden sm:block"></div>

              <div className="hidden sm:block">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-snug">
                  งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#F5B800] block leading-tight mt-0.5">
                  คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
                </span>
              </div>
            </div>

            {/* ฝั่งขวา: เมนูนำทาง */}
            <div className="hidden xl:flex items-center space-x-6 text-xs sm:text-sm font-normal text-slate-200 shrink-0">
              <Link to="/" className="hover:text-[#F5B800] transition-colors py-1">
                หน้าแรก
              </Link>
              <Link to="/survey" className="hover:text-[#F5B800] transition-colors py-1">
                แบบสอบถาม
              </Link>
              <Link to="/dashboard" className="hover:text-[#F5B800] transition-colors py-1 font-semibold text-[#F5B800]">
                สรุปผลแบบประเมินความพึงพอใจ
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="xl:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-[#F5B800]"
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>

          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-white/15 space-y-2 text-sm font-normal">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
                หน้าแรก
              </Link>
              <Link to="/survey" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">
                แบบสอบถาม
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-[#F5B800] text-[#0A2E4D] font-semibold text-center mt-2">
                สรุปผลแบบประเมินความพึงพอใจ
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="grow py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 w-full">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#801818] transition-colors flex items-center gap-1.5 font-semibold text-slate-600">
            <span>←</span> กลับสู่หน้าแรก
          </Link>
          <span className="text-[#0A2E4D] font-semibold bg-sky-50 px-3 py-1 rounded-full border border-sky-200/80 shadow-xs w-fit">
            🔗 เชื่อมต่อระบบ Google Sheets เรียบร้อยแล้ว
          </span>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-[#801818] p-3 rounded-2xl text-xs text-center font-medium shadow-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* HERO HEADER BANNER (สไตล์แดงครั่งเกรดพรีเมียม) */}
        <div className="bg-gradient-to-r from-[#701414] via-[#801818] to-[#961E1E] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/Mahidol_U.jpg"
                alt="Mahidol Logo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "/mahidol-logo.png";
                }}
              />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-[#F5B800] font-medium text-xs tracking-wide px-3 py-0.5 rounded-full border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#F5B800] animate-pulse"></span>
                Mahidol University Satisfaction Insight
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white drop-shadow-sm">
                พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
              </h1>
              <p className="text-xs sm:text-sm text-rose-100/90 font-light">
                สรุปผลแบบประเมินความพึงพอใจและวิเคราะห์ข้อมูลผู้เข้าร่วมกิจกรรมเชิงลึก
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-white/15 lg:border-t-0 pt-4 lg:pt-0 relative z-10">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                <span className={`text-xs font-bold ${loading ? "text-amber-200" : "text-emerald-200"}`}>
                  {loading ? "กำลังเชื่อมต่อข้อมูล..." : "เชื่อมต่อสด (LIVE)"}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/80 mt-0.5">อัปเดตล่าสุด: {lastUpdated || "กำลังโหลด..."}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/25 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
              >
                🔄 รีเฟรช
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-900/60 border border-rose-400/40 text-rose-100 hover:bg-rose-900/90 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

        {/* MULTI-FILTER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 text-[#0A2E4D] font-bold text-sm">🎛️</span>
              <h2 className="font-bold text-slate-800 text-sm">ปรับเลือกเงื่อนไขข้อมูลที่ต้องการดู</h2>
            </div>
            <button
              type="button"
              onClick={handleResetFilter}
              className="text-slate-500 hover:text-[#801818] font-semibold flex items-center gap-1 text-xs transition-colors cursor-pointer bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200"
            >
              ✕ ล้างตัวกรอง
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Filter Year */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shadow-2xs focus-within:border-[#0A2E4D] transition-colors">
                <span className="text-[#0A2E4D] font-bold">📅 ปี:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth("ALL");
                  }}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs"
                >
                  <option value="ALL">ทุกปี</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      พ.ศ. {Number(year) + 543} ({year})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Month */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shadow-2xs focus-within:border-[#0A2E4D] transition-colors">
                <span className="text-[#0A2E4D] font-bold">🗓️ เดือน:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs"
                >
                  <option value="ALL">ทุกเดือน</option>
                  {availableMonths.map((mIdx) => (
                    <option key={mIdx} value={mIdx.toString()}>
                      {MONTH_NAMES
