import s from "./visualizer.module.scss";

export const highlight = (target: SVGElement | HTMLElement) => {
  // Create a div element that has the same dimensions and position as the target
  const highlight = document.createElement("div");

  highlight.style.position = "fixed";
  const bounds = target.getBoundingClientRect();
  highlight.style.top = `${bounds.top}px`;
  highlight.style.left = `${bounds.left}px`;
  highlight.style.width = `${bounds.width}px`;
  highlight.style.height = `${bounds.height}px`;

  highlight.classList.add(s["highlight"] as string);

  // Append to body.
  document.body.appendChild(highlight);

  // Clear instance
  return () => {
    document.body.removeChild(highlight);
  };
};

export const colors = [
  ["#F87171", "#991B1B"],
  ["#FACC15", "#854D0E"],
  ["#4ADE80", "#166534"],
  ["#2DD4BF", "#115E59"],
  ["#38BDF8", "#075985"],
  ["#818CF8", "#3730A3"],
  ["#C084FC", "#6B21A8"],
  ["#E879F9", "#86198F"],
  ["rgba(244, 114, 182, 0.40)", "#9D174D"],
];