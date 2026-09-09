import { AppNavbar } from "@/layout/AppNavbar";
import AppFooter from "@/layout/AppFooter";
import { LoginPage as LoginFeaturePage } from "@/features/auth/LoginPage";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-rac-surface font-['Mitr'] text-slate-800">
      <AppNavbar />
      <main className="min-h-[calc(100vh-60px)]">
        <LoginFeaturePage />
      </main>
      <AppFooter />
    </div>
  );
}
