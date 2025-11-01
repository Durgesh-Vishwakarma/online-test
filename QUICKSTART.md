# 🚀 Quick Start - Get Running in 5 Minutes!

## Step 1: Supabase Setup (2 minutes)

1. Go to **https://supabase.com** → Sign in with GitHub
2. Click **"New Project"**

   - Name: `CommunityFeed`
   - Password: (any password)
   - Region: (closest to you)
   - Click **"Create new project"** (wait 2 min)

3. Once ready, click **Project Settings** (⚙️ icon) → **API**

   - Copy **Project URL**
   - Copy **anon public** key

4. Open `src/config/supabase.ts` and paste your values:

```typescript
const SUPABASE_URL = "https://xxxxx.supabase.co"; // ← paste here
const SUPABASE_ANON_KEY = "eyJhbGc..."; // ← paste here
```

## Step 2: Create Database (1 minute)

1. In Supabase, click **SQL Editor** → **New query**
2. Copy everything from `supabase_setup.sql` file
3. Paste and click **Run** (or Ctrl+Enter)
4. Should see: "Posts table created successfully!"

## Step 3: Disable Email Confirmation (30 seconds)

1. Go to **Authentication** → **Providers**
2. Click **Email** to expand
3. Turn **OFF** "Enable email confirmations"
4. Click **Save**

## Step 4: Run the App! (1 minute)

```bash
npm start
```

- Scan QR code with **Expo Go** app (download from App/Play Store)
- Or press `a` for Android emulator
- Or press `w` for web browser

## Step 5: Test It

1. **Sign Up**: test@example.com / password123
2. **Create Post**: Click "+ New Post"
3. **Pull to Refresh**: Drag down
4. **Close & Reopen**: See instant cache!

---

## Need Help?

**"Invalid API credentials"**
→ Double-check URL and key in `src/config/supabase.ts`

**"Table posts does not exist"**
→ Run the SQL setup again

**"User already registered"**
→ Use different email or delete user in Supabase Auth panel

---

## Ready to Submit?

✅ Push to GitHub:

```bash
git remote add origin https://github.com/yourusername/community-feed.git
git branch -M main
git push -u origin main
```

✅ Record demo video (1-2 min):

- Show sign up/in
- Create post (watch it appear instantly!)
- Pull to refresh
- Scroll to load more
- Close & reopen app (shows cache)

✅ Upload to Google Drive:

- Video + Resume
- Share link → "Anyone with the link"

That's it! 🎉
