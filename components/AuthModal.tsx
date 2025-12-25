
import React, { useState } from 'react';
import { User, AuthProvider } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [method, setMethod] = useState<'selection' | 'phone' | 'otp'>('selection');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleProviderLogin = (provider: AuthProvider, forceAdmin = false) => {
    // Simulate OAuth Login
    const mockUser: User = {
      id: forceAdmin ? 'admin_001' : Math.random().toString(36).substr(2, 9),
      name: forceAdmin ? 'System Administrator' : (provider === 'GOOGLE' ? 'Google User' : provider === 'MICROSOFT' ? 'Microsoft User' : 'Facebook User'),
      email: forceAdmin ? 'admin@lumina.ai' : `user@${provider.toLowerCase()}.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${forceAdmin ? 'admin' : provider}`,
      role: forceAdmin ? 'ADMIN' : 'USER',
      provider
    };
    onLogin(mockUser);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setMethod('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input
      if (value !== '' && index < 5) {
        (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
      }
      // If complete
      if (newOtp.every(v => v !== '')) {
        const mockUser: User = {
          id: 'phone_' + Date.now(),
          name: 'Mobile User',
          phone: phoneNumber,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${phoneNumber}`,
          role: 'USER',
          provider: 'PHONE'
        };
        onLogin(mockUser);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-8 shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
        </button>

        {method === 'selection' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Join Lumina</h2>
              <p className="text-gray-400 text-sm">Sign in to share your stories with the world.</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleProviderLogin('GOOGLE')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
              
              <button 
                onClick={() => handleProviderLogin('MICROSOFT')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2f2f2f] text-white font-bold rounded-xl hover:bg-[#3f3f3f] transition-all"
              >
                <img src="https://www.microsoft.com/favicon.ico" className="w-5 h-5" alt="Microsoft" />
                Continue with Microsoft
              </button>

              <button 
                onClick={() => handleProviderLogin('FACEBOOK')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white font-bold rounded-xl hover:bg-[#2080ff] transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continue with Facebook
              </button>

              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-grow bg-white/10" />
                <span className="text-xs text-gray-500 font-bold uppercase">or</span>
                <div className="h-px flex-grow bg-white/10" />
              </div>

              <button 
                onClick={() => setMethod('phone')}
                className="w-full py-3 glass text-white font-bold rounded-xl hover:bg-white/5 transition-all border border-white/10"
              >
                Sign in with Phone
              </button>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button 
                onClick={() => handleProviderLogin('GOOGLE', true)}
                className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-500/10 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-80-56a12,12,0,1,1-12-12A12,12,0,0,1,128,152Z"></path></svg>
                Staff Entrance (Admin)
              </button>
            </div>
          </div>
        )}

        {method === 'phone' && (
          <div className="space-y-6">
            <button onClick={() => setMethod('selection')} className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
              Back
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Mobile Sign In</h2>
              <p className="text-gray-400 text-sm">Enter your phone number to receive a code.</p>
            </div>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">+</span>
                <input 
                  autoFocus
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="1 234 567 890"
                  className="w-full bg-gray-950 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
              >
                Send Code
              </button>
            </form>
          </div>
        )}

        {method === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
              <p className="text-gray-400 text-sm">We've sent a 6-digit code to {phoneNumber}</p>
            </div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input 
                  key={idx}
                  id={`otp-${idx}`}
                  type="text" 
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 bg-gray-950 border border-white/10 rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              ))}
            </div>
            <div className="text-center">
              <button className="text-xs text-blue-400 hover:underline">Resend code in 45s</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
