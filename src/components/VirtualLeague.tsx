import React, { useState, useEffect } from 'react';
import { Gamepad2, Timer, Trophy, Zap, RefreshCw } from 'lucide-react';
import { Currency, Language, Match } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface VirtualLeagueProps {
  language: Language;
  currency: Currency;
  selectedOddIds: string[];
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
}

export const VirtualLeague: React.FC<VirtualLeagueProps> = ({
  language,
  currency,
  selectedOddIds,
  onSelectOdd,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(38);
  const [matchWeek, setMatchWeek] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setMatchWeek((w) => w + 1);
          sounds.playGoal();
          return 50; // New virtual round
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const virtualMatches: Match[] = [
    {
      id: `v-match-1-${matchWeek}`,
      sport: 'virtual',
      league: 'Virtual Sheger League',
      leagueCountry: 'Ethiopia',
      leagueFlag: '⚡',
      homeTeam: 'Addis Ababa Stars',
      awayTeam: 'Rift Valley United',
      time: `Round ${matchWeek} · 00:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`,
      status: 'upcoming',
      odds: {
        matchWinner: {
          home: { id: `v1-1-${matchWeek}`, name: 'Addis Stars', odd: 1.95, marketName: '1X2' },
          draw: { id: `v1-x-${matchWeek}`, name: 'Draw', odd: 3.20, marketName: '1X2' },
          away: { id: `v1-2-${matchWeek}`, name: 'Rift Valley', odd: 3.50, marketName: '1X2' },
        },
      },
    },
    {
      id: `v-match-2-${matchWeek}`,
      sport: 'virtual',
      league: 'Virtual Premier Pro',
      leagueCountry: 'England',
      leagueFlag: '⚡',
      homeTeam: 'London Red',
      awayTeam: 'Manchester Blue',
      time: `Round ${matchWeek} · 00:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`,
      status: 'upcoming',
      odds: {
        matchWinner: {
          home: { id: `v2-1-${matchWeek}`, name: 'London Red', odd: 2.40, marketName: '1X2' },
          draw: { id: `v2-x-${matchWeek}`, name: 'Draw', odd: 3.10, marketName: '1X2' },
          away: { id: `v2-2-${matchWeek}`, name: 'Man Blue', odd: 2.70, marketName: '1X2' },
        },
      },
    },
    {
      id: `v-match-3-${matchWeek}`,
      sport: 'virtual',
      league: 'Virtual Champions',
      leagueCountry: 'Europe',
      leagueFlag: '⚡',
      homeTeam: 'Madrid White',
      awayTeam: 'Bavaria Munich',
      time: `Round ${matchWeek} · 00:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`,
      status: 'upcoming',
      odds: {
        matchWinner: {
          home: { id: `v3-1-${matchWeek}`, name: 'Madrid White', odd: 2.15, marketName: '1X2' },
          draw: { id: `v3-x-${matchWeek}`, name: 'Draw', odd: 3.30, marketName: '1X2' },
          away: { id: `v3-2-${matchWeek}`, name: 'Bavaria', odd: 3.10, marketName: '1X2' },
        },
      },
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
      {/* Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{t(language, 'virtual')}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                RAPID 50s
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'am' ? 'በየ 50 ሰከንድ የሚካሄዱ ፈጣን የቨርቹዋል ጨዋታዎች' : 'Simulated matches settling every 50 seconds'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <Timer className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-slate-400">Next Kickoff:</span>
          <span className="text-emerald-400 font-bold">00:{timerSeconds < 10 ? '0' : ''}{timerSeconds}</span>
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {virtualMatches.map((vm) => (
          <div
            key={vm.id}
            className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <span>{vm.league}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{vm.time}</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {vm.homeTeam} vs {vm.awayTeam}
              </div>
            </div>

            {/* 1X2 Odds */}
            <div className="grid grid-cols-3 gap-1.5 sm:w-64">
              {[
                { key: '1', odd: vm.odds.matchWinner.home, label: '1' },
                { key: 'X', odd: vm.odds.matchWinner.draw, label: 'X' },
                { key: '2', odd: vm.odds.matchWinner.away, label: '2' },
              ].map(({ key, odd, label }) => {
                const isSelected = selectedOddIds.includes(odd.id);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectOdd(vm, odd.id, odd.name, odd.odd, '1X2');
                      sounds.playClick();
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer font-mono ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-sans">{label}</div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                      {odd.odd.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
