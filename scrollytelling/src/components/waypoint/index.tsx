/* -------------------------------------------------------------------------------------------------
 * Waypoint
 * -----------------------------------------------------------------------------------------------*/

import { Slot } from "@radix-ui/react-slot";
import {
  AnimationProps,
  SimpleTween,
  TweenTarget,
  WaypointBaseDef,
} from "../../types";
import * as React from "react";
import { useScrollytelling } from "../../primitive";
import { getTweenTarget, getValidAt, buildDeclarativeTween } from "../../util";

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

export function Waypoint(
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
