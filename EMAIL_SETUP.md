# Email Configuration Guide

## Issue: Email Verification Not Working

By default, Supabase requires email confirmation for new user registrations. If you're not receiving verification emails, you need to configure email settings in Supabase.

## Solution Options

### Option 1: Disable Email Confirmation (Development/Testing)

Add this to your environment variables:

```bash
EMAIL_CONFIRMATION_ENABLED=false
```

This will:
- Skip email verification
- Auto-confirm new user accounts
- Allow immediate login after registration

**Note:** Only use this for development/testing. For production, always enable email confirmation.

### Option 2: Use Supabase Built-in Email Service (Recommended)

Supabase provides a free built-in email service that works out of the box. No SMTP configuration needed.

**Steps to enable:**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers** > **Email**
3. Ensure "Enable Email provider" is turned ON
4. Under "Confirm email", ensure "Enable email confirmations" is turned ON
5. Click **Save**

**Configure Site URL:**

1. Go to **Project Settings** > **General**
2. Find "Site URL" section
3. Set it to your app URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
4. Click **Save**

**Configure Redirect URLs:**

1. In the same "Site URL" section, find "Redirect URLs"
2. Add your app URL with the verify-email path:
   - Development: `http://localhost:3000/verify-email`
   - Production: `https://yourdomain.com/verify-email`
3. Click **Save**

**Customize Email Template (Optional):**

1. Go to **Authentication** > **Email Templates**
2. Select "Confirm signup"
3. Customize the email subject and body if needed
4. Ensure the `{{ .ConfirmationURL }}` placeholder is included in the template
5. Click **Save**

### Option 3: Configure Custom SMTP (Advanced)

If you prefer to use your own SMTP server:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers** > **Email**
3. Scroll to "SMTP Settings"
4. Configure:
   - **SMTP Host**: Your SMTP server (e.g., smtp.gmail.com)
   - **SMTP Port**: 587 (TLS) or 465 (SSL)
   - **SMTP User**: Your email address
   - **SMTP Password**: Your email password or app-specific password
   - **Sender Email**: The email address to send from
   - **Sender Name**: Your app name (e.g., "Agro Invest")
5. Click **Save**

**Note for Gmail users:** Use an App-Specific Password instead of your regular password. Generate one at Google Account > Security > 2-Step Verification > App Passwords.

## Environment Variables

Add these to your `.env.local` file:

```bash
# App URL (required for email redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email confirmation (set to 'false' to disable for development, remove or set to 'true' for production)
# EMAIL_CONFIRMATION_ENABLED=false
```

**Important:** Remove or comment out `EMAIL_CONFIRMATION_ENABLED=false` to enable email verification with Supabase's built-in service.

## Testing Email Configuration

After configuring email:

1. Try registering a new account
2. Check your email inbox (and spam folder)
3. Click the verification link
4. Verify you can log in

## Troubleshooting

**Still not receiving emails?**
- Check Supabase logs in the dashboard
- Verify SMTP credentials are correct
- Ensure email provider allows third-party apps (use app-specific passwords for Gmail)
- Check firewall/security settings

**Want to skip email for development?**
Set `EMAIL_CONFIRMATION_ENABLED=false` in your environment variables.
