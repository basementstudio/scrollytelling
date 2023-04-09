"use client";
import clsx from "clsx";
import { useState } from "react";
import * as Scrollytelling from "@bsmnt/scrollytelling";
// import { StickyCollection } from "./sticky-collection";

export default function ShopifyClonePage() {
  const [activeLabel, setActiveLabel] = useState<string>();

  return (
    <div className="bg-black relative">
      <section
        className="h-[100vh] p-12 bg-white"
        id="hero-section"
        data-section="0"
      >
        <h1>
          Inspo{" "}
          <a
            href="https://www.shopify.com/editions/winter2023"
            target="_blank"
            rel="noopener"
          >
            https://www.shopify.com/editions/winter2023
          </a>
        </h1>
      </section>

      <div className="space-y-12">
        {sections.map((section, i) => {
          // return <StickyCollection {...section} index={i} key={i} />;
          return (
            <Scrollytelling.Root start="top bottom" end="+=100%" debug key={i}>
              <section
                className={clsx(
                  "min-h-[200vh] z-10 p-12 relative rounded-t-3xl rounded-b-3xl text-black overflow-hidden",
                  section.className
                )}
                style={{
                  willChange: "transform",
                }}
                data-section={i + 1}
              >
                <Scrollytelling.Waypoint
                  at={100}
                  label={`section-${i}`}
                  onCall={() => {
                    console.log("normal call???????????????????");
                    setActiveLabel(`section-${i}`);
                  }}
                  onReverseCall={() => {
                    console.log("reverse call???????????????????");
                    setActiveLabel(i === 0 ? undefined : `section-${i - 1}`);
                  }}
                />
                <Scrollytelling.Animation
                  tween={{
                    target: `[data-section="${i}"]`,
                    start: 0,
                    end: 100,
                    //   end: { unit: "vh", value: 100 },
                    to: {
                      y: i === 0 ? undefined : "100vh",
                      opacity: 0,
                      ease: "power1.in",
                      transformOrigin: "bottom center",
                      scale: i === 0 ? 0.9 : 1,
                    },
                  }}
                />
                <h1 className="text-4xl">{section.title}</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  eaque sit nemo dolor, iure ratione quasi magnam molestias quis
                  repellat. Repudiandae dolorem recusandae nesciunt excepturi
                  eum ratione voluptates neque sed.
                </p>

                <p className="absolute bottom-12">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  eaque sit nemo dolor, iure ratione quasi magnam molestias quis
                  repellat. Repudiandae dolorem recusandae nesciunt excepturi
                  eum ratione voluptates neque sed. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Cum eaque sit nemo dolor, iure
                  ratione quasi magnam molestias quis repellat. Repudiandae
                  dolorem recusandae nesciunt excepturi eum ratione voluptates
                  neque sed. Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Cum eaque sit nemo dolor, iure ratione quasi magnam
                  molestias quis repellat. Repudiandae dolorem recusandae
                  nesciunt excepturi eum ratione voluptates neque sed. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Cum eaque
                  sit nemo dolor, iure ratione quasi magnam molestias quis
                  repellat. Repudiandae dolorem recusandae nesciunt excepturi
                  eum ratione voluptates neque sed. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Cum eaque sit nemo dolor, iure
                  ratione quasi magnam molestias quis repellat. Repudiandae
                  dolorem recusandae nesciunt excepturi eum ratione voluptates
                  neque sed.
                </p>
              </section>
            </Scrollytelling.Root>
          );
        })}
      </div>

      <div className="fixed top-4 right-4 z-50 bg-black text-white px-12 py-6">
        Active Label: {activeLabel}
      </div>
    </div>
  );
}

const sections = [
  { title: "Section one", className: "bg-yellow-300" },
  { title: "Section two", className: "bg-pink-300" },
  { title: "Section three", className: "bg-green-300" },
  { title: "Section four", className: "bg-blue-300" },
];

export type Section = typeof sections[number];
