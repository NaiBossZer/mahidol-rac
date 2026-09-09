import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า Supabase");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (authError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชียังไม่ได้เปิดใช้งาน");
      return;
    }
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from || "/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl max-w-sm w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">เข้าสู่ระบบ</h1>
          <p className="text-xs text-slate-500 font-medium">Mahidol RAC • Supabase Auth กลาง</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">อีเมล</label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@mahidol.ac.th"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">รหัสผ่าน</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
          {error && <p className="text-xs font-semibold text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-slate-50">
            ← กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
