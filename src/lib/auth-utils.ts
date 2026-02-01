export const getRedirectUrl = () => {
    let url =
        import.meta.env.VITE_SITE_URL ?? // Set this in Vercel env
        import.meta.env.VITE_VERCEL_URL ?? // Automatically set by Vercel
        window.location.origin;

    // Make sure to include `https://` when not localhost
    url = url.includes('http') ? url : `https://${url}`;
    // Run through a slash-remover just in case
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;

    return `${url}/dashboard`;
};
