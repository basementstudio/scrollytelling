"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { useCallback } from "react";
import Image from "next/image";

import s from "./cyllinder.module.scss";
import clsx from "clsx";

const mapItemsToCylinder = <T,>(
  itemsArray: T[],
  callback: (
    item: T,
    props: {
      data: {
        idx: number
        progress: number
      }
      y: number;
      z: number;
      rotationX: number;
      opacity: number;
    }
  ) => any,
  progress: number
) => {
  const relevantArrayLength = itemsArray.length - 1;
  const arrayLength = itemsArray.length;

  const cylinderRadius = 240;
  /* Bigger number, more visible */
  const visibleRangeFactor = 5;
  const availableRadians = Math.PI / 1.25;
  const itemDuration = 1 / relevantArrayLength;
  const opacityDiminishFactor = 0.5;

  return itemsArray.map((item, idx) => {
    // Position is the center
    const itemPosition = idx * itemDuration;

    const distanceFromMarker = Math.abs(itemPosition - progress);
    const transformedDistanceFromMarker =
      distanceFromMarker * (arrayLength / visibleRangeFactor);
    /*
      This is the progress of the item.
      Goes from 0 to 1 as it approaches to the target, once it passes, back to 0
    */
    const itemProgress = gsap.utils.clamp(
      0,
      1,
      1 - distanceFromMarker * arrayLength * 2
    ); // Only changes once the box intersects the middle
    const transformedProgress = gsap.utils.clamp(
      0,
      1,
      1 - transformedDistanceFromMarker
    );

    // Map elements over the cylinder
    const offsetAngle = progress * availableRadians;
    const angle = (idx / relevantArrayLength) * availableRadians - offsetAngle;
    const y = Math.sin(angle) * cylinderRadius;
    const z = Math.cos(angle) * cylinderRadius;
    const angleInDegrees = -((angle * 180) / Math.PI);

    return callback(item, {
      data: {
        progress: itemProgress,
        idx
      },
      y,
      z,
      rotationX: angleInDegrees,
      opacity: transformedProgress * opacityDiminishFactor
    });
  });
};

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
