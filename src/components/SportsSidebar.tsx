import React from 'react';
import { 
  Trophy, 
  Flame, 
  Timer, 
  Zap, 
  Sparkles, 
  Gamepad2, 
  Radio, 
  ShieldCheck, 
  PhoneCall,
  Smartphone
} from 'lucide-react';
import { SportType, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface SportsSidebarProps {
  language: Language;
  selectedSport: SportType | 'all' | 'ethiopian';
  setSelectedSport: (sport: SportType | 'all' | 'ethiopian') => void;
  selectedLeague: string | null;
  setSelectedLeague: (league: string | null) => void;
  liveMatchesCount: number;
  openWallet: (tab: 'deposit') => void;
}

export const SportsSidebar: React.FC<SportsSidebarProps> = ({
  language,
  selectedSport,
  setSelectedSport,
  selectedLeague,
  setSelectedLeague,
  liveMatchesCount,
  openWallet,
}) => {
  const sportsCategories = [
    { id: 'all', label: t(language, 'allSports'), icon: '🌐', count: 26 },
    { 
      id: 'ethiopian', 
      label: t(language, 'ethiopianPremierLeague'), 
      icon: '🇪🇹', 
      isSpecial: true,
      badge: 'HOT' 
    },
    { id: 'football', label: t(language, 'football'), icon: '⚽', count: 12 },
    { id: 'basketball', label: t(language, 'basketball'), icon: '🏀', count: 4 },
    { id: 'tennis', label: t(language, 'tennis'), icon: '🎾', count: 3 },
    { id: 'volleyball', label: t(language, 'volleyball'), icon: '🏐', count: 2 },
    { id: 'table_tennis', label: t(language, 'table_tennis'), icon: '🏓', count: 2 },
    { id: 'boxing', label: t(language, 'boxing'), icon: '🥊', count: 2 },
    { id: 'mma', label: t(language, 'mma'), icon: '🥋', count: 2 },
    { id: 'athletics', label: t(language, 'athletics'), icon: '🏃', count: 2 },
    { id: 'cricket', label: t(language, 'cricket'), icon: '🏏', count: 1 },
    { id: 'handball', label: t(language, 'handball'), icon: '🤾', count: 1 },
    { id: 'esports', label: t(language, 'esports'), icon: '🎮', count: 2 },
    { id: 'ice_hockey', label: t(language, 'ice_hockey'), icon: '🏒', count: 1 },
    { id: 'american_football', label: t(language, 'american_football'), icon: '🏈', count: 1 },
    { id: 'baseball', label: t(language, 'baseball'), icon: '⚾', count: 1 },
  ];

  const popularLeagues = [
    { name: 'Ethiopian Premier League', flag: '🇪🇹', short: 'Ethio PL' },
    { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'EPL' },
    { name: 'Champions League', flag: '🇪🇺', short: 'UCL' },
    { name: 'NBA', flag: '🇺🇸', short: 'NBA' },
  ];

  return (
    <aside className="w-full lg:w-64 space-y-4 select-none shrink-0">
      {/* Ethiopian League Spotlight Banner */}
      <div 
        onClick={() => {
          setSelectedSport('ethiopian');
          setSelectedLeague('Ethiopian Premier League');
          sounds.playClick();
        }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/90 via-slate-900 to-amber-950/70 border border-emerald-500/40 p-3.5 cursor-pointer hover:border-emerald-400 transition-all shadow-md group"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {language === 'am' ? 'የሀገር ውስጥ ሊግ' : 'LOCAL DERBY'}
          </span>
          <span className="text-xs">🇪🇹</span>
        </div>
        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
          {language === 'am' ? 'የኢትዮጵያ ፕሪሚየር ሊግ' : 'Ethiopian Premier League'}
        </h4>
        <p className="text-[11px] text-slate-300 mt-1 leading-snug">
          {language === 'am' 
            ? 'ቅዱስ ጊዮርጊስ vs ኢትዮጵያ ቡና እና ፋሲል ከነማ ከፍተኛ ኦድስ' 
            : 'Saint George, Coffee SC & Fasil Kenema with boosted odds'}
        </p>
        <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
          <span>{language === 'am' ? 'ጨዋታዎችን ይመልከቱ' : 'View Matches'}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Sports Categories Card */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 font-mono">
          <span>{t(language, 'sports')}</span>
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        </div>

        <div className="space-y-1">
          {sportsCategories.map((cat) => {
            const isSelected = selectedSport === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedSport(cat.id as SportType | 'all' | 'ethiopian');
                  setSelectedLeague(cat.id === 'ethiopian' ? 'Ethiopian Premier League' : null);
                  sounds.playClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {cat.badge && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {cat.badge}
                    </span>
                  )}
                  {cat.count && !isSelected && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {cat.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Leagues Selector */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 font-mono flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{t(language, 'topLeagues')}</span>
        </div>

        <div className="space-y-1">
          {popularLeagues.map((league) => {
            const isSelected = selectedLeague === league.name;
            return (
              <button
                key={league.name}
                onClick={() => {
                  if (isSelected) {
                    setSelectedLeague(null);
                  } else {
                    setSelectedLeague(league.name);
                    if (league.name === 'Ethiopian Premier League') {
                      setSelectedSport('ethiopian');
                    } else if (league.name === 'NBA') {
                      setSelectedSport('basketball');
                    } else {
                      setSelectedSport('football');
                    }
                  }
                  sounds.playClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{league.flag}</span>
                  <span className="truncate">{league.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {league.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Telebirr Fast Deposit Callout */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs">
            📱
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{language === 'am' ? 'በቴሌብር / ሲቢኢ ብር' : 'Telebirr & CBE Birr'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold">LIVE</span>
            </div>
            <div className="text-[11px] text-amber-400 font-mono font-bold">
              0941574759
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">
          {language === 'am' 
            ? 'ተቀማጭ ለማድረግ በቴሌብር ወይም በሲቢኢ ብር ወደ 0941574759 ያስገቡ።' 
            : 'Transfer deposits directly to Cash Bet: 0941574759'}
        </p>

        <button
          onClick={() => {
            openWallet('deposit');
            sounds.playClick();
          }}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>{language === 'am' ? 'ብር አስገባ (0941574759)' : 'Deposit via 0941574759'}</span>
        </button>
      </div>

      {/* Responsible Gaming Badge */}
      <div className="px-3 py-2 text-[10px] text-slate-500 text-center leading-normal">
        <div className="flex items-center justify-center gap-1 text-slate-400 font-semibold mb-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>18+ Responsible Gaming</span>
        </div>
        <span>Licensed & regulated under National Lottery Administration of Ethiopia.</span>
      </div>
    </aside>
  );
};
