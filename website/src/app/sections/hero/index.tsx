"use client"

import { gsap } from "gsap";
import { useIsoLayoutEffect } from "../../hooks/use-iso-layout-effect";
import { Header } from "../header";

import s from "./hero.module.scss";
import { useRef } from "react";

export const Hero = () => {
  const svgMakeRef = useRef<SVGSVGElement>(null);
  const svgWeRef = useRef<SVGSVGElement>(null);

  useIsoLayoutEffect(() => {
    if(!svgMakeRef.current || !svgWeRef.current) return;

    gsap.set(svgMakeRef.current, {
      xPercent: -35,
      scaleY: 1,
    });

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 1.5,
        ease: "power2.inOut"
      }
    }); 

    timeline.to(svgWeRef.current, {
      attr: {
        viewBox: "0 0 1856 183"
      },
      width: "96.667vw"
    });
    
    timeline.to(
      "#morphPath",
      {
        morphSVG: {
          shape:
            "M339.823 0V183H890V140.769H400.618V109.096H890V71.5577H400.618V42.2308H1856V0H339.823Z",
          map: "position"
        }
      },
      "<"
    );
    
    timeline.to(
      svgMakeRef.current,
      {
        xPercent: 0,
        scaleY: 0.6
      },
      "<"
    );

    timeline.play();
    
  }, []);
  return (
    <>
      <Header />
      <section className={s["section"]}>
        <div className="wrapper">
          <div className={s["content"]}>
            <div className={s["svg__container"]}>
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
                <path
                  id="morphPath"
                  d="M339.823 0V183H543V140.769H400.618V109.096H543V71.5577H400.618V42.2308H543V0H339.823Z"
                  fill="white"
                />
              </svg>

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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
