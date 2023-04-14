import { Experiment } from "../../../lib/types";
import { Cyllinder } from "../../components/cyllinder";

export const LabCylinder = async () => {
  const experiments = await fetch(
    "https://lab.basement.studio/experiments.json",
    { next: { revalidate: 1 } }
  ).then((res) => res.json());

  const filteredExperiments = experiments.filter(
    (experiment: any) => experiment.og !== null
  ) as Experiment[];

  return <Cyllinder experiments={filteredExperiments} />;
};
