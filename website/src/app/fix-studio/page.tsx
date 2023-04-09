"use client";

import * as React from "react";
import { Yellowtail } from "next/font/google";
import { SProject } from "./s-project";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { projects } from "./projects";

/* eslint-disable @next/next/no-img-element */

const yellowtail = Yellowtail({
  subsets: ["latin"],
  variable: "--font-yellowtail",
  weight: "400",
});

export default function FixStudioPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const topContainerRef = React.useRef<HTMLDivElement>(null);
  const titleContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      defaults: { duration: 1 },
    });

    timeline.to(topContainerRef.current, {
      opacity: 0,
      scale: 0.9,
    });

    timeline.to(
      titleContainerRef.current?.querySelector("h1") ?? null,
      {
        scaleY: 0,
        y: 250,
        ease: "linear",
      },
      0.6
    );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="h-screen" ref={containerRef}>
        <div
          className="h-[40%] sticky top-0 bg-red-500"
          ref={topContainerRef}
        ></div>
        <div
          className="h-[60%] bg-black text-white px-6 flex items-center sticky top-0"
          ref={titleContainerRef}
        >
          <h1
            style={{
              ...yellowtail.style,
              fontSize: "20vw",
              transform: "scaleY(2)",
            }}
            className="text-4xl font-medium"
          >
            React Miami
          </h1>
        </div>
      </div>
      <div className="bg-black">
        {projects.map((project, i) => {
          const headerHeight = 25;
          const pin = {
            top: i * headerHeight,
          };
          return (
            <SProject
              key={i}
              headerHeight={headerHeight}
              pin={pin}
              start={`top-=${pin.top}px bottom`}
              end={`bottom top+=${pin.top}px`}
              project={project}
              height={`calc(100vh)`}
            />
          );
        })}
      </div>
      <div className="h-screen">Footer</div>
    </div>
  );
}
