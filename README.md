# Community Feed - Technical Assessment

A React Native mobile application built with Expo, featuring user authentication, a community feed with posts, and optimized performance with caching.

## Features

✅ **Authentication**
- Email/password authentication using Supabase
- Sign up and sign in functionality
- Persistent sessions with AsyncStorage
- Automatic navigation to Feed on successful login

✅ **Feed Screen**
- Display posts from Supabase in a FlatList
- Pull-to-refresh functionality
- Infinite scrolling with pagination
- Create new posts with modal interface
- Optimistic UI updates when posting

✅ **Data Caching**
- TanStack Query (React Query) for data caching
- Posts cached for 30 seconds (staleTime)
- Instant load on app reopen (gcTime: 5 minutes)
- Background refetching

✅ **FlatList Optimization**
- Pagination (10 posts per page)
- `removeClippedSubviews` for memory optimization
- `maxToRenderPerBatch` and `windowSize` configured
- Loading and error states handled
- Pull-to-refresh with loading indicator

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Authentication & Database**: Supabase
- **State Management & Caching**: TanStack Query (React Query)
- **Navigation**: React Navigation
- **Local Storage**: AsyncStorage

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)
- Supabase account

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd CommunityFeed
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Update `src/config/supabase.ts`:
\`\`\`typescript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
\`\`\`

### 4. Create Database Table

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
\`\`\`

### 5. Run the App

\`\`\`bash
npm start
\`\`\`

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app on your phone

## Project Structure

\`\`\`
CommunityFeed/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── screens/
│   │   ├── AuthScreen.tsx       # Login/Signup screen
│   │   └── FeedScreen.tsx       # Main feed with posts
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── App.tsx                      # Root component with QueryClient
└── package.json
\`\`\`

## Key Implementation Details

### Caching Strategy
- Uses TanStack Query for intelligent caching
- Posts are cached for 30 seconds before refetching
- Cache persists for 5 minutes after last use
- Optimistic updates provide instant feedback

### FlatList Optimization
\`\`\`typescript
<FlatList
  removeClippedSubviews={true}    // Remove offscreen items
  maxToRenderPerBatch={10}        // Batch rendering
  windowSize={10}                 // Viewport multiplier
  initialNumToRender={10}         // Initial items
  onEndReached={loadMore}         // Infinite scroll
/>
\`\`\`

### Optimistic Updates
When creating a post:
1. Immediately show post in UI
2. Send request to Supabase
3. If successful, update with real data
4. If failed, rollback and show error

## Testing

1. **Sign Up**: Create a new account
2. **Sign In**: Log in with created credentials
3. **View Feed**: See existing posts
4. **Pull to Refresh**: Drag down to refresh
5. **Create Post**: Click "New Post" button
6. **Infinite Scroll**: Scroll to bottom to load more
7. **Close & Reopen**: Posts load instantly from cache

## Performance Features

- ⚡ Optimistic UI updates
- 💾 Intelligent data caching
- 🔄 Background refetching
- 📱 FlatList optimizations
- 🎯 Pagination for large datasets

## Built By

Created as part of Technical Assessment Round 1 for Zonecheck.

## License

MIT
