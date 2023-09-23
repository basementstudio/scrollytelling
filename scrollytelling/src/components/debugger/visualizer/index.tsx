import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type {
  VisualizerRoot,
  VisualizerItem,
  DataAttribute,
} from "./shared-types";

import s from "./visualizer.module.scss";
import { internalEventEmmiter } from "../../../util/internal-event-emmiter";

const colors = [
  ["#F87171", "#991B1B"],
  ["#FACC15", "#854D0E"],
  ["#4ADE80", "#166534"],
  ["#2DD4BF", "#115E59"],
  ["#38BDF8", "#075985"],
  ["#818CF8", "#3730A3"],
  ["#C084FC", "#6B21A8"],
  ["#E879F9", "#86198F"],
  ["rgba(244, 114, 182, 0.40)", "#9D174D"],
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

const Tween = ({
  tween,
  root,
  idx,
}: {
  tween: VisualizerItem;
  root: VisualizerRoot;
  idx: number;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [active, setActive] = useState(false);

  const data = tween.data;

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
      const progress = root.tween?.progress();

      if (!progress) return;

      const start = tween._start / 100;
      const end = (tween._start + tween._dur) / 100;

      if (progress >= start && progress <= end) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    return internalEventEmmiter.on("timeline:update", handleUpdate);
  }, [root.tween, tween._dur, tween._start]);

  const targetString = tween
    .targets()
    .map((t: any) => {
      if (t instanceof SVGElement) {
        return `${t.tagName.toLocaleLowerCase()}${t.id ? `#${t.id}` : ""}${
          t.classList.length ? "." + t.classList[0] : ""
        }`;
      } else if (t instanceof HTMLElement) {
        return `${t.tagName.toLocaleLowerCase()}${t.id ? `#${t.id}` : ""}${
          t.classList.length ? "." + t.classList[0] : ""
        }`;
      }
    })
    .join(", ");

  return (
    <div
      className={`${s["tween"]}${active ? ` ${[s["active"]]}` : ""}`}
      style={{
        // @ts-ignore
        "--duration-percentage": tween._dur + "%",
        "--start-offset-percentage": tween._start + "%",
        background:
          "linear-gradient(90deg, transparent 0%, " +
          colors[idx % colors.length]?.[0] +
          " 100%)",
        outlineColor: colors[idx % colors.length]?.[1],
        minWidth: 16,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        // todo scroll to regular tweens
        // should we have a label for every timeline? or is there an easier way to do this?

        const st = root.tween?.scrollTrigger;
        if (!st) return;

        if (data.type === "waypoint") {
          // scroll to label
          const foundLabel = root.tween?.labels[data.label];
          if (foundLabel) {
            const targetPx = st.labelToScroll(data.label);
            window.scrollTo({ top: targetPx + 0, behavior: "smooth" });
          }
        }
      }}
    >
      {data.type === "waypoint" ? "F" : targetString}
    </div>
  );
};

const ProgressStatus = ({ root }: { root: VisualizerRoot | undefined }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      const progress = root?.tween?.progress();
      setProgress(progress ?? 0);
    };

    return internalEventEmmiter.on("timeline:update", handleUpdate);
  }, [root?.tween]);

  return <>{(progress * 100).toFixed(0)}%</>;
};

export const Visualizer = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelHeaderRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const [roots, setRoots] = useState<VisualizerRoot[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<string>();
  const [dismiss, setDismiss] = useState(false);
  const [minimize, setMinimize] = useState(false);

  const root = roots.find((r) => r.id === selectedRoot) ?? roots[0];

  useEffect(() => {
    const handleUpdate = () => {
      const progress = root?.tween?.progress();

      if (!markerRef.current || !trailRef.current || progress === undefined) return;

      markerRef.current.style.left = `${progress * 100}%`;
      trailRef.current.style.left =  `${progress * 100}%`;
    };

    return internalEventEmmiter.on("timeline:update", handleUpdate);
  }, [root?.tween]);

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
      const target = e.target;
      if (target instanceof HTMLElement) {
        const hasInteractableClosest =
          target.closest("button") ||
          target.closest("select") ||
          target.closest("input");
        if (hasInteractableClosest) return; // do nothing.
      }
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
    return internalEventEmmiter.on("timeline:refresh", () => {
      const roots: VisualizerRoot[] = [];

      gsap.globalTimeline.getChildren().forEach((t) => {
        if (!t.data?.isScrollytellingTween) return; // not a scrollytelling tween
        const data = t.data as DataAttribute;
        switch (data.type) {
          case "root": {
            const existingRootItem = roots.find((r) => r.id === data.id);
            if (!existingRootItem) {
              roots.push({
                id: data.id,
                debug: data.debug,
                label: data.label,
                children: [],
                tween: t as any,
              });
            } else {
              existingRootItem.debug = data.debug;
              existingRootItem.tween = t as any;
              existingRootItem.label = data.label;
            }
            break;
          }
          case "rest":
          case "waypoint":
          case "animation": {
            const existingRootItem = roots.find((r) => r.id === data.rootId);
            if (!existingRootItem) {
              roots.push({
                id: data.rootId,
                debug: false,
                label: data.rootId,
                children: [t as any],
                tween: undefined,
              });
            } else {
              existingRootItem.children.push(t as any);
            }

            break;
          }

          default:
            break;
        }
      });

      // sort by trigger's top distance to top of the document
      roots.sort((a, b) => {
        const aTriggerEl = a.tween?.scrollTrigger?.trigger;
        const bTriggerEl = b.tween?.scrollTrigger?.trigger;

        if (!aTriggerEl || !bTriggerEl) return 0;

        const aTop = aTriggerEl.getBoundingClientRect().top;
        const bTop = bTriggerEl.getBoundingClientRect().top;

        return aTop - bTop;
      });

      setRoots(roots.filter((r) => r.debug));
    });
  }, []);

  if (dismiss) return <></>;
  return (
    <div className={s["root"]} ref={panelRef}>
      <header className={s["header"]} ref={panelHeaderRef}>
        <div className={s["actions"]}>
          <select
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.currentTarget.value)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {roots.map((r) => {
              return (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              );
            })}
          </select>
          <button
            className={s["scrollToRoot"]}
            onClick={() => {
              const triggerElement = root?.tween?.scrollTrigger?.trigger;
              if (triggerElement) {
                triggerElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          > 
            Scroll to Root
          </button>
        </div>

        <div className={s["actions"]}>
          <button
            className={s["button"]}
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? (
              "Exp"
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.43359 8C2.43359 7.72386 2.65745 7.5 2.93359 7.5H13.0669C13.3431 7.5 13.5669 7.72386 13.5669 8C13.5669 8.27614 13.3431 8.5 13.0669 8.5H2.93359C2.65745 8.5 2.43359 8.27614 2.43359 8Z"
                  fill="white"
                />
              </svg>
            )}
          </button>
          <button className={s["button"]} onClick={() => setDismiss(true)}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.5402 4.27333C12.7648 4.04878 12.7648 3.68471 12.5402 3.46016C12.3157 3.23561 11.9516 3.23561 11.7271 3.46016L8.00033 7.18691L4.27358 3.46016C4.04903 3.23561 3.68496 3.23561 3.46041 3.46016C3.23585 3.68471 3.23585 4.04878 3.46041 4.27333L7.18715 8.00008L3.46041 11.7268C3.23585 11.9514 3.23585 12.3154 3.46041 12.54C3.68496 12.7646 4.04903 12.7646 4.27358 12.54L8.00033 8.81325L11.7271 12.54C11.9516 12.7646 12.3157 12.7646 12.5402 12.54C12.7648 12.3154 12.7648 11.9514 12.5402 11.7268L8.8135 8.00008L12.5402 4.27333Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </header>
      {!minimize && (
        <>
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
                {root?.children.map((t, idx) => {
                  return (
                    <div className={s["row"]} key={idx}>
                      <Tween tween={t} root={root} idx={idx} />
                    </div>
                  ); 
                })}
              </div> 
              <div className={s["progress"]}>
                <div className={s["marker"]} ref={markerRef}>
                  <span className={s["thumb"]}>
                    <span className={s["percent"]}>
                      <ProgressStatus root={root} />
                    </span>
                    <svg
                      width="8"
                      height="11"
                      viewBox="0 0 8 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask id="path-1-inside-1_2793_1632" fill="white">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8 0H0V8L4 11L8 8V0Z"
                        />
                      </mask>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8 0H0V8L4 11L8 8V0Z"
                        fill="white"
                      />
                      <path
                        d="M0 0V-1H-1V0H0ZM8 0H9V-1H8V0ZM0 8H-1V8.5L-0.6 8.8L0 8ZM4 11L3.4 11.8L4 12.25L4.6 11.8L4 11ZM8 8L8.6 8.8L9 8.5V8H8ZM0 1H8V-1H0V1ZM1 8V0H-1V8H1ZM4.6 10.2L0.6 7.2L-0.6 8.8L3.4 11.8L4.6 10.2ZM7.4 7.2L3.4 10.2L4.6 11.8L8.6 8.8L7.4 7.2ZM7 0V8H9V0H7Z"
                        fill="white"
                        mask="url(#path-1-inside-1_2793_1632)"
                      />
                    </svg>
                  </span>
                </div>
                <div className={s['trail']}>
                  <div className={s["gradient"]} ref={trailRef} />
                </div>
              </div>
            </div>
          </main>
          <footer className={s["footer"]}>
            <span>
              Visualizer - <span className={s["version"]}>v.01.240</span>
            </span>
            <span>
              made with 🖤 by{" "}
              <a
                href="https://basement.studio"
                target="_blank"
                className={s["bsmnt"]}
                rel="noopener"
              >
                bsmnt
              </a>
              .
            </span>
          </footer>
        </>
      )}
    </div>
  );
};
