interface DebugOptions {
  debug?:
    | false
    | {
        label?: string;
        visualizer?: boolean;
        markers?: boolean;
      };
}

interface DebugValues {
  debugMarkers: boolean;
  debugVisualizer: boolean;
  debugLabel: string | null;
}

const useDebugOptions = (debug: DebugOptions["debug"]): DebugValues => {
  const debugMarkers =
    typeof debug === "object" && debug ? debug.markers ?? false : false;
  const debugVisualizer =
    typeof debug === "object" && debug ? debug.visualizer ?? true : true;
  const debugLabel =
    typeof debug === "object" && debug ? debug.label ?? null : null;

  return { debugMarkers, debugVisualizer, debugLabel };
};

export default useDebugOptions;
