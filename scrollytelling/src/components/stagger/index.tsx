/* -------------------------------------------------------------------------------------------------
 * Stagger
 * -----------------------------------------------------------------------------------------------*/

import * as React from "react";
import { StaggerBaseDef, TweenWithChildrenDef, TweenWithTargetDef } from "../../types";
import { Animation } from "../animation";

export function Stagger(
  props: StaggerBaseDef & {
    tween: TweenWithTargetDef;
  }
): React.ReactElement;

export function Stagger(
  props: StaggerBaseDef & {
    children?: React.ReactNode[];
    tween: TweenWithChildrenDef;
  }
): React.ReactElement;

export function Stagger({
  children,
  overlap,
  tween
}: StaggerBaseDef & {
  children?: React.ReactNode[];
  tween: TweenWithChildrenDef | TweenWithTargetDef;
}) {

  const timeline = React.useMemo(() => {
    if(tween?.start === undefined || tween?.end === undefined) {
      throw new Error('Stagger must have start and end');
    }

    return getStaggeredTimeline(
      {
        start: tween?.start,
        end: tween?.end,
        chunks: children?.length,
        overlap: overlap,
      }
    )
  }, [children?.length, overlap, tween?.end, tween?.start]);

  if (children) {
    return children.map(
      (child, i) => {
        const currTween = timeline[i];

        if (!currTween) {
          return null;
        }

        return (
          <Animation
            key={i}
            tween={{
              ...tween,
              start: currTween.start,
              end: currTween.end,
            }}
          >
            {child}
          </Animation>
        );
      }
    );
  }

  return <></>;
}

// Overlap duration arrays by a factor mantaining the final duration between them
const overlapDurationArrayByFactor = (
  durations: { start: number; end: number }[],
  factor: number
  ) => {
  const first = durations[0];
  const last = durations[durations.length - 1];
  
  if(first === undefined || last === undefined) {
    throw Error('Durations array is empty');
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
      start: Math.max(veryStart + (newStart - veryStart) * afterOverlapDurationDiffFactor, 0),
      end: Math.min(veryStart + (newEnd - veryStart) * afterOverlapDurationDiffFactor, 100),
    };
  });

  return newDurations;
};

export const getStaggeredTimeline = (config: {
  start: number;
  end: number;
  overlap?: number;
  chunks?: number;
}) => {
  const { start, end, overlap = 0, chunks = 1 } = config;

  if(overlap > 1 || overlap < 0) {
    throw new Error('Overlap must be between 0 and 1');
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