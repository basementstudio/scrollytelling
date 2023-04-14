"use client"

import { Canvas } from '@react-three/fiber';
import React from 'react';
import { useAppStore } from '../../context/use-app-store';
import { webglTunnel } from "../../lib/webgl";

const PageCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 35 }}
      className="canvas"
      // @ts-ignore
      // eventSource={eventsRef}
      onCreated={() => useAppStore.setState({ canvasLoaded: true })}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <webglTunnel.Out />
    </Canvas>
  );
};

export default PageCanvas;