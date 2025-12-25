
import React, { useState } from 'react';
import { View, User } from '../types';

interface HeaderProps {
  view: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ view, setView, user, onLogout, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:rotate-12 transition-transform">
            L
          </div>
          <span className="text-xl font-bold text-gradient">LUMINA</span>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={() => setView('home')}
            className={`text-sm font-medium transition-colors ${view === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Explore
          </button>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/50">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:block text-sm font-semibold">{user.name}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass rounded-2xl border border-white/10 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/5 mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email || user.phone}</p>
                  </div>
                  <button 
                    onClick={() => { setView('dashboard'); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    Dashboard
                  </button>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors text-purple-400 flex items-center gap-2"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={() => { setView('create'); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    Create Story
                  </button>
                  <div className="h-px bg-white/5 my-2" />
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
