import { useState, useEffect } from "react";

export function PrivacyConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasConsented = localStorage.getItem("mahidol_privacy_consent");
      if (!hasConsented) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mahidol_privacy_consent", "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-semibold">การยินยอมเปิดเผยและใช้งานข้อมูลข่าวสาร</h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          มหาวิทยาลัยมหิดล (Mahidol Insight Hub) ขอแจ้งให้ทราบถึงการเก็บรวบรวม
          ใช้ หรือเปิดเผยข้อมูลเพื่อนำไปพัฒนาและปรับปรุงการให้บริการตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
        </p>

        <div className="my-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>• ข้อมูลจะถูกนำไปวิเคราะห์ในภาพรวม (Anonymized Data)</p>
          <p>• ท่านสามารถถอนการยินยอมได้ทุกเมื่อ</p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ยินยอมและดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
