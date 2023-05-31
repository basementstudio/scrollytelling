import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import * as Portal from "@radix-ui/react-portal";
import { buildDeclarativeTween } from "./util/build-declarative-tween";
import { useIsoLayoutEffect } from "./hooks/use-iso-layout-effect";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

// ---- Utils

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>> 
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

// ---- Contexts

type ScrollytellingContextType = {
  timeline: gsap.core.Timeline | undefined;
  rootRef: React.RefObject<HTMLDivElement>;
};

const ScrollytellingContext = React.createContext<
  undefined | ScrollytellingContextType
>(undefined);

const useScrollytelling = () => {
  const scrollytelling = React.useContext(ScrollytellingContext);
  if (!scrollytelling) {
    throw new Error(
      "useScrollytelling must be used within a Scrollytelling.Root"
    );
  }
  return scrollytelling;
};

type ScrollytellingDispatchersContextType = {
  getTimelineSpace: (params: { start: number; end: number }) => {
    duration: number;
    position: number;
    cleanup: () => void;
  };
  scopedQuerySelector: gsap.utils.SelectorFunc | undefined;
};

const ScrollytellingDispatchersContext = React.createContext<
  undefined | ScrollytellingDispatchersContextType
>(undefined);

const useDispatcher = () => {
  const dispatcher = React.useContext(ScrollytellingDispatchersContext);
  if (!dispatcher) {
    throw new Error("useDispatcher must be used within a ScrollytellingRoot");
  }
  return dispatcher;
};

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

// ---- Debugger

