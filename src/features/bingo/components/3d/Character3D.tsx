import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Component, Suspense, useState, type ReactNode } from "react";
import type { HostEmotion } from "@/types/bingo";
import { CharacterModel } from "@/features/bingo/3d/CharacterModel";

interface Props {
  emotion: HostEmotion;
  talking?: boolean;
  title?: string;
  onFallback?: () => void;
}
class ModelBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Character3D({
  emotion,
  talking = false,
  title = "พี่ M-Guide",
  onFallback,
}: Props) {
  const [enabled, setEnabled] = useState(true);
  const fallback = () => {
    setEnabled(false);
    onFallback?.();
  };
  if (!enabled) return null;
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-white">
      <Canvas camera={{ position: [0, 0.15, 4.4], fov: 32 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ModelBoundary onError={fallback}>
            <ambientLight intensity={1.6} />
            <directionalLight position={[2, 4, 3]} intensity={2.4} />
            <directionalLight position={[-2, 2, 1]} intensity={1.1} />
            <CharacterModel emotion={emotion} talking={talking} />
            <ContactShadows position={[0, -1.65, 0]} opacity={0.22} scale={4} blur={2.5} far={3} />
          </ModelBoundary>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.25}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      <span className="absolute left-2 top-2 rounded-full bg-rac-blue px-2 py-1 text-[9px] font-bold text-white">
        3D • {title}
      </span>
      <button
        type="button"
        className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-slate-600 shadow-sm"
        onClick={() => setEnabled(false)}
      >
        ใช้ภาพ 2D
      </button>
    </div>
  );
}
