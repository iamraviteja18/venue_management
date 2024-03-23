export const getCookieDomain = () => {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
    ? 'localhost'
    : 'hydrogen.icu';
};
