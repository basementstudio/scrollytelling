"use client";

import { useMemo, useRef, useState } from "react";
import * as Scrollytelling from "~/lib/scrollytelling-client";
import gsap from "gsap";
import { useIsoLayoutEffect } from "~/app/hooks/use-iso-layout-effect";

import s from "./horizontal-scroll.module.scss";

export const HorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<HTMLDivElement[]>([]);

  useIsoLayoutEffect(() => {
    if (!containerRef.current) return;

    const q = gsap.utils.selector(containerRef);
    const inner_sections = q(`.${s["panel"]}`) as HTMLDivElement[];

    setSections(inner_sections);
  }, []);

  const tween = useMemo(() => {
    return { xPercent: -100 * (sections.length - 1), ease: "none" };
  }, [sections.length]);

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
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: tween,
          }}
        >
          <div className={s["panel"]}>
            <h2>SECTION 1</h2>
          </div>
        </Scrollytelling.Animation>
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: tween,
          }}
        >
          <div className={s["panel"]}>
            <h2>SECTION 2</h2>
          </div>
        </Scrollytelling.Animation>
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: tween,
          }}
        >
          <div className={s["panel"]}>
            <h2>SECTION 3</h2>
          </div>
        </Scrollytelling.Animation>
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: tween,
          }}
        >
          <div className={s["panel"]}>
            <h2>SECTION 4</h2>
          </div>
        </Scrollytelling.Animation>
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: tween,
          }}
        >
          <div className={s["panel"]}>
            <h2>SECTION 5</h2>
          </div>
        </Scrollytelling.Animation>
      </Scrollytelling.Pin>
    </Scrollytelling.Root>
  );
};
