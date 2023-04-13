"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import Image from "next/image";

import s from "./cyllinder.module.scss";
import clsx from "clsx";
import { defaultConfig, useMapToCylinder } from "./helpers";
import { Experiment } from "../../../lib/types";
import { useMedia } from "../../../hooks/use-media";
import Link from "next/link";

const progress = { value: 0 };

type CyllinderProps = {
  experiments: Experiment[];
};

const itemHeight = "7vh";
const itemsInViewAtOnce = 7;
const itemsPadding = 4;

export const Cyllinder: React.FC<CyllinderProps> = ({ experiments }) => {
  const isMobileSize = useMedia("(max-width: 768px)");
  const pinSpacerHeight = `calc(3 * ${itemHeight} * ${
    Math.max(itemsInViewAtOnce, experiments.length) + itemsPadding
  })`;

  const update = useMapToCylinder({
    target: "[data-experiment]",
    onUpdate: (element, { y, z, rotationX, opacity, data }) => {
      gsap.set(element, {
        rotateX: rotationX,
        opacity: data.progress === 0 ? opacity : 1,
        y: y,
        z: z,
        attr: { ["data-state"]: data.progress != 0 ? "active" : "disabled" },
      });
    },
    config: {
      availableRadians: isMobileSize
        ? defaultConfig.availableRadians / 2
        : defaultConfig.availableRadians,
    },
  });

  return (
    <Scrollytelling.Root
      scrub={0.75}
      callbacks={{
        onRefresh: () => update(progress.value),
      }}
      end="bottom bottom"
    >
      <div
        className={s["section"]}
        style={{
          height: pinSpacerHeight,
        }}
      >
        <div className={s["pin"]}>
          <div className={s["cyllinder"]}>
            <Scrollytelling.Animation
              tween={{
                start: 0,
                end: 100,
                target: progress,
                to: {
                  value: 1,
                  onUpdate: () => update(progress.value),
                },
              }}
            />

            {experiments.map((experiment, i) => {
              const author = experiment.contributors[0];

              return (
                <div className={s["item"]} data-experiment={i} key={i}>
                  <h2 className={s["title"]}>{experiment.title}</h2>
                  <div className={s["info"]}>
                    <Link
                      className={s["link"]}
                      href={"https://lab.basement.studio" + experiment.href}
                    >
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
                    </Link>

                    {author?.name && (
                      <p className={s["credits"]}>
                        <span>Made by</span>{" "}
                        <Link href={author.url} target="_blank" rel="noopener">
                          {author?.name}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Scrollytelling.Root>
  );
};
