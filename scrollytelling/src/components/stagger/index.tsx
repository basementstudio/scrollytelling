import * as React from "react";
import {
  StaggerBaseDef,
  TweenWithChildrenDef,
  TweenWithTargetDef,
} from "../../types";
import { Animation } from "../animation";
import { getStaggeredTimeline, isDev } from "../../util";

/* -------------------------------------------------------------------------------------------------
 * Stagger
 * -----------------------------------------------------------------------------------------------*/

/**
 * Stagger component enables staggered animations for a group of elements using GSAP animations.
 * It allows you to create a sequence of animations that start at different times with optional overlaps.
 *
 * @param {StaggerBaseDef} props - Stagger component props
 * @returns {React.ReactElement} Stagger component
 * @link https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#stagger
 */

type StaggerProps = {
  children?: React.ReactNode[];
  tween: TweenWithChildrenDef | TweenWithTargetDef;
} & StaggerBaseDef;

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
  disabled = false,
  overlap,
  tween,
}: StaggerProps) {
  const isTweenWithTarget = "target" in tween;
  const targetLength =
    isTweenWithTarget && Array.isArray(tween.target)
      ? tween.target.length
      : children?.length;

  const timeline = React.useMemo(() => {
    if (tween?.start === undefined || tween?.end === undefined) {
      if (isDev) {
        throw new Error("Stagger needs a start and end value");
      } else {
        console.warn("Stagger needs a start and end value");
      }

      return [];
    }

    return getStaggeredTimeline({
      chunks: targetLength,
      end: tween?.end,
      overlap: overlap,
      start: tween?.start,
    });
  }, [overlap, targetLength, tween?.end, tween?.start]);

  if (children) {
    return children.map((child, i) => {
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
          disabled={disabled}
        >
          {child}
        </Animation>
      );
    });
  } else if (isTweenWithTarget) {
    const target = tween.target;

    if (Array.isArray(target)) {
      return target.map((target, i) => {
        const currTween = timeline[i];

        if (!currTween) {
          return null;
        }

        if (tween.to) {
          return (
            <Animation
              key={i}
              tween={{
                ...tween,
                end: currTween.end,
                start: currTween.start,
                target: target,
                to: {
                  ...tween.to,
                  onUpdateParams: [i],
                },
              }}
              disabled={disabled}
            />
          );
        } else if (tween.from) {
          return (
            <Animation
              key={i}
              tween={{
                ...tween,
                end: currTween.end,
                from: { ...tween.from, onUpdateParams: [i] },
                start: currTween.start,
                target: target,
              }}
              disabled={disabled}
            />
          );
        } else if (tween.fromTo) {
          return (
            <Animation
              key={i}
              tween={{
                ...tween,
                end: currTween.end,
                fromTo: [
                  {
                    ...tween.fromTo[0],
                  },
                  {
                    ...tween.fromTo[1],
                    onUpdateParams: [i],
                  },
                ],
                start: currTween.start,
                target: target,
              }}
              disabled={disabled}
            />
          );
        }
      });
    } else if (isDev) {
      throw new Error("Stagger target must be an array");
    }
  }

  return <></>;
}
