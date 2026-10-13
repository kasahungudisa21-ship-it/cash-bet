import React, { useState } from 'react';
import { 
  Wallet, 
  Smartphone, 
  ReceiptText, 
  Flame, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy, 
  Radio, 
  ArrowUpRight, 
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Tv,
  Gamepad2,
  CreditCard
} from 'lucide-react';
import { Currency, Language, Match } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

export type DashboardLayoutMode = 'sports' | 'stadium' | 'arcade' | 'financial';

interface EthiopianBirrDashboardHeaderProps {
  language: Language;
  currency: Currency;
  balance: number;
  activeBetsCount: number;
  potentialPayoutTotal: number;
  hotMatch?: Match;
  activeLayoutMode: DashboardLayoutMode;
  setLayoutMode: (mode: DashboardLayoutMode) => void;
  openWallet: (tab: 'deposit' | 'withdraw') => void;
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
  selectedOddIds: string[];
}

export const EthiopianBirrDashboardHeader: React.FC<EthiopianBirrDashboardHeaderProps> = ({
  language,
  currency,
  balance,
  activeBetsCount,
  potentialPayoutTotal,
  hotMatch,
  activeLayoutMode,
  setLayoutMode,
  openWallet,
  onSelectOdd,
  selectedOddIds,
}) => {
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(100);

  const denominations = [
    { value: 10, label: '10 ብር', color: 'birr-10-gradient', border: 'border-emerald-600', text: 'text-emerald-300' },
    { value: 50, label: '50 ብር', color: 'birr-50-gradient', border: 'border-amber-500', text: 'text-amber-300' },
    { value: 100, label: '100 ብር', color: 'birr-100-gradient', border: 'border-teal-400', text: 'text-teal-200' },
    { value: 200, label: '200 ብር', color: 'birr-200-gradient', border: 'border-purple-400', text: 'text-purple-200' },
  ];

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Banknote Denominations & Layout Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl ethiopia-banknote-pattern shadow-lg">
        {/* Ethiopian Birr Banknotes Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mr-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="hidden md:inline ml-1 text-slate-300">
              {language === 'am' ? 'የኢትዮጵያ ብሮች ኖቶች:' : 'Ethiopian Notes:'}
            </span>
          </div>

          {denominations.map((note) => {
            const isSelected = selectedDenomination === note.value;
            return (
              <button
                key={note.value}
                onClick={() => {
                  setSelectedDenomination(note.value);
                  sounds.playClick();
                }}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  note.color
                } ${isSelected ? 'ring-2 ring-amber-400 border-white shadow-md scale-105' : 'opacity-85 hover:opacity-100 border-slate-700/60'}`}
              >
                <span className="text-[10px]">🇪🇹</span>
                <span className={note.text}>{note.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dashboard Layout Switcher (የዳሽቦርድ አቀማመጥ መቆጣጠሪያ) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 hidden lg:inline">
            {language === 'am' ? 'አቀማመጥ:' : 'Layout:'}
          </span>

          <button
            onClick={() => {
              setLayoutMode('sports');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayoutMode === 'sports'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t(language, 'sportsHubView')}</span>
          </button>

          <button
            onClick={() => {
              setLayoutMode('stadium');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayoutMode === 'stadium'
                ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 text-white shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{t(language, 'liveStadiumView')}</span>
          </button>

          <button
            onClick={() => {
              setLayoutMode('arcade');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayoutMode === 'arcade'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{t(language, 'quickGamesView')}</span>
          </button>

          <button
            onClick={() => {
              setLayoutMode('financial');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayoutMode === 'financial'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t(language, 'walletOverviewView')}</span>
          </button>
        </div>
      </div>

      {/* 4 Ethiopian Birr Denomination KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: 100 Birr Theme (Emerald / Teal) - Wallet Balance */}
        <div className="relative overflow-hidden rounded-2xl birr-100-gradient border birr-100-border p-4 text-white shadow-lg flex flex-col justify-between group hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-teal-200 uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.2 bg-teal-900/60 border border-teal-400/40 rounded text-[9px]">100 ብር ኖት</span>
              <span>{t(language, 'balance')}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-950/50 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1.5">
              <span>{balance.toLocaleString()}</span>
              <span className="text-sm font-sans font-bold text-teal-200">
                {currency === 'ETB' ? 'ብር' : 'USD'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-teal-700/40 text-xs">
              <span className="text-teal-200 text-[11px]">
                {language === 'am' ? 'የተረጋገጠ ሂሳብ' : 'Verified Balance'}
              </span>
              <button
                onClick={() => openWallet('deposit')}
                className="px-2.5 py-1 bg-white text-emerald-950 hover:bg-amber-300 font-extrabold rounded-lg text-[11px] transition-colors cursor-pointer shadow-sm"
              >
                + {t(language, 'deposit')}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Telebirr & CBE Birr Instant Deposit Box (Invisible Phone) */}
        <div className="relative overflow-hidden rounded-2xl telebirr-cyan-gradient border border-sky-400/40 p-4 text-white shadow-lg flex flex-col justify-between group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.2 bg-sky-950/70 border border-sky-400/40 rounded text-[9px]">TELEBIRR / CBE</span>
              <span>{language === 'am' ? 'ተቀማጭ' : 'Deposit'}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs text-sky-200 font-medium">
              {language === 'am' ? 'ኦፊሴላዊ የክፍያ ጌትዌይ:' : 'Official Payment Gateway:'}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1 bg-slate-950/60 border border-sky-400/40 px-2.5 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-amber-300">
                  {language === 'am' ? 'የተረጋገጠ የካሽ ቤት አካውንት' : 'Cash Bet Merchant'}
                </span>
              </div>
              <button
                onClick={() => openWallet('deposit')}
                className="px-2.5 py-1 bg-sky-400 hover:bg-sky-300 text-slate-950 text-[10px] font-black rounded-lg transition-all cursor-pointer shadow-sm"
              >
                + {t(language, 'deposit')}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-sky-800/40 text-[11px] text-sky-200">
              <span>{language === 'am' ? 'በቴሌብር ወይም በሲቢኢ ይክፈሉ' : 'Pay via Telebirr or CBE'}</span>
              <span className="font-mono text-emerald-300 font-bold">INSTANT</span>
            </div>
          </div>
        </div>

        {/* Card 3: 50 Birr Theme (Golden Amber) - Active Bets & Potential Returns */}
        <div className="relative overflow-hidden rounded-2xl birr-50-gradient border birr-50-border p-4 text-white shadow-lg flex flex-col justify-between group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.2 bg-amber-950/70 border border-amber-400/40 rounded text-[9px]">50 ብር ኖት</span>
              <span>{t(language, 'myBets')}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-white">
                {activeBetsCount} <span className="text-sm font-sans font-normal text-amber-200">{language === 'am' ? 'ቲኬቶች' : 'Slips'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-400/40 text-amber-300 font-mono font-bold">
                {language === 'am' ? 'በሂደት ላይ' : 'Live'}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-amber-800/40 flex items-center justify-between text-xs">
              <span className="text-amber-200 text-[11px]">
                {language === 'am' ? 'የሚገኝ ትርፍ:' : 'Potential Win:'}
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {potentialPayoutTotal.toLocaleString()} {currency === 'ETB' ? 'ብር' : '$'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: 200 Birr Theme (Royal Violet / Gold) - Today's Hot Derby Match */}
        <div className="relative overflow-hidden rounded-2xl birr-200-gradient border birr-200-border p-4 text-white shadow-lg flex flex-col justify-between group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.2 bg-purple-950/70 border border-purple-400/40 rounded text-[9px]">200 ብር ኖት</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'am' ? 'የሸገር ደርቢ' : 'Sheger Derby'}</span>
            </span>
            <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
              LIVE 58'
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-white truncate flex items-center justify-between">
              <span className="truncate">{hotMatch ? `${hotMatch.homeTeam} vs ${hotMatch.awayTeam}` : 'Saint George vs Ethiopia Bunna'}</span>
              <span className="font-mono font-bold text-amber-300 shrink-0 ml-1">
                {hotMatch ? `${hotMatch.homeScore} - ${hotMatch.awayScore}` : '1 - 1'}
              </span>
            </div>

            {/* Quick 1X2 Odd Selectors directly inside KPI card */}
            {hotMatch && (
              <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-purple-800/40">
                <button
                  onClick={() => onSelectOdd(hotMatch, '1', '1', hotMatch.odds.matchWinner.home.odd, '1X2')}
                  className={`px-1 py-1 rounded text-[10px] font-mono font-bold border text-center transition-all cursor-pointer ${
                    selectedOddIds.includes(hotMatch.id)
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-purple-950/60 border-purple-700/60 text-purple-100 hover:bg-purple-800'
                  }`}
                >
                  <div>1</div>
                  <div className="text-amber-300">{hotMatch.odds.matchWinner.home.odd.toFixed(2)}</div>
                </button>

                <button
                  onClick={() => onSelectOdd(hotMatch, 'X', 'X', hotMatch.odds.matchWinner.draw.odd, '1X2')}
                  className="px-1 py-1 rounded text-[10px] font-mono font-bold border border-purple-700/60 bg-purple-950/60 text-purple-100 hover:bg-purple-800 text-center transition-all cursor-pointer"
                >
                  <div>X</div>
                  <div className="text-amber-300">{hotMatch.odds.matchWinner.draw.odd.toFixed(2)}</div>
                </button>

                <button
                  onClick={() => onSelectOdd(hotMatch, '2', '2', hotMatch.odds.matchWinner.away.odd, '1X2')}
                  className="px-1 py-1 rounded text-[10px] font-mono font-bold border border-purple-700/60 bg-purple-950/60 text-purple-100 hover:bg-purple-800 text-center transition-all cursor-pointer"
                >
                  <div>2</div>
                  <div className="text-amber-300">{hotMatch.odds.matchWinner.away.odd.toFixed(2)}</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
