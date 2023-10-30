"use client";

import { useMemo, useRef } from "react";
import * as Scrollytelling from "~/lib/scrollytelling-client";

import s from "./horizontal-scroll.module.scss";

export const HorizontalScroll = () => {
  // Ref for the main container
  const containerRef = useRef<HTMLDivElement>(null);

  // Define the sections for the animation
  const sectionData = [
    { label: "SECTION 1" },
    { label: "SECTION 2" },
    { label: "SECTION 3" },
    { label: "SECTION 4" },
    { label: "SECTION 5" },
  ];

  // Calculate animation configuration for horizontal scroll
  const horizontalScrollTween = useMemo(() => {
    return { xPercent: -100 * (sectionData.length - 1), ease: "none" };
  }, [sectionData.length]);

  // Create animated section elements
  const sectionElements = sectionData.map((section, index) => (
    <Scrollytelling.Animation
      key={index}
      tween={{
        start: 0,
        end: 100,
        to: horizontalScrollTween,
      }}
    >
      <div className={s["panel"]}>
        <h2>{section.label}</h2>
      </div>
    </Scrollytelling.Animation>
  ));

  // Main component with horizontal scroll effect
  return (
    <Scrollytelling.Root
      defaults={{ ease: "none" }}
      debug={{ label: "Horizontal Scroll" }}
      scrub={1}
      end="+=3500"
    >
      <Scrollytelling.Pin
        childHeight={"100vh"}
        pinSpacerHeight={"500vh"}
        pinSpacerClassName={s["pin-spacer"]}
        childClassName={s["pin-style"]}
        ref={containerRef}
      >
        {sectionElements}
      </Scrollytelling.Pin>
    </Scrollytelling.Root>
  );
};
