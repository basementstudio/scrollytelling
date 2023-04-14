import * as React from 'react';

import { isApiSupported } from '../lib/utils';

export const useMedia = (mediaQuery: string, initialValue?: boolean) => {
	const [isVerified, setIsVerified] = React.useState<boolean | undefined>(initialValue);

	React.useEffect(() => {
		if (!isApiSupported('matchMedia')) {
			console.warn('matchMedia is not supported by your current browser');
			return;
		}
		const mediaQueryList = window.matchMedia(mediaQuery);
		const changeHandler = () => setIsVerified(!!mediaQueryList.matches);

		changeHandler();
		if (typeof mediaQueryList.addEventListener === 'function') {
			mediaQueryList.addEventListener('change', changeHandler);
			return () => {
				mediaQueryList.removeEventListener('change', changeHandler);
			};
		} else if (typeof mediaQueryList.addListener === 'function') {
			mediaQueryList.addListener(changeHandler);
			return () => {
				mediaQueryList.removeListener(changeHandler);
			};
		}
	}, [mediaQuery]);

	return isVerified;
};
