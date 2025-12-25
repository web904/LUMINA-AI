
import React, { useState } from 'react';
import { Post, User } from '../types';
import { generateBlogDraft, generatePostImage, researchTopic, ResearchResult } from '../services/geminiService';

interface CreatePostProps {
  onCreate: (post: Post) => void;
  user: User;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreate, user }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [researchData, setResearchData] = useState<ResearchResult | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');

  const handleMagicGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    
    try {
      setLoadingStep('Crafting narrative...');
      const draft = await generateBlogDraft(topic);
      setTitle(draft.title);
      setContent(draft.content);
      setTags(draft.tags);

      setLoadingStep('Generating visual concept...');
      const image = await generatePostImage(topic);
      setCoverImage(image);
    } catch (err) {
      console.error(err);
      alert("AI generator hit a snag. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setIsResearching(true);
    try {
      const result = await researchTopic(topic);
      setResearchData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: content.slice(0, 150).replace(/[#*`]/g, '') + '...',
      author: user.name,
      authorId: user.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      coverImage: coverImage || 'https://picsum.photos/1200/600',
      tags: tags.length > 0 ? tags : ['General'],
      readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)) + ' min',
      status: 'published'
    };

    onCreate(newPost);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Create Magic</h1>
        <p className="text-gray-400 text-lg">Use our AI engine to draft your next masterpiece or start from scratch.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* AI Magic Card */}
          <div className="glass p-6 rounded-2xl space-y-4 border border-blue-500/20 shadow-2xl shadow-blue-900/10">
            <h3 className="font-bold flex items-center gap-2 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M152,120a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,120Zm-40,40h32a8,8,0,0,0,0-16H112a8,8,0,0,0,0,16Zm120-24A104.11,104.11,0,0,1,128,240a103.41,103.41,0,0,1-51.2-13.47,8,8,0,0,0-8.24-.13L29.35,250.15a16,16,0,0,1-23.5-17.5l14.48-52.14a8,8,0,0,0-1-6.22A104,104,0,1,1,232,136Zm-16,0a88,88,0,1,0-88,88,87.35,87.35,0,0,0,43.34-11.42,24,24,0,0,1,24.71-.4L224,228.31,210.15,178.6a24,24,0,0,1,3.09-18.67A87.41,87.41,0,0,0,216,136Z"></path></svg>
              Topic Control
            </h3>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The impact of Mars colonization on Earth..."
              className="w-full h-24 bg-gray-950 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-300"
            />
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleMagicGenerate}
                disabled={isLoading || isResearching || !topic.trim()}
                className="py-3 bg-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Draft Post
              </button>
              <button 
                onClick={handleResearch}
                disabled={isLoading || isResearching || !topic.trim()}
                className="py-3 glass border border-purple-500/30 text-purple-400 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isResearching ? 'Searching...' : 'Research'}
              </button>
            </div>
            {isLoading && (
              <p className="text-[10px] text-center text-blue-400 font-medium animate-pulse">{loadingStep}</p>
            )}
          </div>

          {/* Research Results */}
          {researchData && (
            <div className="glass p-5 rounded-2xl border border-white/10 max-h-[400px] overflow-y-auto animate-in slide-in-from-left duration-300">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Live Intelligence</h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{researchData.summary}</p>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-blue-400 uppercase">Sources:</p>
                {researchData.sources.map((src, i) => (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-[10px] text-gray-500 hover:text-white truncate"
                  >
                    • {src.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 block">Cover Image</label>
            {coverImage ? (
              <div className="relative group rounded-3xl overflow-hidden aspect-[21/9] border border-white/10">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setCoverImage('')} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-3xl aspect-[21/9] flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-900 transition-all">
                <p className="text-gray-500">No cover image generated yet.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Post Title..." className="w-full bg-transparent text-4xl md:text-5xl font-black focus:outline-none" />
            <input type="text" placeholder="Tags (comma separated)..." value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(',').map(s => s.trim()))} className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-300" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell your story..." className="w-full h-[500px] bg-transparent text-xl leading-relaxed focus:outline-none border-t border-white/5 pt-8" />
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-xl shadow-blue-900/20">Publish Story</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
