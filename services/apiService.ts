
import { Post, User } from '../types';

const API_BASE_URL = 'https://api.lumina-blog-demo.com'; 

/**
 * Log simulated SQL queries for the Admin Monitor
 */
const logSQL = (query: string) => {
  const logs = JSON.parse(localStorage.getItem('sql_logs') || '[]');
  const entry = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    query
  };
  localStorage.setItem('sql_logs', JSON.stringify([entry, ...logs].slice(0, 20)));
  window.dispatchEvent(new Event('sql_updated'));
};

export const apiService = {
  async pingDatabase(): Promise<boolean> {
    logSQL('SELECT 1 FROM information_schema.tables LIMIT 1;');
    // Simulate latency
    await new Promise(r => setTimeout(r, 400));
    return true; 
  },

  async getPosts(): Promise<Post[]> {
    logSQL('SELECT p.*, u.name as author FROM posts p JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC;');
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      const saved = localStorage.getItem('lumina_posts');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async createPost(post: Post): Promise<Post> {
    logSQL(`INSERT INTO posts (id, author_id, title, content, status) VALUES ('${post.id}', '${post.authorId}', '${post.title.replace(/'/g, "''")}', ...);`);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      return await response.json();
    } catch (error) {
      return post;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    logSQL(`DELETE FROM posts WHERE id = '${id}';`);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch (error) {
      return true;
    }
  },

  async syncUser(user: User): Promise<User> {
    logSQL(`INSERT INTO users (id, name, email, role) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.role}') ON DUPLICATE KEY UPDATE name = VALUES(name);`);
    try {
      const response = await fetch(`${API_BASE_URL}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      return user;
    }
  }
};