const Debugger = () => {
  const { timeline, rootRef } = useScrollytelling();
  const [progress, setProgress] = React.useState<{
    percentage: string;
    px: string;
  }>();

  React.useEffect(() => {
    if (!timeline || !rootRef.current) return;
    const handleUpdate = () => {
      const progress = timeline.progress();
      if (!timeline.scrollTrigger) return;

      const start = timeline.scrollTrigger.start;
      const end = timeline.scrollTrigger.end;
      const scroll = (end - start) * progress;
      setProgress({
        percentage: `${(progress * 100).toFixed(2)}%`,
        px: `${scroll.toFixed(0)}px`,
      });
    };

    timeline.eventCallback("onUpdate", handleUpdate);

    return () => {
      timeline.eventCallback("onUpdate", null);
    };
  }, [timeline, rootRef]);

  return (
    <div
      style={{
        width: "370px",
        padding: "24px",
        border: "1px solid black",
        fontSize: "12px",
        background: "#360202",
      }}
    >
      <pre>{JSON.stringify({ progress }, null, 2)}</pre>
    </div>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/

type TweenOp =
  | { to: gsap.TweenVars; from?: never; fromTo?: never }
  | { from: gsap.TweenVars; to?: never; fromTo?: never }
  | { fromTo: [gsap.TweenVars, gsap.TweenVars]; to?: never; from?: never };

type Time = number; // do we need this?: | UnitValue<"vh" | "px" | "%" | "vw">;

type TweenBaseDef = {
  start: Time;
  end: Time;
}

type TweenTarget = gsap.TweenTarget | React.RefObject<HTMLElement>;

type TweenWithTargetDef = TweenBaseDef & TweenOp & {
  target: TweenTarget;
};

type TweenWithChildrenDef = TweenBaseDef & TweenOp;

type AnimationProps = {
  tween: DataOrDataArray<TweenWithChildrenDef | TweenWithTargetDef>;
  children?: React.ReactNode;
};

function Animation(props: { tween: DataOrDataArray<TweenWithTargetDef> }): null;
function Animation(props: {
  children: React.ReactNode;
  tween: DataOrDataArray<TweenWithChildrenDef>;
}): React.ReactElement;
function Animation(props: AnimationProps): React.ReactElement | null {
  const ref = React.useRef<HTMLElement>(null);
  const id = React.useId();

  const { timeline } = useScrollytelling();
  const { getTimelineSpace } = useDispatcher();

  React.useEffect(() => {
    if (!timeline || !props.tween) return;

    const addTweenToTimeline = (
      tween: TweenWithChildrenDef | TweenWithTargetDef
    ) => {
      const tweenTarget = getTweenTarget({
        targetContainer: "target" in tween ? tween : {},
        ref,
      });
      if (tweenTarget) {
        const timelineSpace = getTimelineSpace({
          start: tween.start,
          end: tween.end,
        });
        const cleanup = buildDeclarativeTween({
          id,
          timeline,
          op: tween,
          target: tweenTarget,
          duration: timelineSpace.duration,
          position: timelineSpace.position,
        });

        return () => {
          cleanup();
          timelineSpace.cleanup();
        };
      } else return () => undefined;
    };

    if (Array.isArray(props.tween)) {
      const cleanupTweens = props.tween.map((tween) => {
        const cleanup = addTweenToTimeline(tween);
        return cleanup;
      });
      return () => {
        cleanupTweens.forEach((cleanup) => cleanup());
      };
    } else {
      const cleanup = addTweenToTimeline(props.tween);
      return () => {
        cleanup();
      };
    }
  }, [getTimelineSpace, id, props.tween, timeline]);

  if (props.children) {
    return <Slot ref={ref}>{props.children}</Slot>;
  }
  return null;
}

/* -------------------------------------------------------------------------------------------------
 * Waypoint
 * -----------------------------------------------------------------------------------------------*/

type WaypointBaseDef = {
  at: number;
  onCall?: () => void;
  onReverseCall?: () => void;
  label?: string;
};

type SimpleTween = TweenOp & { duration: number; forwards?: boolean };

function Waypoint(
  props: WaypointBaseDef & {
    tween?: SimpleTween & { target: TweenTarget };
  }
): null;
function Waypoint(
  props: WaypointBaseDef & {
    children: React.ReactNode;
    tween?: SimpleTween;
  }
): React.ReactElement;
function Waypoint(
  props: WaypointBaseDef & {
    children?: AnimationProps["children"];
    tween?: SimpleTween & { target?: TweenTarget };
  }
): React.ReactElement | null {
  const ref = React.useRef<HTMLElement>(null);
  const id = React.useId();
  const lastStateRef = React.useRef<"idle" | "complete" | "reverse-complete">(
    "idle"
  );

  const { timeline } = useScrollytelling();

  React.useEffect(() => {
    if (!timeline) return;

    let cleanupTween: undefined | (() => void) = undefined;
    let generatedTween: undefined | gsap.core.Tween = undefined;
    if (props.tween) {
      const { duration, ...op } = props.tween;
      const tweenTarget = getTweenTarget({ targetContainer: props.tween, ref });
      cleanupTween = buildDeclarativeTween({
        id: id + "-tween",
        op,
        duration,
        target: tweenTarget,
        paused: true,
      });
      generatedTween = gsap.getById<gsap.core.Tween>(id + "-tween");
    }

    const validAt = getValidAt(props.at);

    // create a new paused set
    const newSet = gsap.set({}, { id, paused: true });

    /**
     * if the lastStateRef is "complete", it means that this waypoint was already triggered
     * now, the state changed, so this effect cleaned up the previous set, so we lost the "complete" state inside the tween
     * we now recover it by playing the new set, which will trigger the onComplete callback (with nothing in it)
     * then we put the correct callbacks so that it "resumes"
     */
    if (lastStateRef.current === "complete") {
      // play it to trigger the onComplete (that was previously triggered)
      newSet.play();
    }

    // set the callbacks
    newSet.vars.onComplete = () => {
      lastStateRef.current = "complete";
      props.onCall?.();
      generatedTween?.play();
    };
    newSet.vars.onReverseComplete = () => {
      lastStateRef.current = "reverse-complete";
      props.onReverseCall?.();
      if (!props.tween?.forwards) {
        generatedTween?.reverse();
      }
    };

    // add it to the timeline
    timeline.add(newSet, validAt);

    // this won't actually play it. it will enable it so that the timeline can play it whenever it needs to
    newSet.play();

    if (props.label) {
      timeline.addLabel(props.label, validAt);
    }

    return () => {
      gsap.getById(id)?.revert();
      cleanupTween?.();
      if (props.label) timeline.removeLabel(props.label);
    };
  }, [id, timeline, props]);

  if (props.children) {
    return <Slot ref={ref}>{props.children}</Slot>;
  }
  return null;
}

// ---- getValidAt
function getValidAt(at: number) {
  if (at < 0) {
    throw new Error("at must be a positive number");
  }

  if (at > 100) {
    throw new Error("at must be less than 100");
  }

  if (at === 0) {
    // gsap won't call "reverse" if the time is 0, so we change it slightly.
    return 0.000001;
  }
  if (at === 100) {
    // same sitiuation with 100.
    return 99.999999;
  }
  return at;
}

/* -------------------------------------------------------------------------------------------------
 * Parallax
 * -----------------------------------------------------------------------------------------------*/

interface ParallaxProps {
  tween: TweenBaseDef & {
    target?: TweenTarget; // Optional: The target element or elements to apply the animation to.
  } & RequireAtLeastOne<{
    movementX?: UnitValue; // The amount of movement on the X-axis.
    movementY?: UnitValue; // The amount of movement on the Y-axis.
  }>;
  children?: React.ReactNode; // Optional: Content to be rendered inside the Parallax component.
}

/**
 * Applies a parallax effect to its children using GSAP animations.
 * 
 * @returns {JSX.Element} `Animation` component with parallax effect applied. _(Expects `children`)_
 * @link [[@bsmnt/scrollytelling] API Docs: Parallax](https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#parallax)
 */

const Parallax: React.FC<ParallaxProps> = ({ children, tween }) => {
  if (!tween.movementY && !tween.movementX) {
    throw new Error(
      "At least one of movementY and movementX is required in Parallax component."
    );
  }

  return (
    <Animation
      tween={{
        ...tween,
        fromTo: [
          {
            y: tween.movementY
              ? -1 * tween.movementY.value + tween.movementY.unit
              : undefined,
            x: tween.movementX
              ? -1 * tween.movementX.value + tween.movementX.unit
              : undefined,
          },
          {
            y: tween.movementY
              ? tween.movementY.value + tween.movementY.unit
              : undefined,
            x: tween.movementX
              ? tween.movementX.value + tween.movementX.unit
              : undefined,
            ease: "linear",
          },
        ],
      }}
    >
      {children}
    </Animation>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Pin
 * -----------------------------------------------------------------------------------------------*/

interface PinProps {
  childHeight: string | number; // The height of the pinned element in the pin.
  pinSpacerHeight: string | number; // The height of the spacer reserved for the pinned element in the pin.
  childClassName?: string; // Optional: Custom CSS class name for the child element
  children?: React.ReactNode; // Optional: Content to be rendered inside the pinned element
  pinSpacerClassName?: string; // Optional: Custom CSS class name for the pin spacer element
  top?: string | number; // Optional: Custom top position for the pinned element
}

/**
 * Pin component enables pinning an element in its initial position while the remaining content scrolls.
 * It ensures that the pinned element stays fixed at its starting position within the active duration of Scrollytelling.
 *
 * @param {PinProps} props - Pin component props
 * @returns {JSX.Element} Pin component
 * @link https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#pin
 */

const Pin = React.forwardRef<HTMLDivElement, PinProps>(
  (
    {
      childClassName,
      childHeight,
      children,
      pinSpacerClassName,
      pinSpacerHeight,
      top = 0,
    }: PinProps,
    ref
  ) => {
    if (!childHeight || !pinSpacerHeight) {
      throw new Error(
        "childHeight and pinSpacerHeight are required in Pin component."
      );
    }

    return (
      <div
        className={pinSpacerClassName}
        ref={ref}
        style={{ height: pinSpacerHeight }}
      >
        <div
          className={childClassName}
          style={{ height: childHeight, position: "sticky", top }}
        >
          {children}
        </div>
      </div>
    );
  }
);

Pin.displayName = "Pin";

/* -------------------------------------------------------------------------------------------------
 * RegisterGsapPlugins
 * -----------------------------------------------------------------------------------------------*/

type Plugin = Parameters<typeof gsap.registerPlugin>[number];

const RegisterGsapPlugins = ({ plugins }: { plugins: Plugin[] }) => {
  // this needs to run before scrolltrigger does any animations
  useIsoLayoutEffect(() => {
    gsap.registerPlugin(...plugins);
  }, []);

  return null;
};

/* -------------------------------------------------------------------------------------------------
 * useScrollToLabel
 * -----------------------------------------------------------------------------------------------*/

const useScrollToLabel = (
  label: string,
  opts?: {
    behavior?: ScrollBehavior;
    offset?: number;
  }
) => {
  const scrollytelling = useScrollytelling();

  return React.useCallback(() => {
    if (!scrollytelling.timeline) throw new Error("timeline not initialized");
    const st = scrollytelling.timeline.scrollTrigger;
    if (!st) throw new Error("scrollTrigger not found");
    const foundLabel = scrollytelling.timeline.labels[label];
    if (!foundLabel) throw new Error(`label ${label} not found`);

    const targetPx = st.labelToScroll(label);

    window.scrollTo({
      top: targetPx + (opts?.offset ?? 0),
      behavior: opts?.behavior,
    });
  }, [label, opts?.behavior, opts?.offset, scrollytelling.timeline]);
};

/* -------------------------------------------------------------------------------------------------
 * Types / Utils
 * -----------------------------------------------------------------------------------------------*/

type DataOrDataArray<T> = T | Array<T>;
type UnitValue<Unit = string> = { value: number; unit: Unit };

// ---- getTweenTarget
function getTweenTarget({
  targetContainer,
  ref,
}: {
  targetContainer: { target?: TweenTarget };
  ref: React.RefObject<HTMLElement>;
}) {
  if (targetContainer.target) {
    if (
      targetContainer.target &&
      typeof targetContainer.target === "object" &&
      "current" in targetContainer.target
    ) {
      return targetContainer.target.current;
    } else {
      return targetContainer.target;
    }
  } else if (ref) {
    return ref.current;
  } else {
    return null;
  }
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  Scrollytelling as Root,
  Animation,
  Waypoint,
  Parallax,
  Pin,
  RegisterGsapPlugins,
  //
  useScrollytelling,
  useScrollToLabel,
};
