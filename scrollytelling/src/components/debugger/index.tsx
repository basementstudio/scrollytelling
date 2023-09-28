import { useEffect, useState } from "react";
import { Visualizer } from "./visualizer";
import { Portal } from "@radix-ui/react-portal";

// ---- Debugger

export default function Debugger() {
  const [mountInstance, setMountInstance] = useState(false);

  useEffect(() => {
    const w = window as {
      __scrollytelling_alreadyMountedDebuggerInstance?: boolean;
    };

    const alreadyMountedInstance =
      w.__scrollytelling_alreadyMountedDebuggerInstance;
    if (alreadyMountedInstance) return;
    setMountInstance(true);
    w.__scrollytelling_alreadyMountedDebuggerInstance = true;
  }, []);

  if (!mountInstance) return <></>;
  return (
    <Portal>
      <Visualizer />
    </Portal>
  );
}
