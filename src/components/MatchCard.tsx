import React from 'react';
import { 
  Radio, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Clock, 
  Zap,
  Layers
} from 'lucide-react';
import { Match, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface MatchCardProps {
  match: Match;
  language: Language;
  selectedOddIds: string[];
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
  onOpenDetails: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  language,
  selectedOddIds,
  onSelectOdd,
  onOpenDetails,
}) => {
  const isLive = match.status === 'live';

  const renderOddButton = (
    oddId: string,
    label: string,
    value: number,
    marketName: string,
    trend?: 'up' | 'down' | 'same'
  ) => {
    const isSelected = selectedOddIds.includes(oddId);

    // Ethiopian Birr Banknote Theme Assignment
    // Home (1) = 100 Birr (Emerald/Teal)
    // Draw (X) = 50 Birr (Golden Amber)
    // Away (2) = 200 Birr (Royal Violet)
    const isHome = label.includes('1') || oddId.toLowerCase().includes('home');
    const isDraw = label.includes('X') || oddId.toLowerCase().includes('draw');
    const isAway = label.includes('2') || oddId.toLowerCase().includes('away');

    let selectedStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md';
    let unselectedBorder = 'hover:border-emerald-500/50';

    if (isHome) {
      selectedStyle = 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 border-teal-300 font-black shadow-md shadow-teal-950/50';
      unselectedBorder = 'hover:border-teal-400/60 hover:text-teal-200';
    } else if (isDraw) {
      selectedStyle = 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-950/50';
      unselectedBorder = 'hover:border-amber-400/60 hover:text-amber-200';
    } else if (isAway) {
      selectedStyle = 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300 font-black shadow-md shadow-purple-950/50';
      unselectedBorder = 'hover:border-purple-400/60 hover:text-purple-200';
    }

    return (
      <button
        onClick={() => {
          onSelectOdd(match, oddId, label, value, marketName);
          sounds.playClick();
        }}
        className={`relative flex items-center justify-between px-2.5 py-2 rounded-xl border text-xs font-mono transition-all duration-150 cursor-pointer ${
          isSelected
            ? selectedStyle
            : `bg-slate-900/90 border-slate-800 text-slate-300 ${unselectedBorder} hover:bg-slate-800/80`
        }`}
      >
        <span className={`text-[10px] font-sans font-bold ${isSelected ? (isAway ? 'text-purple-100' : 'text-slate-900') : 'text-slate-400'}`}>
          {label}
        </span>

        <div className="flex items-center gap-1 font-bold">
          <span className={isSelected ? (isAway ? 'text-white font-black' : 'text-slate-950 font-black') : 'text-amber-300 font-bold'}>
            {value.toFixed(2)}
          </span>
          {trend === 'up' && (
            <TrendingUp className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
          )}
          {trend === 'down' && (
            <TrendingDown className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={`rounded-xl border transition-all overflow-hidden ${
      match.isEthiopianLeague 
        ? 'bg-slate-900/90 border-emerald-500/40 hover:border-amber-400/60 shadow-lg shadow-emerald-950/30' 
        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
    }`}>
      {/* Ethiopian Tricolor Line on Ethiopian Matches */}
      {match.isEthiopianLeague && (
        <div className="ethiopia-tricolor-line h-1 w-full" />
      )}

      {/* Top Meta Header */}
      <div className="px-3.5 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2 truncate">
          <span>{match.leagueFlag}</span>
          <span className="font-semibold text-slate-300 truncate">
            {match.league}
          </span>
          {match.isEthiopianLeague && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-sans font-bold flex items-center gap-0.5">
              <span>🇪🇹</span>
              <span>{language === 'am' ? 'ኢትዮጵያ' : 'ETHIO'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLive ? (
            <div className="flex items-center gap-1.5 text-red-400 font-bold bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE {match.time}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{match.time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Match Info & Odds Grid */}
      <div className="p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Teams and Scores */}
          <div 
            onClick={() => onOpenDetails(match)}
            className="flex-1 cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {match.homeTeam}
                </span>
                {isLive && (
                  <span className="font-mono font-black text-emerald-400 text-sm ml-2">
                    {match.homeScore ?? 0}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {match.awayTeam}
                </span>
                {isLive && (
                  <span className="font-mono font-black text-emerald-400 text-sm ml-2">
                    {match.awayScore ?? 0}
                  </span>
                )}
              </div>
            </div>

            {isLive && match.stats?.currentAction && (
              <div className="text-[11px] text-amber-400/90 font-mono mt-1.5 truncate flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{match.stats.currentAction}</span>
              </div>
            )}
          </div>

          {/* Quick 1X2 Buttons */}
          <div className="grid grid-cols-3 gap-1.5 sm:w-72 shrink-0">
            {renderOddButton(
              match.odds.matchWinner.home.id,
              '1',
              match.odds.matchWinner.home.odd,
              '1X2',
              match.odds.matchWinner.home.trend
            )}
            {renderOddButton(
              match.odds.matchWinner.draw.id,
              'X',
              match.odds.matchWinner.draw.odd,
              '1X2',
              match.odds.matchWinner.draw.trend
            )}
            {renderOddButton(
              match.odds.matchWinner.away.id,
              '2',
              match.odds.matchWinner.away.odd,
              '1X2',
              match.odds.matchWinner.away.trend
            )}
          </div>
        </div>

        {/* Secondary Markets Row (Over/Under & More Markets button) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          {match.odds.overUnder ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono uppercase">
                O/U 2.5:
              </span>
              <div className="flex items-center gap-1.5">
                {renderOddButton(
                  match.odds.overUnder.over.id,
                  'Over',
                  match.odds.overUnder.over.odd,
                  'Over/Under 2.5'
                )}
                {renderOddButton(
                  match.odds.overUnder.under.id,
                  'Under',
                  match.odds.overUnder.under.odd,
                  'Over/Under 2.5'
                )}
              </div>
            </div>
          ) : (
            <div />
          )}

          {/* More Markets Button */}
          <button
            onClick={() => {
              onOpenDetails(match);
              sounds.playClick();
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-auto"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>+16 Markets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
