'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const MEMBERS = [
  { color: '#FF4D6D', radius: 3, speed: 0.3, offset: 0, tilt: 0 },
  { color: '#FFB800', radius: 3.2, speed: 0.25, offset: 1.0, tilt: 0.2 },
  { color: '#00E5A0', radius: 3.5, speed: 0.28, offset: 2.0, tilt: -0.15 },
  { color: '#3B82F6', radius: 3.8, speed: 0.22, offset: 3.0, tilt: 0.1 },
  { color: '#B967FF', radius: 4.1, speed: 0.2, offset: 4.0, tilt: -0.25 },
  { color: '#FF4D6D', radius: 4.5, speed: 0.18, offset: 5.0, tilt: 0.3 },
  { color: '#00E5A0', radius: 2.6, speed: 0.35, offset: 0.5, tilt: -0.1 },
  { color: '#FFB800', radius: 2.8, speed: 0.32, offset: 2.5, tilt: 0.15 },
];

export default function CommunityOrbit() {
  const center = useRef();
  const centerPulse = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (center.current) {
      center.current.rotation.y = t * 0.4;
      center.current.rotation.x = t * 0.2;
    }
    if (centerPulse.current) {
      centerPulse.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    }
  });

  return (
    <group>
      {/* Central organizer node */}
      <mesh ref={center}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#FFB800"
          emissive="#FFB800"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={centerPulse}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color="#FFB800" transparent opacity={0.1} />
      </mesh>

      {/* Orbiting member cards */}
      {MEMBERS.map((m, i) => (
        <MemberCard key={i} {...m} index={i} />
      ))}
    </group>
  );
}

function MemberCard({ color, radius, speed, offset, tilt, index }) {
  const group = useRef();
  const card = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = t * speed * (hovered ? 0.2 : 1) + offset;

    if (group.current) {
      group.current.position.x = Math.cos(angle) * radius;
      group.current.position.z = Math.sin(angle) * radius;
      group.current.position.y = Math.sin(angle * 2 + tilt) * 0.5;

      // Billboard: always face camera
      group.current.lookAt(state.camera.position);
    }

    if (card.current) {
      const target = hovered ? 1.3 : 1;
      card.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={card}>
        <RoundedBox args={[0.9, 1.2, 0.05]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.7 : 0.4}
            transparent
            opacity={0.3}
            metalness={0.5}
            roughness={0.3}
          />
        </RoundedBox>
        {/* Avatar circle */}
        <mesh position={[0, 0.15, 0.04]}>
          <circleGeometry args={[0.28, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Name bar */}
        <mesh position={[0, -0.35, 0.04]}>
          <planeGeometry args={[0.7, 0.05]} />
          <meshBasicMaterial color="#E8E6F0" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]}>
          <planeGeometry args={[0.5, 0.03]} />
          <meshBasicMaterial color="#E8E6F0" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}
