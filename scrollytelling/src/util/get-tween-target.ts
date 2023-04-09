export function getTweenTarget({
  ref,
  scopedQuerySelector,
  target,
}: {
  ref: React.RefObject<HTMLElement>;
  scopedQuerySelector: gsap.utils.SelectorFunc | undefined;
  target: gsap.TweenTarget | React.RefObject<HTMLElement> | undefined;
}) {
  if (target) {
    if (typeof target === "string" && scopedQuerySelector) {
      return scopedQuerySelector(target);
    } else if (typeof target === "object" && "current" in target) {
      return target.current;
    } else {
      return target;
    }
  } else {
    return ref.current;
  }
}

export type TweenTarget = ReturnType<typeof getTweenTarget>;
