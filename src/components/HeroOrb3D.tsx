import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh, Group } from "three";

function Orb() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.25;
    mesh.current.rotation.x += dt * 0.08;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 64]} />
      <MeshDistortMaterial
        color="#a78bfa"
        roughness={0.15}
        metalness={0.85}
        distort={0.42}
        speed={1.4}
      />
    </mesh>
  );
}

function Shard({ position, color, scale = 0.2 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.6;
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={1.5} floatIntensity={1.2} rotationIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </Float>
  );
}

function Ring({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.z += dt * 0.15;
  });
  return (
    <group ref={g} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 16, 200]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function HeroOrb3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.6], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={1.6} color="#f0abfc" />
        <directionalLight position={[-3, -1, 2]} intensity={1.1} color="#22d3ee" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#a78bfa" />

        <Float speed={1.1} floatIntensity={0.6} rotationIntensity={0.4}>
          <Orb />
        </Float>

        <Ring radius={1.7} tilt={0.4} color="#a78bfa" />
        <Ring radius={1.95} tilt={-0.3} color="#22d3ee" />

        <Shard position={[1.9, 1.1, 0.2]} color="#f0abfc" scale={0.18} />
        <Shard position={[-2.0, -0.6, 0.4]} color="#22d3ee" scale={0.15} />
        <Shard position={[1.4, -1.4, -0.2]} color="#a78bfa" scale={0.13} />
        <Shard position={[-1.6, 1.4, -0.4]} color="#818cf8" scale={0.16} />

      </Suspense>
    </Canvas>
  );
}

export default HeroOrb3D;