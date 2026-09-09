import React, { useEffect } from "react";
import { HelpCircle, CheckCircle2, AlertCircle, Info, Sparkles, ChevronRight } from "lucide-react";
import { QuestionCard, HostEmotion } from "../../types/bingo";
import { playChime } from "@/features/bingo/soundEngine";
import { KnowledgeCharacter } from "@/features/bingo/components/KnowledgeCharacter";
import { BINGO_KEYWORDS_POOL, getCategoryStyle } from "@/features/bingo/bingoKeywords";

interface MGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionCard | null;
  onAnswer: (optionIndex: number) => void;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
  onNextQuestion: () => void;
  emotion: HostEmotion;
  soundEnabled: boolean;
}

export const MGuidePopup: React.FC<MGuidePopupProps> = ({
  isOpen,
  onClose,
  question,
  onAnswer,
  selectedOption,
  isAnswerChecked,
  isCorrect,
  onNextQuestion,
  emotion,
  soundEnabled,
}) => {
  // Action D: Accessibility - Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !question) return null;

  const knowledgeTile = BINGO_KEYWORDS_POOL.find((tile) => tile.id === question.targetKeywordId);
  const categoryStyle = knowledgeTile ? getCategoryStyle(knowledgeTile.category) : null;
  const characterTitle =
    knowledgeTile?.category === "biology"
      ? "พี่ M-Guide • นักชีววิทยาครั่ง"
      : knowledgeTile?.category === "chemistry"
        ? "พี่ M-Guide • นักเคมีสีธรรมชาติ"
        : knowledgeTile?.category === "product"
          ? "พี่ M-Guide • นักพัฒนาผลิตภัณฑ์"
          : "พี่ M-Guide • นักเรียนรู้ชุมชน";
  const characterSpeech = !isAnswerChecked
    ? `ลองคิดจากคำใบ้ก่อนนะครับ: ${question.hint}`
    : isCorrect
      ? `KNOWLEDGE UNLOCKED! ${question.explanation}`
      : `ทบทวนอีกนิดนะครับ: ${question.explanation}`;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mguide-modal-title"
    >
      <div className="bg-white border-2 border-rac-lac/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with M-Guide Banner */}
        <div className="bg-gradient-to-r from-rac-blue-light via-rac-lac to-rac-lac-dark text-white p-4 sm:p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            {/* Animated Character Avatar */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center p-1 overflow-hidden shadow-inner">
              <img
                src={`/assets/characters/prof-mahidol/${
                  emotion === "excited"
                    ? "excited"
                    : emotion === "happy"
                      ? "happy"
                      : emotion === "thinking"
                        ? "thinking"
                        : emotion === "concerned"
                          ? "concerned"
                          : "idle"
                }.svg`}
                alt="พี่ M-Guide"
                className="w-full h-full object-contain transform transition-transform hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector(".mascot-fallback")) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "mascot-fallback text-2xl font-bold flex items-center justify-center";
                    fallback.innerText =
                      emotion === "happy" || emotion === "excited" ? "🎓✨" : "🤔📚";
                    parent.appendChild(fallback);
                  }
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rac-gold text-rac-blue-light text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BINGO HOST
                </span>
                <span className="text-xs text-white/80 font-mono">การ์ดคำถาม #{question.id}</span>
              </div>
              <h3
                id="mguide-modal-title"
                className="text-base sm:text-lg font-bold text-white leading-tight"
              >
                พี่ M-Guide (ผู้ช่วยศูนย์เรียนรู้ครั่ง)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="ปิดหน้าต่างคำถาม"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Host Dialogue Speech Bubble */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 flex gap-3 items-start">
            <div className="w-7 h-7 rounded-xl bg-rac-lac text-white shrink-0 flex items-center justify-center text-xs font-bold">
              M
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rac-lac">คำทักทายจากพิธีกร:</p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {!isAnswerChecked
                  ? "น้องๆ ตอบคำถามข้อนี้ให้ถูกต้อง เพื่อปลดล็อกช่องบิงโกบนกระดานกันเลยครับ!"
                  : isCorrect
                    ? "🎉 เก่งมากครับ! คำตอบถูกต้อง ช่องบิงโกที่เกี่ยวข้องจะถูกมาร์กบนกระดานให้ทันที!"
                    : "💡 ยังไม่ถูกต้องนะครับ แต่ไม่ต้องกังวล พี่ M-Guide มีคำอธิบายให้ลองทบทวนดูได้เลยครับ"}
              </p>
            </div>
          </div>

          {categoryStyle && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Knowledge Map
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${categoryStyle.bg}`}
              >
                {categoryStyle.label}
              </span>
            </div>
          )}

          <KnowledgeCharacter emotion={emotion} title={characterTitle} speech={characterSpeech} />

          {/* Question Prompt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <HelpCircle className="w-4 h-4 text-rac-blue-light" />
              <span>คำถามชิงช่องบิงโก</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {question.question}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle =
                "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700";

              if (isAnswerChecked) {
                if (idx === question.correctIndex) {
                  btnStyle =
                    "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-300";
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    "bg-rose-50 border-rose-400 text-rose-800 line-through ring-2 ring-rose-200";
                } else {
                  btnStyle = "bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                btnStyle =
                  "bg-rac-lac/10 border-rac-lac text-rac-lac font-semibold ring-2 ring-rac-lac/20";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerChecked}
                  onClick={() => {
                    if (soundEnabled) playChime("click");
                    onAnswer(idx);
                  }}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-rac-lac ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                      {["ก", "ข", "ค", "ง"][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerChecked && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrect && (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Hint Box (When answered) */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl border ${
                isCorrect
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/70 border-amber-200 text-amber-900"
              } space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                <Info className="w-4 h-4" />
                <span>คำอธิบายความรู้ครั่ง:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ตอบถูกรับ 100 คะแนน + ปลดล็อกช่อง</span>
          </div>

          <div className="flex gap-2">
            {isAnswerChecked ? (
              <button
                onClick={onNextQuestion}
                className="bg-rac-lac hover:bg-rac-lac-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <span>จับการ์ดถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
              >
                ไว้ตอบทีหลัง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
