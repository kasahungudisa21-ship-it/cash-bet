import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flag, 
  Target, 
  RotateCcw, 
  ChevronRight, 
  Flame, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { Match, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface LivePitchTrackerProps {
  liveMatches: Match[];
  language: Language;
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
  selectedOddIds: string[];
}

export const LivePitchTracker: React.FC<LivePitchTrackerProps> = ({
  liveMatches,
  language,
  onSelectOdd,
  selectedOddIds,
}) => {
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [actionText, setActionText] = useState('Saint George building attack from midfield...');

  const currentMatch = liveMatches[activeMatchIndex] || liveMatches[0];

  // Animate the live pitch action
  useEffect(() => {
    if (!currentMatch) return;

    const interval = setInterval(() => {
      // Generate realistic randomized tactical position
      const newX = 25 + Math.floor(Math.random() * 55);
      const newY = 20 + Math.floor(Math.random() * 60);
      setBallX(newX);
      setBallY(newY);

      const actions = [
        `⚡ ${currentMatch.homeTeam} pressing in the attacking third`,
        `🧤 Great save by ${currentMatch.awayTeam} goalkeeper!`,
        `🎯 Shot on target from 22 yards out!`,
        `🚩 Corner kick awarded to ${newX > 50 ? currentMatch.homeTeam : currentMatch.awayTeam}`,
        `⚔️ Intense midfield duel, possession contested`,
        `🚀 Fast counter-attack sprinting down the left flank`,
        `🔥 Free kick awarded in dangerous shooting territory`,
      ];
      setActionText(actions[Math.floor(Math.random() * actions.length)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [currentMatch]);

  if (!currentMatch) return null;

  const stats = currentMatch.stats || {
    possessionHome: 52,
    possessionAway: 48,
    shotsHome: 8,
    shotsAway: 6,
    cornersHome: 4,
    cornersAway: 3,
    redCardsHome: 0,
    redCardsAway: 0,
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl mb-6">
      {/* Header bar with Live Match Switcher */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1">
            <span>{t(language, 'liveTracker')}</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400">{currentMatch.league}</span>
          </span>
        </div>

        {/* Match selector pills if multiple live games */}
        {liveMatches.length > 1 && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
            {liveMatches.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMatchIndex(idx);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer truncate max-w-[120px] ${
                  activeMatchIndex === idx
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.homeTeam.split(' ')[0]} v {m.awayTeam.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score & Match Status (Column 1) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                LIVE {currentMatch.time}
              </span>
              <span>{currentMatch.period || '2nd Half'}</span>
            </div>

            {/* Scoreboard Teams */}
            <div className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentMatch.leagueFlag}</span>
                  <span className="font-bold text-white text-sm truncate max-w-[170px]">
                    {currentMatch.homeTeam}
                  </span>
                </div>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {currentMatch.homeScore ?? 0}
                </span>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentMatch.leagueFlag}</span>
                  <span className="font-bold text-white text-sm truncate max-w-[170px]">
                    {currentMatch.awayTeam}
                  </span>
                </div>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {currentMatch.awayScore ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Odds for Current Live Match */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>{t(language, 'matchWinner')}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live Odds
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'home', item: currentMatch.odds.matchWinner.home, label: '1' },
                { key: 'draw', item: currentMatch.odds.matchWinner.draw, label: 'X' },
                { key: 'away', item: currentMatch.odds.matchWinner.away, label: '2' },
              ].map(({ key, item, label }) => {
                const isSelected = selectedOddIds.includes(item.id);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectOdd(currentMatch, item.id, item.name, item.odd, '1X2');
                      sounds.playClick();
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">{label}</div>
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      {item.odd.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Animated Pitch (Column 2) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative w-full h-48 sm:h-56 bg-emerald-950/40 rounded-xl border border-emerald-800/40 overflow-hidden shadow-inner flex flex-col justify-between p-2">
            {/* Field Turf Stripes Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#059669_40px,#059669_80px)]" />

            {/* Field Lines */}
            <div className="absolute inset-2 border border-emerald-500/30 rounded pointer-events-none">
              {/* Half-way line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/30" />
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-500/30" />
              {/* Left Penalty Box */}
              <div className="absolute top-1/4 bottom-1/4 left-0 w-16 border-r border-y border-emerald-500/30" />
              {/* Right Penalty Box */}
              <div className="absolute top-1/4 bottom-1/4 right-0 w-16 border-l border-y border-emerald-500/30" />
            </div>

            {/* Field Direction Indicators */}
            <div className="relative z-10 flex justify-between text-[11px] font-bold text-emerald-300/80 px-3">
              <span className="flex items-center gap-1">
                ◀ {currentMatch.homeTeam}
              </span>
              <span className="flex items-center gap-1">
                {currentMatch.awayTeam} ▶
              </span>
            </div>

            {/* Dynamic Animated Ball */}
            <div
              className="absolute z-20 w-4 h-4 -ml-2 -mt-2 transition-all duration-1000 ease-out"
              style={{ left: `${ballX}%`, top: `${ballY}%` }}
            >
              <div className="relative w-full h-full">
                <div className="absolute -inset-1 rounded-full bg-amber-400/50 animate-ping" />
                <div className="w-4 h-4 rounded-full bg-white shadow-lg border border-slate-900 flex items-center justify-center text-[8px]">
                  ⚽
                </div>
              </div>
            </div>

            {/* Tactical Live Event Ticker on Pitch Bottom */}
            <div className="relative z-10 bg-slate-950/80 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate text-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium truncate">{actionText}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold ml-2">
                ATTACKING
              </span>
            </div>
          </div>

          {/* Match Stats Bar */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            {/* Possession */}
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Possession</div>
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
                <span className="text-emerald-400">{stats.possessionHome}%</span>
                <span className="text-slate-400">{stats.possessionAway}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${stats.possessionHome}%` }}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${stats.possessionAway}%` }}
                />
              </div>
            </div>

            {/* Shots */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Shots</div>
              <div className="font-mono font-bold text-white text-sm">
                <span className="text-emerald-400">{stats.shotsHome}</span> - <span className="text-amber-400">{stats.shotsAway}</span>
              </div>
            </div>

            {/* Corners */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Corners</div>
              <div className="font-mono font-bold text-white text-sm">
                <span className="text-emerald-400">{stats.cornersHome}</span> - <span className="text-amber-400">{stats.cornersAway}</span>
              </div>
            </div>

            {/* Cards */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">Cards</div>
              <div className="font-mono font-bold text-white text-sm flex items-center justify-center gap-1">
                <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block" />
                <span>0 - 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
