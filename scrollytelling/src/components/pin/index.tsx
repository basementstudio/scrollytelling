import * as React from "react";

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

export const Pin = React.forwardRef<HTMLDivElement, PinProps>(
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
