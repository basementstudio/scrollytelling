import * as React from "react";

import { Animation } from "../animation";

/* -------------------------------------------------------------------------------------------------
 * Parallax
 * -----------------------------------------------------------------------------------------------*/

import {
  RequireAtLeastOne,
  StartEndOptions,
  TweenTarget,
  UnitValue,
} from "../../types";

interface ParallaxProps {
  tween: StartEndOptions & {
    target?: TweenTarget; // Optional: The target element or elements to apply the animation to.
  } & RequireAtLeastOne<{
      movementX?: UnitValue; // The amount of movement on the X-axis.
      movementY?: UnitValue; // The amount of movement on the Y-axis.
    }>;
  children?: React.ReactNode; // Optional: Content to be rendered inside the Parallax component.
  disabled?: boolean;
}

/**
 * Applies a parallax effect to its children using GSAP animations.
 *
 * @returns {JSX.Element} `Animation` component with parallax effect applied. _(Expects `children`)_
 * @link [[@bsmnt/scrollytelling] API Docs: Parallax](https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#parallax)
 */

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  tween,
  disabled = false,
}): JSX.Element => {
  if (!tween.movementY && !tween.movementX) {
    throw new Error(
      "At least one of movementY and movementX is required in Parallax component."
    );
  }

  return (
    <Animation
      disabled={disabled}
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
