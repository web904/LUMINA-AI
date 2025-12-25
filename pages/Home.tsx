
import React from 'react';
import { Post } from '../types';

interface HomeProps {
  posts: Post[];
  onSelectPost: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ posts, onSelectPost }) => {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="space-y-12">
      {/* Hero Section / Featured Post */}
      {featured && (
        <section 
          className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10"
          onClick={() => onSelectPost(featured.id)}
        >
          <img 
            src={featured.coverImage} 
            alt={featured.title} 
            className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <div className="flex gap-2 mb-4">
              {featured.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur text-xs font-semibold rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 max-w-3xl leading-tight">
              {featured.title}
            </h1>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div>
                <p className="font-semibold">{featured.author}</p>
                <p className="text-sm text-gray-500">{featured.date} &bull; {featured.readTime}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          Latest Stories <div className="h-1 flex-grow bg-white/5" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer flex flex-col"
              onClick={() => onSelectPost(post.id)}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 mb-4">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex gap-2 mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{post.author}</span>
                <span>&bull;</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
