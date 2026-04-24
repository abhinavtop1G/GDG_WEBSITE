'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const EVENTS = [
  { name: 'DevFest', year: '2025', color: '#FF4D6D' },
  { name: 'CloudHack', year: '48h', color: '#FFB800' },
  { name: 'ML Club', year: '/w', color: '#00E5A0' },
  { name: 'Flutter Lab', year: 'NEW', color: '#3B82F6' },
  { name: 'AI Summit', year: '2026', color: '#B967FF' },
];

export default function EventsNexus() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {EVENTS.map((ev, i) => {
        const total = EVENTS.length;
        const angle = ((i - (total - 1) / 2) / total) * Math.PI * 0.7;
        const radius = 6;
        return (
          <EventPanel
            key={i}
            index={i}
            event={ev}
            position={[Math.sin(angle) * radius, (i % 2 === 0 ? 0.3 : -0.3), -Math.cos(angle) * radius + 6]}
            rotation={[0, -angle, 0]}
          />
        );
      })}
    </group>
  );
}

function EventPanel({ event, position, rotation, index }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Subtle float
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + index) * 0.15;
    // Hover scale
    const target = hovered ? 1.15 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'none';
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main panel */}
      <RoundedBox args={[2.2, 2.8, 0.08]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color={event.color}
          emissive={event.color}
          emissiveIntensity={hovered ? 0.6 : 0.35}
          transparent
          opacity={0.2}
          metalness={0.4}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Inner glow frame */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2, 2.6]} />
        <meshBasicMaterial
          color={event.color}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Accent line at top */}
      <mesh position={[0, 1.2, 0.06]}>
        <planeGeometry args={[1.6, 0.02]} />
        <meshBasicMaterial color={event.color} />
      </mesh>

      {/* Corner accents */}
      {[
        [-1, 1.35],
        [1, 1.35],
        [-1, -1.35],
        [1, -1.35],
      ].map((p, idx) => (
        <mesh key={idx} position={[p[0], p[1], 0.06]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#E8E6F0" />
        </mesh>
      ))}

      {/* Scan line */}
      <ScanLine color={event.color} offset={index} />
    </group>
  );
}

function ScanLine({ color, offset }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime * 0.5 + offset * 0.3) % 1;
      ref.current.position.y = -1.2 + t * 2.4;
      ref.current.material.opacity = 0.4 * (1 - Math.abs(t - 0.5) * 2);
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.07]}>
      <planeGeometry args={[1.8, 0.03]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}
