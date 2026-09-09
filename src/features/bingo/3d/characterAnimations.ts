import type { HostEmotion } from "@/types/bingo";

export const EMOTION_ANIMATION: Record<HostEmotion, string> = {
  idle: "Idle",
  thinking: "Thinking",
  happy: "Happy",
  concerned: "Concerned",
  excited: "Excited",
};

export const TALKING_ANIMATION = "Talking";

export function getAnimationName(emotion: HostEmotion, talking: boolean) {
  return talking ? TALKING_ANIMATION : EMOTION_ANIMATION[emotion];
}
