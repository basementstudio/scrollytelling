import clsx from 'clsx';
import { gsap } from 'gsap';
import * as React from 'react';
import mergeRefs from 'react-merge-refs';

import { useMouseTracker } from '../../hooks/use-mouse-tracker';

import s from './dotted-container.module.scss';

export const DottedDiv = React.forwardRef<
	HTMLDivElement,
	{ children?: React.ReactNode } & JSX.IntrinsicElements['div']
>(({ children, className, ...rest }, ref) => {
	const { elementRef } = useMouseTracker({
		onChange: ({ x, y, isHovering, first }) => {
			const maskElement = elementRef.current?.querySelector(`.${s.mask}`);
			if (!maskElement) return;
			gsap.set(maskElement, { opacity: 1 });

			const webkitMaskImage = `radial-gradient(circle var(--radius) at ${x}px ${y}px, var(--bg) 40%,transparent)`;

			if (first) {
				gsap.set(maskElement, { webkitMaskImage });
				gsap.to(maskElement, {
					'--radius': isHovering ? '200px' : '0px',
					duration: 0.4,
				});
			} else {
				gsap.to(maskElement, {
					'--radius': isHovering ? '200px' : '0px',
					webkitMaskImage,
					duration: 0.4,
				});
			}
		},
		windowAsProxy: true,
		enableOnlyWhenHovering: true,
	});

	return (
		<div {...rest} className={clsx(s.div, className)} ref={mergeRefs([ref, elementRef])}>
			<div className={s.mask} />
			{children}
		</div>
	);
});
