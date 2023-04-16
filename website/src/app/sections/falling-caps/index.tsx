"use client"

import * as Scrollytelling from "@bsmnt/scrollytelling";

import s from "./falling-caps.module.scss";
import { CapsModel } from "./caps";
import { Canvas } from "@react-three/fiber";

const splitText = (text: string, wordClass?: string) => {
  const wordsArray = text.split(" ");
  const htmlWords = wordsArray.map((word, i) => {
    return (
      <span className={wordClass} key={i}>
        {word}
        {i < wordsArray.length - 1 && " "}
      </span>
    );
  });

  return htmlWords
}

const lines = [
  "We want to help",
  "make the internet",
  "everything it can be."
]
const totalWords = lines.reduce((acc, line) => {
  return acc + line.split(" ").length
}, 0)


export const FallingCaps = () => {

  return (
    <Scrollytelling.Root end="bottom bottom">
      <section className={s['spacer']}>
        <div className={s["pin"]}>
          <div className={s["canvas-container"]}>
            <Canvas
              camera={{ position: [0, 0, 10], fov: 35 }}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
              }}
            >
              <CapsModel />
            </Canvas>
          </div>

          <Scrollytelling.Animation
            tween={{
              start: 0,
              end: 60,
              target: `.${s["paragraph"]} > *`,
              fromTo: [
                {
                  opacity: 0.2,
                },
                {
                  opacity: 1,
                  stagger: 100 / totalWords,
                  duration: 100,
                  ease: "power2.out",
                },
              ],
            }}
          />
          <p className={s["paragraph"]}>
            {splitText(lines[0] as string)}<br/>
            {splitText(lines[1] as string)}<br/>
            {splitText(lines[2] as string, s["highlight"])}
          </p>
        </div>
      </section>
    </Scrollytelling.Root>
  );
};
