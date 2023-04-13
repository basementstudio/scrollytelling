"use client";

import * as Scrollytelling from "@bsmnt/scrollytelling";
import Image from "next/image";

import SMILE_IMAGE from "../../../../public/images/parallax/smile.png";
import PC_IMAGE from "../../../../public/images/parallax/pc.png";

import s from "./last-parallax.module.scss";

export const LastParallax = () => {
  return (
    <Scrollytelling.Root end="bottom bottom" scrub={0.75}>
      <Scrollytelling.Pin
        childHeight={"100vh"}
        pinSpacerHeight={"200vh"}
        top={0}
      >
        <section className={s["section"]}>
          <div className="wrapper">
            <Scrollytelling.Animation
              tween={{
                start: 0,
                end: 100,
                fromTo: [
                  {
                    yPercent: -20,
                  },
                  {
                    ease: "linear",
                    yPercent: -50,
                  },
                ],
              }}
            >
              <Image
                alt="Smile"
                className={s["smile"]}
                src={SMILE_IMAGE}
                placeholder="blur"
              />
            </Scrollytelling.Animation>
            <Scrollytelling.Animation
              tween={{
                start: 0,
                end: 100,
                fromTo: [
                  {
                    scale: 60,
                  },
                  {
                    ease: "linear",
                    scale: 1,
                  },
                ],
              }}
            >
              <h2>
                LAST BUT <br />
                NOT LEAST
              </h2>
            </Scrollytelling.Animation>
            <Scrollytelling.Animation
              tween={{
                start: 0,
                end: 100,
                fromTo: [
                  {
                    yPercent: -80,
                  },
                  {
                    ease: "linear",
                    yPercent: -50,
                  },
                ],
              }}
            >
              <Image
                alt="PC"
                className={s["pc"]}
                src={PC_IMAGE}
                placeholder="blur"
              />
            </Scrollytelling.Animation>
          </div>
        </section>
      </Scrollytelling.Pin>
    </Scrollytelling.Root>
  );
};
