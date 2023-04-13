import clsx from 'clsx';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

import s from './link.module.scss';

export type LinkProps = {
	children?: React.ReactNode;
	unstyled?: boolean;
} & JSX.IntrinsicElements['a'] &
	Omit<NextLinkProps, 'as' | 'passHref'>;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, className, ...restProps }, ref) => {
	const { href, target, rel, unstyled = false, ...aProps } = restProps;

	return (
		<NextLink
			href={href}
			target={target ?? '_blank'}
			rel={rel ?? 'noopener'}
			{...aProps}
			ref={ref}
			className={clsx(s['link'], s['link--rg'], { [s['unstyled'] as string]: unstyled }, className)}
		>
			{unstyled ? <>{children}</> : <span>{children}</span>}
		</NextLink>
	);
});

export default Link;
