import * as React from "react";
import { mergeRefs } from "./util/merge-refs";

/**
 * ImageSequenceCanvas
 */

type SupportTable = { supportsWebp: boolean; supportsAvif: boolean };

export type ImageSequenceCanvasController = {
  preload: (frameStart: number, frameEnd: number) => Promise<void>;
  draw: (frame: number) => Promise<void>;
  canvas: HTMLCanvasElement | null;
};

export type ImageSequenceCanvasProps = {
  getFrameSrc: (frame: number, supportTable: SupportTable) => string;
  controllerRef: React.ForwardedRef<ImageSequenceCanvasController>;
  ref?: React.ForwardedRef<HTMLCanvasElement>;
  // /**
  //  * Width and height define the drawing's quality
  //  */
  // width: number;
  // /**
  //  * Width and height define the drawing's quality
  //  */
  // height: number;
} & JSX.IntrinsicElements["canvas"];

export const ImageSequenceCanvas = React.forwardRef<
  HTMLCanvasElement,
  ImageSequenceCanvasProps
>(({ controllerRef, getFrameSrc, ...rest }, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasRectRef = React.useRef<DOMRect | null>(null);
  const supportTableRef = React.useRef<SupportTable>({
    supportsAvif: false,
    supportsWebp: false,
  });
  const supportTablePromiseRef = React.useRef<Promise<unknown> | null>(null);

  React.useEffect(() => {
    supportTablePromiseRef.current = Promise.all([
      webpIsSupported(),
      avifIsSupported(),
    ]).then(([supportsWebp, supportsAvif]) => {
      supportTableRef.current = { supportsWebp, supportsAvif };
    });
  }, []);

  React.useImperativeHandle(
    controllerRef,
    () => {
      return {
        preload: async (frameStart: number, frameEnd: number) => {
          await supportTablePromiseRef.current;
          const promises = [];
          for (let frame = frameStart; frame <= frameEnd; frame++) {
            const src = getFrameSrc(frame, supportTableRef.current);
            promises.push(loadImage(src));
          }
          await Promise.all(promises);
        },
        draw: async (frame: number) => {
          await supportTablePromiseRef.current;
          const src = getFrameSrc(frame, supportTableRef.current);
          const canvas = canvasRef.current;
          const context = canvas?.getContext("2d");
          if (!canvas || !context || !src || !canvasRectRef.current) return;
          const img = await loadImage(src);

          // Get the DPR and size of the canvas
          const dpr = window.devicePixelRatio || 1;

          // Set the "actual" size of the canvas
          canvas.width = canvasRectRef.current.width * dpr;
          canvas.height = canvasRectRef.current.height * dpr;

          // Scale the context to ensure correct drawing operations
          // context.scale(dpr, dpr);

          // thanks https://stackoverflow.com/a/31910088
          // @ts-ignore
          context.mozImageSmoothingEnabled = false;
          // @ts-ignore
          context.webkitImageSmoothingEnabled = false;
          // @ts-ignore
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);

          // const canvasWidth = canvas.width;
          // const canvasHeight = canvas.height;
          // const imgWidth = img.width;
          // const imgHeight = img.height;

          // const ratio = Math.min(
          //   canvasWidth / imgWidth,
          //   canvasHeight / imgHeight
          // );

          // const newWidth = imgWidth * ratio;
          // const newHeight = imgHeight * ratio;

          // const offsetX = (canvasWidth - newWidth) / 2;
          // const offsetY = (canvasHeight - newHeight) / 2;

          // context.clearRect(0, 0, canvas.width, canvas.height);
          // context.drawImage(
          //   img,
          //   0,
          //   0,
          //   imgWidth,
          //   imgHeight,
          //   offsetX,
          //   offsetY,
          //   newWidth,
          //   newHeight
          // );
        },
        get canvas() {
          return canvasRef.current;
        },
      };
    },
    [getFrameSrc]
  );

  // get canvas rect into a ref, update with a resize observer
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const c = entries[0];
      if (!c) return;
      canvasRectRef.current = c.contentRect;
      console.log("here.");
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <canvas {...rest} ref={mergeRefs([canvasRef, ref])} />
      {/* <Scrollytelling.Animation
        tween={{
          start: 0,
          end: 100,
          target: sequence,
          to: {
            frame: 202,
            snap: "frame",
            ease: "none",
            onUpdate: () => {
              console.log(sequence);
              ref.current?.draw(sequence.frame);
            },
          },
        }}
      /> */}
    </>
  );
});

export const useImageSequence = (firstFrame = 0) => {
  const controllerRef = React.useRef<ImageSequenceCanvasController>(null);
  const sequence = { frame: firstFrame };
  return { controllerRef, sequence };
};

ImageSequenceCanvas.displayName = "Scrollytelling.ImageSequenceCanvas";

// utils

const imagesLoadedCache = new Map<string, HTMLImageElement>();

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const imageFromCache = imagesLoadedCache.get(src);
    if (imageFromCache) {
      if (imageFromCache.complete) {
        resolve(imageFromCache);
      } else {
        imageFromCache.addEventListener("load", () => resolve(imageFromCache), {
          once: true,
        });
      }
    } else {
      const image = new Image();
      image.addEventListener("load", () => resolve(image), { once: true });
      image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      image.src = src;
      imagesLoadedCache.set(src, image);
    }
  });
}

async function webpIsSupported() {
  // If the browser doesn't has the method createImageBitmap, you can't display webp format
  if (!window.createImageBitmap) return false;

  // Base64 representation of a white point image
  const webpData =
    "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=";

  // Retrieve the Image in Blob Format
  const blob = await fetch(webpData).then((r) => r.blob());

  // If the createImageBitmap method succeeds, return true, otherwise false
  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
}

async function avifIsSupported() {
  // If the browser doesn't has the method createImageBitmap, you can't display avif format
  if (!window.createImageBitmap) return false;

  // Base64 representation of a white point image
  const avifData =
    "data:image/avif;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=";

  // Retrieve the Image in Blob Format
  const blob = await fetch(avifData).then((r) => r.blob());

  // If the createImageBitmap method succeeds, return true, otherwise false
  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
}
