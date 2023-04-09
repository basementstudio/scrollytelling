"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { Section } from "./page";

// this would achieve the same effect as https://www.shopify.com/editions/winter2023
// but without a "deacceleration" on pin.

export const StickyCollection = ({
  index: i,
  ...section
}: Section & { index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>();

  useEffect(() => {
    if (!ref.current) return;
    setContainerHeight(ref.current.clientHeight);
  }, []);

  return (
    <Scrollytelling.Root start="top bottom" end="+=100%">
      <section
        className={clsx(
          "min-h-[200vh] z-10 p-12 relative rounded-t-3xl rounded-b-3xl text-black overflow-hidden",
          section.className
        )}
        style={{
          willChange: "transform",
          position: "sticky",
          top: `calc((-1 * ${containerHeight}px) + 95vh)`,
        }}
        ref={ref}
        data-section={i + 1}
      >
        <Scrollytelling.Animation
          tween={{
            target: `[data-section="${i}"]`,
            start: 0,
            end: 100,
            //   end: { unit: "vh", value: 100 },
            to: {
              //   y: i === 0 ? undefined : "100vh",
              opacity: 0,
              ease: "power1.in",
              transformOrigin: "bottom center",
              scale: i === 0 ? 0.9 : 1,
            },
          }}
        />
        <h1 className="text-4xl">{section.title}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum eaque sit
          nemo dolor, iure ratione quasi magnam molestias quis repellat.
          Repudiandae dolorem recusandae nesciunt excepturi eum ratione
          voluptates neque sed.
        </p>

        <p className="absolute bottom-12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum eaque sit
          nemo dolor, iure ratione quasi magnam molestias quis repellat.
          Repudiandae dolorem recusandae nesciunt excepturi eum ratione
          voluptates neque sed. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Cum eaque sit nemo dolor, iure ratione quasi magnam
          molestias quis repellat. Repudiandae dolorem recusandae nesciunt
          excepturi eum ratione voluptates neque sed. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Cum eaque sit nemo dolor, iure ratione
          quasi magnam molestias quis repellat. Repudiandae dolorem recusandae
          nesciunt excepturi eum ratione voluptates neque sed. Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Cum eaque sit nemo dolor, iure
          ratione quasi magnam molestias quis repellat. Repudiandae dolorem
          recusandae nesciunt excepturi eum ratione voluptates neque sed. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Cum eaque sit nemo
          dolor, iure ratione quasi magnam molestias quis repellat. Repudiandae
          dolorem recusandae nesciunt excepturi eum ratione voluptates neque
          sed.
        </p>
      </section>
    </Scrollytelling.Root>
  );
};
