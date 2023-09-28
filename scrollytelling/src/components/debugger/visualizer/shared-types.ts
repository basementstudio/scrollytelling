export type DataAttribute = {
  id: string;
  isScrollytellingTween: boolean;
} & (
  | { type: "root"; debug: boolean; label: string }
  | { type: "animation" | "rest"; rootId: string }
  | {
      type: "waypoint";
      rootId: string;
      label: string;
      _internalOnCall?: () => void;
      _internalOnReverseCall?: () => void;
    }
);

export type VisualizerItem = Omit<GSAPTween | GSAPTimeline, "data"> & {
  _start: number;
  _dur: number;
  data: DataAttribute;
};

export type VisualizerRoot = {
  id: string;
  debug: boolean;
  label: string;
  tween?: GSAPTimeline;
  children: VisualizerItem[];
};
