export interface Post {
  id: number;
  title: string;
  description: string;
  steps: string;
  for_who: string;
  why_it_works: string;
  where_it_works: string;
  votes: number;
  created_at: string;
  user_id: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
}