import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstOptionRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mguide-modal-title"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={modalRef} className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-rac-lac/30 bg-white shadow-2xl">
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-rac-blue-light via-rac-lac to-rac-lac-dark p-4 text-white sm:p-5">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/15 p-1 shadow-inner sm:h-14 sm:w-14">
              <img
                src={`/assets/characters/prof-mahidol/${emotion === "excited" ? "excited" : emotion === "happy" ? "happy" : emotion === "thinking" ? "thinking" : emotion === "concerned" ? "concerned" : "idle"}.svg`}
                alt="พี่ M-Guide"
                className="h-full w-full object-contain transition-transform hover:scale-110"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rac-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rac-blue-light sm:text-xs">BINGO HOST</span>
                <span className="font-mono text-xs text-white/80">การ์ดคำถาม #{question.id}</span>
              </div>
              <h3 id="mguide-modal-title" className="text-base font-bold leading-tight text-white sm:text-lg">พี่ M-Guide (ผู้ช่วยศูนย์เรียนรู้ครั่ง)</h3>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400" aria-label="ปิดหน้าต่างคำถาม">✕</button>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 sm:p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rac-lac text-xs font-bold text-white">M</div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rac-lac">คำทักทายจากพิธีกร:</p>
              <p className="text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">{!isAnswerChecked ? "น้องๆ ตอบคำถามข้อนี้ให้ถูกต้อง เพื่อปลดล็อกช่องบิงโกบนกระดานกันเลยครับ!" : isCorrect ? "🎉 เก่งมากครับ! คำตอบถูกต้อง ช่องบิงโกที่เกี่ยวข้องจะถูกมาร์กบนกระดานให้ทันที!" : "💡 ยังไม่ถูกต้องนะครับ แต่ไม่ต้องกังวล พี่ M-Guide มีคำอธิบายให้ลองทบทวนดูได้เลยครับ"}</p>
            </div>
          </div>

          {categoryStyle && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Knowledge Map</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${categoryStyle.bg}`}>{categoryStyle.label}</span>
            </div>
          )}

          <KnowledgeCharacter emotion={emotion} title={characterTitle} speech={characterSpeech} />

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><HelpCircle className="h-4 w-4 text-rac-blue-light" /><span>คำถามชิงช่องบิงโก</span></div>
            <h4 className="text-base font-bold leading-snug text-slate-800 sm:text-lg">{question.question}</h4>
          </div>

          <div className="space-y-2.5" aria-label="ตัวเลือกคำตอบ">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700";
              if (isAnswerChecked) {
                if (idx === question.correctIndex) btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-300";
                else if (isSelected && !isCorrect) btnStyle = "bg-rose-50 border-rose-400 text-rose-800 line-through ring-2 ring-rose-200";
                else btnStyle = "bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
              } else if (isSelected) {
                btnStyle = "bg-rac-lac/10 border-rac-lac text-rac-lac font-semibold ring-2 ring-rac-lac/20";
              }
              return (
                <button
                  ref={idx === 0 ? firstOptionRef : undefined}
                  key={idx}
                  disabled={isAnswerChecked}
                  aria-pressed={isSelected}
                  onClick={() => { if (soundEnabled) playChime("click"); onAnswer(idx); }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rac-lac sm:p-4 sm:text-base ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 font-mono text-xs font-bold">{["ก", "ข", "ค", "ง"][idx]}</span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerChecked && idx === question.correctIndex && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
                  {isAnswerChecked && isSelected && !isCorrect && <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />}
                </button>
              );
            })}
          </div>

          {isAnswerChecked && (
            <div className={`space-y-1.5 rounded-2xl border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50/70 text-emerald-900" : "border-amber-200 bg-amber-50/70 text-amber-900"}`} role="status" aria-live="polite">
              <div className="flex items-center gap-1.5 text-xs font-bold sm:text-sm"><Info className="h-4 w-4" /><span>คำอธิบายความรู้ครั่ง:</span></div>
              <p className="text-xs leading-relaxed sm:text-sm">{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-center gap-1 text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5 text-amber-500" /><span>ตอบถูกรับ 100 คะแนน + ปลดล็อกช่อง</span></div>
          <div className="flex gap-2">
            {isAnswerChecked ? (
              <button onClick={onNextQuestion} className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-rac-lac px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-rac-lac-dark focus:outline-none focus:ring-2 focus:ring-amber-400"><span>จับการ์ดถัดไป</span><ChevronRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={onClose} className="cursor-pointer rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300">ไว้ตอบทีหลัง</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
