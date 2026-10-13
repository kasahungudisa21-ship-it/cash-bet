import React, { useState } from 'react';
import { 
  Zap, 
  Wallet, 
  Globe, 
  Volume2, 
  VolumeX, 
  Search, 
  ReceiptText, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Menu, 
  X,
  Coins,
  User,
  LogOut
} from 'lucide-react';
import { Currency, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  balance: number;
  openWallet: (tab: 'deposit' | 'withdraw') => void;
  openTicketChecker: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  openSlipMobile: () => void;
  slipCount: number;
  currentUser?: { username: string; phone: string; vipLevel: string } | null;
  openAuthModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  balance,
  openWallet,
  openTicketChecker,
  soundEnabled,
  setSoundEnabled,
  searchQuery,
  setSearchQuery,
  activeNavTab,
  setActiveNavTab,
  openSlipMobile,
  slipCount,
  currentUser,
  openAuthModal,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const navItems = [
    { id: 'sports', label: t(language, 'sports'), icon: '⚽' },
    { id: 'live', label: t(language, 'live'), icon: '🔴', isLiveBadge: true },
    { id: 'crash', label: t(language, 'cashRush'), icon: '🚀', isHot: true },
    { id: 'virtual', label: t(language, 'virtual'), icon: '🎮' },
    { id: 'jackpot', label: t(language, 'jackpot'), icon: '🏆', isGold: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      {/* Ethiopian Flag Tricolor Signature Top Border */}
      <div className="ethiopia-tricolor-line h-1.5 w-full shadow-sm" />

      {/* Top Banner / Ticker with Ethiopian Colors */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-rose-950/70 border-b border-slate-800/80 text-[11px] py-1 px-4 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
          </div>
          <span className="font-semibold text-emerald-400">
            {language === 'am' ? 'የቴሌብር / ሲቢኢ ብር ፈጣን ተቀማጭ' : 'Telebirr & CBE Birr Instant Deposit'}
          </span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
            {language === 'am' ? 'ኦፊሴላዊ ጌትዌይ' : 'OFFICIAL GATEWAY'}
          </span>
          <span className="text-slate-400 hidden md:inline">
            ({language === 'am' ? 'በቴሌብር ወይም በሲቢኢ ብር በደቂቃዎች ውስጥ በቀጥታ ገቢ ይደረጋል' : 'Direct secure transfer with instant automated credit'})
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <button 
            onClick={openTicketChecker}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>{t(language, 'checkTicket')}</span>
          </button>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>24/7 Support: 9484</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo with Ethiopian Tricolor */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveNavTab('sports');
              sounds.playClick();
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-amber-400 to-rose-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-wider text-emerald-400">
                  CASH<span className="text-amber-400">BET</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold px-1.5 py-0.2 rounded font-mono">
                  🇪🇹 ET
                </span>
              </div>
              <span className="text-[11px] font-bold tracking-tight block mt-0.5 text-amber-300">
                {language === 'am' ? 'ካሽ ቤት ኢትዮጵያ' : 'Ethiopia Sportsbook'}
              </span>
            </div>
          </button>

          {/* Quick Search on Desktop */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(language, 'searchMatches')}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavTab(item.id);
                  sounds.playClick();
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.isLiveBadge && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5"></span>
                )}
                {item.isHot && !isActive && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                    HOT
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Balance, Wallet, Lang & Currency */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Balance Display */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 sm:pl-3 sm:pr-1 gap-2 shadow-inner">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">
                {t(language, 'balance')}
              </div>
              <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-400 leading-tight">
                {currency === 'ETB' ? 'Br ' : '$'}
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  openWallet('deposit');
                  sounds.playClick();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                title={t(language, 'deposit')}
              >
                <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">{t(language, 'deposit')}</span>
              </button>

              <button
                onClick={() => {
                  openWallet('withdraw');
                  sounds.playClick();
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title={t(language, 'withdraw')}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{t(language, 'withdraw')}</span>
              </button>
            </div>
          </div>

          {/* Currency Toggle */}
          <button
            onClick={() => {
              setCurrency(currency === 'ETB' ? 'USD' : 'ETB');
              sounds.playClick();
            }}
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Toggle Currency"
          >
            <span>{currency === 'ETB' ? '🇪🇹 ETB' : '🇺🇸 USD'}</span>
          </button>

          {/* Language Toggle (Amharic / English) */}
          <button
            onClick={() => {
              setLanguage(language === 'en' ? 'am' : 'en');
              sounds.playClick();
            }}
            className="flex items-center gap-1 text-xs font-bold px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 pr-2">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white cursor-pointer px-1.5 py-0.5"
                title="Profile"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                  {currentUser.username[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-white truncate max-w-[80px]">
                    {currentUser.username}
                  </div>
                  <div className="text-[9px] text-amber-400 leading-none">
                    {currentUser.vipLevel}
                  </div>
                </div>
              </button>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-lg transition-transform active:scale-95 flex items-center gap-1 cursor-pointer shadow"
            >
              <User className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'ግባ / ተመዝገብ' : 'Login'}</span>
            </button>
          )}

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-900/50 border-slate-850 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Bet Slip Opener Badge */}
          <button
            onClick={openSlipMobile}
            className="md:hidden relative p-2 bg-slate-900 border border-emerald-500/50 text-emerald-400 rounded-lg cursor-pointer"
            title="Bet Slip"
          >
            <ReceiptText className="w-4 h-4" />
            {slipCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {slipCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2">
          {/* Mobile Search */}
          <div className="relative w-full mb-3">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(language, 'searchMatches')}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavTab(item.id);
                  setMobileMenuOpen(false);
                  sounds.playClick();
                }}
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  activeNavTab === item.id
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                openTicketChecker();
                setMobileMenuOpen(false);
              }}
              className="text-amber-400 font-semibold flex items-center gap-1.5"
            >
              <ReceiptText className="w-4 h-4" />
              <span>{t(language, 'checkTicket')}</span>
            </button>

            <button
              onClick={() => {
                setCurrency(currency === 'ETB' ? 'USD' : 'ETB');
              }}
              className="text-slate-300 bg-slate-900 px-2 py-1 rounded"
            >
              Currency: {currency}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
