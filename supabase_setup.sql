-- Community Feed - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;

-- Create policies for posts table
-- Allow anyone to read posts (even unauthenticated users can view)
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert their own posts
CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for better performance on queries
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);

-- Optional: Add some sample data for testing
-- Uncomment and modify if needed
/*
INSERT INTO posts (content, author_email, user_id) VALUES
  ('Welcome to Community Feed! 🎉', 'test@example.com', auth.uid()),
  ('This is a sample post to test the feed.', 'test@example.com', auth.uid());
*/

-- Verify the setup
SELECT 
  'Posts table created successfully!' as message,
  COUNT(*) as total_posts 
FROM posts;
