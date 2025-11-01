# Quick Setup Guide

Follow these steps to get the Community Feed app running:

## Step 1: Install Dependencies

\`\`\`bash
cd CommunityFeed
npm install
\`\`\`

## Step 2: Setup Supabase

### 2.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (or "New Project" if you have an account)
3. Sign in with GitHub
4. Create a new organization (if first time)
5. Click "New Project"
6. Fill in:
   - **Name**: CommunityFeed
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
7. Click "Create new project" (takes ~2 minutes)

### 2.2 Get Your API Credentials

1. Once project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Project API keys** > **anon public** key (long string starting with "eyJ...")
4. Copy both values

### 2.3 Update Configuration

1. Open `src/config/supabase.ts`
2. Replace these lines:
   \`\`\`typescript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   \`\`\`
   With your actual values:
   \`\`\`typescript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOi...your-key-here';
   \`\`\`

### 2.4 Create Database Table

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire content from `supabase_setup.sql`
4. Paste it in the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Posts table created successfully!"

### 2.5 Enable Email Authentication (Important!)

1. Go to **Authentication** > **Providers** in Supabase
2. Find **Email** provider
3. Make sure it's **enabled** (toggle should be green)
4. Scroll down and **disable** "Confirm email" for testing:
   - Click on Email provider to expand settings
   - Turn OFF "Enable email confirmations"
   - Click Save
   - This allows instant sign up without email verification

## Step 3: Run the App

\`\`\`bash
npm start
\`\`\`

This will open Expo Dev Tools. Then:

- **For Android**: Press `a` or scan QR with Expo Go app
- **For iOS**: Press `i` (Mac only) or scan QR with Camera app
- **For Web**: Press `w`

## Step 4: Test the App

1. **Sign Up**:

   - Email: test@example.com
   - Password: password123
   - Click "Sign Up"

2. **Sign In**:

   - Use the same credentials
   - Should navigate to Feed screen

3. **Create Post**:

   - Click "+ New Post" button
   - Type something
   - Click "Post"
   - Should appear instantly (optimistic update)

4. **Test Caching**:

   - Create a few posts
   - Close the app completely
   - Reopen it
   - Posts should load instantly from cache

5. **Test Pagination**:
   - Create 15+ posts
   - Scroll to bottom
   - More posts should load automatically

## Troubleshooting

### "Invalid API credentials"

- Double-check SUPABASE_URL and SUPABASE_ANON_KEY in `src/config/supabase.ts`
- Make sure there are no extra spaces or quotes
- URL should start with https://
- Key should start with eyJ

### "Table posts does not exist"

- Run the SQL setup again in Supabase SQL Editor
- Check **Table Editor** to see if posts table exists

### "User already registered"

- Either use different email
- Or go to Supabase **Authentication** > **Users** and delete the test user

### App won't start

- Try: `npm install` again
- Clear cache: `npx expo start -c`
- Check Node version: `node -v` (should be 16+)

### Posts not loading

- Check Supabase project is running (not paused)
- Verify SQL policies were created
- Check browser console for errors

## Tips

- Keep Supabase dashboard open to see real-time data
- Use **Table Editor** to manually view/edit posts
- Check **Authentication** > **Users** to see registered users
- Monitor **Logs** for API errors

## Next Steps

Once everything works:

1. Test on physical device with Expo Go
2. Record demo video
3. Push to GitHub
4. Share repository link

Good luck! 🚀
