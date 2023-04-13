import Image from 'next/image';
import bsmtTeamImg from '../../../../public/footer/basement-team-footer.jpg';
import QRImg from '../../../../public/footer/QR.svg';

import s from './footer.module.scss';
import Link from '../../components/link';

export const Footer = () => {
	return (
		<footer className={s.footer}>
			<div className={s['pre-footer']}>
				<div>
					<p>Now we are talking! Say hello to our OSS brand new scrollytelling library</p>
					<div>fasfasfasfasf</div>
				</div>

				<Image className={s.QR} src={QRImg} alt="QR" />
			</div>

			<Image className={s['team-img']} src={bsmtTeamImg} alt="Basement Team" />
			<h2>BSMNT TEAM</h2>
			<div className={s.links}>
				<div>
					<span>social media</span>
					<ul>
						{socials.map((social, idx) => (
							<>
								{idx !== 0 && <span>&nbsp;—&nbsp;</span>}
								<li key={social.name}>
									<Link href={social.url}>{social.name}</Link>
								</li>
							</>
						))}
					</ul>
				</div>
				<div>
					<span>get in touch</span>
					<Link href="mailto:sayhi@basement.studio">sayhi@basement.studio</Link>
				</div>
				<div
					style={{
						alignItems: 'end',
					}}
				>
					<span>@basement.studio llc {new Date().getFullYear()}</span>
					<span>all rights reserved</span>
				</div>
			</div>
		</footer>
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
