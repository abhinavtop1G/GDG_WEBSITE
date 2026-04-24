'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Roughly plotted latitude/longitude -> 3D coords on unit sphere
function latLngToVec3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Contributor nodes around the globe
const LOCATIONS = [
  [28.6, 77.2],   // Delhi
  [1.35, 103.8],  // Singapore
  [37.8, -122.4], // SF
  [51.5, -0.1],   // London
  [-33.9, 151.2], // Sydney
  [35.7, 139.7],  // Tokyo
  [52.5, 13.4],   // Berlin
  [-23.5, -46.6], // São Paulo
  [19.4, -99.1],  // Mexico City
  [-1.3, 36.8],   // Nairobi
  [55.8, 37.6],   // Moscow
  [40.7, -74.0],  // NYC
];

export default function ImpactHorizon() {
  const globe = useRef();
  const wireframe = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globe.current) globe.current.rotation.y = t * 0.1;
    if (wireframe.current) wireframe.current.rotation.y = -t * 0.05;
  });

  const nodePositions = useMemo(
    () => LOCATIONS.map((l) => latLngToVec3(l[0], l[1], 2.5)),
    []
  );

  // Create arc pairs between random locations
  const arcs = useMemo(() => {
    const result = [];
    for (let i = 0; i < 14; i++) {
      const a = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      const b = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      if (a.equals(b)) continue;
      result.push({ from: a, to: b, offset: Math.random() });
    }
    return result;
  }, [nodePositions]);

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={globe}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#1a0f2e"
          emissive="#3B82F6"
          emissiveIntensity={0.15}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Wireframe grid overlay */}
      <mesh ref={wireframe}>
        <sphereGeometry args={[2.52, 24, 16]} />
        <meshBasicMaterial
          color="#00E5A0"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Contributor nodes */}
      {nodePositions.map((pos, i) => (
        <ContributorNode key={i} position={pos} index={i} />
      ))}

      {/* Connection arcs */}
      {arcs.map((arc, i) => (
        <ConnectionArc key={i} from={arc.from} to={arc.to} offset={arc.offset} />
      ))}
    </group>
  );
}

function ContributorNode({ position, index }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const pulse = 1 + Math.sin(t * 2 + index * 0.5) * 0.4;
      ref.current.scale.setScalar(pulse);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#00E5A0" />
    </mesh>
  );
}

function ConnectionArc({ from, to, offset }) {
  const lineRef = useRef();
  const packetRef = useRef();

  const { curve, geometry } = useMemo(() => {
    // Arc midpoint pushed outward
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dist = from.distanceTo(to);
    mid.normalize().multiplyScalar(2.5 + dist * 0.3);

    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const points = curve.getPoints(30);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return { curve, geometry };
  }, [from, to]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = ((t * 0.3 + offset) % 1);
    if (packetRef.current) {
      const point = curve.getPointAt(progress);
      packetRef.current.position.copy(point);
      packetRef.current.material.opacity = Math.sin(progress * Math.PI);
    }
  });

  return (
    <>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#00E5A0" transparent opacity={0.35} />
      </line>
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#FFB800" transparent />
      </mesh>
    </>
  );
}
