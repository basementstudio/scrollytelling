import type { DataAttribute } from "../components/debugger/visualizer/shared-types";
import { FromToOptions, TweenTarget } from "../types";
import { gsap } from "gsap";

export function getTweenTarget({
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

export function buildDeclarativeTween({
  op,
  id,
  target,
  duration,
  paused,
  ...timelineAndPosition
}: {
  op: FromToOptions;
  id: string;
  target: TweenTarget;
  duration: number;
  paused?: boolean;
} & (
  | { timeline?: never; position?: never }
  | { timeline: gsap.core.Timeline; position: number }
)) {
  const data: DataAttribute = {
    id,
    type: "animation",
    rootId: timelineAndPosition.timeline?.data.id,
    isScrollytellingTween: true,
  };

  if ("to" in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.to(
        target,
        {
          ...op.to,
          id,
          duration,
          paused,
          data,
        },
        timelineAndPosition.position
      );
    } else {
      gsap.to(target, { ...op.to, id, duration, paused });
    }
  } else if ("from" in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.from(
        target,
        { ...op.from, id, duration, paused, data },
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
        { ...op.fromTo[1], id, duration, paused, data },
        timelineAndPosition.position
      );
    } else {
      gsap.fromTo(
        target,
        { ...op.fromTo[0] },
        { ...op.fromTo[1], id, duration, paused }
      );
    }
  } else throw new Error("Invalid TweenOp");

  return () => {
    gsap.getById(id)?.revert();
  };
}

/**
 * Overlap duration arrays by a factor while maintaining the final duration between them.
 *
 * @param {Array<{ start: number; end: number }>} durations - An array of duration objects.
 * @param {number} factor - The factor by which durations will overlap (0 to 1).
 * @returns {Array<{ start: number; end: number }>} Overlapped duration array.
 */
const overlapDurationArrayByFactor = (
  durations: { start: number; end: number }[],
  factor: number
) => {
  const first = durations[0];
  const last = durations[durations.length - 1];

  if (first === undefined || last === undefined) {
    throw Error("Durations array is empty");
  }

  /*
    We need the veryStart because is our left shift in a [0% - 100%] timeline. Overlapping durations
    affect the timeline total duration & we don't want that, so to scale it proportionally. Steps are:
    1. We unshift it to bring the start to 0
    2. Then we scale it proportionally to match the initial totalDuration
    3. And then we shift it back to the veryStart
  */
  const veryStart = first.start;
  const veryEnd = last.end;
  const totalDuration = veryEnd - veryStart;

  const overlapDuration = totalDuration * factor;
  const overlapDurationPerDuration = overlapDuration / durations.length;

  const afterOverlapDuration =
    totalDuration - overlapDurationPerDuration * (durations.length - 1);
  const afterOverlapDurationDiffFactor = totalDuration / afterOverlapDuration;

  const newDurations = durations.map((duration, i) => {
    const newStart = duration.start - overlapDurationPerDuration * i;
    const newEnd = duration.end - overlapDurationPerDuration * i;

    return {
      start: Math.max(
        veryStart + (newStart - veryStart) * afterOverlapDurationDiffFactor,
        0
      ),
      end: Math.min(
        veryStart + (newEnd - veryStart) * afterOverlapDurationDiffFactor,
        100
      ),
    };
  });

  return newDurations;
};

/**
 * Generate staggered animation timeline based on configuration.
 *
 * @param {Object} config - Stagger configuration with start, end, overlap, and chunks.
 * @returns {Array<{ start: number; end: number }>} Staggered animation timeline.
 */

export const getStaggeredTimeline = (config: {
  chunks?: number;
  end: number;
  overlap?: number;
  start: number;
}) => {
  const { start, end, overlap = 0, chunks = 1 } = config;

  if (overlap > 1 || overlap < 0) {
    throw new Error("Overlap must be between 0 and 1");
  }

  const duration = end - start;
  const chunkDuration = duration / chunks;

  const animationChunks = Array.from({ length: chunks }).map((_, i) => {
    const chunkStart = start + chunkDuration * i;
    const chunkEnd = chunkStart + chunkDuration;

    return {
      start: chunkStart,
      end: chunkEnd,
    };
  });

  if (overlap > 0) {
    return overlapDurationArrayByFactor(animationChunks, overlap);
  }

  return animationChunks;
};

export const clsx = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export function getValidAt(at: number) {
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

export const isDev = process.env.NODE_ENV === "development";
