
import React from 'react';
import { User, Post } from '../types';

interface DashboardProps {
  user: User;
  posts: Post[];
  onSelectPost: (id: string) => void;
  onDeletePost: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, posts, onSelectPost, onDeletePost }) => {
  const stats = [
    { label: 'Total Stories', value: posts.length, icon: '📚' },
    { label: 'Reads', value: '1.2k', icon: '👁️' },
    { label: 'Followers', value: '42', icon: '👤' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row items-center gap-8 glass p-8 rounded-3xl border border-white/10">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left flex-grow">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h1 className="text-4xl font-black">{user.name}</h1>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-widest">
              {user.role}
            </span>
          </div>
          <p className="text-gray-400 max-w-xl">{user.bio || 'AI enthusiast and storyteller sharing thoughts on the future of technology.'}</p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <button className="px-6 py-2 glass border border-white/10 rounded-full text-sm font-bold hover:bg-white/5 transition-colors">Edit Profile</button>
            <button className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Public Page</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.label} className="glass p-6 rounded-2xl border border-white/10">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500 uppercase font-bold tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">My Stories</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-bold">View Archive</button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 mb-4">You haven't written any stories yet.</p>
            <button className="text-blue-400 font-bold hover:underline">Start writing now</button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <img src={post.coverImage} className="w-20 h-14 rounded-lg object-cover" alt="" />
                  <div>
                    <h3 className="font-bold group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => onSelectPost(post.id)}>
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500">{post.date} &bull; {post.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108,148,64l24-24,44,44Z"></path></svg>
                  </button>
                  <button onClick={() => onDeletePost(post.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
