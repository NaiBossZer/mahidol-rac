import { useCallback, useEffect, useMemo, useState } from "react";
import { QUESTION_MAP } from "../data/questionMap";
import type { SurveyResponse, ScoreItem } from "../types";
import { supabase } from "@/lib/supabase";

type ActivityOption = { id: string; title: string; activity_date: string; category: string | null; featured_image: string | null; status: "draft" | "published" | "archived" };

const parseNum = (value: unknown) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const mapSurveyRow = (row: Record<string, unknown>): SurveyResponse => ({
  ...row,
  timestamp: typeof row.submitted_at === "string" ? row.submitted_at : undefined,
  ageGroup: typeof row.age_group === "string" ? row.age_group : undefined,
  affiliation: typeof row.affiliation === "string" ? row.affiliation : undefined,
  feedback: typeof row.feedback === "string" ? row.feedback : undefined,
});

export function useDashboardData() {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(() => new URLSearchParams(window.location.search).get("activity") || "ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedAge, setSelectedAge] = useState("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState("ALL");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const [responseResult, activityResult] = await Promise.all([
        supabase.from("survey_responses").select("*").order("submitted_at", { ascending: false }),
        supabase.from("activities").select("id,title,activity_date,category,featured_image,status").order("activity_date", { ascending: false }),
      ]);

      if (responseResult.error) throw responseResult.error;
      if (activityResult.error) throw activityResult.error;
      setData((responseResult.data ?? []).map((row) => mapSurveyRow(row as Record<string, unknown>)));
      setActivities((activityResult.data ?? []) as ActivityOption[]);
      const now = new Date();
      setLastUpdated(`${now.getDate()} ${now.toLocaleString("th-TH", { month: "short" })} ${now.getFullYear() + 543} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    } catch (error) {
      console.error("Failed to load satisfaction dashboard from Supabase", error);
      setErrorMsg("ไม่สามารถดึงข้อมูลจาก Supabase ได้ กรุณาตรวจสอบสิทธิ์ Admin และกด Refresh อีกครั้ง");
      setData([]);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const activityMap = useMemo(() => new Map(activities.map((activity) => [activity.id, activity])), [activities]);
  const selectedActivityInfo = selectedActivity === "ALL" ? null : activityMap.get(selectedActivity) || null;

  const availableYears = useMemo(() => Array.from(new Set(data.flatMap((item) => {
    const date = item.timestamp ? new Date(item.timestamp) : null;
    return date && !Number.isNaN(date.getTime()) ? [String(date.getFullYear())] : [];
  }))).sort((a, b) => Number(b) - Number(a)), [data]);

  const availableMonths = useMemo(() => Array.from(new Set(data.flatMap((item) => {
    const date = item.timestamp ? new Date(item.timestamp) : null;
    return date && !Number.isNaN(date.getTime()) && (selectedYear === "ALL" || String(date.getFullYear()) === selectedYear) ? [date.getMonth()] : [];
  }))).sort((a, b) => a - b), [data, selectedYear]);

  const ageGroupList = useMemo(() => Array.from(new Set(data.map((item) => item.ageGroup?.trim()).filter(Boolean))) as string[], [data]);
  const affiliationsList = useMemo(() => Array.from(new Set(data.map((item) => item.affiliation?.trim() || "ไม่ระบุ"))), [data]);

  const filteredData = useMemo(() => data.filter((item) => {
    if (selectedActivity !== "ALL" && String(item.activity_id || "") !== selectedActivity) return false;
    const date = item.timestamp ? new Date(item.timestamp) : null;
    if (date && !Number.isNaN(date.getTime())) {
      if (selectedYear !== "ALL" && String(date.getFullYear()) !== selectedYear) return false;
      if (selectedMonth !== "ALL" && String(date.getMonth()) !== selectedMonth) return false;
    }
    if (selectedAge !== "ALL" && (item.ageGroup?.trim() || "") !== selectedAge) return false;
    return selectedAffiliation === "ALL" || (item.affiliation?.trim() || "ไม่ระบุ") === selectedAffiliation;
  }), [data, selectedActivity, selectedYear, selectedMonth, selectedAge, selectedAffiliation]);

  const itemScores = useMemo<ScoreItem[]>(() => Object.entries(QUESTION_MAP).map(([key, info]) => {
    let sum = 0; let count = 0;
    filteredData.forEach((item) => { const value = parseNum(item[key]); if (value > 0) { sum += value; count++; } });
    return { key, title: info.title, category: info.category, avg: count ? Number((sum / count).toFixed(2)) : 0 };
  }), [filteredData]);

  const categoryGroupedScores = useMemo(() => {
    const groups: Record<string, { category: string; items: ScoreItem[] }> = {};
    itemScores.forEach((item) => { (groups[item.category] ??= { category: item.category, items: [] }).items.push(item); });
    return Object.values(groups).map((group) => ({ ...group, avg: group.items.length ? Number((group.items.reduce((sum, item) => sum + item.avg, 0) / group.items.length).toFixed(2)) : 0, items: [...group.items].sort((a, b) => b.avg - a.avg) })).sort((a, b) => b.avg - a.avg);
  }, [itemScores]);

  const cardMetrics = useMemo(() => {
    if (!itemScores.length || !filteredData.length) return null;
    const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
    return { highest: sorted[0]!, lowest: sorted.at(-1)!, grandAvgPercent: Math.round((itemScores.reduce((sum, item) => sum + item.avg, 0) / itemScores.length / 5) * 100), totalQuestions: itemScores.length };
  }, [itemScores, filteredData]);

  const affiliationBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach((item) => { const key = item.affiliation?.trim() || "ไม่ระบุ"; counts[key] = (counts[key] || 0) + 1; });
    const total = filteredData.length || 1;
    return Object.entries(counts).map(([name, count], index) => ({ name, count, percent: Number(((count / total) * 100).toFixed(1)), color: ["var(--rac-brand-blue)", "var(--rac-brand-red)", "var(--rac-brand-green)", "var(--rac-brand-gold)", "#0284c7", "#7c3aed", "#e11d48"][index % 7]! }));
  }, [filteredData]);

  const feedbackAnalysis = useMemo(() => {
    const raw = filteredData.filter((item) => item.feedback?.trim()).map((item) => ({ text: item.feedback!.trim(), affiliation: item.affiliation || "ไม่ระบุ" }));
    let positiveCount = 0, followUpCount = 0, urgentCount = 0;
    const topicCounts: Record<string, number> = { การให้บริการ: 0, "กิจกรรม/การเรียนรู้": 0, "สิ่งแวดล้อม/สถานที่": 0, "อุปกรณ์/สื่อ": 0 };
    const latestList = raw.map((item) => {
      const text = item.text.toLowerCase(); let status: "positive" | "followup" | "urgent" | "general" = "positive"; let tag = "กิจกรรม/การเรียนรู้";
      if (["ด่วน", "ปรับปรุง", "แย่", "เสีย", "ช้า"].some((x) => text.includes(x))) { status = "urgent"; urgentCount++; }
      else if (["ควร", "อยากให้", "ติดตาม", "เพิ่ม"].some((x) => text.includes(x))) { status = "followup"; followUpCount++; }
      else if (["ดี", "ประทับใจ", "ชอบ", "เยี่ยม", "ขอบคุณ"].some((x) => text.includes(x))) positiveCount++;
      if (["บริการ", "พนักงาน", "ต้อนรับ", "เจ้าหน้าที่"].some((x) => text.includes(x))) tag = "การให้บริการ";
      else if (["จอดรถ", "สถานที่", "ห้อง", "แอร์", "สะอาด"].some((x) => text.includes(x))) tag = "สิ่งแวดล้อม/สถานที่";
      else if (["อุปกรณ์", "สื่อ", "ไมค์", "สไลด์"].some((x) => text.includes(x))) tag = "อุปกรณ์/สื่อ";
      topicCounts[tag]++; return { ...item, status, tag };
    });
    return { total: raw.length, positiveCount, followUpCount, urgentCount, topicCounts, maxTopicCount: Math.max(...Object.values(topicCounts), 1), latestList };
  }, [filteredData]);

  const resetFilters = () => { setSelectedActivity("ALL"); setSelectedYear("ALL"); setSelectedMonth("ALL"); setSelectedAge("ALL"); setSelectedAffiliation("ALL"); };

  return { data, activities, activityMap, selectedActivityInfo, loading, errorMsg, lastUpdated, fetchData, availableYears, availableMonths, ageGroupList, affiliationsList, filteredData, itemScores, categoryGroupedScores, cardMetrics, affiliationBreakdown, feedbackAnalysis, selectedActivity, selectedYear, selectedMonth, selectedAge, selectedAffiliation, setSelectedActivity, setSelectedYear, setSelectedMonth, setSelectedAge, setSelectedAffiliation, resetFilters };
}
