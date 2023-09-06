"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollytelling } from "../../../context";

import s from "./visualizer.module.scss";

const colors = [
  "#00FFFF",
  "#FF00FF",
  "#00BFFF",
  "#FF69B4",
  "#C0FF3E",
  "#FFA500",
  "#FFD700",
  "#7FFF00",
  "#00FFFF",
  "#FFD460",
  "#00FF00",
  "#BF40FF",
  "#00F5FF",
  "#FF6A6A",
  "#CCFF00",
];

const setHighlight = (target: SVGElement | HTMLElement) => {
  // Create a div element that has the same dimensions and position as the target
  const highlight = document.createElement("div");

  highlight.style.position = "fixed";
  const bounds = target.getBoundingClientRect();
  highlight.style.top = `${bounds.top}px`;
  highlight.style.left = `${bounds.left}px`;
  highlight.style.width = `${bounds.width}px`;
  highlight.style.height = `${bounds.height}px`;

  highlight.classList.add(s["highlight"] as string);

  // Append to body.
  document.body.appendChild(highlight);

  // Clear instance
  return () => {
    document.body.removeChild(highlight);
  };
};

type EnhancedTween = (GSAPTween | GSAPTimeline) & {
  _start: number;
  _dur: number;
};

const Tween = ({ tween, idx }: { tween: EnhancedTween; idx: number }) => {
  const { timeline, events } = useScrollytelling();
  const [isHovering, setIsHovering] = useState(false);
  const [active, setActive] = useState(false);

  // Highlight tween target element on hover
  useEffect(() => {
    if (isHovering) {
      const cleanups = tween.targets().map((t: any) => {
        if (t instanceof SVGElement || t instanceof HTMLElement) {
          return setHighlight(t);
        }

        return undefined;
      });

      return () => {
        // @ts-ignore
        cleanups.forEach((clean) => clean && clean());
      };
    }
  }, [isHovering, tween]);

  useEffect(() => {
    const handleUpdate = () => {
      const progress = timeline?.progress();

      if (!progress) return;

      const start = tween._start / 100;
      const end = (tween._start + tween._dur) / 100;

      if (progress >= start && progress <= end) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    return events.on("timeline:update", handleUpdate);
  }, [events, timeline, tween._dur, tween._start]);

  const targetString = tween
    .targets()
    .map((t: any) => {
      if (t instanceof SVGElement) {
        return `${t.tagName}${t.id ? `#${t.id}` : ""}${
          t.classList.length ? "." + t.classList[0] : ""
        }`;
      } else if (t instanceof HTMLElement) {
        return `${t.tagName}${t.id ? `#${t.id}` : ""}${
          t.classList.length ? "." + t.classList[0] : ""
        }`;
      }
    })
    .join(", ");

  return (
    // @ts-ignore
    <div
      className={`${s["tween"]}${active ? ` ${[s["active"]]}` : ""}`}
      style={{
        width: tween._dur + "%",
        left: tween._start + "%",
        background: colors[idx % colors.length],
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {targetString}
    </div>
  );
};

const ProgressStatus = () => {
  const [progress, setProgress] = useState(0);
  const { timeline, events } = useScrollytelling();

  useEffect(() => {
    if (!timeline) return;

    const handleUpdate = () => {
      setProgress(timeline.progress());
    };

    return events.on("timeline:update", handleUpdate);
  }, [events, timeline]);

  return <>{(progress * 100).toFixed(2)}%</>;
};

export const Visualizer = () => {
  const [tweens, setTweens] = useState<EnhancedTween[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelHeaderRef = useRef<HTMLElement>(null);
  const progressRef = useRef(null);
  const { timeline, events } = useScrollytelling();

  useEffect(() => {
    if (!timeline) return;

    const handleUpdate = () => {
      if (!progressRef.current) return;
      // @ts-ignore
      progressRef.current.style.left = `${timeline.progress() * 100}%`;
    };

    return events.on("timeline:update", handleUpdate);
  }, [events, timeline]);

  useEffect(() => {
    const panel = panelRef.current;
    const panelHeader = panelHeaderRef.current;

    if (!panel || !panelHeader) return;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const dragMouseDown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      // call a function whenever the cursor moves:
      document.addEventListener("mousemove", elementDrag);
    };

    const elementDrag = (e: MouseEvent) => {
      if (!panel) return;

      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      panel.style.top = panel.offsetTop - pos2 + "px";
      panel.style.left = panel.offsetLeft - pos1 + "px";
    };

    function closeDragElement() {
      /* stop moving when mouse button is released */
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }

    panelHeader.addEventListener("mousedown", dragMouseDown);

    return () => {
      panelHeader.removeEventListener("mousedown", dragMouseDown);
      closeDragElement();
    };
  }, []);

  useEffect(() => {
    return events.on("timeline:refresh", () => {
      const filteredTweens = timeline?.getChildren().filter((t) => {
        /*
          Do not include the rest tween that the Root adds
          to ensure the timeline lasts 100.
        */
        return !t.vars.id?.toString().startsWith("rest-");
      });
      setTweens((filteredTweens || []) as EnhancedTween[]);
    });
  }, [events, timeline]);

  return (
    <div className={s["root"]} ref={panelRef}>
      <header className={s["header"]} ref={panelHeaderRef}>
        <h1>Visualizer</h1>
      </header>
      <main className={s["main"]}>
        <div className={s["timeline"]}>
          <div className={s["guides"]}>
            <div className={s["guide"]} style={{ left: "0%" }}>
              <span className={s["percent"]}>0%</span>
            </div>
            <div className={s["guide"]} style={{ left: "25%" }}>
              <span className={s["percent"]}>25%</span>
            </div>
            <div className={s["guide"]} style={{ left: "50%" }}>
              <span className={s["percent"]}>50%</span>
            </div>
            <div className={s["guide"]} style={{ left: "75%" }}>
              <span className={s["percent"]}>75%</span>
            </div>
            <div className={s["guide"]} style={{ left: "100%" }}>
              <span className={s["percent"]}>100%</span>
            </div>
          </div>
          <div className={s["tweens"]}>
            {tweens?.map((t, idx) => (
              <div className={s["tween-row"]} key={idx}>
                <Tween tween={t} idx={idx} />
              </div>
            ))}
          </div>
          <div className={s["progress"]} ref={progressRef}>
            <span className={s["thumb"]} />
          </div>
        </div>
      </main>
      <footer className={s["footer"]}>
        <ProgressStatus />
      </footer>
    </div>
  );
};
