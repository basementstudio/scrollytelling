import { gsap } from "gsap";
import { Slot } from "@radix-ui/react-slot";
import * as Portal from "@radix-ui/react-portal";
import * as React from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// ---- Components ----
import { Animation } from "./components/animation";
import { Debugger } from "./components/debugger";
import { Parallax } from "./components/parallax";
import { Pin } from "./components/pin";
import { RegisterGsapPlugins } from "./components/register-plugins";
import { Waypoint } from "./components/waypoint";

// ---- Context ----
import {
  ScrollytellingContext,
  ScrollytellingDispatchersContext,
  ScrollytellingDispatchersContextType,
  useScrollytelling,
} from "./context";
import { useScrollToLabel } from "./hooks/use-scroll-to-label";

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
}: {
  children?: React.ReactNode;
  debug?: boolean;
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
  scrub?: boolean | number;
  defaults?: gsap.TweenVars | undefined;
  toggleActions?: ScrollTrigger.Vars["toggleActions"];
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const scopedQuerySelector = gsap.utils.selector(ref);
  const id = React.useId();
  const restTweenId = `rest-${id}`;

  const [timeline, setTimeline] = React.useState<gsap.core.Timeline>();

  // initialize timeline
  React.useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        markers: debug,
        scrub: scrub ?? true,
        start: start ?? "top top",
        end: end ?? "bottom bottom",
        trigger: ref.current,
        toggleActions,
        ...callbacks,
      },
      paused: true,
      defaults: { ...defaults, duration: 1 },
    });

    setTimeline(tl);

    return () => {
      tl.revert();
    };
  }, [end, debug, start, callbacks, scrub, defaults, toggleActions]);

  // rest tween to ensure timeline is always 100 long
  const addRestToTimeline = React.useCallback(
    (lastEnd: number, timeline: gsap.core.Timeline) => {
      // clear previous rest tween, if any
      gsap.getById(restTweenId)?.revert();

      // set new rest tween
      const duration = 100 - lastEnd;
      const position = 100 - duration;
      timeline.to({}, { id: restTweenId, duration: duration }, position);

      // cleanup
      return () => {
        gsap.getById(restTweenId)?.revert();
      };
    },
    [restTweenId]
  );

  const getTimelineSpace: ScrollytellingDispatchersContextType["getTimelineSpace"] =
    React.useCallback(
      ({ start, end }) => {
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

        return {
          duration,
          position: start,
          cleanup: () => {
            cleanup();
          },
        };
      },
      [addRestToTimeline, timeline]
    );

  return (
    <ScrollytellingContext.Provider value={{ timeline, rootRef: ref }}>
      <ScrollytellingDispatchersContext.Provider
        value={{ getTimelineSpace, scopedQuerySelector }}
      >
        <Slot ref={ref}>{children}</Slot>
        {debug && (
          <Portal.Root container={ref.current} asChild>
            <div
              style={{ position: "absolute", top: 0, right: 0, height: "100%" }}
            >
              <div style={{ position: "sticky", top: 0 }}>
                <Debugger />
              </div>
            </div>
          </Portal.Root>
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
  //
  useScrollytelling,
  useScrollToLabel,
};
