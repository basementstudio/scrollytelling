import * as React from 'react';
import useMeasure from 'react-use-measure';

export const useMouseTracker = (config?: {
	onChange?: (mousePosition: { x: number; y: number; isHovering: boolean; first: boolean }) => void;
	windowAsProxy?: boolean;
	enableOnlyWhenHovering?: boolean;
}) => {
	const elementRef = React.useRef<HTMLDivElement>(null);
	const [ref, bounds] = useMeasure({ scroll: true });

	ref(elementRef.current);

	const mousePositionRef = React.useRef({ x: 0, y: 0, isHovering: false });

	const [enableTracking, setEnableTracking] = React.useState(!config?.enableOnlyWhenHovering);

	// enable / disable tracking if enableOnlyWhenHovering === true
	React.useEffect(() => {
		if (!config?.enableOnlyWhenHovering) return;

		const element = elementRef.current;
		if (!element) return;

		function handlePointerEnter() {
			setEnableTracking(true);
		}

		function handlePointerLeave() {
			setEnableTracking(false);
		}

		element.addEventListener('pointerenter', handlePointerEnter, {
			passive: true,
		});
		element.addEventListener('pointerleave', handlePointerLeave, {
			passive: true,
		});
		return () => {
			element.removeEventListener('pointerenter', handlePointerEnter);
			element.removeEventListener('pointerleave', handlePointerLeave);
		};
	}, [config?.enableOnlyWhenHovering]);

	React.useEffect(() => {
		if (!enableTracking) return;

		const element = elementRef.current;
		if (!element) return;

		let first = true;

		const handleMouseMove = (e: { clientX: number; clientY: number; target: EventTarget | null }) => {
			const target = e.target;
			mousePositionRef.current = {
				x: e.clientX - bounds.left,
				y: e.clientY - bounds.top,
				isHovering: target instanceof HTMLElement && element.contains(target),
			};
			config?.onChange?.({ ...mousePositionRef.current, first });
			first = false;
		};

		if (config?.windowAsProxy) {
			window.addEventListener('mousemove', handleMouseMove, {
				passive: true,
			});
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
			};
		} else {
			element.addEventListener('pointermove', handleMouseMove, {
				passive: true,
			});
			return () => {
				element.removeEventListener('pointermove', handleMouseMove);
			};
		}
	}, [bounds.height, bounds.left, bounds.top, bounds.width, config, enableTracking]);

	return { elementRef, mousePositionRef };
};
