# Virtual Coding Platform

## Setup Instructions

1.  **Install Dependencies**:
    Run the following command in your terminal:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Confirm `.env` has your Supabase URL and Key.
    ```env
    VITE_SUPABASE_URL=https://vuhdmtlqcuogagdtqulg.supabase.co
    VITE_SUPABASE_ANON_KEY=...
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Features Implemented
- **Landing Page**: Modern, flat design with specific branding.
- **Authentication**: Login/Signup with Supabase (Email + Google).
- **Dashboard**: Project management interface.
- **Antigravity AI**: AI coding assistant interface.

## AI Configuration (Antigravity)
The Antigravity feature uses a Supabase Edge Function.
1. Deploy the function in `supabase/functions/antigravity-generate`.
   ```bash
   supabase functions deploy antigravity-generate
   ```
2. Set your Gemini API Key in Supabase Secrets:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_key_here
   ```

## Architecture
- **Frontend**: Vite + React + TypeScript + React Router
- **Styling**: Tailwind CSS
- **Deployment**: Docker + Nginx
