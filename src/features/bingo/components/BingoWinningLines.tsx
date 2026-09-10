import React from "react";
import { motion } from "framer-motion";
import type { WinningLine } from "@/types/bingo";

interface BingoWinningLinesProps {
  lines: readonly WinningLine[];
}

function coordinates(line: WinningLine): [number, number, number, number] {
  if (line.type === "row") {
    const y = (line.index - 0.5) * 25;
    return [12.5, y, 87.5, y];
  }
  if (line.type === "col") {
    const x = (line.index - 0.5) * 25;
    return [x, 12.5, x, 87.5];
  }
  return line.index === 1 ? [12.5, 12.5, 87.5, 87.5] : [87.5, 12.5, 12.5, 87.5];
}

export const BingoWinningLines: React.FC<BingoWinningLinesProps> = ({ lines }) => (
  <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {lines.map((line, index) => {
      const [x1, y1, x2, y2] = coordinates(line);
      return (
        <g key={`${line.type}-${line.index}`}>
          <motion.line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="rgb(251 191 36)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }} />
          <motion.line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="white" strokeWidth="0.65" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.9, 0.25] }} transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }} />
        </g>
      );
    })}
  </svg>
);
