import { gsap } from "gsap";

// ---- Utils
export type DataOrDataArray<T> = T | Array<T>;
export type UnitValue<Unit = string> = { value: number; unit: Unit };
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ---- Tween Specifics
export type FromToOptions =
  | { to: gsap.TweenVars; from?: never; fromTo?: never }
  | { from: gsap.TweenVars; to?: never; fromTo?: never }
  | { fromTo: [gsap.TweenVars, gsap.TweenVars]; to?: never; from?: never };

export type StartEndOptions = {
  start: number;
  end: number;
};

type TweenBaseDef = StartEndOptions & FromToOptions;

export type TweenTarget = gsap.TweenTarget | React.RefObject<HTMLElement>;

export type TweenWithTargetDef = TweenBaseDef & {
  target: TweenTarget;
};

// Although is the same type, this naming convention is necessary in order to differentiate it from the TweenWithTargetDef
export type TweenWithChildrenDef = TweenBaseDef;

// ---- Component Props
export interface AnimationProps {
  tween: DataOrDataArray<TweenBaseDef | TweenWithTargetDef>;
  children?: React.ReactNode;
  disabled?: boolean;
}

export type WaypointBaseDef = {
  at: number;
  onCall?: () => void;
  onReverseCall?: () => void;
  label?: string;
  disabled?: boolean;
};

export type StaggerBaseDef = {
  overlap?: number;
  disabled?: boolean;
};

// FIXME: This name is not clear, why SimpleTween doesn't consume TweenBaseDef?
export type SimpleTween = FromToOptions & {
  duration: number;
  forwards?: boolean;
};

// ---- Aliases
export type TweenVars = gsap.TweenVars;

export type Plugin = Parameters<typeof gsap.registerPlugin>[number];
