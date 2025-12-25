
import React, { useState, useEffect } from 'react';
import { Post, View, User } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AuthModal from './components/AuthModal';
import { apiService } from './services/apiService';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of AI Content Generation',
    excerpt: 'Explore how large language models are transforming the digital publishing landscape...',
    content: `# The Future of AI Content Generation\n\nAI is fundamental shift...`,
    author: 'Lumina Editorial',
    authorId: 'admin_1',
    date: 'Oct 24, 2023',
    coverImage: 'https://picsum.photos/1200/600?random=1',
    tags: ['AI', 'Tech', 'Future'],
    readTime: '5 min',
    status: 'published'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const remotePosts = await apiService.getPosts();
        if (remotePosts.length > 0) {
          setPosts(remotePosts);
        } else {
          // Check local storage if remote empty
          const savedPosts = localStorage.getItem('lumina_posts');
          setPosts(savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS);
        }

        const savedUser = localStorage.getItem('lumina_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = async (newUser: User) => {
    const syncedUser = await apiService.syncUser(newUser);
    setUser(syncedUser);
    localStorage.setItem('lumina_user', JSON.stringify(syncedUser));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
    setView('home');
  };

  const handleCreatePost = async (newPost: Post) => {
    await apiService.createPost(newPost);
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('lumina_posts', JSON.stringify(updated));
    setView('home');
  };

  const handleDeletePost = async (id: string) => {
    const success = await apiService.deletePost(id);
    if (success) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      localStorage.setItem('lumina_posts', JSON.stringify(updated));
    }
  };

  const navigateToPost = (id: string) => {
    setSelectedPostId(id);
    setView('post');
    window.scrollTo(0, 0);
  };

  const currentPost = posts.find(p => p.id === selectedPostId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-bold tracking-widest animate-pulse">CONNECTING TO MYSQL...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-gray-100">
      <Header 
        view={view}
        setView={setView} 
        user={user} 
        onLogout={handleLogout} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'home' && (
          <Home posts={posts.filter(p => p.status === 'published')} onSelectPost={navigateToPost} />
        )}
        
        {view === 'post' && currentPost && (
          <PostDetail post={currentPost} />
        )}
        
        {view === 'create' && user && (
          <CreatePost user={user} onCreate={handleCreatePost} />
        )}
        
        {view === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            posts={posts.filter(p => p.authorId === user.id)} 
            onSelectPost={navigateToPost}
            onDeletePost={handleDeletePost}
          />
        )}

        {view === 'admin' && user?.role === 'ADMIN' && (
          <AdminPanel 
            posts={posts} 
            onDeletePost={handleDeletePost}
            onSelectPost={navigateToPost}
          />
        )}
      </main>

      <Footer />

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;
