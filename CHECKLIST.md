# Pre-Submission Checklist

## ✅ Required Features

### Authentication

- [ ] Supabase email/password authentication implemented
- [ ] Sign up functionality working
- [ ] Sign in functionality working
- [ ] Successfully navigates to Feed screen after login
- [ ] Session persists (stays logged in after app restart)

### Feed Screen

- [ ] Posts fetched from Supabase
- [ ] Posts displayed using FlatList
- [ ] Pull-to-refresh implemented and working
- [ ] Create new post feature implemented
- [ ] Optimistic UI update when posting (post appears immediately)

### Data Caching

- [ ] TanStack Query (React Query) integrated
- [ ] Posts cache instantly on app reopen
- [ ] No network wait when reopening app (cached data shows first)
- [ ] Background refetch after showing cached data

### FlatList Optimization

- [ ] Pagination implemented (loads more posts when scrolling)
- [ ] Infinite scrolling working
- [ ] Loading state shown while fetching
- [ ] Error state handled with retry button
- [ ] Performance optimizations applied (removeClippedSubviews, etc.)

## 📦 Code Quality

- [ ] TypeScript used throughout
- [ ] No console errors or warnings
- [ ] Proper error handling implemented
- [ ] Clean code structure with separate folders
- [ ] Comments added where necessary

## 📝 Documentation

- [ ] README.md created with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Features list
  - [ ] Tech stack
  - [ ] How to run
- [ ] SETUP_GUIDE.md with detailed steps
- [ ] SQL setup file included
- [ ] .env.example file provided

## 🔧 Configuration

- [ ] Supabase URL configured in `src/config/supabase.ts`
- [ ] Supabase anon key configured
- [ ] Database table `posts` created in Supabase
- [ ] Row Level Security policies set up
- [ ] Email authentication enabled in Supabase

## 🚀 Testing

- [ ] App runs without errors (`npm start` works)
- [ ] Can sign up new user
- [ ] Can sign in with existing user
- [ ] Can view posts
- [ ] Can create new post
- [ ] New post appears immediately (optimistic update)
- [ ] Pull to refresh works
- [ ] Scroll to load more works
- [ ] Close and reopen app - posts load instantly
- [ ] Logout works

## 📱 Demo Video

- [ ] Record 1-2 minute screen recording showing:
  - [ ] Sign up/Sign in
  - [ ] Viewing feed
  - [ ] Creating a post (show optimistic update)
  - [ ] Pull to refresh
  - [ ] Scrolling for more posts
  - [ ] Close and reopen app (show instant cache load)
- [ ] Upload to Google Drive
- [ ] Set sharing to "Anyone with the link"
- [ ] Test the link in incognito mode

## 📂 Git & GitHub

- [ ] Repository created on GitHub
- [ ] Code pushed to repository
- [ ] Multiple commits made (at least 3-4)
- [ ] Commit messages are descriptive
- [ ] Commits show natural progression
- [ ] Repository is public or shared with evaluators

## 📎 Submission Checklist

- [ ] GitHub repository link ready
- [ ] Demo video link ready (Google Drive)
- [ ] Resume uploaded to same Google Drive folder
- [ ] All links are accessible (test in incognito)
- [ ] Links are properly formatted and clickable

## 🎯 Bonus Points

- [ ] UI looks polished and professional
- [ ] Smooth animations
- [ ] Loading skeletons implemented
- [ ] Empty states handled gracefully
- [ ] Error messages are user-friendly
- [ ] Code is well-organized and commented
- [ ] Extra features added (edit, delete, like posts, etc.)

## ⏰ Time Management

- Start Time: ****\_\_****
- Current Time: ****\_\_****
- Time Remaining: ****\_\_****

Remember: You have 1.5 hours total. Prioritize completing all required features before adding extras!

## 🆘 Quick Troubleshooting

**App won't start?**

- Try: `npm install` then `npx expo start -c`

**Can't sign in?**

- Check Supabase credentials in `src/config/supabase.ts`
- Verify email confirmation is disabled in Supabase

**Posts not loading?**

- Verify SQL table was created
- Check RLS policies are set up
- Look at Supabase logs for errors

**Cache not working?**

- Check React Query is configured correctly
- Look for any console errors

Good luck! 🚀
