import gsap from "gsap";
import { useCallback, useMemo } from "react";
import { isClient } from "../../../lib/utils";

export const defaultConfig = {
  cylinderRadius: 240,
  visibleRangeFactor: 3,
  availableRadians: Math.PI / 1.25,
  opacityDiminishFactor: 0.5
}

type Config = {
  target: string;
  onUpdate: (item: Element, props: {
    data: {
      progress: number,
      idx: number,
    },
    y: number,
    z: number,
    rotationX: number,
    opacity: number,
  }) => void;
  config: {
    cylinderRadius: number;
    /* Bigger number, more visible */
    visibleRangeFactor: number;
    availableRadians: number;
    opacityDiminishFactor: number;
  };
}

export const useMapToCylinder = (config: Omit<Config, "config"> & {
  config?: Partial<Config["config"]>;
}) => {
  const targets = useMemo(() => {
    if(!isClient) return

    const a = Array.from(document.querySelectorAll(config.target));
    return a;
  }, [config.target]);

  const resolvedConfig = useMemo<Config>(() => {
    return {
      ...config,
      config: {
        ...(defaultConfig || {}),
        ...config.config,
      }
    }
  }, [config])

  const update = useCallback((progress: number) => {
    if(!targets) return

    const relevantArrayLength = targets.length - 1;
    const arrayLength = targets.length;

    const itemDuration = 1 / relevantArrayLength;

    targets.map((item, idx) => {
      // Position is the center
      const itemPosition = idx * itemDuration;

      const distanceFromMarker = Math.abs(itemPosition - progress);
      const transformedDistanceFromMarker =
        distanceFromMarker * (arrayLength / resolvedConfig.config.visibleRangeFactor);
      /*
        This is the progress of the item.
        Goes from 0 to 1 as it approaches to the target, once it passes, back to 0
      */
      const itemProgress = gsap.utils.clamp(
        0,
        1,
        1 - distanceFromMarker * relevantArrayLength * 2
      ); // Only changes once the box intersects the middle
      const transformedProgress = gsap.utils.clamp(
        0,
        1,
        1 - transformedDistanceFromMarker
      );

      // Map elements over the cylinder
      const offsetAngle = progress * resolvedConfig.config.availableRadians;
      const angle = (idx / relevantArrayLength) * resolvedConfig.config.availableRadians - offsetAngle;
      const y = Math.sin(angle) * resolvedConfig.config.cylinderRadius;
      const z = (Math.cos(angle) * resolvedConfig.config.cylinderRadius) - resolvedConfig.config.cylinderRadius;
      const angleInDegrees = -((angle * 180) / Math.PI);

      resolvedConfig.onUpdate?.(item, {
        data: {
          progress: itemProgress,
          idx,
        },
        y,
        z,
        rotationX: angleInDegrees,
        opacity: transformedProgress * resolvedConfig.config.opacityDiminishFactor,
      });
    });
  }, [resolvedConfig, targets])
  
  return update
}
