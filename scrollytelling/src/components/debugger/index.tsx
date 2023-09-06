import { Visualizer } from "./visualizer";
import { Portal } from "@radix-ui/react-portal";

// ---- Debugger

export default function Debugger() {
  return (
    <Portal>
      <Visualizer />
    </Portal>
  );
}
