import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type {
  VisualizerRoot,
  VisualizerItem,
  DataAttribute,
} from "./shared-types";

import s from "./visualizer.module.scss";
import { internalEventEmmiter } from "../../../util/internal-event-emmiter";
import { clsx } from "../../../util";
import libPackage from "../../../../package.json";

import { colors, highlight } from "./helpers";

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

  // Highlight tween target element on hover
  useEffect(() => {
    if (isHovering) {
      const cleanups = tween.targets().map((t: any) => {
        if (t instanceof SVGElement || t instanceof HTMLElement) {
          return highlight(t);
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
      if (t instanceof SVGElement || t instanceof HTMLElement) {
        return `${t.tagName.toLocaleLowerCase()}${t.id ? `#${t.id}` : ""}${t.classList.length ? "." + t.classList[0] : ""
          }`;
      }

      if (t instanceof Object) {
        const allKeys = Object.keys(t).filter((k) => k != "_gsap");
        const displayKeys = allKeys.slice(0, 3);

        if (allKeys.length > displayKeys.length) {
          displayKeys.push("...");
        }

        return `${t.constructor.name} { ${displayKeys.join(", ")} }`;
      }
    })
    .join(", ");

  return (
    <div
      title={targetString}
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
        const st = root.tween?.scrollTrigger;
        if (!st) return;

        const start = st.start;
        const end = st.end;
        const scroll = start + (end - start) * (tween._start / 100);

        console.log({ start, end, tweenStart: tween._start });

        window.scrollTo({ top: scroll, behavior: "smooth" });
      }}
    >
      {targetString}
    </div>
  );
};

const Waypoint = ({
  tween,
  root,
}: {
  tween: VisualizerItem;
  root: VisualizerRoot;
  idx: number;
}) => {
  const [lastState, setLastState] = useState<
    "complete" | "reverse-complete" | undefined
  >(undefined);

  useEffect(() => {
    if (tween.data.type === "waypoint") {
      tween.data._internalOnCall = () => {
        setLastState("complete");
      };

      tween.data._internalOnReverseCall = () => {
        setLastState("reverse-complete");
      };
    }
  }, [tween.data]);

  return (
    <div
      style={{
        // @ts-ignore
        "--start-offset-percentage": tween._start + "%",
      }}
      className={s["waypoint"]}
      onClick={() => {
        const st = root.tween?.scrollTrigger;
        if (!st) return;

        if (tween.data.type === "waypoint") {
          // scroll to label
          const foundLabel = root.tween?.labels[tween.data.label];
          if (foundLabel) {
            const targetPx = st.labelToScroll(tween.data.label);
            window.scrollTo({ top: targetPx + 0, behavior: "smooth" });
          }
        }
      }}
    >
      <span
        className={clsx(
          s["onReverseCall"],
          lastState === "reverse-complete" && s["active"]
        )}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.375 9.75L2.625 6L6.375 2.25M9.375 9.75L5.625 6L9.375 2.25"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 1.5V2.25V1.5ZM1.5 10.5V7.5V10.5ZM1.5 7.5L2.885 7.1535C3.9272 6.89302 5.0282 7.01398 5.989 7.4945L6.043 7.5215C6.98459 7.9921 8.06137 8.11772 9.086 7.8765L10.643 7.5105C10.4523 5.76591 10.4515 4.00577 10.6405 2.261L9.0855 2.627C8.06097 2.86794 6.98439 2.74215 6.043 2.2715L5.989 2.2445C5.0282 1.76398 3.9272 1.64302 2.885 1.9035L1.5 2.25M1.5 7.5V2.25V7.5Z"
          fill="white"
          fillOpacity="0.12"
        />
        <path
          d="M1.5 1.5V2.25M1.5 2.25L2.885 1.9035C3.9272 1.64302 5.0282 1.76398 5.989 2.2445L6.043 2.2715C6.98439 2.74215 8.06097 2.86794 9.0855 2.627L10.6405 2.261C10.4515 4.00577 10.4523 5.76591 10.643 7.5105L9.086 7.8765C8.06137 8.11772 6.98459 7.9921 6.043 7.5215L5.989 7.4945C5.0282 7.01398 3.9272 6.89302 2.885 7.1535L1.5 7.5M1.5 2.25V7.5M1.5 10.5V7.5"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={clsx(s["onCall"], lastState === "complete" && s["active"])}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.625 2.25L9.375 6L5.625 9.75M2.625 2.25L6.375 6L2.625 9.75"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
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

const Select: React.FC<React.ComponentProps<"select">> = (props) => {
  //asd
  return (
    <div className={s["selectWrapper"]}>
      <select {...props} className={clsx(s["select"], props.className)} />
      <svg
        className={s["arrow"]}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.75 4.125L6 7.875L2.25 4.125"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
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
  const [initialized, setInitialized] = useState(false);
  const [scrollTop, setScrollTop] = useState<number>();
  const [isUserScroll, setIsUserScroll] = useState(true);
  const root = roots.find((r) => r.id === selectedRoot) ?? roots[0];


  useEffect(() => {
    if (!isUserScroll) return;

    const onScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);

    const activeRoot = roots.find((r) => {
      const progress = r?.tween?.progress() as number; 
      const roundedProgress = Math.round(progress * 100) / 100

      return roundedProgress !== undefined &&
      (roundedProgress > 0 && roundedProgress < 1);
    }
    );

    if (!activeRoot) return;

    setSelectedRoot(activeRoot.id);

    return () => {
      window.removeEventListener("scroll", onScroll);
    }

  }, [isUserScroll, roots, scrollTop]);

  useEffect(() => {
    const handleUpdate = () => {
      const progress = root?.tween?.progress();

      if (!markerRef.current || !trailRef.current || progress === undefined) {
        return;
      }

      markerRef.current.style.left = `${progress * 100}%`;
      trailRef.current.style.left = `${progress * 100}%`;
    };

    return internalEventEmmiter.on("timeline:update", handleUpdate);
  }, [root?.tween]);

  useEffect(() => {
    const panel = panelRef.current;
    const panelHeader = panelHeaderRef.current;

    /* Get last position from sessionStorage */

    const lastPosition = sessionStorage.getItem(
      "@bmsmnt/scrollytelling-visualizer:position"
    );

    if (!panel || !panelHeader) return;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (lastPosition) {
      const { top, left } = JSON.parse(lastPosition);
      panel.style.top = top;
      panel.style.left = left;
    }

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
      /* Save the last position on the sessionStorage */
      sessionStorage.setItem(
        "@bmsmnt/scrollytelling-visualizer:position",
        JSON.stringify({
          top: panel?.style.top,
          left: panel?.style.left,
        })
      );
    }

    panelHeader.addEventListener("mousedown", dragMouseDown);

    setInitialized(true);

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

  useEffect(() => {
    // Force refresh on mount
    internalEventEmmiter.emit("timeline:refresh");
  }, []);

  if (dismiss) return <></>;

  return (
    <div
      className={clsx(s["root"], initialized && s["initialized"])}
      ref={panelRef}
    >
      <header className={s["header"]} ref={panelHeaderRef}>
        <div className={s["actions"]}>
          <Select
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
          </Select>
          <div className={s['actions']}>

            <button
              className={clsx(s["button"], s["scrollToRoot"])}
              onClick={() => {
                const triggerElement = root?.tween?.scrollTrigger?.trigger;
                if (triggerElement) {
                 setIsUserScroll(false);

                 setTimeout(() => {
                    setIsUserScroll(true);
                  }
                  , 1500);

                  triggerElement.scrollIntoView({ 
                    behavior: "smooth" });
                }
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.875 6.00004L6.398 1.52254C6.178 1.30304 5.822 1.30304 5.6025 1.52254L1.125 6.00004M9.75 4.87504V9.93754C9.75 10.248 9.498 10.5 9.1875 10.5H7.125V8.06254C7.125 7.75204 6.873 7.50004 6.5625 7.50004H5.4375C5.127 7.50004 4.875 7.75204 4.875 8.06254V10.5H2.8125C2.502 10.5 2.25 10.248 2.25 9.93754V4.87504M7.875 10.5H3.75"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className={s['text']}>
                SCROLL TO ROOT
              </span>
            </button>
          </div>
        </div>

        <div className={s["actions"]}>
          <button
            className={s["button"]}
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.43359 8C2.43359 7.72386 2.65745 7.5 2.93359 7.5H13.0669C13.3431 7.5 13.5669 7.72386 13.5669 8C13.5669 8.27614 13.3431 8.5 13.0669 8.5H2.93359C2.65745 8.5 2.43359 8.27614 2.43359 8Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 2.43311C8.27614 2.43311 8.5 2.65697 8.5 2.93311L8.5 13.0664C8.5 13.3426 8.27614 13.5664 8 13.5664C7.72386 13.5664 7.5 13.3426 7.5 13.0664L7.5 2.93311C7.5 2.65697 7.72386 2.43311 8 2.43311Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
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
                fillRule="evenodd"
                clipRule="evenodd"
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
                  const data = t.data as DataAttribute;

                  if (data.type === "animation") {
                    return (
                      <div className={s["row"]} key={idx}>
                        <Tween tween={t} root={root} idx={idx} />
                      </div>
                    );
                  }

                  if (data.type === "waypoint") {
                    return (
                      <div className={s["row"]} key={idx}>
                        <Waypoint tween={t} root={root} idx={idx} />
                      </div>
                    );
                  }

                  return <></>;
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
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 0H0V8L4 11L8 8V0Z"
                        />
                      </mask>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
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
                <div className={s["trail"]}>
                  <div className={s["gradient"]} ref={trailRef} />
                </div>
              </div>
            </div>
          </main>
          <footer className={s["footer"]}>
            <span>
              Visualizer
              <span className={s["version"]}> (v.{libPackage.version})</span>
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
