"use client";

import { useAppStore } from "../context/use-app-store";
import { useIsoLayoutEffect } from "./hooks/use-iso-layout-effect";
import { FallingCaps } from "./sections/falling-caps";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { HorizontalMarquee } from "./sections/horizontal-marquee";
import { LastParallax } from "./sections/last-parallax";
import { MysteriousSection } from "./sections/mysterious";

import gsap from "gsap";

export default function HomePage() {
  const { fontsLoaded, canvasLoaded, loading } = useAppStore();

  useIsoLayoutEffect(() => {
    if (!fontsLoaded || !canvasLoaded || loading) return;
    gsap.to("main", { autoAlpha: 1, duration: 0.3 });
  }, [fontsLoaded, canvasLoaded, loading]);

  return (
    <main style={{ opacity: 0 }}>
      <Hero />
      <FallingCaps />
      <HorizontalMarquee />
      <LastParallax />
      <MysteriousSection />
      <Footer />
    </main>
  );
}
