import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { SurveyPage as SurveyFeaturePage } from "@/features/survey/SurveyPage";

export function SurveyPage() {
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
