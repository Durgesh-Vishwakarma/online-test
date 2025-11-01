export interface Post {
  id: string;
  content: string;
  author_email: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}
