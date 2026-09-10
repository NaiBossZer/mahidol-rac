import { useEffect } from "react";
import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { SurveyPage as SurveyFeaturePage } from "@/features/survey/SurveyPage";
import { getSurveyActivityId } from "@/features/survey/surveyDataContract";
import { saveSurveySubmission } from "@/features/survey/surveyRepository";

export function SurveyPage() {
  useEffect(() => {
    const activityId = getSurveyActivityId();
    if (!activityId) return;

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const requestUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      // Phase 7.3 compatibility bridge: the existing survey UI still calls its
      // historical Apps Script URL, but the request is intercepted and persisted
      // directly to Supabase. Google Sheets/Apps Script is never contacted.
      if (!requestUrl.includes("script.google.com/macros/s/")) {
        return originalFetch(input, init);
      }

      const target = new URL(requestUrl);
      target.searchParams.set("activity_id", activityId);
      target.searchParams.set("survey_contract", "7.3");
      target.searchParams.set("submitted_at", new Date().toISOString());
      target.searchParams.set("pdpa_consent", "true");

      await saveSurveySubmission(target.searchParams);
      return new Response(null, { status: 204 });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="min-h-screen bg-rac-surface font-['Mitr'] text-slate-800">
      <AppNavbar />
      <main className="min-h-[calc(100vh-60px)]">
        <SurveyFeaturePage />
      </main>
      <AppFooter />
    </div>
  );
}
