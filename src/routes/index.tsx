import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Loader2,
  Presentation,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import mahidolLogo from "@/assets/mahidol-logo.png";
import { getSurveyData } from "@/lib/survey.functions";
import { getAiInsight, type InsightResult } from "@/lib/insight.functions";
import {
  analyse,
  detectColumns,
  parseDateValue,
  shortLabel,
  toMean5,
  type Analysis,
} from "@/lib/analysis";
import { Empty, Gauge, Kpi, Panel, StatusDot } from "@/components/dashboard/primitives";
import {
  DonutChart,
  MatrixChart,
  RadarPanel,
  RatingBars,
  StackedRatingBars,
  TrendChart,
  VBarChart,
  ChannelBreakdown,
} from "@/components/dashboard/charts";
import { FilterBar, type FilterState } from "@/components/dashboard/FilterBar";
import { exportExcel, exportPdf, exportPptx } from "@/lib/export";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร | มหาวิทยาลัยมหิดล" },
      {
        name: "description",
        content:
          "Executive Dashboard สรุปความพึงพอใจและข้อมูลเชิงลึกจากพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร มหาวิทยาลัยมหิดล เชื่อมต่อข้อมูลสดจาก Google Sheets",
      },
      {
        property: "og:title",
        content: "Satisfaction & Event Insight Dashboard — ห้องการเรียนรู้ครั่งครบวงจร",
      },
      {
        property: "og:description",
        content:
          "KPI ความพึงพอใจ ประสบการณ์ผู้เข้าร่วม Learning Impact และ AI Insight สำหรับผู้บริหาร มหาวิทยาลัยมหิดล",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const EVENT = "พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร";

function fmt(n: number, d = 2) {
  return Number.isFinite(n) ? n.toFixed(d) : "-";
}

function ratingColorOf(mean5: number) {
  if (mean5 >= 4.5) return "var(--color-good)";
  if (mean5 >= 4.0) return "var(--color-gold)";
  return "var(--color-bad)";
}

function buildSummary(a: Analysis) {
  return JSON.stringify(
    {
      กิจกรรม: EVENT,
      จำนวนผู้ตอบ: a.responses,
      ความพึงพอใจโดยรวม: a.overall
        ? { ค่าเฉลี่ยเต็ม5: Number(fmt(a.overall.mean)), ร้อยละ: Number(fmt(a.overall.percent, 1)) }
        : null,
      รายข้อความพึงพอใจ: a.ratings.map((r) => ({
        หัวข้อ: r.header,
        ค่าเฉลี่ย: Number(fmt(toMean5(r))),
        SD: Number(fmt(r.sd)),
        ผู้ตอบ: r.n,
      })),
      ข้อมูลผู้ตอบ: a.categoricals.map((c) => ({
        คำถาม: c.header,
        คำตอบ: c.items.slice(0, 12).map((i) => ({ ตัวเลือก: i.label, จำนวน: i.count })),
      })),
      LearningImpactScore: a.learningImpactScore ? Number(fmt(a.learningImpactScore, 1)) : null,
      EventExperienceScore: a.experienceScore ? Number(fmt(a.experienceScore, 1)) : null,
      EventSuccessScore: a.successScore ? Number(fmt(a.successScore.score, 1)) : null,
      NPS: a.nps,
      ความต้องการเข้าร่วมอนาคต: a.futureParticipation,
      คำตอบปลายเปิด: a.openAnswers.slice(0, 150),
    },
    null,
    0,
  ).slice(0, 38000);
}

function Dashboard() {
  const fetchSurvey = useServerFn(getSurveyData);
  const requestInsight = useServerFn(getAiInsight);
  const [filters, setFilters] = useState<FilterState>({ values: {}, from: "", to: "" });

  const query = useQuery({
    queryKey: ["survey"],
    queryFn: () => fetchSurvey(),
    staleTime: 60_000,
    retry: 1,
  });

  const columns = useMemo(
    () => (query.data ? detectColumns(query.data.headers, query.data.rows) : []),
    [query.data],
  );

  const filterOptions = useMemo(() => {
    if (!query.data) return [];
    return columns
      .filter((c) => c.kind === "categorical" && c.uniqueValues <= 15 && c.uniqueValues > 1)
      .slice(0, 5)
      .map((c) => ({
        index: c.index,
        header: c.header,
        values: Array.from(
          new Set(query.data!.rows.map((r) => (r[c.index] ?? "").trim()).filter(Boolean)),
        ).sort(),
      }));
  }, [columns, query.data]);

  const tsColumn = columns.find((c) => c.kind === "timestamp");

  const filteredRows = useMemo(() => {
    if (!query.data) return [];
    const entries = Object.entries(filters.values).filter(([, v]) => v.length > 0);
    return query.data.rows.filter((row) => {
      for (const [idx, allowed] of entries) {
        if (!allowed.includes((row[Number(idx)] ?? "").trim())) return false;
      }
      if (tsColumn && (filters.from || filters.to)) {
        const d = parseDateValue(row[tsColumn.index] ?? "");
        if (!d) return false;
        if (filters.from && d < new Date(`${filters.from}T00:00:00`)) return false;
        if (filters.to && d > new Date(`${filters.to}T23:59:59`)) return false;
      }
      return true;
    });
  }, [query.data, filters, tsColumn]);

  const activeFilters =
    Object.values(filters.values).filter((v) => v.length).length +
    (filters.from ? 1 : 0) +
    (filters.to ? 1 : 0);

  const analysis = useMemo(
    () => (query.data ? analyse(query.data.headers, filteredRows, columns) : null),
    [query.data, filteredRows, columns],
  );

  const insightMutation = useMutation<InsightResult, Error, string>({
    mutationFn: (summary) => requestInsight({ data: { summary } }),
  });
  const insight = insightMutation.data ?? null;

  if (query.isPending) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="size-7 animate-spin text-gold" />
        <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูลจาก Google Sheets…</p>
      </main>
    );
  }

  if (query.isError || !query.data || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="panel max-w-lg text-center">
          <AlertTriangle className="mx-auto size-8 text-bad" />
          <h1 className="mt-3 text-lg font-semibold">ไม่สามารถเชื่อมต่อ Google Sheets ได้</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {query.error instanceof Error ? query.error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"}
          </p>
          <button
            onClick={() => query.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded border border-gold px-3 py-1.5 text-sm text-gold"
          >
            <RefreshCw className="size-4" /> ลองเชื่อมต่ออีกครั้ง
          </button>
        </div>
      </main>
    );
  }

  const a = analysis;
  const overallMean = a.overall?.mean ?? 0;
  const sortedRatings = [...a.ratings].sort((x, y) => y.percent - x.percent);
  const top3 = sortedRatings.slice(0, 3);
  const bottom3 = [...sortedRatings].reverse().slice(0, 3);
  const mainProfile = a.categoricals[0];
  const secondProfile = a.categoricals[1];
  const departmentTable = a.categoricals[0];

  const hasData = a.responses > 0;

  return (
    <main className="mx-auto max-w-[1700px] space-y-3 p-3 md:p-5">
      {/* HEADER */}
      <header className="panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={mahidolLogo} alt="ตราสัญลักษณ์มหาวิทยาลัยมหิดล" className="size-14 shrink-0" />
          <div>
            <p className="panel-title text-[11px]">Mahidol University</p>
            <h1 className="mt-0.5 text-xl leading-tight font-bold md:text-2xl">{EVENT}</h1>
            <p className="mt-0.5 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Satisfaction &amp; Event Insight Dashboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <div className="num-xl text-3xl text-gold">{a.responses}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div className="text-right text-[10px] text-muted-foreground">
            <StatusDot ok />
            <div className="mt-1">
              Last Updated:{" "}
              {new Date(query.data.fetchedAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
            </div>
            <div>ชีต: {query.data.sheetTitle}</div>
          </div>
          <div className="no-print flex items-center gap-1.5">
            <button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              className="flex items-center gap-1 rounded border border-gold/70 px-2.5 py-1.5 text-[11px] text-gold hover:bg-gold-soft"
            >
              <RefreshCw className={`size-3.5 ${query.isFetching ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={() => exportPdf()}
              className="flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-[11px] hover:border-gold/70"
            >
              <FileText className="size-3.5" /> PDF
            </button>
            <button
              onClick={() => exportExcel(a, query.data.headers, filteredRows)}
              className="flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-[11px] hover:border-gold/70"
            >
              <FileSpreadsheet className="size-3.5" /> Excel
            </button>
            <button
              onClick={() => exportPptx(a, insight)}
              className="flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-[11px] hover:border-gold/70"
            >
              <Presentation className="size-3.5" /> PPT
            </button>
          </div>
        </div>
      </header>

      {filterOptions.length || tsColumn ? (
        <div className="panel py-2">
          <FilterBar
            options={filterOptions}
            state={filters}
            onChange={setFilters}
            hasTimestamp={Boolean(tsColumn)}
            active={activeFilters}
          />
        </div>
      ) : null}

      {!hasData ? (
        <Empty label="ไม่พบข้อมูลตามเงื่อนไขที่เลือก (Empty Data)" />
      ) : (
        <>
          {/* KPI SUMMARY */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Kpi
              label="ผู้ตอบแบบสอบถาม"
              value={String(a.responses)}
              unit="คน"
              sub={activeFilters ? `กรองแล้ว จาก ${query.data.rows.length} คน` : "ทั้งหมดในชีต"}
              color="var(--color-gold)"
            />
            <Kpi
              label="ความพึงพอใจเฉลี่ย"
              value={a.overall ? fmt(overallMean) : "-"}
              unit="/ 5.00"
              sub={a.overall ? `SD เฉลี่ย ${fmt(a.overall.sd)}` : "ไม่พบคำถามแบบให้คะแนน"}
              color={ratingColorOf(overallMean)}
            />
            <Kpi
              label="ระดับความพึงพอใจ"
              value={a.overall ? fmt(a.overall.percent, 1) : "-"}
              unit="%"
              sub={`จาก ${a.ratings.length} หัวข้อประเมิน`}
              color={ratingColorOf(overallMean)}
            />
            <Kpi
              label="Learning Impact"
              value={a.learningImpactScore !== null ? fmt(a.learningImpactScore, 1) : "-"}
              unit="%"
              sub={
                a.groups.learning.length
                  ? `${a.groups.learning.length} หัวข้อด้านความรู้/ครั่ง`
                  : "ข้อมูลไม่เพียงพอ"
              }
              color="var(--color-lac)"
            />
            <Kpi
              label="Event Experience"
              value={a.experienceScore !== null ? fmt(a.experienceScore, 1) : "-"}
              unit="%"
              sub={
                a.groups.experience.length
                  ? `${a.groups.experience.length} หัวข้อด้านการจัดงาน`
                  : "ข้อมูลไม่เพียงพอ"
              }
              color="var(--color-chart-4)"
            />
            <Kpi
              label={a.nps ? "NPS / Recommendation" : "Future Participation"}
              value={
                a.nps
                  ? String(a.nps.score)
                  : a.futureParticipation
                    ? fmt(a.futureParticipation.percentYes, 1)
                    : "-"
              }
              unit={a.nps ? "" : "%"}
              sub={
                a.nps
                  ? `Promoter ${a.nps.promoters} · Detractor ${a.nps.detractors}`
                  : a.futureParticipation
                    ? shortLabel(a.futureParticipation.header, 34)
                    : "ไม่พบคำถามในแบบสอบถาม"
              }
              color="var(--color-gold)"
            />
          </div>

          {/* ROW: PROFILE | SATISFACTION | EXPERIENCE */}
          <div className="grid gap-3 xl:grid-cols-3">
            <Panel
              title="Participant Profile"
              hint={mainProfile ? shortLabel(mainProfile.header, 60) : undefined}
            >
              {mainProfile ? (
                <DonutChart data={mainProfile.items} height={210} />
              ) : (
                <Empty />
              )}
              {secondProfile ? (
                <div className="mt-3">
                  <p className="mb-1 text-[10px] tracking-widest text-muted-foreground uppercase">
                    {shortLabel(secondProfile.header, 46)}
                  </p>
                  <VBarChart data={secondProfile.items} height={150} />
                </div>
              ) : null}
            </Panel>

            <Panel
              title="Event Satisfaction"
              hint="ค่าเฉลี่ย (เต็ม 5) · เรียงจากสูงไปต่ำ · SD ในทูลทิป"
              className="xl:col-span-2"
            >
              <RatingBars
                data={sortedRatings.map((r) => ({
                  label: r.header,
                  mean: r.mean,
                  sd: r.sd,
                  scaleMax: r.scaleMax,
                }))}
              />
            </Panel>
          </div>

          {/* ROW: TOP/BOTTOM | EXPERIENCE RADAR | SUCCESS */}
          <div className="grid gap-3 xl:grid-cols-4">
            <Panel title="Top 3 / Bottom 3" hint="Ranking จากคะแนนเฉลี่ย">
              <div className="space-y-1.5">
                {top3.map((r, i) => (
                  <RankRow key={r.index} rank={i + 1} label={r.header} value={toMean5(r)} good />
                ))}
                <div className="hairline my-2" />
                {bottom3.map((r, i) => (
                  <RankRow
                    key={r.index}
                    rank={sortedRatings.length - i}
                    label={r.header}
                    value={toMean5(r)}
                    good={false}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Event Experience" hint="ความเหมาะสมของการจัดงาน (%)">
              {a.groups.experience.length >= 3 ? (
                <RadarPanel
                  data={a.groups.experience.map((r) => ({ label: r.header, value: r.percent }))}
                />
              ) : a.groups.experience.length ? (
                <RatingBars
                  data={a.groups.experience.map((r) => ({
                    label: r.header,
                    mean: r.mean,
                    sd: r.sd,
                    scaleMax: r.scaleMax,
                  }))}
                />
              ) : (
                <Empty />
              )}
            </Panel>

            <Panel title="Learning / Knowledge Impact" hint="การกระจายคะแนนรายข้อ">
              {a.groups.learning.length ? (
                <>
                  <StackedRatingBars
                    data={a.groups.learning.map((r) => ({
                      label: r.header,
                      buckets: Object.fromEntries(
                        r.distribution.map((d) => [String(d.value), d.count]),
                      ),
                    }))}
                  />
                  <p className="mt-1 text-center text-[11px] text-muted-foreground">
                    Learning Impact Score{" "}
                    <span className="num-xl text-base text-lac">
                      {fmt(a.learningImpactScore ?? 0, 1)}%
                    </span>
                  </p>
                </>
              ) : (
                <Empty />
              )}
            </Panel>

            <Panel title="Event Success Score" hint="คำนวณจากตัวชี้วัดที่มีข้อมูลจริง">
              {a.successScore ? (
                <>
                  <Gauge value={a.successScore.score} label={a.successScore.label} />
                  <ul className="mt-2 space-y-1">
                    {a.successScore.parts.map((p) => (
                      <li key={p.label} className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="num-xl text-[13px]">{fmt(p.value, 1)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Empty />
              )}
            </Panel>
          </div>

          {/* ROW: FUTURE | MATRIX | TREND */}
          <div className="grid gap-3 xl:grid-cols-3">
            <Panel
              title="Future Participation"
              hint={a.futureParticipation ? shortLabel(a.futureParticipation.header, 56) : undefined}
            >
              {a.futureParticipation ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="num-xl text-5xl text-gold">
                      {fmt(a.futureParticipation.percentYes, 1)}
                      <span className="text-xl">%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      ต้องการเข้าร่วมกิจกรรมในอนาคต (n={a.futureParticipation.total})
                    </p>
                  </div>
                  {a.futureParticipation.yes + a.futureParticipation.no + a.futureParticipation.unsure >
                  0 ? (
                    <DonutChart
                      height={170}
                      data={[
                        { label: "ต้องการเข้าร่วม", count: a.futureParticipation.yes },
                        { label: "ไม่แน่ใจ", count: a.futureParticipation.unsure },
                        { label: "ไม่ต้องการ", count: a.futureParticipation.no },
                      ].filter((d) => d.count > 0)}
                    />
                  ) : null}
                  {a.futureActivities ? (
                    <div>
                      <p className="mb-1 text-[10px] tracking-widest text-muted-foreground uppercase">
                        Future Activity Ranking
                      </p>
                      <VBarChart
                        data={a.futureActivities.items}
                        height={150}
                        color="var(--color-lac)"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <Empty />
              )}
            </Panel>

            <Panel
              title="Event Improvement Matrix"
              hint="X = ความพึงพอใจ · Y = ความสำคัญ (ความสัมพันธ์กับความพึงพอใจรวม)"
            >
              <MatrixChart data={a.matrix} />
              <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[9px] tracking-widest">
                <span className="rounded bg-good/15 py-1 text-good">KEEP</span>
                <span className="rounded bg-chart-4/15 py-1 text-chart-4">PROMOTE</span>
                <span className="rounded bg-gold-soft py-1 text-gold">IMPROVE</span>
                <span className="rounded bg-bad/15 py-1 text-bad">PRIORITY</span>
              </div>
            </Panel>

            <Panel
              title={a.timeline.length > 1 ? "Response Trend" : "Response Timeline"}
              hint={a.timestampColumn ? shortLabel(a.timestampColumn.header, 40) : undefined}
            >
              {a.timeline.length ? <TrendChart data={a.timeline} /> : <Empty />}
              {departmentTable ? (
                <div className="mt-3 max-h-44 overflow-auto">
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-panel text-left text-[10px] tracking-widest text-gold uppercase">
                      <tr>
                        <th className="py-1">{shortLabel(departmentTable.header, 30)}</th>
                        <th className="py-1 text-right">คน</th>
                        <th className="py-1 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentTable.items.map((it) => (
                        <tr key={it.label} className="border-t border-border/50">
                          <td className="py-1 pr-2">{it.label}</td>
                          <td className="py-1 text-right num-xl text-[12px]">{it.count}</td>
                          <td className="py-1 text-right text-muted-foreground">
                            {fmt(it.percent, 1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Panel>
          </div>

          {/* ROW: FEEDBACK | AI INSIGHT | RECOMMENDATION */}
          <div className="grid gap-3 xl:grid-cols-3">
            <Panel
              title="Feedback Analysis"
              hint={
                channelStat
                  ? `ช่องทางการรับรู้ข่าวสาร · ${shortLabel(channelStat.header, 40)}`
                  : "ช่องทางการรับรู้ข่าวสาร"
              }
            >
              {channelStat ? (
                <>
                  <ChannelBreakdown items={channelStat.items} total={channelStat.total} />
                  {insight?.sentiment ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                      {(
                        [
                          ["Positive", insight.sentiment.positive, "var(--color-good)"],
                          ["Neutral", insight.sentiment.neutral, "var(--color-gold)"],
                          ["Negative", insight.sentiment.negative, "var(--color-bad)"],
                        ] as const
                      ).map(([label, value, color]) => (
                        <div key={label} className="rounded border border-border py-1.5">
                          <div className="num-xl text-lg" style={{ color }}>
                            {value}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{label}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    คำตอบปลายเปิดทั้งหมด {a.openAnswers.length} ข้อความ
                  </p>
                </>
              ) : (
                <Empty />
              )}
            </Panel>


            <Panel
              title="AI Event Insight"
              hint="วิเคราะห์จากข้อมูลจริงในชีตเท่านั้น"
              action={
                <button
                  onClick={() => insightMutation.mutate(buildSummary(a))}
                  disabled={insightMutation.isPending}
                  className="no-print flex items-center gap-1 rounded border border-gold/70 px-2 py-1 text-[10px] text-gold hover:bg-gold-soft"
                >
                  {insightMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Sparkles className="size-3" />
                  )}
                  {insight ? "วิเคราะห์ใหม่" : "วิเคราะห์ด้วย AI"}
                </button>
              }
            >
              {insightMutation.isError ? (
                <Empty label={insightMutation.error.message} />
              ) : insight ? (
                <ol className="space-y-2 text-[12px] leading-snug">
                  {(insight.insights.length
                    ? insight.insights
                    : ["ไม่สามารถวิเคราะห์ในประเด็นนี้ได้ เนื่องจากข้อมูลไม่เพียงพอ"]
                  ).map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="num-xl text-[13px] text-gold">{i + 1}</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <Empty label="กด “วิเคราะห์ด้วย AI” เพื่อสรุปประเด็นสำคัญจากข้อมูลชุดนี้" />
              )}
              {insight?.strengths.length || insight?.improvements.length ? (
                <div className="mt-3 grid gap-2 text-[11px]">
                  <InsightList title="จุดเด่นของกิจกรรม" items={insight?.strengths ?? []} color="var(--color-good)" />
                  <InsightList
                    title="ประเด็นที่ควรปรับปรุง"
                    items={insight?.improvements ?? []}
                    color="var(--color-bad)"
                  />
                  <InsightList
                    title="ข้อเสนอแนะจากผู้เข้าร่วม"
                    items={insight?.suggestions ?? []}
                    color="var(--color-gold)"
                  />
                </div>
              ) : null}
            </Panel>

            <Panel title="What should we do next?" hint="Executive Recommendation">
              {insight ? (
                <div className="space-y-2 text-[11px]">
                  <InsightList title="สิ่งที่ควรรักษา" items={insight.recommendation.keep} color="var(--color-good)" />
                  <InsightList
                    title="สิ่งที่ควรปรับปรุง"
                    items={insight.recommendation.improve}
                    color="var(--color-bad)"
                  />
                  <InsightList
                    title="สิ่งที่ควรเพิ่มในครั้งต่อไป"
                    items={insight.recommendation.add}
                    color="var(--color-gold)"
                  />
                  <InsightList
                    title="รูปแบบกิจกรรมที่ผู้เข้าร่วมสนใจ"
                    items={insight.recommendation.interest}
                    color="var(--color-chart-4)"
                  />
                  <InsightList
                    title="แนวทางพัฒนาห้องการเรียนรู้ครั่งครบวงจร"
                    items={insight.recommendation.develop}
                    color="var(--color-lac)"
                  />
                </div>
              ) : (
                <Empty label="ข้อเสนอแนะเชิงบริหารจะแสดงหลังกดวิเคราะห์ด้วย AI" />
              )}
            </Panel>
          </div>
        </>
      )}

      <footer className="pb-4 text-center text-[10px] text-muted-foreground">
        แหล่งข้อมูล: {query.data.spreadsheetTitle} · Google Forms → Google Sheets → Dashboard ·
        มหาวิทยาลัยมหิดล
      </footer>
    </main>
  );
}

function RankRow({
  rank,
  label,
  value,
  good,
}: {
  rank: number;
  label: string;
  value: number;
  good: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="num-xl w-6 text-center text-[13px]"
        style={{ color: good ? "var(--color-good)" : "var(--color-bad)" }}
      >
        {rank}
      </span>
      <span className="flex-1 text-[11px] leading-tight">{shortLabel(label, 42)}</span>
      <span className="num-xl text-[14px]" style={{ color: ratingColorOf(value) }}>
        {fmt(value)}
      </span>
    </div>
  );
}

function InsightList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[10px] tracking-widest uppercase" style={{ color }}>
        {title}
      </p>
      <ul className="mt-0.5 space-y-0.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-1.5 leading-snug">
            <span style={{ color }}>•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
