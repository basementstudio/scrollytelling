"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { useCallback } from "react";

const mapItemsToCylinder = <T,>(
  itemsArray: T[],
  callback: (
    item: T,
    props: {
      idx: number,
      y: number,
      z: number,
      rotationX: number,
      opacity: number
    }
  ) => any,
  progress: number
) => {
  const relevantArrayLength = itemsArray.length - 1
  const arrayLength = itemsArray.length;

  const cylinderRadius = 240;
  /* Bigger number, more visible */
  const visibleRangeFactor = 4;
  const availableRadians = Math.PI;
  const itemDuration = (1 / relevantArrayLength);

  return itemsArray.map((item, idx) => {
    // Position is the center
    const itemPosition = idx * itemDuration;

    const distanceFromMarker = Math.abs(itemPosition - progress);
    const transformedDistanceFromMarker = distanceFromMarker * (arrayLength / visibleRangeFactor);
    /*
      This is the progress of the item.
      Goes from 0 to 1 as it approaches to the target, once it passes, back to 0
    */
    const itemProgress = gsap.utils.clamp(0, 1, 1 - transformedDistanceFromMarker);

    // Map elements over the cylinder
    const offsetAngle = (progress) * availableRadians ;
    const angle = (idx / relevantArrayLength) * availableRadians - offsetAngle;
    const y = Math.sin(angle) * cylinderRadius;
    const z = Math.cos(angle) * cylinderRadius;
    const angleInDegrees = -((angle * 180) / Math.PI);

    return callback(item, {
      idx,
      y,
      z,
      rotationX: angleInDegrees,
      opacity: itemProgress
    })
  });
}

export const Cyllinder = () => {
  const itemHeight = "7vh";
  const itemsInViewAtOnce = 7;
  const itemsPadding = 4;
  const itemContainerHeight = `calc(${itemHeight} * ${itemsInViewAtOnce}`;
  const pinSpacerHeight = `calc(3 * ${itemHeight} * ${
    Math.max(itemsInViewAtOnce, experiments.length) + itemsPadding
  }`;

  const animateCylinder = useCallback((st: ScrollTrigger) => {
    const elements = document.querySelectorAll<HTMLDivElement>(
      `[data-experiment]`
    );

    mapItemsToCylinder(Array.from(elements), (element, { y, z, rotationX, opacity }) => {
      gsap.set(element, {
        rotateX: rotationX,
        opacity: opacity,
        y: y,
        z: z,
      });
    }, st.progress);
  }, [])

  return (
    <Scrollytelling.Root
      callbacks={{
        onRefresh: animateCylinder,
        onUpdate: animateCylinder
      }}
      end="bottom bottom"
      //   end="+=300%"
      debug
    >
      <div
        className="flex justify-center"
        style={{
          height: pinSpacerHeight,
        }}
      >
        <div
          className="sticky top-0 py-[50vh] w-full"
          style={{
            height: itemContainerHeight,
          }}
        >
          <Scrollytelling.Animation
            tween={{
              start: 0,
              end: 100,
              to: {
                yPercent: -100,
                ease: "linear",
              },
            }}
          >
            <div className="relative flex flex-col w-full" style={{ perspective: "700px" }}>
              <span style={{width: '100%', height: 1, background: "red"}} />
              {experiments.map((experiment, i) => {
                return (
                  <Scrollytelling.Animation
                    tween={{ start: 0, end: 0, to: {} }}
                    key={i}
                  >
                    <div style={{
                      position: "absolute",
                      left: "50%",
                      transform: `translate(-50%, -50%) scale(0.7)`,
                      opacity: 0
                    }} data-experiment={i} key={i}>
                      <h2
                        className="font-bold text-center whitespace-nowrap"
                        style={{

                          fontSize: "6vw",
                          fontFamily: "basement grotesque",
                        }}
                      >
                        {experiment.title}
                      </h2>
                    </div>
                  </Scrollytelling.Animation>
                );
              })}
            </div>
          </Scrollytelling.Animation>
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
