import * as React from "react";
import { useScrollytelling } from "../context";

/* -------------------------------------------------------------------------------------------------
 * useScrollToLabel
 * -----------------------------------------------------------------------------------------------*/

export const useScrollToLabel = (
  label: string,
  opts?: {
    behavior?: ScrollBehavior;
    offset?: number;
  }
) => {
  const scrollytelling = useScrollytelling();

  return React.useCallback(() => {
    if (!scrollytelling.timeline) throw new Error("timeline not initialized");
    const st = scrollytelling.timeline.scrollTrigger;
    if (!st) throw new Error("scrollTrigger not found");
    const foundLabel = scrollytelling.timeline.labels[label];
    if (!foundLabel) throw new Error(`label ${label} not found`);

    const targetPx = st.labelToScroll(label);

    window.scrollTo({
      top: targetPx + (opts?.offset ?? 0),
      behavior: opts?.behavior,
    });
  }, [label, opts?.behavior, opts?.offset, scrollytelling.timeline]);
};
