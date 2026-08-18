import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  // 🔒 ตรวจสอบการเข้าถึง: เช็กสิทธิ์ผ่าน sessionStorage (ปิดแท็บเมื่อไหร่ ต้องล็อกอินใหม่)
  beforeLoad: () => {
    const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
    if (!isAuth) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardPage,
});

// URL ล่าสุดจาก Deployment Version 13
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

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  // 🚪 ฟังก์ชันสำหรับออกจากระบบ (ลบค่าใน sessionStorage)
  const handleLogout = () => {
    sessionStorage.removeItem("dashboard_auth");
    navigate({ to: "/login" });
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "GET",
        redirect: "follow",
      });

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

  const calcGlobalAverage = () => {
    if (!Array.isArray(data) || data.length === 0) return "0.00";
    const keys: (keyof SurveyResponse)[] = [
      "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall",
      "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
      "p4_knowledge", "p4_inspiration", "p4_communityResource", "p4_futureReturn"
    ];

    let totalSum = 0;
    let totalCount = 0;

    data.forEach((item) => {
      keys.forEach((k) => {
        const val = parseNum(item[k]);
        if (val > 0) {
          totalSum += val;
          totalCount += 1;
        }
      });
    });

    return totalCount > 0 ? (totalSum / totalCount).toFixed(2) : "0.00";
  };

  const calcGroupPercentage = (keys: (keyof SurveyResponse)[]) => {
    if (!Array.isArray(data) || data.length === 0) return "0.0";
    let totalSum = 0;
    let validRespondentCount = 0;

    data.forEach((item) => {
      let hasValidScore = false;
      keys.forEach((k) => {
        const val = parseNum(item[k]);
        if (val > 0) {
          totalSum += val;
          hasValidScore = true;
        }
      });
      if (hasValidScore) validRespondentCount++;
    });

    const totalMax = validRespondentCount * keys.length * 5;
    return totalMax > 0 ? ((totalSum / totalMax) * 100).toFixed(1) : "0.0";
  };

  const totalRespondents = Array.isArray(data) ? data.length : 0;
  const overallAvg = calcGlobalAverage();
  const satisfactionPct = calcGroupPercentage([
    "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall",
    "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
    "p4_knowledge", "p4_inspiration", "p4_communityResource", "p4_futureReturn"
  ]);
  const learningImpactPct = calcGroupPercentage([
    "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
    "p4_knowledge", "p4_inspiration", "p4_communityResource"
  ]);
  const eventExpPct = calcGroupPercentage([
    "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"
  ]);
  const futurePartPct = calcGroupPercentage(["p4_futureReturn"]);

  return (
    <div className="min-h-screen bg-[#0a1122] text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Navigation */}
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            ← Back to home
          </Link>
          <span className="text-amber-400/80 font-medium bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
            Viewing Fixed Google Sheets
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Main Header Banner */}
        <div className="bg-[#0f1a30] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-amber-400/30 flex items-center justify-center p-1 shadow-inner shrink-0">
              <img
                src="https://mahidol.ac.th/wp-content/uploads/2020/06/mahidol-logo-gold.png"
                alt="Mahidol Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                Mahidol University
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
              </h1>
              <p className="text-xs text-slate-400 tracking-wider mt-0.5">
                SATISFACTION & EVENT INSIGHT DASHBOARD
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-slate-800/80 lg:border-t-0 pt-3 lg:pt-0">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                <span className={`text-xs font-semibold ${loading ? "text-amber-400" : "text-emerald-400"}`}>
                  {loading ? "CONNECTING..." : "LIVE / CONNECTED"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Last Updated: {lastUpdated || "กำลังโหลด..."}
              </p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              🔄 Refresh
            </button>

            {/* 🚪 ปุ่มออกจากระบบ (ผูก onClick เรียบร้อยแล้ว) */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* 6 Key Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90">ผู้ตอบแบบสอบถาม</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white">{totalRespondents}</span>
              <span className="text-xs text-slate-400 font-medium">คน</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">ทั้งหมดในชีต</p>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90">ความพึงพอใจเฉลี่ย</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-400">{overallAvg}</span>
              <span className="text-xs text-slate-400">/ 5.00</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">คะแนนรวมเฉลี่ยทุกหัวข้อ</p>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90">ระดับความพึงพอใจ</p>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-emerald-400">{satisfactionPct}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">จาก 14 หัวข้อประเมิน</p>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90 tracking-wider">LEARNING IMPACT</p>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-emerald-400">{learningImpactPct}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">8 หัวข้อด้านความรู้/ครั่ง</p>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90 tracking-wider">EVENT EXPERIENCE</p>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-cyan-400">{eventExpPct}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">5 หัวข้อด้านการจัดงาน</p>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <p className="text-xs font-bold text-amber-400/90 tracking-wider">FUTURE PARTICIPATION</p>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-amber-400">{futurePartPct}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">ความสนใจเข้าร่วมอีกในอนาคต</p>
          </div>
        </div>

        {/* Detailed Data Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase border-b border-slate-800 pb-2">
              PARTICIPANT PROFILE (ข้อมูลผู้ตอบ)
            </h2>
            
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300">สัดส่วนหน่วยงานที่สังกัด</p>
              {!Array.isArray(data) || data.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">ยังไม่มีข้อมูล</p>
              ) : (
                Object.entries(
                  data.reduce((acc, curr) => {
                    const key = curr.affiliation?.trim() || "ไม่ระบุ";
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([label, count]) => {
                  const pct = totalRespondents ? Math.round((count / totalRespondents) * 100) : 0;
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[250px]">{label}</span>
                        <span className="text-slate-200 font-mono">{count} คน ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#0f1a30] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase border-b border-slate-800 pb-2">
              FEEDBACK & SUGGESTIONS (ข้อเสนอแนะ)
            </h2>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {!Array.isArray(data) || data.filter((d) => d.feedback?.trim()).length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะ</p>
              ) : (
                data
                  .filter((d) => d.feedback?.trim())
                  .map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300">
                      <p className="text-[10px] text-amber-400/80 font-mono mb-1">{item.timestamp || "N/A"}</p>
                      <p>"{item.feedback}"</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
