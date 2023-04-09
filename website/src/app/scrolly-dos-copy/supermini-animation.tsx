"use client";
import { useEffect, useRef } from "react";
import * as Scrollytelling from "@bsmnt/scrollytelling";

export const SuperminiAnimation = () => {
  const controllerRef: Scrollytelling.ImageSequenceCanvasProps["controllerRef"] =
    useRef(null);
  const framRef = useRef({ frame: 1 });

  useEffect(() => {
    controllerRef.current?.preload(1, 225);
  }, []);

  return (
    <>
      <Scrollytelling.Animation
        tween={{
          start: 80,
          end: 100,
          to: { scale: 0.9, opacity: 0 },
        }}
      >
        <Scrollytelling.ImageSequenceCanvas
          controllerRef={controllerRef}
          getFrameSrc={(frame, { supportsWebp }) => {
            const normalizedFrame = frame.toLocaleString("en-US", {
              minimumIntegerDigits: 4,
              useGrouping: false,
            });
            return `/360-sequence${
              supportsWebp ? "-webp" : ""
            }/${normalizedFrame}.${supportsWebp ? "webp" : "png"}`;
          }}
          className="aspect-square w-[50vw] h-[50vw]"
          width={1000}
          height={1000}
        />
      </Scrollytelling.Animation>

      <Scrollytelling.Animation
        tween={{
          target: framRef.current,
          start: 0,
          end: 100,
          fromTo: [
            { frame: 1 },
            {
              snap: "frame",
              frame: 225,
              ease: "power2.out",
              onUpdate() {
                controllerRef.current?.draw(framRef.current.frame);
              },
            },
          ],
        }}
      />
    </>
  );
};
