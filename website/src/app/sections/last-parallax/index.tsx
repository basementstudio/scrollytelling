import * as Scrollytelling from "~/lib/scrollytelling-client";
import Image from "next/image";

import SMILE_IMAGE from "../../../../public/images/parallax/smile.png";
import PC_IMAGE from "../../../../public/images/parallax/pc.png";

import s from "./last-parallax.module.scss";

export const LastParallax = () => {
  return (
    <Scrollytelling.Root
      start="top bottom"
      scrub={0.75}
      debug={{ label: "last parallax" }}
    >
      <section className={s["section"]}>
        <div className="wrapper">
          <Scrollytelling.Waypoint at={50} tween={{ target: ['body'], to: { background: 'white', color: 'black' }, duration: 0.35 }} />
          <Scrollytelling.Waypoint at={100} tween={{ target: ['body'], to: { background: 'black', color: 'white' }, duration: 0.35 }} />
          <Scrollytelling.Parallax
            tween={{
              start: 0,
              end: 100,
              movementY: { value: 40, unit: "px" },
            }}
          >
            <Image
              alt="PC"
              className={s["pc"]}
              src={PC_IMAGE}
              placeholder="blur"
            />
          </Scrollytelling.Parallax>
          <Scrollytelling.Parallax
            tween={{
              start: 0,
              end: 100,
              movementY: { value: -30, unit: "px" },
            }}
          >
            <Image
              alt="Smile"
              className={s["smile"]}
              src={SMILE_IMAGE}
              placeholder="blur"
            />
          </Scrollytelling.Parallax>
          <Scrollytelling.Animation
            tween={{
              start: 0,
              end: 100,
              fromTo: [
                {
                  scale: 0,
                },
                {
                  ease: "linear",
                  scale: 1,
                },
              ],
            }}
          >
            <h2 className={s['title']}>
              THAT&apos;S ALL, <br />
              FOLKS
            </h2>
          </Scrollytelling.Animation>
        </div>
      </section>
    </Scrollytelling.Root>
  );
};
