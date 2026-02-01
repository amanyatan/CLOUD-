export const getRedirectUrl = () => {
    // Simple, robust redirect to the dashboard relative to the current origin
    // This works for localhost and Vercel deployments without env var confusion
    return `${window.location.origin}/dashboard`;
};
