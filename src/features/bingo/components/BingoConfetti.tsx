import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface BingoConfettiProps {
  active: boolean;
}

export const BingoConfetti: React.FC<BingoConfettiProps> = ({ active }) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    const burst = (origin: { x: number; y: number }) => {
      void confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 42,
        gravity: 0.95,
        ticks: 180,
        scalar: 0.9,
        origin,
        disableForReducedMotion: true,
      });
    };

    burst({ x: 0.15, y: 0.62 });
    burst({ x: 0.85, y: 0.62 });
    const timer = window.setTimeout(() => void confetti({ particleCount: 120, spread: 120, startVelocity: 35, gravity: 1, ticks: 200, scalar: 1, origin: { x: 0.5, y: 0.45 }, disableForReducedMotion: true }), 180);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!active) firedRef.current = false;
  }, [active]);

  return null;
};
