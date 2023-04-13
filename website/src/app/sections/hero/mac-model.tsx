import * as THREE from "three";
import { Float, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useScrollytelling } from "@bsmnt/scrollytelling";

type GLTFResult = GLTF & {
  nodes: {
    Cube009: THREE.Mesh;
    Cube009_1: THREE.Mesh;
  };
  materials: {
    m_Mac128k: THREE.MeshStandardMaterial;
    m_Outline: THREE.MeshStandardMaterial;
  };
};

useGLTF.preload("/models/Mac128k-light.glb");

export const MacModel = () => {
  const { nodes, materials } = useGLTF(
    "/models/Mac128k-light.glb"
  ) as GLTFResult;
  const innerRef = useRef<THREE.Group>(null);

  const { timeline } = useScrollytelling();

  const width = useThree((state) => state.viewport.width);

  useFrame(() => {
    if (!innerRef.current || !timeline?.scrollTrigger) return;

    innerRef.current.rotation.y = Math.PI * 2 * timeline.scrollTrigger.progress;
  });

  return (
    <Float>
      <group dispose={null} scale={width * 0.6} ref={innerRef}>
        <group position={[0, 0, 0]} rotation={[0.45, -0.51, -0.03]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube009.geometry}
            material={materials.m_Mac128k}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube009_1.geometry}
            material={materials.m_Outline}
          />
        </group>
      </group>
    </Float>
  );
};
