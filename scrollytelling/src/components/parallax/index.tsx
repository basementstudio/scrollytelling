import * as React from "react";

import { Animation } from "../animation";

/* -------------------------------------------------------------------------------------------------
 * Parallax
 * -----------------------------------------------------------------------------------------------*/

import { TweenBaseDef, TweenTarget, UnitValue } from "../../types";

interface ParallaxProps {
  tween: Omit<TweenBaseDef, "to" | "from" | "fromTo"> & {
    target?: TweenTarget; // Optional: The target element or elements to apply the animation to.
    movementX?: UnitValue; // Optional: The amount of movement on the X-axis.
    movementY?: UnitValue; // Optional: The amount of movement on the Y-axis.
  };
  children?: React.ReactNode; // Optional: Content to be rendered inside the Parallax component.
}

/**
 * Parallax component applies a parallax effect to its children using GSAP animations.
 *
 * @param {ParallaxProps} props - Parallax component props
 * @returns {JSX.Element} Parallax component
 * @link https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#parallax
 */

export const Parallax: React.FC<ParallaxProps> = ({ children, tween }) => {
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
