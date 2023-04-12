"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { useCallback } from "react";
import Image from "next/image";

import s from "./cyllinder.module.scss";
import clsx from "clsx";
import { mapItemsToCylinder } from "./helpers";
import { Experiment } from "../../../lib/types";

const progress = { value: 0 };

type CyllinderProps = {
  experiments: Experiment[];
}

export const Cyllinder: React.FC<CyllinderProps> = ({experiments}) => {
  const itemHeight = "7vh";
  const itemsInViewAtOnce = 7;
  const itemsPadding = 4;
  const itemContainerHeight = `calc(${itemHeight} * ${itemsInViewAtOnce}`;
  const pinSpacerHeight = `calc(3 * ${itemHeight} * ${
    Math.max(itemsInViewAtOnce, experiments.length) + itemsPadding
  }`;

  const animateCylinder = useCallback((progress: number) => {
    const elements =
      document.querySelectorAll<HTMLDivElement>(`[data-experiment]`);

    mapItemsToCylinder(
      Array.from(elements),
      (element, { y, z, rotationX, opacity, data }) => {
        gsap.set(element, {
          rotateX: rotationX,
          opacity: data.progress === 0 ? opacity : 1,
          y: y,
          z: z,
          attr: { ["data-state"]: data.progress != 0 ? "active" : "disabled" }
        });
      },
      progress
    );
  }, []);

  return (
    <Scrollytelling.Root
      scrub={0.75}
      callbacks={{
        onRefresh: () => animateCylinder(progress.value),
      }}
      end="bottom bottom"
    >
      <div
        className={s["section"]}
        style={{
          height: pinSpacerHeight,
        }}
      >
        <div
          className={s["pin"]}
          style={{
            height: itemContainerHeight,
          }}
        >
          <div className={s["cyllinder"]}>
            {/* Just for debug purposes */}
            {/* <span style={{ width: "100%", height: 1, background: "red" }} /> */}

            <Scrollytelling.Animation
              tween={{
                start: 0,
                end: 100,
                target: progress,
                to: {
                  value: 1,
                  onUpdate: () => animateCylinder(progress.value),
                },
              }}
            />

            {experiments.map((experiment, i) => {
              return (
                <div className={s["item"]} data-experiment={i} key={i}>
                  <h2 className={s["title"]}>
                    {experiment.og && (
                      <Image
                        draggable={false}
                        className={clsx("image", s["image"])}
                        src={experiment.og}
                        width={760}
                        height={496}
                        quality={100}
                        alt={"dummy image"}
                      />
                    )}

                    {experiment.title}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Scrollytelling.Root>
  );
};
