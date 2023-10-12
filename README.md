# BSMNT Scrollytelling

BSMNT Scrollytelling is a library for creating Scrollytelling animations. It's powered by GSAP ScrollTrigger, but abstracts away some things to make it work better with React.

![Frame 7](https://user-images.githubusercontent.com/40034115/233121992-12eb2448-4f62-4cba-b9a3-c0d3e9233aa7.jpg)

---

### 👇 New documentation here! 👇

- 💡 [Core Concepts](/docs/core-concepts.md)
- 📕 [API Reference](/docs/api.md)

---

## Installation

To get started, we'll need the `@bsmnt/scrollytelling` package, as well as the required peer dependency: [GSAP](https://greensock.com/docs/).

```zsh
yarn add @bsmnt/scrollytelling gsap
```

## Why

At [basement](https://basement.studio/), we've built a bunch of websites that use scroll animations. Over the years, we faced some issues that required solutions that we copy-pased throughout different project. We decided to build a library to share how we build these with the world.

**Challenges we faced**

- Needed a deep understanding of how GSAP works with ScrollTrigger.
- Needed to be careful about running animations inside `useEffect` and then cleaning them up.
- Couldn’t think of scroll animations in terms of a `start` and an `end`, so it was hard to fire up animations at the exact scroll progress we needed to.

## What

We aimed at componentizing a way of building scroll animations that could:

- ✅ Provide sensible defaults for scroll animations, such as `scrub: true`, and `ease: 'linear'`.
- ✅ Take care of component mounting and unmounting.
- ✅ Create animations with absolute positioning defined by a `start` and an `end`, instead of a time-based `duration`.

As an added benefit, going "component-based" allowed us to:

- ✅ Improve compatibility with React Server Components: our components definitely `'use client'`, but not necessarily the parents or children of our components.
- ✅ Compose animations at every level of the tree, as it all works with React Context.

A simple example of how this works:

![117 (1)](https://user-images.githubusercontent.com/40034115/233122199-a201e5a0-20d0-4538-a681-a7e9d6f539bb.png)

## Exports

- `Root`: Creates timeline and scrollTrigger, provides React Context.
- `Animation`: Appends an animation to the timeline. Receives a `tween` prop that will control how the animation behaves.
- `Waypoint`: Runs a callback or tween at a specific point in the timeline. Can also receive a `label` prop, that will create a GSAP label at that position.
- `RegisterGsapPlugins`: Registers custom GSAP plugins, if you need them for a specific use case.
- `Parallax`: Helper to create a simple parallax.
- `ImageSequenceCanvas`: Helper to create a simple image sequence animation.
- `useScrollytelling`: Context consumer. Returns the `timeline`.
- `useScrollToLabel`: Scrolls to the label name you pass. Labels can be added with the `Waypoint` component.

## Demo

We did a small demo to showcase this library in action. This is the best place to see how the library works in a real world scenario. Check it out:

- Site URL: [https://scrollytelling.basement.studio/](https://scrollytelling.basement.studio/)
- Code: [https://github.com/basementstudio/scrollytelling/blob/main/website/README.md](https://github.com/basementstudio/scrollytelling/blob/main/website/README.md)

## Examples

- Simple tweening: [https://stackblitz.com/edit/react-ts-8rqm8k?file=App.tsx](https://stackblitz.com/edit/react-ts-8rqm8k?file=App.tsx)
- With Lenis Smooth Scroll: [https://stackblitz.com/edit/react-ts-uuwfed?file=App.tsx](https://stackblitz.com/edit/react-ts-uuwfed?file=App.tsx)
- Layered pinning: [https://stackblitz.com/edit/react-ts-4dtlww?file=App.tsx](https://stackblitz.com/edit/react-ts-4dtlww?file=App.tsx)
- Three.js Tube: [https://codesandbox.io/s/978cns?file=/src/App.js](https://codesandbox.io/s/978cns?file=/src/App.js)

## Troubleshooting

<details>
<summary>
<b>"My simple animation is not doing anything on scroll"</b>
</summary>

Please check your `start` and `end` values for your `Root` component. A typical issue comes when:

1. your animation _"starts when the start of the scroller hits the start of the viewport"_,
2. your animation _"ends when the bottom of the scroller hits the bottom of the viewport"_,
3. the element your `Root` wraps around is only `100vh` tall, so the animation's duration is 0.

To fix this, either add more height to the element your `Root` wraps, or tweak the `end` value to be something like `bottom start`, which would mean "when the bottom of the scroller hits the start of the viewport".

</details>

---

GSAP files are subject to GreenSock's standard license which can be found at [https://greensock.com/standard-license/](https://greensock.com/standard-license/)
