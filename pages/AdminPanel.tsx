
import React, { useState, useEffect } from 'react';
import { Post } from '../types';

interface AdminPanelProps {
  posts: Post[];
  onDeletePost: (id: string) => void;
  onSelectPost: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ posts, onDeletePost, onSelectPost }) => {
  const [tab, setTab] = useState<'content' | 'users' | 'database'>('content');
  const [sqlLogs, setSqlLogs] = useState<{id: number, timestamp: string, query: string}[]>([]);

  useEffect(() => {
    const updateLogs = () => {
      const logs = JSON.parse(localStorage.getItem('sql_logs') || '[]');
      setSqlLogs(logs);
    };
    updateLogs();
    window.addEventListener('sql_updated', updateLogs);
    return () => window.removeEventListener('sql_updated', updateLogs);
  }, []);

  const mockUsers = [
    { id: '1', name: 'Alex Rivers', role: 'USER', email: 'alex@example.com', joins: '2 days ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: '2', name: 'Sarah Chen', role: 'USER', email: 'sarah@example.com', joins: '1 week ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'admin_001', name: 'James Wilson', role: 'ADMIN', email: 'james@lumina.ai', joins: '1 month ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gradient">Admin Center</h1>
          <p className="text-gray-500 text-sm">Oversee platform health and moderate database records.</p>
        </div>
        <div className="flex glass p-1 rounded-xl border border-white/10 overflow-x-auto">
          {['content', 'users', 'database'].map((t) => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'content' && (
        <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Story</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.coverImage} className="w-12 h-8 rounded object-cover border border-white/10" alt="" />
                      <span className="font-bold truncate max-w-[200px]">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{post.author}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-tighter">
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => onSelectPost(post.id)} className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.74-27.65-38.57C194.59,61.13,162.69,48,128,48S61.41,61.13,36.34,86.19c-18.83,18.83-27.3,37.78-27.65,38.57a8,8,0,0,0,0,6.48c.35.79,8.82,19.74,27.65,38.57C61.41,194.87,93.31,208,128,208s66.59-13.13,91.66-38.19c18.83-18.83,27.3-37.78,27.65-38.57A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-59.32-11.52-80.37-32.44C31.57,143.51,25,129.56,24.11,128c.87-1.56,7.46-15.51,23.52-31.56C68.68,75.52,97.22,64,128,64s59.32,11.52,80.37,32.44c16.06,16.05,22.65,30,23.52,31.56-.87,1.56-7.46,15.51-23.52,31.56C187.32,180.48,158.78,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                      </button>
                      <button onClick={() => onDeletePost(post.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUsers.map(u => (
            <div key={u.id} className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blue-500/30 transition-all">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold truncate">{u.name}</h3>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                <div className="mt-2 text-[10px] text-gray-400">ID: {u.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Inspector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,80V176c0,30.93-43,56-96,56S32,206.93,32,176V80a8,8,0,0,1,16,0v8.6c19.12,15.19,47.42,23.4,80,23.4s60.88-8.21,80-23.4V80a8,8,0,0,1,16,0Zm-96,48c-32.58,0-60.88-8.21-80-23.4V128.6c19.12,15.19,47.42,23.4,80,23.4s60.88-8.21,80-23.4V104.6C184.88,119.79,156.58,128,128,128Zm0,48c-32.58,0-60.88-8.21-80-23.4V176c19.12,15.19,47.42,23.4,80,23.4s60.88-8.21,80-23.4V152.6C184.88,167.79,156.58,176,128,176ZM128,32c-53,0-96,25.07-96,56s43,56,96,56,96-25.07,96-56S181,32,128,32Zm0,96c-44.11,0-80-17.94-80-40s35.89-40,80-40,80,17.94,80,40S172.11,128,128,128Z"></path></svg>
                MySQL Table: `posts`
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead className="border-b border-white/10 text-gray-500 uppercase font-bold">
                    <tr>
                      <th className="pb-2 pr-4">ID (Primary)</th>
                      <th className="pb-2 pr-4">Author_ID (FK)</th>
                      <th className="pb-2 pr-4">Title</th>
                      <th className="pb-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-gray-300">
                    {posts.map(p => (
                      <tr key={p.id}>
                        <td className="py-2 pr-4 truncate max-w-[80px] text-blue-400">{p.id}</td>
                        <td className="py-2 pr-4 truncate max-w-[80px] text-purple-400">{p.authorId}</td>
                        <td className="py-2 pr-4 truncate max-w-[150px]">{p.title}</td>
                        <td className="py-2 pr-4 uppercase">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>
                MySQL Table: `users`
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-left font-mono">
                  <thead className="border-b border-white/10 text-gray-500 uppercase font-bold">
                    <tr>
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {mockUsers.map(u => (
                      <tr key={u.id}>
                        <td className="py-2 text-blue-400">{u.id}</td>
                        <td className="py-2">{u.name}</td>
                        <td className="py-2 text-purple-400">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SQL Logs Monitor */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl border border-white/10 p-6 h-[600px] flex flex-col bg-gray-950/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  MySQL Command Log
                </h3>
                <button 
                  onClick={() => { localStorage.removeItem('sql_logs'); setSqlLogs([]); }}
                  className="text-[10px] text-gray-600 hover:text-white uppercase font-bold"
                >
                  Clear
                </button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-4 font-mono text-[10px] scrollbar-hide">
                {sqlLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                    <p>Waiting for query data...</p>
                  </div>
                ) : (
                  sqlLogs.map(log => (
                    <div key={log.id} className="p-3 bg-black/40 rounded-lg border border-white/5 hover:border-blue-500/20 transition-all">
                      <div className="flex justify-between mb-1 opacity-40">
                        <span>{log.timestamp}</span>
                        <span className="text-blue-500">MYSQL-DRIVER</span>
                      </div>
                      <p className="text-gray-300 break-words leading-relaxed">{log.query}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-500 flex justify-between items-center">
                <span>CONNECTION: POOLED</span>
                <span>STATUS: OK</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
