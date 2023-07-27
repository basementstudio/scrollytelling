import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

// ---- Types ----
import {
  AnimationProps,
  DataOrDataArray,
  TweenWithChildrenDef,
  TweenWithTargetDef,
} from "../../types";

// ---- Utils ----
import { buildDeclarativeTween, getTweenTarget } from "../../util";
import { useDispatcher, useScrollytelling } from "../../context";

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/

/**
 * Animation component enables defining animations using GSAP within the Scrollytelling context.
 *
 * @param {AnimationProps} props - Animation component props
 * @returns {null | React.ReactElement} Animation component
 * @link https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#animation
 */

export function Animation(props: {
  tween: DataOrDataArray<TweenWithTargetDef>;
  disabled?: boolean;
}): null;

export function Animation(props: {
  children: React.ReactNode;
  tween: DataOrDataArray<TweenWithChildrenDef>;
  disabled?: boolean;
}): React.ReactElement;

export function Animation({
  tween,
  children,
  disabled = false,
}: AnimationProps): React.ReactElement | null {
  const ref = React.useRef<HTMLElement>(null);
  const id = React.useId();

  const { timeline } = useScrollytelling();
  const { getTimelineSpace } = useDispatcher();

  React.useEffect(() => {
    if (!timeline || !tween || disabled) return;

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
        if (!timelineSpace) return; // root is probably disabled.
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

    if (Array.isArray(tween)) {
      const cleanupTweens = tween.map((tween) => {
        const cleanup = addTweenToTimeline(tween);
        return cleanup;
      });
      return () => {
        cleanupTweens.forEach((cleanup) => cleanup?.());
      };
    } else {
      const cleanup = addTweenToTimeline(tween);
      return () => {
        cleanup?.();
      };
    }
  }, [getTimelineSpace, id, tween, timeline, disabled]);

  if (children) {
    return <Slot ref={ref}>{children}</Slot>;
  }
  return null;
}
