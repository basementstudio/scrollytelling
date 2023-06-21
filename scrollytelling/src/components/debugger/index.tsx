import * as React from "react";
import { useScrollytelling } from "../../context";

// ---- Debugger

export const Debugger = () => {
  const { timeline, rootRef } = useScrollytelling();
  const [progress, setProgress] = React.useState<{
    percentage: string;
    px: string;
  }>();

  React.useEffect(() => {
    if (!timeline || !rootRef.current) return;
    const handleUpdate = () => {
      const progress = timeline.progress();
      if (!timeline.scrollTrigger) return;

      const start = timeline.scrollTrigger.start;
      const end = timeline.scrollTrigger.end;
      const scroll = (end - start) * progress;
      setProgress({
        percentage: `${(progress * 100).toFixed(2)}%`,
        px: `${scroll.toFixed(0)}px`,
      });
    };

    timeline.eventCallback("onUpdate", handleUpdate);

    return () => {
      timeline.eventCallback("onUpdate", null);
    };
  }, [timeline, rootRef]);

  return (
    <div
      style={{
        width: "370px",
        padding: "24px",
        border: "1px solid black",
        fontSize: "12px",
        background: "#360202",
      }}
    >
      <pre>{JSON.stringify({ progress }, null, 2)}</pre>
    </div>
  );
};
