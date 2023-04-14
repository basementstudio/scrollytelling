import { Cyllinder } from "./components/cyllinder";

import { FallingCaps } from "./sections/falling-caps";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { HorizontalMarquee } from "./sections/horizontal-marquee";
import { LastParallax } from "./sections/last-parallax";
import { MysteriousSection } from "./sections/mysterious";
import { Experiment } from "../lib/types";
import { LabIntro } from "./sections/lab-cylinder/intro";
import PageCanvas from "./components/page-canvas";

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
      <PageCanvas />
      <Hero />
      <FallingCaps />
      <HorizontalMarquee />
      <LabIntro />
      <Cyllinder experiments={filteredExperiments} />
      <LastParallax />
      <MysteriousSection />
      <Footer />
    </main>
  );
}
