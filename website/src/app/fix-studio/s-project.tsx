import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Project } from "./projects";

type SProjectProps = {
  // general props
  start?: ScrollTrigger.Vars["start"];
  end?: ScrollTrigger.Vars["end"];
  pin: {
    top: number;
  };
  onToggle?: (isActive: boolean) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  // specific to this component
  project: Project;
  headerHeight: number;
  height: string;
};

export const SProject = ({
  start,
  end,
  project,
  headerHeight,
  pin,
  onToggle,
  height,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
}: SProjectProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: start ?? "top top",
        end: end ?? "bottom top",
        markers: true,
        scrub: true,

        onEnter: () => {
          onEnter?.();
          console.log("ENTER");
        },
        onLeave: () => {
          onLeave?.();
          console.log("LEAVE");
        },
        onEnterBack: () => {
          onEnterBack?.();
          console.log("ENTER BACK");
        },
        onLeaveBack: () => {
          onLeaveBack?.();
          console.log("LEAVE BACK");
        },
        onScrubComplete: () => {
          console.log("on scrub complete");
        },
        onToggle: (self) => {
          onToggle?.(self.isActive);
        },
      },
      defaults: { duration: 1 },
    });

    timeline.set(imgRef.current, {
      scale: 0,
      transformOrigin: "top right",
    });

    timeline.to(imgRef.current, {
      scale: 1,
      transformOrigin: "top right",
      ease: "linear",
    });

    timeline.to(imgRef.current, {
      scale: 0,
      transformOrigin: "top left",
      ease: "linear",
    });

    return () => {
      timeline.kill();
    };
  }, [end, start, onToggle, onEnter, onLeave, onEnterBack, onLeaveBack]);

  return (
    <div
      className="sticky flex flex-col"
      style={{
        height,
        top: `${pin.top}px`,
        // paddingTop: pin.top,
      }}
      ref={containerRef}
    >
      <header
        className="flex text-white items-center justify-between uppercase border-white border-t bg-black px-6"
        style={{
          height: headerHeight,
        }}
      >
        <span className="flex-1">{project.title}</span>
        <span className="flex-shrink-0">({project.year})</span>
        <span className="flex-1 text-right">{project.category}</span>
      </header>
      <div className="relative flex-grow px-6 bg-black">
        <img
          src={project.image}
          alt=""
          ref={imgRef}
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};
