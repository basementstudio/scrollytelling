"use client";

import * as Scrollytelling from "@bsmnt/scrollytelling";
import { gsap } from "../../../lib/gsap";
import { useIsoLayoutEffect } from "../../hooks/use-iso-layout-effect";
import { Header } from "../header";

import s from "./hero.module.scss";
import { useRef } from "react";

export const Hero = () => {
  const svgMakeRef = useRef<SVGSVGElement>(null);
  const svgWeRef = useRef<SVGSVGElement>(null);
  const pathMorhRef = useRef<SVGPathElement>(null);

  useIsoLayoutEffect(() => {
    if (!svgMakeRef.current || !svgWeRef.current) return;

    gsap.set(svgMakeRef.current, {
      xPercent: -35,
      scaleY: 1,
    });

    // const timeline = gsap.timeline({
    //   paused: true,
    //   defaults: {
    //     duration: 1.5,
    //     ease: "power2.inOut",
    //   },
    // });

    // timeline.to(svgWeRef.current, {
    //   attr: {
    //     viewBox: "0 0 1856 183",
    //   },
    //   width: "96.667vw",
    // });

    // timeline.to(
    //   pathMorhRef.current,
    //   {
    //     morphSVG: {
    //       shape:
    //         "M339.823 0V183H890V140.769H400.618V109.096H890V71.5577H400.618V42.2308H1856V0H339.823Z",
    //       map: "position",
    //     },
    //   },
    //   "<"
    // );

    // timeline.to(
    //   svgMakeRef.current,
    //   {
    //     xPercent: 0,
    //     scaleY: 0.6,
    //   },
    //   "<"
    // );

    // timeline.play();
  }, []);
  return (
    <>
      <Header />
      <Scrollytelling.Root>
        <Scrollytelling.Pin
          childHeight={"80vh"}
          pinSpacerHeight={"250vh"}
          top={0}
        >
          <section className={s["section"]}>
            <div className="wrapper">
              <div className={s["content"]}>
                <div className={s["svg__container"]}>
                  <Scrollytelling.Animation
                    tween={{
                      start: 0,
                      end: 100,
                      to: {
                        attr: {
                          viewBox: "0 0 1856 183",
                        },
                        width: "96.667vw",
                      },
                    }}
                  >
                    <svg
                      className={s["svg-we"]}
                      fill="none"
                      ref={svgWeRef}
                      viewBox="0 0 543 183"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M210.102 0H124.631L97.6302 136.781H96.1997L62.0471 0H0L45.5965 183H134.644L159.856 55.8385H161.287L183.638 183H286.275L329.904 0H270.003L236.387 140.769H234.956L210.102 0Z"
                        fill="white"
                      />
                      <Scrollytelling.Animation
                        tween={{
                          start: 0,
                          end: 100,
                          to: {
                            fill: "red",
                            morphSVG: {
                              shape:
                                "M339.823 0V183H890V140.769H400.618V109.096H890V71.5577H400.618V42.2308H1856V0H339.823Z",
                            },
                          },
                        }}
                      >
                        <path
                          id="morphPath"
                          ref={pathMorhRef}
                          d="M339.823 0V183H543V140.769H400.618V109.096H543V71.5577H400.618V42.2308H543V0H339.823Z"
                          fill="white"
                        />
                      </Scrollytelling.Animation>
                    </svg>
                  </Scrollytelling.Animation>

                  <Scrollytelling.Animation
                    tween={{
                      start: 0,
                      end: 100,
                      to: {
                        xPercent: 0,
                        scaleY: 0.6,
                      },
                    }}
                  >
                    <svg
                      className={s["svg-make"]}
                      fill="none"
                      ref={svgMakeRef}
                      viewBox="0 0 924 187"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M59.0072 187V56.8192H60.6165L96.9148 187H169.869L206.346 53.9423H207.419V187H268.214V0H173.624L138.756 126.824H137.326L102.1 0.479482L0 0V187H59.0072Z"
                        fill="white"
                      />
                      <path
                        d="M449.1 0H348.788L277.979 187H341.457L352.722 155.354H442.126L452.14 187H517.942L449.1 0ZM367.205 114.597L396.172 33.5641H397.603L428 114.597H367.205Z"
                        fill="white"
                      />
                      <path
                        d="M527.698 187H588.493V167.581L620.858 127.544L656.62 187H731.362L664.13 80.0744L727.786 0H662.163L588.493 94.459V0H527.698V187Z"
                        fill="white"
                      />
                      <path
                        d="M741.257 0V187H924V143.846H802.052V111.481H916.49V73.1218H802.052V43.1538H923.642V0H741.257Z"
                        fill="white"
                      />
                    </svg>
                  </Scrollytelling.Animation>
                </div>
                <div>
                  <svg
                    className={s["svg-coolshit"]}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1856 258"
                    fill="none"
                  >
                    <path
                      fill="#fff"
                      d="M201.778.325V18.67h-18.344V.325H91.717V18.67h73.374v18.343h18.343v18.343h18.344v36.687h18.343V.325h-18.343ZM55.03 18.67v18.343H36.687v18.343H18.343v36.687H0v91.718h18.343v36.686h18.344v18.344h36.687v-18.344H55.03V183.76H36.687V92.042H55.03V55.355h18.344V37.013h18.343V18.67H55.03ZM201.778 183.76h-18.344v18.343h18.344V183.76Zm-18.344 18.343h-18.343v18.343h18.343v-18.343Zm-18.343 36.687v-18.344h-36.687v18.344h36.687Zm-91.717 18.343h55.03V238.79h-55.03v18.343ZM330.325 18.669h73.374V.325h-73.374V18.67Zm-36.687 201.777V183.76h-18.343V92.042h18.343V55.355h18.344V37.013h18.343V18.67h-36.687v18.343h-18.343v18.343h-18.344v36.687h-18.343v91.718h18.343v36.686h18.344v18.344h36.687v-18.344h-18.344ZM458.729 73.699V37.012h-18.343V18.67h-36.687v18.343h18.343V73.7h18.344v91.717h-18.344v36.687h-18.343v18.343h-18.344v18.344h36.687v-18.344h18.344v-18.343h18.343v-36.687h18.344V73.699h-18.344ZM385.355 238.79h-73.373v18.343h73.373V238.79ZM587.205 18.669h73.374V.325h-73.374V18.67Zm-36.687 201.777V183.76h-18.343V92.042h18.343V55.355h18.344V37.013h18.343V18.67h-36.687v18.343h-18.343v18.343h-18.344v36.687h-18.343v91.718h18.343v36.686h18.344v18.344h36.687v-18.344h-18.344ZM715.609 73.699V37.012h-18.343V18.67h-36.687v18.343h18.343V73.7h18.344v91.717h-18.344v36.687h-18.343v18.343h-18.344v18.344h36.687v-18.344h18.344v-18.343h18.343v-36.687h18.343V73.699h-18.343ZM642.235 238.79h-73.373v18.343h73.373V238.79ZM917.458 238.79h-110.06v-36.687h18.343v-55.03h18.344V73.699h18.343v-55.03h18.344V.325h-73.374V18.67h18.343v55.03h-18.343v73.374h-18.344v55.03h-18.343v36.687h-18.343v18.343h183.434v-36.687h-18.344v18.344Zm18.344-55.03v36.686h18.343V183.76h-18.343Z"
                    />
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      d="M1149.14 3h-72.5v18.125h-18.12v18.124h-18.13v54.374h18.13v18.125h18.12v18.124h18.13v18.125h18.12v18.124h18.13v18.125h18.12v36.249h-18.12v18.125h-72.5v-18.125h-18.13v-36.249h-18.12v36.249h-18.13v36.249h18.13v-36.249h18.12v18.125h18.13v18.124h90.62V238.62h18.13v-18.125h18.12v-54.374h-18.12v-18.124h-18.13v-18.125h-18.12v-18.124h-18.13V93.623h-18.12V75.498h-18.13V39.25h18.13V21.125h54.37v18.124h18.13V75.5h18.12v-36.25h18.13V3h-18.13v36.25h-18.12V21.124h-18.13V3Zm344.23 0h-72.5v18.125h18.12v54.373h-18.12v54.374h-108.75V75.498h18.13V21.125h18.12V3h-72.5v18.125H1294v54.373h-18.13v72.499h-18.12v54.374h-18.13v36.249h-18.12v18.124h72.5V238.62h-18.13v-36.249H1294v-54.374h108.74v54.374h-18.12v36.249h-18.13v18.124h72.5V238.62h-18.12v-36.249h18.12v-54.374h18.13V75.498h18.12V21.125h18.13V3Zm54.37 0h72.5v18.125h-18.13v54.373h-18.12v54.374h-18.12v72.499h-18.13v36.249h18.13v18.124h-72.5V238.62h18.12v-36.249h18.13v-72.499h18.12V75.498h18.13V21.125h-18.13V3ZM1856 3h-199.37v36.25h-18.12v18.124h18.12V39.249h18.12V21.125h54.38v54.373H1711v72.499h-18.12v54.374h-18.13v36.249h-18.12v18.124h72.5V238.62H1711v-36.249h18.13v-54.374h18.12V75.498h18.13V21.125h72.5v18.124h-18.13v18.125h18.13V39.249H1856V3Zm-55 183h27.54v24h27v24h-27v23H1801v-23h-27v-24h27v-24Zm27 47v-23h-26.46v23H1828Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div className={s["svg__container"]}>
                  <Scrollytelling.Animation
                    tween={{
                      start: 0,
                      end: 80,
                      to: {
                        xPercent: 0,
                        width: "6.510vw",
                        marginRight: "1.250vw",
                        attr: {
                          viewBox: "0 0 125 115",
                        },
                      },
                    }}
                  >
                    <svg
                      className={s["svg-that"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 415 115"
                      fill="none"
                    >
                      <Scrollytelling.Animation
                        tween={{
                          start: 0,
                          end: 80,
                          to: {
                            scaleX: 0.3,
                          },
                        }}
                      >
                        <path
                          fill="#fff"
                          d="M32.877 113H63.42V26.077h33.057V0H0v26.077h32.877V113ZM101.415 113h30.542V66.351h40.423V113h30.542V0H172.38v40.274h-40.423V0h-30.542v113ZM292.994 0H242.6l-35.573 113h31.89l5.659-19.123h44.914L294.521 113h33.057L292.994 0Zm-41.142 69.249 14.552-48.967h.719l15.271 48.967h-30.542ZM351.401 113h30.542V26.077H415V0h-96.476v26.077h32.877V113Z"
                        />
                      </Scrollytelling.Animation>
                    </svg>
                  </Scrollytelling.Animation>

                  <Scrollytelling.Animation
                    tween={{
                      start: 0,
                      end: 80,
                      to: {
                        scaleX: 1.5,
                      },
                    }}
                  >
                    <svg
                      className={s["svg-performs"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1118 115"
                      fill="none"
                    >
                      <path
                        fill="#fff"
                        d="M0 1.716v111.568h38.416V78.24h48.699c27.117-2.288 33.897-9.87 33.897-37.904 0-30.896-6.78-38.62-33.897-38.62H0Zm38.416 50.778V27.463h27.909c12.09 0 15.14 2.574 15.14 13.016 0 9.583-3.05 12.015-15.14 12.015H38.416ZM129.541 1.716v111.568h115.475V87.537h-77.059v-19.31h72.313V45.343h-72.313v-17.88h76.833V1.717H129.541ZM335.542 1.716h-79.771v111.568h38.417V75.379h30.055c14.236 0 15.818 1.288 15.818 13.589v24.316h38.417V87.251c0-16.878-9.265-24.173-30.846-24.173v-.858c21.581 0 30.846-8.439 30.846-28.178 0-25.889-5.876-32.326-42.936-32.326Zm-41.354 49.347v-25.03h28.473c14.689 0 16.27 1.287 16.27 12.3 0 11.443-1.581 12.73-16.27 12.73h-28.473ZM389.174 1.716v111.568h38.416l.339-38.62h71.974V48.918h-71.635l.226-21.455h75.929V1.716H389.174ZM587.497 24.316c32.089 0 35.591 3.29 35.591 33.184s-3.502 33.184-35.591 33.184-35.592-3.29-35.592-33.184 3.503-33.184 35.592-33.184ZM512.359 57.5c0 46.057 15.14 57.5 75.138 57.5 59.997 0 75.138-11.443 75.138-57.5S647.494 0 587.497 0c-59.998 0-75.138 11.443-75.138 57.5ZM750.866 1.716h-79.77v111.568h38.416V75.379h30.055c14.237 0 15.819 1.288 15.819 13.589v24.316h38.416V87.251c0-16.878-9.265-24.173-30.846-24.173v-.858c21.581 0 30.846-8.439 30.846-28.178 0-25.889-5.875-32.326-42.936-32.326Zm-41.354 49.347v-25.03h28.474c14.688 0 16.27 1.287 16.27 12.3 0 11.443-1.582 12.73-16.27 12.73h-28.474ZM841.785 113.284V35.616h1.017l22.937 77.668h46.099l23.05-79.385h.678v79.385h38.417V1.716h-59.772l-22.033 75.666h-.904l-22.259-75.38-64.517-.286v111.568h37.287ZM1049.98 90.684c-25.76 0-28.59-1.43-28.59-14.876h-38.977c0 31.325 14.349 39.192 68.247 39.192 53.89 0 67.34-6.294 67.34-31.754 0-27.605-13.56-35.472-67.79-39.191-21.02-1.574-26.33-3.576-26.33-10.299 0-8.439 2.71-9.44 26.78-9.44 24.97 0 27.79 1.573 27.79 16.449h38.99C1117.44 8.153 1103.42 0 1050.66 0c-53.107 0-66.327 6.723-66.327 33.47 0 24.173 12.316 31.325 61.807 36.045 25.87 2.431 32.31 4.863 32.31 12.158 0 8.153-2.82 9.011-28.47 9.011Z"
                      />
                    </svg>
                  </Scrollytelling.Animation>
                </div>
                <div className={s["footer"]}>
                  <p>
                    We’re a boutique studio of ambitious creatives working at
                    the edge of performant and immersive digital experiences,
                    giving 110% to bring projects from a realm of ideas to
                    reality through branding, visual design & development of the
                    highest quality.
                  </p>
                  <p>
                    We don&apos;t settle, we are intentional about building with
                    surgical precision and creating extraordinary experiences.
                    We go the extra mile, and then walk a couple more, just for
                    fun.
                  </p>
                  <p>
                    Sometimes size doesn&apos;t matter. we work for big & small
                    non-stoppable visionaries. here&apos;s love for them all.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Scrollytelling.Pin>
      </Scrollytelling.Root>
    </>
  );
};
