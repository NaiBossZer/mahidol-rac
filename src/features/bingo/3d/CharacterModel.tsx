import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { HostEmotion } from "@/types/bingo";
import { getAnimationName } from "./characterAnimations";

const MODEL_URL = "/assets/characters/rac-man.glb";

interface Props {
  emotion: HostEmotion;
  talking?: boolean;
}

export function CharacterModel({ emotion, talking = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const active = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const name = getAnimationName(emotion, talking);
    const clip = animations.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (!clip) return;
    const next = mixer.clipAction(clip);
    next.reset().fadeIn(0.2).play();
    active.current?.fadeOut(0.2);
    active.current = next;
    return () => next.fadeOut(0.15);
  }, [animations, emotion, mixer, talking]);

  useEffect(() => () => mixer.stopAllAction(), [mixer]);

  useFrame((_, delta) => {
    mixer.update(delta);
    if (!group.current) return;
    const time = Date.now() * 0.0018;
    const bob = emotion === "excited" ? 0.06 : emotion === "thinking" ? 0.012 : 0.025;
    const sway = emotion === "thinking" ? 0.035 : talking ? 0.02 : 0.012;
    group.current.position.y = Math.sin(time) * bob;
    group.current.rotation.z = Math.sin(time * 0.7) * sway;
    group.current.rotation.y =
      emotion === "thinking" ? Math.sin(time * 0.55) * 0.06 : Math.sin(time * 0.45) * 0.025;
    const pulse = talking ? 1 + Math.sin(time * 2.8) * 0.012 : 1;
    group.current.scale.setScalar(1.05 * pulse);
  });

  return <primitive ref={group} object={scene} scale={1.05} position={[0, -0.98, 0]} />;
}

useGLTF.preload(MODEL_URL);
