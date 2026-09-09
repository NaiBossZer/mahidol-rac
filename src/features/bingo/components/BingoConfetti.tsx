import React, { useEffect, useRef } from "react";

interface BingoConfettiProps {
  active: boolean;
}

export const BingoConfetti: React.FC<BingoConfettiProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = [
      "var(--rac-brand-red)",
      "var(--rac-brand-gold)",
      "#16A34A",
      "#E84393",
      "var(--rac-brand-blue-light)",
      "#F97316",
      "#A855F7",
    ];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height * 0.5,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "var(--rac-brand-gold)",
      vy: Math.random() * 3 + 2.5,
      vx: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
    }));

    const startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      if (elapsed < 6500) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};
