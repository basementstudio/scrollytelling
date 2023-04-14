'use client';

import Image from 'next/image';
import bsmtTeamImg from '../../../../public/footer/basement-team-footer.jpg';
import * as Scrollytelling from '@bsmnt/scrollytelling';
import QRImg from '../../../../public/footer/QR.svg';

import s from './footer.module.scss';
import Link from '../../components/link';
import { DottedDiv } from '../../components/dotted-container';
import basementTeamSVG from '../../../../public/footer/basement-team.svg';
import { useMedia } from '../../../hooks/use-media';
import { toVw } from '../../../lib/utils';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export const Footer = () => {
	const isDesktopSm = useMedia('(min-width: 1024px)');

	return (
		<Scrollytelling.Root start="top bottom" end="bottom bottom">
			<footer className={s.footer}>
				<PreFooter />
				<div className={s['imgs-container']}>
					<Image className={s['team-img']} src={bsmtTeamImg} alt="Basement Team" />
					<div className={s['QR-container']}>
						<Scrollytelling.Animation
							tween={{
								start: 60,
								end: 100,
								from: {
									y: '-120%',
									position: 'absolute',
									right: isDesktopSm ? '8vw' : toVw(20),
									scale: 0.6,
								},
							}}
						>
							<Image className={s.QR} src={QRImg} alt="QR" />
						</Scrollytelling.Animation>
					</div>
				</div>
				<Image className={s['footer-heading-text']} src={basementTeamSVG} alt="basement team" />
				<div className={s.links}>
					<div>
						<span>social media</span>
						<ul>
							{socials.map((social, idx) => (
								<li key={idx}>
									{idx !== 0 && <span>&nbsp;—&nbsp;</span>}
									<Link href={social.url}>{social.name}</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<span>get in touch</span>
						<Link href="mailto:sayhi@basement.studio">sayhi@basement.studio</Link>
					</div>
					<div>
						<span>@basement.studio llc {new Date().getFullYear()}</span>
						<span>all rights reserved</span>
					</div>
				</div>
			</footer>
		</Scrollytelling.Root>
	);
};

const PreFooter = () => {
	return (
		<div className={s['pre-footer']}>
			<div className={s['left-content']}>
				<p>Now we are talking! Say hello to our OSS brand new scrollytelling library</p>
				<Terminal />
				<Image className={s['QR-mobile']} src={QRImg} alt="QR" />
			</div>
		</div>
	);
};

const Terminal = () => {
	const [isCopied, setIsCopied] = useState(false);

	const contentRef = useRef<HTMLParagraphElement>(null);

	const copyTextContent = () => {
		if (contentRef.current) {
			const text = contentRef.current.textContent;
			if (text) {
				navigator.clipboard.writeText(text);
				setIsCopied(true);
			}
		}
	};

	useEffect(() => {
		if (!isCopied) return;

		const timeId = setTimeout(() => {
			setIsCopied(false);
		}, 2000);

		return () => {
			clearTimeout(timeId);
		};
	}, [isCopied]);

	return (
		<div className={s.terminal}>
			<div className={s['upper-bar']}>
				<span className={s.dots}>
					{[1, 2, 3].map((_, idx) => (
						<span key={idx} className={s.circle} />
					))}
				</span>
				<span className={s['terminal-title']}>terminal</span>
			</div>
			<DottedDiv className={s.content}>
				<p ref={contentRef}>yarn add @bsmnt/scrollytelling</p>
				<button className={s['copy-button']} onClick={copyTextContent}>
					<CopyIconSVG />
				</button>
			</DottedDiv>
			<CopiedNotification className={clsx(isCopied && s['text-copied-notif--visible'])} />
		</div>
	);
};

const socials = [
	{
		name: 'twitter',
		url: 'https://twitter.com/bsmnt',
	},
	{
		name: 'instagram',
		url: 'https://www.instagram.com/bsmnt/',
	},
	{
		name: 'github',
		url: 'https://github.com/basementstudio',
	},
	{
		name: 'dribbble',
		url: 'https://dribbble.com/bsmnt',
	},
];

const CopiedNotification = ({ className }: { className?: string }) => {
	return (
		<div className={clsx(s['text-copied-notif'], className)}>
			<p>Copied!</p>
		</div>
	);
};

const CopyIconSVG = ({ className }: { className?: string }) => {
	return (
		<svg
			className={className ?? ''}
			width="33"
			height="33"
			viewBox="0 0 33 33"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.25592 20.7437C2.25592 22.529 3.70318 23.9764 5.48849 23.9764H8.72106V21.8213H5.48849C4.89339 21.8213 4.41097 21.3388 4.41097 20.7437V5.65838C4.41097 5.06329 4.89339 4.58086 5.48849 4.58086H20.5738C21.1689 4.58086 21.6513 5.06329 21.6513 5.65838V8.89086H11.9536C10.1683 8.89086 8.72106 10.3381 8.72106 12.1234V27.2087C8.72106 28.9939 10.1683 30.4413 11.9536 30.4413H27.0389C28.8242 30.4413 30.2715 28.9939 30.2715 27.2087V12.1234C30.2715 10.3381 28.8242 8.89086 27.0389 8.89086H23.8064V5.65838C23.8064 3.87308 22.3591 2.42581 20.5738 2.42581H5.48849C3.70318 2.42581 2.25592 3.87308 2.25592 5.65838V20.7437ZM10.8761 12.1234C10.8761 11.5283 11.3585 11.0459 11.9536 11.0459H27.0389C27.634 11.0459 28.1165 11.5283 28.1165 12.1234V27.2087C28.1165 27.8039 27.634 28.2862 27.0389 28.2862H11.9536C11.3585 28.2862 10.8761 27.8039 10.8761 27.2087V12.1234Z"
				fill="#EFEFEF"
			/>
		</svg>
	);
};
