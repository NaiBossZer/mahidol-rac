import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { ActivityAdminPage as ActivityAdminFeaturePage } from "@/features/activity/ActivityAdminPage";

export function ActivityAdminPage() {
  return (
    <div className="min-h-screen bg-rac-surface font-['Mitr'] text-slate-800">
      <AppNavbar />
      <main className="min-h-[calc(100vh-60px)]">
        <ActivityAdminFeaturePage />
      </main>
      <AppFooter />
    </div>
  );
}
