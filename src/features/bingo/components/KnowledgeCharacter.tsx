import React, { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Character3D = lazy(() =>
  import("@/features/bingo/components/3d/Character3D").then((module) => ({
    default: module.Character3D,
  })),
);
import { Sparkles } from "lucide-react";
import { HostEmotion } from "@/types/bingo";

interface KnowledgeCharacterProps {
  emotion: HostEmotion;
  speech: string;
  title?: string;
}

const emotionFile: Record<HostEmotion, string> = {
  idle: "idle",
  happy: "happy",
  thinking: "thinking",
  concerned: "concerned",
  excited: "excited",
};

export const KnowledgeCharacter: React.FC<KnowledgeCharacterProps> = ({
  emotion,
  speech,
  title = "พี่ M-Guide",
}) => {
  const [use3D, setUse3D] = useState(true);
  const image = `/assets/characters/prof-mahidol/${emotionFile[emotion]}.svg`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative overflow-hidden rounded-3xl border-2 border-rac-gold/40 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-3 sm:p-4"
      aria-label="ตัวละครอธิบายความรู้"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rac-gold/15 blur-2xl" />
      <div className="relative flex items-center gap-3 sm:gap-4">
        <div className="relative w-44 shrink-0 sm:w-56">
          {use3D ? (
            <Suspense
              fallback={
                <div className="h-48 rounded-2xl bg-amber-50/70" aria-label="กำลังโหลดตัวละคร 3D" />
              }
            >
              <Character3D
                emotion={emotion}
                talking={Boolean(speech)}
                title={title}
                onFallback={() => setUse3D(false)}
              />
            </Suspense>
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={image}
                src={image}
                alt={title}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="h-28 w-full object-contain sm:h-36"
              />
            </AnimatePresence>
          )}
          {!use3D && (
            <button
              type="button"
              onClick={() => setUse3D(true)}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-rac-blue px-2.5 py-1 text-[9px] font-bold text-white shadow-sm whitespace-nowrap"
            >
              ลอง 3D
            </button>
          )}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-rac-lac">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Knowledge Talk</span>
          </div>
          <div className="relative rounded-2xl border border-amber-200 bg-white px-3.5 py-3 shadow-sm sm:px-4 sm:py-3.5">
            <span className="absolute -left-2 top-5 h-3 w-3 rotate-45 border-b border-l border-amber-200 bg-white" />
            <p className="relative text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
              {speech}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default KnowledgeCharacter;
