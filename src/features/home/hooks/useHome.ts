import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/features/home/data/homeData";

export function useHome() {
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "3d">("video");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isHeroPaused]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return {
    activeMediaTab,
    setActiveMediaTab,
    currentSlide,
    setCurrentSlide,
    prevSlide,
    nextSlide,
    scrollToSection,
    isHeroPaused,
    setIsHeroPaused,
  };
}
