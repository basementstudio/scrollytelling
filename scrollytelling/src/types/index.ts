export type DataOrDataArray<T> = T | Array<T>;
export type UnitValue<Unit = string> = { value: number; unit: Unit };

export type TweenOp =
  | { to: gsap.TweenVars; from?: never; fromTo?: never }
  | { from: gsap.TweenVars; to?: never; fromTo?: never }
  | { fromTo: [gsap.TweenVars, gsap.TweenVars]; to?: never; from?: never };

export type Time = number; // do we need this?: | UnitValue<"vh" | "px" | "%" | "vw">;

export type TweenBaseDef = {
  start: Time;
  end: Time;
} & TweenOp;

export type TweenTarget = gsap.TweenTarget | React.RefObject<HTMLElement>;

export type TweenWithTargetDef = TweenBaseDef & {
  target: TweenTarget;
};

export type TweenWithChildrenDef = TweenBaseDef;

export interface AnimationProps {
  tween: DataOrDataArray<TweenWithChildrenDef | TweenWithTargetDef>;
  children?: React.ReactNode;
}

export type WaypointBaseDef = {
  at: number;
  onCall?: () => void;
  onReverseCall?: () => void;
  label?: string;
};

export type SimpleTween = TweenOp & { duration: number; forwards?: boolean };


export type TweenVars = gsap.TweenVars; 

export type Plugin = Parameters<typeof gsap.registerPlugin>[number];
