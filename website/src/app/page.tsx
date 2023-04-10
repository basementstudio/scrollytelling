"use client";
/* eslint-disable @next/next/no-img-element */
import { Yellowtail } from "next/font/google";
import { projects } from "./fix-studio/projects";
import { columns } from "./components/people";
import { Fragment } from "react";
import { news } from "./components/news";
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { SuperminiAnimation } from "./components/supermini-animation";
import { Cillinder } from "./components/cillinder";

const yellowtail = Yellowtail({
  subsets: ["latin"],
  variable: "--font-yellowtail",
  weight: "400",
});

export default function ScrollyDos() {
  return (
    <div
      id="bg"
      style={{
        ["--bg" as string]: "black",
        ["--text" as string]: "white",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <Scrollytelling.Root>
        <Scrollytelling.Pin
          childHeight={"60vh"}
          pinSpacerHeight={"100vh"}
          top={0}
          childClassName="z-10 flex items-center"
        >
          <Scrollytelling.Animation
            tween={{ start: 0, end: 40, to: { scaleY: 0, ease: "linear" } }}
          >
            <h2
              style={{
                ...yellowtail.style,
                fontSize: "20vw",
                transform: "scaleY(2)",
                lineHeight: 1,
                transformOrigin: "top center",
              }}
            >
              React Miami
            </h2>
          </Scrollytelling.Animation>
        </Scrollytelling.Pin>
      </Scrollytelling.Root>

      <div id="projects-container">
        {projects.map((project, i) => {
          const headerHeight = 25;
          const pin = {
            top: i * headerHeight,
          };
          const shouldTranslateABit = i > 3;

          return (
            <Fragment key={i}>
              <Scrollytelling.Root
                start={`top-=${pin.top}px bottom`}
                end={`bottom top+=${pin.top}px`}
              >
                <div
                  key={i}
                  className="sticky flex flex-col"
                  style={{
                    height: "100vh",
                    top: `${pin.top}px`,
                  }}
                >
                  <header
                    className="flex items-center justify-between uppercase border-[var(--text)] border-t bg-[var(--bg)] px-6"
                    style={{
                      height: headerHeight,
                    }}
                  >
                    <span className="flex-1">{project.title}</span>
                    <span className="flex-shrink-0">({project.year})</span>
                    <span className="flex-1 text-right">
                      {project.category}
                    </span>
                  </header>
                  <div className="relative flex-grow px-6 bg-[var(--bg)]">
                    <Scrollytelling.Animation
                      tween={[
                        {
                          start: 0,
                          end: 50,
                          to: {
                            scale: 1,
                            transformOrigin: "top right",
                            ease: "linear",
                          },
                        },
                        {
                          start: 50,
                          end: 100,
                          to: {
                            scale: 0,
                            transformOrigin: "top left",
                            ease: "linear",
                          },
                        },
                      ]}
                    >
                      <img
                        src={project.image}
                        alt=""
                        className="object-cover h-full w-full"
                        style={{
                          transform: "scale(0)",
                          transformOrigin: "top right",
                        }}
                        data-img-idx={i}
                      />
                    </Scrollytelling.Animation>
                  </div>
                  {shouldTranslateABit && (
                    <Scrollytelling.Waypoint
                      at={0}
                      tween={{
                        duration: 0.15,
                        target: "#projects-container",
                        to: { y: `-=${headerHeight}` },
                      }}
                    />
                  )}
                </div>
              </Scrollytelling.Root>
            </Fragment>
          );
        })}
      </div>

      <Scrollytelling.Root start="top bottom" end="bottom top">
        <div className="min-h-screen grid grid-cols-4 gap-4 relative">
          <Scrollytelling.Waypoint
            at={0}
            tween={{
              duration: 0.15,
              target: "#bg",
              to: {
                "--bg": "white",
                "--text": "black",
              },
            }}
          />

          {columns.map((column, i) => {
            return (
              <Scrollytelling.Parallax
                key={i}
                tween={{
                  start: 0,
                  end: 100,
                  movementY: { value: i * 4, unit: "vw" },
                }}
              >
                <div className="flex flex-col gap-4">
                  {column.map((person, i) => {
                    return (
                      <div key={i} className="border border-white">
                        <img src={person.image} alt="" />
                        <h3>{person.name}</h3>
                        <p>{person.role}</p>
                      </div>
                    );
                  })}
                </div>
              </Scrollytelling.Parallax>
            );
          })}
        </div>
      </Scrollytelling.Root>

      <Scrollytelling.Root start="top bottom" scrub={1}>
        <div className="h-[300vh] py-[30vh] relative">
          <Scrollytelling.Animation
            tween={[
              {
                fromTo: [{ y: "80vh" }, { y: 0, ease: "linear" }],
                start: 0,
                end: 25,
              },
              {
                fromTo: [
                  { xPercent: 90, ease: "linear" },
                  { xPercent: -100, ease: "linear" },
                ],
                start: 25,
                end: 100,
              },
            ]}
          >
            <div
              className="flex items-center gap-4 px-4 sticky top-[30vh]"
              id="sarasa"
            >
              {news.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="border border-[var(--text)] w-96 flex-shrink-0 p-4"
                  >
                    <p className="text-xs uppercase">{item.tagline}</p>
                    <p className="text-xl">{item.title}</p>
                    <p className="text-sm">{item.description}</p>
                    <a className="bg-[var(--text)] text-[var(--bg)] px-3 h-6">
                      Learn More
                    </a>
                  </div>
                );
              })}
            </div>
          </Scrollytelling.Animation>
        </div>
      </Scrollytelling.Root>

      <Scrollytelling.Root start="top bottom" end="bottom bottom">
        <div className="h-[200vh] flex justify-center">
          <div className="sticky top-0 h-fit">
            <SuperminiAnimation />
          </div>
          <Scrollytelling.Waypoint
            at={100}
            tween={{
              duration: 0.15,
              target: "#bg",
              to: {
                "--bg": "black",
                "--text": "white",
              },
            }}
          />
        </div>
      </Scrollytelling.Root>

      <Cillinder />

      <div className="h-screen">Another section</div>
    </div>
  );
}
