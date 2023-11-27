import { gsap } from "gsap";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import ScrollTrigger from "gsap/ScrollTrigger";

// ---- Components ----
import { Animation } from "./components/animation";
import { Parallax } from "./components/parallax";
import { Pin } from "./components/pin";
import { RegisterGsapPlugins } from "./components/register-plugins";
import { Waypoint } from "./components/waypoint";
import { Stagger } from './components/stagger'

// ---- Context ----
import {
  ScrollytellingContext,
  ScrollytellingDispatchersContext,
  ScrollytellingDispatchersContextType,
  useScrollytelling,
} from "./context";
import { useScrollToLabel } from "./hooks/use-scroll-to-label";
import { internalEventEmmiter } from "./util/internal-event-emmiter";
import type { DataAttribute } from "./components/debugger/visualizer/shared-types";

const Debugger = React.lazy(() => import("./components/debugger"));

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

// ---- Component
const Scrollytelling = ({
  children,
  debug,
  start,
  end,
  callbacks,
  scrub,
  defaults,
  toggleActions,
  disabled = false,
  trigger,
}: {
  children?: React.ReactNode;
  debug?:
    | false
    | {
        label: string;
        visualizer?: boolean;
        markers?: boolean;
      };
  /**
   * The start position of the timeline. This can be a string like "top top" or a number.
   * See https://greensock.com/docs/v3/Plugins/ScrollTrigger/start
   * @default "top top"
   */
  start?: ScrollTrigger.Vars["start"];
  /**
   * The end position of the timeline. This can be a string like "top top" or a number.
   * See https://greensock.com/docs/v3/Plugins/ScrollTrigger/end
   * @default "bottom bottom"
   */
  end?: ScrollTrigger.Vars["end"];
  callbacks?: Pick<
    ScrollTrigger.Vars,
    | "onEnter"
    | "onEnterBack"
    | "onLeave"
    | "onLeaveBack"
    | "onToggle"
    | "onUpdate"
    | "onRefresh"
  >;
  trigger?: ScrollTrigger.Vars["trigger"];
  scrub?: boolean | number;
  defaults?: gsap.TweenVars | undefined;
  toggleActions?: ScrollTrigger.Vars["toggleActions"];
  disabled?: boolean;
}) => {
  const explicitTriggerMode = trigger !== undefined;

  const ref = React.useRef<HTMLDivElement>(null);
  const scopedQuerySelector = gsap.utils.selector(ref);
  const id = React.useId();

  const [timeline, setTimeline] = React.useState<gsap.core.Timeline>();

  const debugMarkers = debug ? debug.markers : false;
  const debugVisualizer = debug
    ? debug.visualizer ?? true // default to true if undefined
    : false;
  const debugLabel = debug ? debug.label : undefined;

  // initialize timeline
  React.useEffect(() => {
    if (!explicitTriggerMode && !ref.current) return;

    if (disabled) {
      setTimeline(undefined);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // fixes https://github.com/basementstudio/scrollytelling/issues/41
    const defaultToggleActions = scrub === false ? "play none none none" : undefined;

    const tl = gsap.timeline({
      scrollTrigger: {
        markers: debugMarkers,
        scrub: scrub ?? true,
        start: start ?? "top top",
        end: end ?? "bottom bottom",
        trigger: explicitTriggerMode ? trigger : ref.current,
        toggleActions: toggleActions ?? defaultToggleActions,
        ...callbacks,
      },
      paused: true,
      defaults: { ...defaults, duration: 1 },
      data: {
        id,
        type: "root",
        label: debugLabel ?? id,
        debug: debugVisualizer,
        isScrollytellingTween: true,
      } satisfies DataAttribute,
    });

    tl.eventCallback("onUpdate", () => {
      internalEventEmmiter.emit("timeline:update", tl);
    });

    setTimeline(tl);

    return () => {
      tl.revert();
    };
  }, [
    debugLabel,
    explicitTriggerMode,
    end,
    start,
    callbacks,
    scrub,
    defaults,
    toggleActions,
    disabled,
    trigger,
    id,
    debugMarkers,
    debugVisualizer,
  ]);

  // rest tween to ensure timeline is always 100 long
  const addRestToTimeline = React.useCallback(
    (lastEnd: number, timeline: gsap.core.Timeline) => {
      const restTweenId = `rest-${id}`;
      // clear previous rest tween, if any
      gsap.getById(restTweenId)?.revert();

      // set new rest tween
      const duration = 100 - lastEnd;
      const position = 100 - duration;
      timeline.to(
        {},
        {
          id: restTweenId,
          duration: duration,
          data: { type: "rest", id: restTweenId, rootId: id },
        },
        position
      );

      // cleanup
      return () => {
        gsap.getById(restTweenId)?.revert();
      };
    },
    [id]
  );

  const getTimelineSpace: ScrollytellingDispatchersContextType["getTimelineSpace"] =
    React.useCallback(
      ({ start, end }) => {
        if (disabled) return null;
        if (!timeline) throw new Error("timeline not initialized");
        const duration = end - start;
        if (start < 0) {
          throw new Error("start time must be greater than 0");
        }
        if (end > 100) {
          throw new Error("end time must be less than 100");
        }
        if (duration < 0) {
          throw new Error("end time must be greater than start time");
        }

        const cleanup = addRestToTimeline(end, timeline);
        internalEventEmmiter.emit("timeline:refresh", timeline);

        return {
          duration,
          position: start,
          cleanup: () => {
            cleanup();
          },
        };
      },
      [disabled, timeline, addRestToTimeline]
    );

  return (
    <ScrollytellingContext.Provider
      value={{ timeline, rootRef: ref, events: internalEventEmmiter }}
    >
      <ScrollytellingDispatchersContext.Provider
        value={{ getTimelineSpace, scopedQuerySelector }}
      >
        {explicitTriggerMode ? children : <Slot ref={ref}>{children}</Slot>}
        {debug && (
          <React.Suspense fallback={null}>
            <Debugger />
          </React.Suspense>
        )}
      </ScrollytellingDispatchersContext.Provider>
    </ScrollytellingContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  Scrollytelling as Root,
  Animation,
  Parallax,
  Pin,
  RegisterGsapPlugins,
  Waypoint,
  Stagger,
  //
  useScrollytelling,
  useScrollToLabel,
};
