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

  return <>{(progress * 100).toFixed(2)}%</>;
};

export const Visualizer = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelHeaderRef = useRef<HTMLElement>(null);
  const progressRef = useRef(null);

  const [roots, setRoots] = useState<VisualizerRoot[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<string>();
  const [dismiss, setDismiss] = useState(false);
  const [minimize, setMinimize] = useState(false);

  const root = roots.find((r) => r.id === selectedRoot) ?? roots[0];

  useEffect(() => {
    const handleUpdate = () => {
      const progress = root?.tween?.progress();
      if (!progressRef.current) return;
      // @ts-ignore
      progressRef.current.style.left = `${progress * 100}%`;
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
        <div className={s["actions-container"]}>
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
        <h1>Visualizer</h1>
        <div className={s["actions-container"]}>
          <button onClick={() => setMinimize((p) => !p)}>
            {minimize ? "Exp" : "Min"}
          </button>
          <button onClick={() => setDismiss(true)}>X</button>
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
                {root?.children.map((t, idx) => (
                  <div className={s["tween-row"]} key={idx}>
                    <Tween tween={t} root={root} idx={idx} />
                  </div>
                ))}
              </div>
              <div className={s["progress"]} ref={progressRef}>
                <span className={s["thumb"]} />
              </div>
            </div>
          </main>
          <footer className={s["footer"]}>
            <ProgressStatus root={root} />
          </footer>
        </>
      )}
    </div>
  );
};
