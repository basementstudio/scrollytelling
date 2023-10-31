// External Library Imports
import { gsap } from "gsap";
import { Slot } from "@radix-ui/react-slot";
import ScrollTrigger from "gsap/ScrollTrigger";

// React Imports
import * as React from "react";

// Component Imports
import { Animation } from "./components/animation";
import { Parallax } from "./components/parallax";
import { Pin } from "./components/pin";
import { RegisterGsapPlugins } from "./components/register-plugins";
import { Stagger } from './components/stagger';
import { Waypoint } from "./components/waypoint";

// Context and Custom Hooks Imports
import {
  ScrollytellingContext,
  ScrollytellingDispatchersContext,
  ScrollytellingDispatchersContextType,
  useScrollytelling,
} from "./context";
import { useScrollToLabel } from "./hooks/use-scroll-to-label";

// Utilities and Types Imports
import { internalEventEmmiter } from "./util/internal-event-emmiter";
import type { DataAttribute } from "./components/debugger/visualizer/shared-types";

// Lazy Components
const Debugger = React.lazy(() => import("./components/debugger"));

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

interface ScrollytellingProps {
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
  children?: React.ReactNode;
  debug?:
    | false
    | {
        label: string;
        visualizer?: boolean;
        markers?: boolean;
      };
  defaults?: GSAPTweenVars | undefined;
  disabled?: boolean;
  end?: ScrollTrigger.Vars["end"];
  fastScrollEnd?: boolean | number;
  invalidateOnRefresh?: boolean;
  scrub?: boolean | number;
  start?: ScrollTrigger.Vars["start"];  
  toggleActions?: ScrollTrigger.Vars["toggleActions"];
  toggleClass?: string;
  trigger?: ScrollTrigger.Vars["trigger"];
}

/**
 * The `Scrollytelling` component serves as the root component for setting up Scrollytelling animations. It encapsulates the timeline and provides context for child components.
 *
 * @param {ScrollytellingProps} props - Props for the Scrollytelling component.
 * @returns {React.ReactNode} The Scrollytelling component.
 */

const Scrollytelling = React.memo(({
  callbacks,
  children,
  debug,
  defaults,
  disabled = false,
  end,
  fastScrollEnd,
  invalidateOnRefresh,
  scrub,
  start,
  toggleActions,
  toggleClass,
  trigger
}: ScrollytellingProps) => {
  const explicitTriggerMode = trigger !== undefined;

  const id = React.useId();
  const ref = React.useRef<HTMLDivElement>(null);
  const scopedQuerySelector = gsap.utils.selector(ref);

  const [timeline, setTimeline] = React.useState<GSAPTimeline>();

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

    const ctx = gsap.context(()=>{
      const tl = gsap.timeline({             
        defaults: { ...defaults, duration: 1 },      
        paused: true,
        scrollTrigger: {
          end: end ?? "bottom bottom",
          fastScrollEnd,
          invalidateOnRefresh,
          markers: debugMarkers,
          scrub: scrub ?? true,
          start: start ?? "top top",
          toggleActions,
          toggleClass,
          trigger: explicitTriggerMode ? trigger : ref.current,
          ...callbacks
        },
        data: {
          debug: debugVisualizer,
          id,
          isScrollytellingTween: true,
          label: debugLabel ?? id,
          type: "root"
        } satisfies DataAttribute,
      });
  
      tl.eventCallback("onUpdate", () => {
        internalEventEmmiter.emit("timeline:update", tl);
      });
  
      setTimeline(tl);
    }, ref); 

    return () => {
      ctx.revert();
    };
  }, [callbacks, debugLabel, debugMarkers, debugVisualizer, defaults, disabled, end, explicitTriggerMode, fastScrollEnd, id, invalidateOnRefresh, scrub, start, toggleActions, toggleClass, trigger]);

  /**
   *
   * @param {GSAPTimeline} timeline - The GSAP timeline.
   * @param {number} lastEnd - The end position of the last tween.
   * @returns {Function} A cleanup function to remove the rest tween.
   * Adds a "rest" tween to ensure the timeline is always 100 units long.
   */
  const addRestToTimeline = React.useCallback(
    (lastEnd: number, timeline: GSAPTimeline) => {
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

  /**
   * Gets the available timeline space between the start and end positions.
   *
   * @param {Object} param - Object containing start and end positions.
   * @param {number} param.start - The start position.
   * @param {number} param.end - The end position.
   * @returns {Object|null} An object with duration, position, and cleanup function. Returns null if disabled.
   * @throws {Error} Throws an error if the timeline is not initialized or if the positions are invalid.
   */
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
});

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
