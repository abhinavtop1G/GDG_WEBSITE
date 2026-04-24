'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ProjectsGallery() {
  const platform = useRef();

  useFrame((state) => {
    if (platform.current) {
      platform.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={platform}>
      {/* Project artifacts on pedestals */}
      <ProjectArtifact
        position={[0, 0, 0]}
        type="torus"
        color="#00E5A0"
        label="LexiRAG"
      />
      <ProjectArtifact
        position={[3.5, 0, -2]}
        type="octahedron"
        color="#FF4D6D"
        label="CrowdPulse"
      />
      <ProjectArtifact
        position={[-3.5, 0, -2]}
        type="cone"
        color="#3B82F6"
        label="CampusMesh"
      />

      {/* Central platform */}
      <mesh position={[0, -1.5, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 5.2, 64]} />
        <meshBasicMaterial color="#B967FF" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -1.52, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.5, 4.6, 64]} />
        <meshBasicMaterial color="#B967FF" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, -1.54, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 3.85, 64]} />
        <meshBasicMaterial color="#B967FF" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function ProjectArtifact({ position, type, color, label }) {
  const artifact = useRef();
  const pedestal = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (artifact.current) {
      artifact.current.rotation.y = t * 0.6;
      artifact.current.rotation.x = t * 0.3;
      artifact.current.position.y = Math.sin(t * 1.2) * 0.15 + 0.3;
      const target = hovered ? 1.2 : 1;
      artifact.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
    if (pedestal.current) {
      pedestal.current.rotation.y = -t * 0.1;
    }
  });

  const Geometry = () => {
    switch (type) {
      case 'torus':
        return <torusKnotGeometry args={[0.5, 0.15, 80, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.7, 0]} />;
      case 'cone':
        return <coneGeometry args={[0.55, 1, 6]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  };

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Artifact */}
      <mesh ref={artifact}>
        <Geometry />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.5}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Wireframe outer shell */}
      <mesh ref={pedestal} position={[0, 0.3, 0]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>

      {/* Pedestal ring */}
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Light beam from pedestal */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.9, 1, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
