import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

function SurveyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
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
          {/* ข้อที่ 1 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              1. ความพึงพอใจในภาพรวมต่อการจัดกิจกรรม
            </label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="satisfaction" value={score} required className="text-blue-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{score}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ข้อที่ 2 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              2. ข้อเสนอแนะเพิ่มเติม
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="แสดงความคิดเห็นของคุณที่นี่..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 shadow-md transition-colors"
          >
            ส่งแบบประเมิน
          </button>
        </form>
      </div>
    </div>
  );
}
