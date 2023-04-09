"use client";
import { useScrollToLabel } from "@bsmnt/scrollytelling";

export const ScrollToWaypointTest = ({ label }: { label: string }) => {
  const scrollToLabel = useScrollToLabel(label, { behavior: "smooth" });
  return (
    <button type="button" onClick={scrollToLabel} className="cursor-pointer">
      Scroll to {label}
    </button>
  );
};
