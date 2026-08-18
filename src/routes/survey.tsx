import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyc0e3rXRodmtxyjs2eDPiAABxu5JGGmSRTByJnkW2bTgrRr5kK0YEi3JW2ldTwBVUuvg/exec";

function SurveyPage() {
  const [step, setStep] = useState<"pdpa" | "survey" | "submitting" | "submitted">("pdpa");
  const [agreed, setAgreed] = useState(false);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("submitting");

    try {
      // ส่ง payload เป็น JSON Stringify โดยใช้ Header text/plain เพื่อเลี่ยงการถูกบล็อก CORS
      const payload = JSON.stringify({
        satisfaction: satisfaction,
        feedback: feedback,
      });

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: payload,
      });

      setStep("submitted");
    } catch (err) {
      console.error("Error sending data:", err);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      setStep("survey");
    }
  };

  if (step === "submitted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            ขอบคุณสำหรับข้อมูล!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            ระบบได้รับผลการตอบแบบประเมินกิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจรเรียบร้อยแล้ว
          </p>
        </div>
      </div>
    );
  }

  if (step === "pdpa") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ข้อตกลงความเป็นส่วนตัว (PDPA)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            กิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
          </p>

          <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed border border-slate-200 dark:border-slate-700/50">
            ข้อมูลที่ท่านกรอกในแบบประเมินนี้จะนำไปใช้เพื่อการวิเคราะห์และปรับปรุงการจัดกิจกรรมเท่านั้น{" "}
            โดยจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA){" "}
            และไม่มีการเปิดเผยข้อมูลระบุตัวตนสู่สาธารณะ
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => (window.location.href = "https://www.google.com")}
              className="w-1/2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ไม่ยอมรับ
            </button>

            <button
              type="button"
              disabled={!agreed}
              onClick={() => setStep("survey")}
              className="w-1/2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors cursor-pointer"
            >
              ยอมรับ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          แบบประเมินความพึงพอใจ
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          กิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              1. ความพึงพอใจในภาพรวมต่อการจัดกิจกรรม
            </label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="satisfaction"
                    value={score}
                    required
                    onChange={() => setSatisfaction(score)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{score}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              2. ข้อเสนอแนะเพิ่มเติม
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="แสดงความคิดเห็นของคุณที่นี่..."
            />
          </div>

          <button
            type="submit"
            disabled={step === "submitting"}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {step === "submitting" ? "กำลังบันทึกข้อมูล..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      </div>
    </div>
  );
}
