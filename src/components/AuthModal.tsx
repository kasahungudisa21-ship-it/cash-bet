import React, { useState } from 'react';
import { X, User, Phone, Lock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, signInUser, signUpUser } from '../utils/auth';
import { Language } from '../types/betting';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('0912345678');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'signup') {
        const newUser = await signUpUser(phone, username, password);
        sounds.playBetPlaced();
        confetti({ particleCount: 50, spread: 60 });
        onAuthSuccess(newUser);
        onClose();
      } else {
        const user = await signInUser(phone, password);
        sounds.playClick();
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 font-black">
              CB
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'am' ? 'ወደ ካሽ ቤት ይግቡ' : 'Cash Bet Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'am' ? 'የተረጋገጠ የስፖርት ውርርድ' : 'Verified Sportsbook & Live Games'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome Bonus Notice */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border-b border-emerald-500/30 p-2.5 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{language === 'am' ? '100 ብር የነፃ ውርርድ ቦነስ!' : '100 ETB Free Bet Bonus!'}</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
            NEW
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950/50 p-2 border-b border-slate-800 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
              sounds.playClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
              tab === 'signin'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'ግባ (Sign In)' : 'Sign In'}
          </button>

          <button
            onClick={() => {
              setTab('signup');
              setError(null);
              sounds.playClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
              tab === 'signup'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'ተመዝገብ (Sign Up)' : 'Sign Up'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {error && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-1 block">
                {language === 'am' ? 'የተጠቃሚ ስም (Full Name / Username)' : 'Username / Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Abebe Kebede"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-1 block">
              {language === 'am' ? 'ስልክ ቁጥር (Phone Number)' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0911223344"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-1 block">
              {language === 'am' ? 'የይለፍ ቃል (Password)' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading 
                ? (language === 'am' ? 'በማረጋገጥ ላይ...' : 'Verifying...') 
                : tab === 'signup' 
                ? (language === 'am' ? 'ተመዝገብ እና 100 ብር ቦነስ ውሰድ' : 'Register & Claim 100 ETB Bonus') 
                : (language === 'am' ? 'ግባ ወደ አካውንት' : 'Sign In')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Secured Betting</span>
          </div>
        </form>
      </div>
    </div>
  );
};
