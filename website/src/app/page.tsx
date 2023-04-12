import { Cyllinder } from "./components/cyllinder";
import { FallingCaps } from "./sections/falling-caps";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { HorizontalMarquee } from "./sections/horizontal-marquee";
import { LastParallax } from "./sections/last-parallax";
import { MysteriousSection } from "./sections/mysterious";
import { Experiment } from "../lib/types";

export default async function HomePage() {
  const experiments = await fetch(
    "https://lab.basement.studio/experiments.json",
    { next: { revalidate: 1 } }
  ).then((res) => res.json());

  const filteredExperiments = experiments.filter(
    (experiment: any) => experiment.og !== null
  ) as Experiment[];

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
      <Cyllinder experiments={filteredExperiments} />
      <LastParallax />
      <MysteriousSection />
      <Footer />
    </main>
  );
}
