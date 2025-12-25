
import React, { useState } from 'react';
import { Post } from '../types';
import { chatWithPost } from '../services/geminiService';

interface PostDetailProps {
  post: Post;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatMessage('');
    setIsTyping(true);

    try {
      const response = await chatWithPost(post.content, userText);
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I had trouble thinking about that." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Image */}
      <img 
        src={post.coverImage} 
        alt={post.title} 
        className="w-full aspect-[21/9] object-cover rounded-3xl mb-12 shadow-2xl border border-white/5"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-2 space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-400 border-b border-white/10 pb-8">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center font-bold text-white">
                {post.author[0]}
              </div>
              <div>
                <p className="font-bold text-white">{post.author}</p>
                <p className="text-sm">{post.date} &bull; {post.readTime} Read</p>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-blue max-w-none text-gray-300 leading-relaxed text-lg">
            {/* Very simple MD rendering for this demo */}
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-white">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-white">{line.slice(3)}</h2>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="mb-4">{line}</p>;
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-12 border-t border-white/5">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 glass rounded-full text-xs font-semibold text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* AI Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="glass p-6 rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-900/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                Ask Lumina AI
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Have questions about this article? Ask our AI assistant for clarity or related facts.
              </p>

              <div className="h-[300px] overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                {chatHistory.length === 0 && (
                  <p className="text-xs text-gray-600 italic text-center mt-12">No messages yet. Ask me anything!</p>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-1 items-center px-4 py-2 bg-gray-800 w-fit rounded-2xl rounded-tl-none">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1.5 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.1.03L24.24,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,80.19A15.9,15.9,0,0,0,157.6,243h.52a16,16,0,0,0,14.51-11.23l58.64-187.31A16,16,0,0,0,227.32,28.68ZM158.1,227,116.79,146.8,184,79.59a8,8,0,0,0-11.31-11.31L105.48,135.59,25.28,94.27l187.31-58.64Z"></path></svg>
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold text-sm mb-2 text-indigo-400">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-4">Get the latest AI-generated insights delivered to your inbox.</p>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all border border-white/10">Subscribe</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostDetail;
