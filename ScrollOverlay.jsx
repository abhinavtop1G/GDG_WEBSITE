'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OrbitalCore() {
  const core = useRef();
  const wireframe = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.x = t * 0.15;
      core.current.rotation.y = t * 0.2;
      const pulse = 1 + Math.sin(t * 1.5) * 0.05;
      core.current.scale.setScalar(pulse);
    }
    if (wireframe.current) {
      wireframe.current.rotation.x = -t * 0.1;
      wireframe.current.rotation.y = -t * 0.12;
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.3;
    if (ring2.current) ring2.current.rotation.z = -t * 0.2;
    if (ring3.current) ring3.current.rotation.x = t * 0.25;
  });

  return (
    <group>
      {/* Inner solid core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={wireframe}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial
          color="#00E5A0"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.012, 8, 100]} />
        <meshBasicMaterial color="#FF4D6D" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[4, 0.008, 8, 100]} />
        <meshBasicMaterial color="#FFB800" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring3} rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[4.8, 0.006, 8, 120]} />
        <meshBasicMaterial color="#00E5A0" transparent opacity={0.5} />
      </mesh>

      {/* Orbiting dots */}
      <OrbitingDots />
    </group>
  );
}

function OrbitingDots() {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.3;
      group.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  const dots = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 3.2;
    dots.push(
      <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#E8E6F0" />
      </mesh>
    );
  }

  return <group ref={group}>{dots}</group>;
}
