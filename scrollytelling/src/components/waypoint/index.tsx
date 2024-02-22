/* -------------------------------------------------------------------------------------------------
 * Waypoint
 * -----------------------------------------------------------------------------------------------*/

import { gsap } from "gsap";
import { Slot } from "@radix-ui/react-slot";
import {
  AnimationProps,
  SimpleTween,
  TweenTarget,
  WaypointBaseDef,
} from "../../types";
import * as React from "react";
import { useScrollytelling } from "../../primitive";
import { getTweenTarget, buildDeclarativeTween } from "../../util";
import { DataAttribute } from "../debugger/visualizer/shared-types";
import { useDispatcher } from "../../context";

export function Waypoint(
  props: WaypointBaseDef & {
    tween?: SimpleTween & { target: TweenTarget };
  }
): null;

export function Waypoint(
  props: WaypointBaseDef & {
    children: React.ReactNode;
    tween?: SimpleTween;
  }
): React.ReactElement;

export function Waypoint({
  tween,
  children,
  at,
  label,
  onCall,
  onReverseCall,
  disabled = false,
}: WaypointBaseDef & {
  children?: AnimationProps["children"];
  tween?: SimpleTween & { target?: TweenTarget };
}): React.ReactElement | null {
  const ref = React.useRef<HTMLElement>(null);
  const id = React.useId();
  const lastStateRef = React.useRef<"idle" | "complete" | "reverse-complete">(
    "idle"
  );

  const { timeline,  } = useScrollytelling();
  const { getTimelineSpace } = useDispatcher();

  const waypointLabel = label ?? `label-${id}`;

  React.useEffect(() => {
    if (!timeline || disabled) return;

    let cleanupTween: undefined | (() => void) = undefined;
    let generatedTween: undefined | GSAPTween = undefined;
    if (tween) {
      const { duration, ...op } = tween;
      const tweenTarget = getTweenTarget({ targetContainer: tween, ref });
      cleanupTween = buildDeclarativeTween({
        id: id + "-tween",
        op,
        duration,
        target: tweenTarget,
        paused: true,
      });
      generatedTween = gsap.getById<gsap.core.Tween>(id + "-tween");
    }
    
    const space = getTimelineSpace({ start: at, end: at })
    if (!space) return

    // create a new paused set
    const newSet = gsap.set(
      {},
      {
        id,
        paused: true,
        data: {
          id,
          type: "waypoint",
          rootId: timeline.data.id,
          isScrollytellingTween: true,
          label: waypointLabel,
        } satisfies DataAttribute,
      }
    );

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
      newSet.data._internalOnCall?.()
      onCall?.();
      generatedTween?.play();
    };
    newSet.vars.onReverseComplete = () => {
      lastStateRef.current = "reverse-complete";
      newSet.data._internalOnReverseCall?.()
      onReverseCall?.();
      if (!tween?.forwards) {
        generatedTween?.reverse();
      }
    };

    // add it to the timeline
    timeline.add(newSet, space.position);

    // this won't actually play it. it will enable it so that the timeline can play it whenever it needs to
    newSet.play();

    timeline.addLabel(waypointLabel, space.position);

    return () => {
      gsap.getById(id)?.revert();
      cleanupTween?.();
      timeline.removeLabel(waypointLabel);
      space.cleanup()
    };
  }, [at, disabled, getTimelineSpace, id, onCall, onReverseCall, timeline, tween, waypointLabel]);

  if (children) {
    return <Slot ref={ref}>{children}</Slot>;
  }
  return null;
}
