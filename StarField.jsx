'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Node positions laid out as a loose 3D network
const NODES = [
  { pos: [0, 0, 0], label: 'AI/ML', color: '#00E5A0', size: 0.35 },
  { pos: [2.5, 1.2, -1], label: 'Cloud', color: '#3B82F6', size: 0.3 },
  { pos: [-2.3, 0.8, -0.5], label: 'Web', color: '#FFB800', size: 0.28 },
  { pos: [1.5, -1.5, 1], label: 'Android', color: '#B967FF', size: 0.25 },
  { pos: [-1.8, -1.2, 1.5], label: 'Flutter', color: '#FF4D6D', size: 0.25 },
  { pos: [3.5, -0.5, 1.8], label: 'Data', color: '#00E5A0', size: 0.22 },
  { pos: [-3, -0.3, -2], label: 'DevOps', color: '#3B82F6', size: 0.22 },
  { pos: [0.5, 2.2, -2], label: 'Security', color: '#FF4D6D', size: 0.22 },
  { pos: [-0.5, -2.3, -1], label: 'UX', color: '#FFB800', size: 0.22 },
];

// Edges as index pairs
const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [0, 8],
  [1, 5], [1, 6], [1, 7],
  [2, 4], [2, 8],
  [3, 5], [3, 8],
  [4, 8], [4, 6],
  [6, 7],
];

export default function LearningConstellation() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* Nodes */}
      {NODES.map((n, i) => (
        <Node key={i} {...n} index={i} />
      ))}

      {/* Edges */}
      {EDGES.map((edge, i) => (
        <Edge key={i} from={NODES[edge[0]]} to={NODES[edge[1]]} index={i} />
      ))}

      {/* Signal packets traveling along edges */}
      <SignalPackets />
    </group>
  );
}

function Node({ pos, color, size, index }) {
  const mesh = useRef();
  const halo = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      const pulse = 1 + Math.sin(t * 2 + index) * 0.12;
      mesh.current.scale.setScalar(pulse);
    }
    if (halo.current) {
      halo.current.scale.setScalar(1 + Math.sin(t * 1.5 + index) * 0.2);
      halo.current.material.opacity = 0.15 + Math.sin(t * 1.5 + index) * 0.08;
    }
  });
  return (
    <group position={pos}>
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function Edge({ from, to }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...from.pos), new THREE.Vector3(...to.pos)];
  }, [from, to]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#8B8AA3" transparent opacity={0.25} />
    </line>
  );
}

function SignalPackets() {
  const group = useRef();
  const packets = useMemo(() => {
    return EDGES.map((edge, i) => ({
      from: new THREE.Vector3(...NODES[edge[0]].pos),
      to: new THREE.Vector3(...NODES[edge[1]].pos),
      speed: 0.3 + Math.random() * 0.4,
      offset: Math.random(),
      color: NODES[edge[0]].color,
    }));
  }, []);

  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    packets.forEach((p, i) => {
      const ref = refs.current[i];
      if (!ref) return;
      const progress = ((t * p.speed + p.offset) % 1);
      ref.position.lerpVectors(p.from, p.to, progress);
      ref.material.opacity = Math.sin(progress * Math.PI) * 0.9;
    });
  });

  return (
    <group ref={group}>
      {packets.map((p, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
