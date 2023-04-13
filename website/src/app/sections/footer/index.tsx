import Image from 'next/image';
import bsmtTeamImg from '../../../../public/footer/basement-team-footer.jpg';
import * as Scrollytelling from '@bsmnt/scrollytelling';
import QRImg from '../../../../public/footer/QR.svg';

import s from './footer.module.scss';
import Link from '../../components/link';
import { DottedDiv } from '../../components/dotted-container';
import basementTeamSVG from '../../../../public/footer/basement-team.svg';
import { toVw } from '../../../lib/utils';

export const Footer = () => {
	return (
		<Scrollytelling.Root start="top bottom" end="bottom bottom">
			<footer className={s.footer}>
				<div className={s['pre-footer']}>
					<div className={s['left-content']}>
						<p>Now we are talking! Say hello to our OSS brand new scrollytelling library</p>

						<div className={s.terminal}>
							<div className={s['upper-bar']}>
								<span className={s.dots}>
									{[1, 2, 3].map((_, idx) => (
										<span key={idx} className={s.circle} />
									))}
								</span>
								<span>terminal</span>
							</div>
							<DottedDiv className={s.content}>
								<p>yarn add @bsmnt/scrollytelling</p>
							</DottedDiv>
						</div>
					</div>
				</div>
				<div className={s['imgs-container']}>
					<Image className={s['team-img']} src={bsmtTeamImg} alt="Basement Team" />
					<Scrollytelling.Animation
						tween={{
							start: 60,
							end: 100,
							from: {
								y: toVw(-800),
								x: toVw(-100),
								scale: 0.7,
							},
						}}
					>
						<Image className={s.QR} src={QRImg} alt="QR" />
					</Scrollytelling.Animation>
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
