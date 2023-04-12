import * as THREE from "three";
import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useThree } from "@react-three/fiber";

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

export function MacModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Mac128k-light.glb"
  ) as GLTFResult;

  const width = useThree((state) => state.viewport.width); 

  return (
    <Float>
      <group {...props} dispose={null} scale={width * 0.6}>
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
}
