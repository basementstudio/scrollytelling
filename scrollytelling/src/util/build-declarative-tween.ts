import { gsap } from "gsap";
import { TweenTarget } from "./get-tween-target";

type TweenVars = gsap.TweenVars;

export type TweenOp =
  | { to: TweenVars; from?: never; fromTo?: never }
  | { from: TweenVars; to?: never; fromTo?: never }
  | { fromTo: [TweenVars, TweenVars]; to?: never; from?: never };

export function buildDeclarativeTween({
  op,
  id,
  target,
  duration,
  paused,
  ...timelineAndPosition
}: {
  op: TweenOp;
  id: string;
  target: TweenTarget;
  duration: number;
  paused?: boolean;
} & (
  | { timeline?: never; position?: never }
  | { timeline: gsap.core.Timeline; position: number }
)) {
  if ("to" in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.to(
        target,
        { ...op.to, id, duration, paused },
        timelineAndPosition.position
      );
    } else {
      gsap.to(target, { ...op.to, id, duration, paused });
    }
  } else if ("from" in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.from(
        target,
        { ...op.from, id, duration, paused },
        timelineAndPosition.position
      );
    } else {
      gsap.from(target, { ...op.from, id, duration, paused });
    }
  } else if ("fromTo" in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.fromTo(
        target,
        { ...op.fromTo[0] },
        { ...op.fromTo[1], id, duration, paused },
        timelineAndPosition.position
      );
    } else {
      gsap.fromTo(
        target,
        { ...op.fromTo[0] },
        { ...op.fromTo[1], id, duration }
      );
    }
  } else throw new Error("Invalid TweenOp");

  return () => {
    gsap.getById(id)?.revert();
  };
}
