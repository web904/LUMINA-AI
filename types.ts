
export type UserRole = 'ADMIN' | 'USER';
export type AuthProvider = 'GOOGLE' | 'MICROSOFT' | 'FACEBOOK' | 'PHONE';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  provider: AuthProvider;
  bio?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
  coverImage: string;
  tags: string[];
  readTime: string;
  status: 'published' | 'draft';
}

export type View = 'home' | 'post' | 'create' | 'dashboard' | 'admin';
