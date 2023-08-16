import * as React from "react";
import { Emitter } from "../util/emmiter";

export type ScrollytellingContextType = {
  timeline: GSAPTimeline | undefined;
  rootRef: React.RefObject<HTMLDivElement>;
  events: Emitter;
};

export const ScrollytellingContext = React.createContext<
  undefined | ScrollytellingContextType
>(undefined);

export const useScrollytelling = () => {
  const scrollytelling = React.useContext(ScrollytellingContext);
  if (!scrollytelling) {
    throw new Error(
      "useScrollytelling must be used within a Scrollytelling.Root"
    );
  }
  return scrollytelling;
};

export type ScrollytellingDispatchersContextType = {
  getTimelineSpace: (params: { start: number; end: number }) => {
    duration: number;
    position: number;
    cleanup: () => void;
  } | null;
  scopedQuerySelector: gsap.utils.SelectorFunc | undefined;
};

export const ScrollytellingDispatchersContext = React.createContext<
  undefined | ScrollytellingDispatchersContextType
>(undefined);

export const useDispatcher = () => {
  const dispatcher = React.useContext(ScrollytellingDispatchersContext);
  if (!dispatcher) {
    throw new Error("useDispatcher must be used within a ScrollytellingRoot");
  }
  return dispatcher;
};
