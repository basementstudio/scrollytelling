import { Cyllinder } from "./components/cyllinder";
import { FallingCaps } from "./sections/falling-caps";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { HorizontalMarquee } from "./sections/horizontal-marquee";
import { LastParallax } from "./sections/last-parallax";
import { MysteriousSection } from "./sections/mysterious";

export default function HomePage() {
  return (
    <main>
      {/* fonts preview: */}
      <h1 style={{ fontWeight: 900, fontSize: "5vw" }}>
        We Make Cool Shit That Performs
      </h1>
      <p style={{ fontWeight: 400 }}>Regular</p>
      <p style={{ fontWeight: 800 }}>Black Expanded</p>
      <p style={{ fontWeight: 900 }}>Ultra Black Expanded</p>
      {/* end fonts preview */}

      <Hero />
      <FallingCaps />
      <HorizontalMarquee />
      <Cyllinder />
      <LastParallax />
      <MysteriousSection />
      <Footer />
    </main>
  );
}
