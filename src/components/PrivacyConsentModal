import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide me-react";

export function PrivacyConsentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // เช็คว่าเคยยินยอมไปแล้วหรือยังจาก LocalStorage
    const hasConsented = localStorage.getItem("mahidol_privacy_consent");
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mahidol_privacy_consent", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] show-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-lg mb-1">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>การยินยอมเปิดเผยและใช้งานข้อมูลข่าวสาร</span>
          </div>
          <DialogTitle className="text-xl">ข้อตกลงและนโยบายความเป็นส่วนตัว</DialogTitle>
          <DialogDescription className="text-sm text-slate-600 space-y-3 pt-3 text-left">
            <p>
              มหาวิทยาลัยมหิดล (Mahidol Insight Hub) ขอแจ้งให้ทราบถึงการเก็บรวบรวม
              ใช้ หรือเปิดเผยข้อมูลข่าวสารและแบบสอบถามความพึงพอใจเพื่อนำไปพัฒนาและปรับปรุงการให้บริการ
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border text-xs text-slate-500 space-y-1">
              <p>• ข้อมูลจะถูกนำไปวิเคราะห์ในภาพรวม (Anonymized Data) เท่านั้น</p>
              <p>• ระบบปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
              <p>• ท่านสามารถถอนการยินยอมหรือศึกษานโยบายความเป็นส่วนตัวเพิ่มเติมได้ทุกเมื่อ</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            ปฏิเสธ
          </Button>
          <Button onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700 text-white">
            ยินยอมและดำเนินการต่อ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
