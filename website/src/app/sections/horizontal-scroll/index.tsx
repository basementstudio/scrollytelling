"use client";

import { useMemo, useRef, useState } from "react";
import * as Scrollytelling from "~/lib/scrollytelling-client";
import gsap from "gsap";
import { useIsoLayoutEffect } from "~/app/hooks/use-iso-layout-effect";

import s from "./horizontal-scroll.module.scss";

// Define the sections for the animation
const sectionData = [
  { label: "SECTION 1" },
  { label: "SECTION 2" },
  { label: "SECTION 3" },
  { label: "SECTION 4" },
  { label: "SECTION 5" },
];

export const HorizontalScroll = () => {
  // Ref for the main container
  const containerRef = useRef<HTMLDivElement>(null);

  // State to store the inner sections
  const [sections, setSections] = useState<HTMLDivElement[]>([]);

  // Effect to initialize the sections
  useIsoLayoutEffect(() => {
    if (!containerRef.current) return;

    // Use a selector to find the inner sections
    const scopedQuerySelector = gsap.utils.selector(containerRef);
    const inner_sections = scopedQuerySelector(
      `.${s["panel"]}`
    ) as HTMLDivElement[];

    setSections(inner_sections);
  }, []);

  // Calculate animation configuration for horizontal scroll
  const horizontalScrollTween = useMemo(() => {
    return { xPercent: -100 * (sections.length - 1), ease: "none" };
  }, [sections.length]);

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
      defaults={{ ease: "linear" }}
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
