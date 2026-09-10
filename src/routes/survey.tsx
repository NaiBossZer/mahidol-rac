import { useEffect } from "react";
import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { SurveyPage as SurveyFeaturePage } from "@/features/survey/SurveyPage";
import { getSurveyActivityId, withSurveyActivityContext } from "@/features/survey/surveyDataContract";

export function SurveyPage() {
  useEffect(() => {
    const activityId = getSurveyActivityId();
    if (!activityId) return;

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const requestUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (!requestUrl.includes("script.google.com/macros/s/")) {
        return originalFetch(input, init);
      }

      const url = withSurveyActivityContext(requestUrl, { activityId });
      const target = new URL(url);
      target.searchParams.set("submitted_at", new Date().toISOString());
      target.searchParams.set("pdpa_consent", "true");

      return originalFetch(target.toString(), init);
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
