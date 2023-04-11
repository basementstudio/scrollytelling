import gsap from "gsap";

export const mapItemsToCylinder = <T,>(
  itemsArray: T[],
  callback: (
    item: T,
    props: {
      data: {
        idx: number;
        progress: number;
      };
      y: number;
      z: number;
      rotationX: number;
      opacity: number;
    }
  ) => any,
  progress: number
) => {
  const relevantArrayLength = itemsArray.length - 1;
  const arrayLength = itemsArray.length;

  const cylinderRadius = 240;
  /* Bigger number, more visible */
  const visibleRangeFactor = 3;
  const availableRadians = Math.PI / 1.25;
  const itemDuration = 1 / relevantArrayLength;
  const opacityDiminishFactor = 0.5;

  return itemsArray.map((item, idx) => {
    // Position is the center
    const itemPosition = idx * itemDuration;

    const distanceFromMarker = Math.abs(itemPosition - progress);
    const transformedDistanceFromMarker =
      distanceFromMarker * (arrayLength / visibleRangeFactor);
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

    if (idx === 1) {
      console.log("itemPosition", {
        start: itemPosition - itemDuration / 2,
        end: itemPosition + itemDuration / 2,
        itemPosition,
        progress,
      });
    }

    // Map elements over the cylinder
    const offsetAngle = progress * availableRadians;
    const angle = (idx / relevantArrayLength) * availableRadians - offsetAngle;
    const y = Math.sin(angle) * cylinderRadius;
    const z = Math.cos(angle) * cylinderRadius;
    const angleInDegrees = -((angle * 180) / Math.PI);

    return callback(item, {
      data: {
        progress: itemProgress,
        idx,
      },
      y,
      z,
      rotationX: angleInDegrees,
      opacity: transformedProgress * opacityDiminishFactor,
    });
  });
};
