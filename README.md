# BSMNT Scrollytelling

BSMNT Scrollytelling is a library for creating Scrollytelling animations. It's powered by GSAP ScrollTrigger, but abstracts away some things to make it work better with React.

## Installation

To get started, we'll need the `@bsmnt/scrollytelling` package, as well as the required peer dependency: [GSAP](https://greensock.com/docs/).

```zsh
yarn add @bsmnt/scrollytelling gsap
```

## Why

At [basement](https://basement.studio/), we've built a bunch of websites that use scroll animations. Over the years, we faced some issues that required solutions that we copy-pased throughout different project. While preparing his talk for the React Miami Conference, [JB](https://twitter.com/julianbenegas8) decided to build a library to share how we build these with the world.

**Challenges we faced**

- Needed a deep understanding of how GSAP works.
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

```tsx
import * as Scrollytelling from '@bsmnt/scrollytelling';

const Component = () => {
  return (
    <Scrollytelling.Root>
      <div className="container">
        <Scrollytelling.Animation
          tween={{ start: 0, end: 30, from: { opacity: 0, scale: 0.9 } }}
        >
          <h1 className="title">Hello Miami</h1>
        </Scrollytelling.Animation>
        <Scrollytelling.Animation
          tween={[
            { start: 30, end: 80, to: { rotate: 360 } },
            { start: 80, end: 100, to: { y: 100 } },
          ]}
        >
          <div className="box" />
        </Scrollytelling.Animation>
      </div>
    </Scrollytelling.Root>
  );
};

```

## Exports

- `Root`: Creates timeline and scrollTrigger, provides React Context.
- `Animation`: Appends an animation to the timeline. Receives a `tween` prop that will control how the animation behaves.
- `Waypoint`: Runs a callback or tween at a specific point in the timeline.
- `RegisterGsapPlugins`: Registers custom GSAP plugins, if you need them for a specific use case.
- `Parallax`: Helper to create a simple parallax.
- `ImageSequenceCanvas`: Helper to create a simple image sequence animation.
- `useScrollytelling`: Context consumer.
- `useScrollToLabel`: Scrolls to the label you pass.
