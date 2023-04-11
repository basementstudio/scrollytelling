"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { useCallback } from "react";
import Image from "next/image";

import s from "./cyllinder.module.scss";
import clsx from "clsx";
import { mapItemsToCylinder } from "./helpers";

const progress = { value: 0 };

export const Cyllinder = () => {
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
                    <Image
                      className={clsx("image", s["image"])}
                      src={"https://dummyimage.com/760x496/000000/ffffff"}
                      width={760}
                      height={496}
                      alt={"dummy image"}
                    />

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

const experiments: {
  title: string;
  image: string;
}[] = [
  {
    title: "GRID BUMP",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "SVG GRADIENT",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "SCULPTURE GALLERY",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "HOLOGRAM WITH NORMALS",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "CD FOUND UNDER THE DESK",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "TRANSMISSION MATERIAL",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "3D CUPCAKE",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "HOLOGRAM WITH NORMALS",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "CD FOUND UNDER THE DESK",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "TRANSMISSION MATERIAL",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
  {
    title: "3D CUPCAKE",
    image:
      "https://images.ctfassets.net/coilcgtyhxyc/7aNUelMZ4GWFG52Un5ddaR/572eb8fd39c9f689e1a04f7e1ba39b10/Cover.jpg?w=2800&h=1575&fm=webp",
  },
];
