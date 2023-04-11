import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/dist/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger, SplitText);

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const RECIPROCAL_GR = 1 / GOLDEN_RATIO;
const DURATION = RECIPROCAL_GR;

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false,
});

gsap.defaults({
  ease: "power4.out",
  duration: DURATION,
});

export { MorphSVGPlugin, DURATION, gsap, ScrollTrigger, SplitText };
