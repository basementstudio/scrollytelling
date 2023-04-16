import { FallingCaps } from "./sections/falling-caps";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { HorizontalMarquee } from "./sections/horizontal-marquee";
import { LastParallax } from "./sections/last-parallax";
import { LabIntro } from "./sections/lab-cylinder/intro";
import { LabCylinder } from "./sections/lab-cylinder";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FallingCaps />
      <HorizontalMarquee />
      <LabIntro />
      {/* @ts-expect-error rsc */}
      <LabCylinder />
      <LastParallax />
      <Footer />
    </main>
  );
}
