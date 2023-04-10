"use client";
import * as React from "react";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { ScrollToWaypointTest } from "./scroll-to-waypoint-test";

export const Hero = () => {
  const chunksAnimation = {
    start: 0,
    end: 70,
  };
  const chunksAnimationDuration = chunksAnimation.end - chunksAnimation.start;

  return (
    <Scrollytelling.Root end="bottom bottom">
      <section className="h-[350vh]">
        <div className="h-[100vh] flex items-center justify-center sticky top-0">
          <Scrollytelling.Animation
            tween={{ start: 70, end: 80, to: { opacity: 0, y: -10 } }}
          >
            <p className="text-5xl font-semibold max-w-[820px] mx-auto cursor-default">
              <span>This is</span>
              {textChunks.map((chunk, i) => {
                const chunkDuration =
                  chunksAnimationDuration / textChunks.length;

                const chunkAnimation = {
                  start: i * chunkDuration,
                  end: i * chunkDuration + chunkDuration,
                };

                return (
                  <Scrollytelling.Animation
                    tween={{
                      start: chunkAnimation.start,
                      end: chunkAnimation.end,
                      to: { opacity: 1, top: 0, ease: "linear" },
                    }}
                    key={i}
                  >
                    <span
                      style={{ opacity: 0.1, top: 0, position: "relative" }}
                    >
                      {chunk}
                    </span>
                  </Scrollytelling.Animation>
                );
              })}
            </p>
          </Scrollytelling.Animation>
          <Scrollytelling.Animation
            tween={{ start: 70, end: 100, to: { opacity: 1, y: 0 } }}
          >
            <p
              style={{ opacity: 0, transform: "translateY(10px)" }}
              className="text-5xl font-semibold max-w-[820px] mx-auto cursor-default absolute"
            >
              Enjoy.
            </p>
          </Scrollytelling.Animation>
        </div>
        <Scrollytelling.Waypoint
          at={80}
          tween={{ to: { color: "red" }, duration: 0.1 }}
          label="sarasa waypoint"
        >
          <div className="relative z-30">
            Hola
            <ScrollToWaypointTest label="sarasa waypoint" />
          </div>
        </Scrollytelling.Waypoint>
      </section>
    </Scrollytelling.Root>
  );
};

const textChunks: React.ReactNode[] = [
  " a website designed for demo purposes only,",
  " to show off some cool scrollytelling tricks,",
  <>
    <span className="text-[#FF4D00]"> and to announce a brand new library</span>
    .
  </>,
];
