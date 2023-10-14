"use client";
import * as Scrollytelling from "@bsmnt/scrollytelling";

export const ImageSequenceSection = () => {
  const { controllerRef, sequence } = Scrollytelling.useImageSequence(140);

  return (
    <Scrollytelling.Root
      debug={{ label: "Image Sequence Canvas", markers: true }}
    >
      <Scrollytelling.Pin childHeight={"100vh"} pinSpacerHeight={"300vh"}>
        <section>
          <Scrollytelling.ImageSequenceCanvas
            controllerRef={controllerRef}
            getFrameSrc={(f) => `/dance-sequence/dance-frame-${f}.png`}
            // width={500}
            // height={500}
            style={{
              width: "70vw",
              height: "100vh",
              objectFit: "cover",
            }}
          />
          <Scrollytelling.Animation
            tween={{
              start: 0,
              end: 100,
              target: sequence,
              to: {
                frame: 202,
                snap: "frame",
                ease: "none",
                onUpdate: () => {
                  controllerRef.current?.draw(sequence.frame);
                },
              },
            }}
          />
        </section>
      </Scrollytelling.Pin>
    </Scrollytelling.Root>
  );
};
