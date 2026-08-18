import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const DASHBOARD_PASSWORD = "ENLP2517"; 

export function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ถ้าล็อกอินอยู่แล้ว ให้เด้งไปหน้า Dashboard ทันที
  useEffect(() => {
    const isAuth = sessionStorage.getItem("dashboard_auth") === "true";
    if (isAuth) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem("dashboard_auth", "true");
      // ใช้ replace: true เพื่อป้องกันการกด back กลับมาหน้าล็อกอิน
      navigate({ to: "/dashboard", replace: true });
    } else {
      setErrorMsg("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            เข้าสู่ระบบ Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            กรุณากรอกรหัสผ่านเพื่อเข้าชมสรุปผลแบบประเมิน
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านที่นี่..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
