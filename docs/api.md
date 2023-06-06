# ⚙️ API

BSMNT Scrollytelling is a library for creating Scrollytelling animations. It's powered by GSAP ScrollTrigger, but abstracts away some things to make it work better with React.

## Components

### `<Parallax>`

Parallax component applies a [parallax effect](https://en.wikipedia.org/wiki/Parallax) to its children using GSAP animations.

#### Render Props

```tsx
<Scrollytelling.Parallax
  tween: {
    start: number; // The time where the movement starts relative to the scroll progress
    end: number; // The time where the movement ends relative to the scroll progress
    target?: TweenTarget; // Optional: The target element or elements to apply the animation to.
    movementX?: UnitValue; // Optional: The amount of movement on the X-axis.
    movementY?: UnitValue; // Optional: The amount of movement on the Y-axis.
  }
>
  {children}
</Scrollytelling.Parallax>
```

> **Keep in mind that either `movementX` or `movementY` are required for the Parallax to work**


#### Usage

```jsx
import * as Scrollytelling from "@bsmnt/scrollytelling";

export const HomePage = () => (
  <Scrollytelling.Root>
    <Scrollytelling.Parallax
      tween={{
        start: 0,
        end: 100,
        movementY: { value: 40, unit: "px" },
      }}
    >
      <p>This text will move on scroll</p>
    </Scrollytelling.Parallax>
  </Scrollytelling.Root>
);
```

#### Example

https://stackblitz.com/edit/react-ts-wkxnja

---

### `<Pin>`

Pin component enables pinning an element in its initial position while the remaining content scrolls. It ensures that the pinned element stays fixed at its starting position within the active duration of Scrollytelling.

#### Render Props

```tsx
<Scrollytelling.Pin
  childHeight: string | number; // The height of the pinned element in the pin.
  pinSpacerHeight: string | number; // The height of the spacer reserved for the pinned element in the pin.
  childClassName?: string; // Optional: Custom CSS class name for the child element
  children?: React.ReactNode; // Optional: Content to be rendered inside the pinned element
  pinSpacerClassName?: string; // Optional: Custom CSS class name for the pin spacer element
  top?: string | number; // Optional: Custom top position for the pinned element
>
  {children}
</Scrollytelling.Pin>
```

#### Usage

```jsx
import * as Scrollytelling from "@bsmnt/scrollytelling";

export const HomePage = () => (
  <Scrollytelling.Root>
    <Scrollytelling.Pin childHeight={0} pinSpacerHeight={"100vh"} top={0}>
      <section className="section">
        <div className="wrapper">
          <h1>Layered pinning 1</h1>
        </div>
      </section>
    </Scrollytelling.Pin>
  </Scrollytelling.Root>
);
```

#### Example

https://stackblitz.com/edit/react-ts-kittrj
