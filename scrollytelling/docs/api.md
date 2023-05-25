# ⚙️ API

BSMNT Scrollytelling is a library for creating Scrollytelling animations. It's powered by GSAP ScrollTrigger, but abstracts away some things to make it work better with React.

## Components

### `<Pin>`
Pin component enables pinning an element in its initial position while the remaining content scrolls. It ensures that the pinned element stays fixed at its starting position within the active duration of Scrollytelling.

#### Render Props

```tsx
<Scrollytelling.Pin
  childHeight: string | number;
  pinSpacerHeight: string | number;
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
import * as Scrollytelling from '@bsmnt/scrollytelling';

export const HomePage = () => (
  <Scrollytelling.Root>
    <Scrollytelling.Pin childHeight={0} pinSpacerHeight={'100vh'} top={0}>
        <section className="section">
        <div className="wrapper">
            <h1>Layered pinning 1</h1>
        </div>
        </section>
    </Scrollytelling.Pin>
  </Scrollytelling.Root>
)
```

#### Example
https://stackblitz.com/edit/react-ts-wkxnja
