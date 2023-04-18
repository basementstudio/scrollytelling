export const siteURL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL as string | URL
);
export const siteOrigin = siteURL.origin;
