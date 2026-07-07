# Vercel Deployment Environment Variables

To deploy this application to Vercel, you must add the following environment variables in your Vercel project settings:

## Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://your-project.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in Supabase project settings → API

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Your Supabase service role key (admin access)
   - Found in Supabase project settings → API
   - ⚠️ Keep this secret and never expose it

4. **NEXT_PUBLIC_APP_URL**
   - Your deployed application URL
   - Example: `https://agro-invest.vercel.app`

## Optional Environment Variables

5. **EMAIL_CONFIRMATION_ENABLED**
   - Set to `false` to disable email confirmation (for development)
   - Default: `true`

## How to Add Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/romizdev1-2986s-projects/agro-invest/settings/environment-variables
2. Click "Add New"
3. Add each variable with its corresponding value
4. Select the appropriate environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. For service role key, you'll need project admin access
