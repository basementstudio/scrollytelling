"use client";
import { gsap } from "gsap";
import * as Scrollytelling from "@bsmnt/scrollytelling";

export const Cillinder = () => {
  const itemHeight = "7vh";
  const itemsInViewAtOnce = 7;
  const itemsPadding = 4;
  const itemContainerHeight = `calc(${itemHeight} * ${itemsInViewAtOnce}`;
  const pinSpacerHeight = `calc(3 * ${itemHeight} * ${
    Math.max(itemsInViewAtOnce, experiments.length) + itemsPadding
  }`;

  return (
    <Scrollytelling.Root
      callbacks={{
        onUpdate: (st) => {
          // const maxItemsInView = 7;
          const itemDuration = 100 / experiments.length;
          const itemCenter = itemDuration / 2;

          experiments.forEach((experiment, i) => {
            const element = document.querySelector<HTMLDivElement>(
              `[data-experiment="${i}"]`
            );
            const h2 = element?.querySelector("h2");
            if (!element || !h2) return;
            const itemPosition = (i + 1) * itemDuration - itemCenter;
            const itemProgress = itemPosition / 100 - st.progress;

            const opacity = 1 - Math.abs(itemProgress * 3);
            const scale = 1 - Math.abs(itemProgress * 1.4);
            const y = itemProgress * -250;
            gsap.set(element, { opacity, scale, y });
          });
        },
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
          className="sticky top-0 py-[50vh] overflow-hidden"
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
            <div className="flex flex-col">
              {experiments.map((experiment, i) => {
                return (
                  <div data-experiment={i} key={i}>
                    <h2
                      className="font-bold text-center"
                      style={{
                        fontSize: "6vw",
                        fontFamily: "basement grotesque",
                      }}
                    >
                      {experiment.title}
                    </h2>
                  </div>
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
