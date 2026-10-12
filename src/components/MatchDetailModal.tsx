import React, { useState } from 'react';
import { X, Trophy, Clock, Zap, Shield, Target } from 'lucide-react';
import { Match, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  language: Language;
  selectedOddIds: string[];
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  language,
  selectedOddIds,
  onSelectOdd,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'goals' | 'halftime'>('main');

  if (!match) return null;

  const renderOddBox = (id: string, name: string, odd: number, market: string) => {
    const isSelected = selectedOddIds.includes(id);

    return (
      <button
        key={id}
        onClick={() => {
          onSelectOdd(match, id, name, odd, market);
          sounds.playClick();
        }}
        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md shadow-emerald-500/20'
            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/40 hover:bg-slate-850'
        }`}
      >
        <span className={`text-xs font-semibold ${isSelected ? 'text-slate-950' : 'text-slate-300'}`}>
          {name}
        </span>
        <span className={`text-sm font-mono font-bold ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
          {odd.toFixed(2)}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span>{match.leagueFlag}</span>
            <div>
              <div className="text-xs font-mono text-slate-400">
                {match.league} · {match.time}
              </div>
              <h3 className="text-base font-bold text-white truncate">
                {match.homeTeam} vs {match.awayTeam}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market Category Tabs */}
        <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold">
          {[
            { id: 'main', label: 'Main Markets' },
            { id: 'goals', label: 'Goals & Over/Under' },
            { id: 'halftime', label: 'Double Chance & Halftime' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-5">
          {activeTab === 'main' && (
            <>
              {/* 1X2 Full Time */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                  {t(language, 'matchWinner')}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {renderOddBox(
                    match.odds.matchWinner.home.id,
                    `1 (${match.homeTeam.split(' ')[0]})`,
                    match.odds.matchWinner.home.odd,
                    '1X2'
                  )}
                  {renderOddBox(
                    match.odds.matchWinner.draw.id,
                    'X (Draw)',
                    match.odds.matchWinner.draw.odd,
                    '1X2'
                  )}
                  {renderOddBox(
                    match.odds.matchWinner.away.id,
                    `2 (${match.awayTeam.split(' ')[0]})`,
                    match.odds.matchWinner.away.odd,
                    '1X2'
                  )}
                </div>
              </div>

              {/* Both Teams To Score */}
              {match.odds.bothTeamsScore && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                    {t(language, 'bothTeamsScore')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderOddBox(
                      match.odds.bothTeamsScore.yes.id,
                      'Yes (GG)',
                      match.odds.bothTeamsScore.yes.odd,
                      'Both Teams To Score'
                    )}
                    {renderOddBox(
                      match.odds.bothTeamsScore.no.id,
                      'No (NG)',
                      match.odds.bothTeamsScore.no.odd,
                      'Both Teams To Score'
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'goals' && (
            <>
              {/* Over / Under 2.5 */}
              {match.odds.overUnder && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                    Total Goals 2.5
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderOddBox(
                      match.odds.overUnder.over.id,
                      'Over 2.5 Goals',
                      match.odds.overUnder.over.odd,
                      'Over/Under 2.5'
                    )}
                    {renderOddBox(
                      match.odds.overUnder.under.id,
                      'Under 2.5 Goals',
                      match.odds.overUnder.under.odd,
                      'Over/Under 2.5'
                    )}
                  </div>
                </div>
              )}

              {/* Additional Over/Under simulated tiers */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                  Total Goals 1.5 & 3.5
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {renderOddBox(
                    `${match.id}-ov15`,
                    'Over 1.5 Goals',
                    1.22,
                    'Over/Under 1.5'
                  )}
                  {renderOddBox(
                    `${match.id}-un15`,
                    'Under 1.5 Goals',
                    3.80,
                    'Over/Under 1.5'
                  )}
                  {renderOddBox(
                    `${match.id}-ov35`,
                    'Over 3.5 Goals',
                    2.85,
                    'Over/Under 3.5'
                  )}
                  {renderOddBox(
                    `${match.id}-un35`,
                    'Under 3.5 Goals',
                    1.36,
                    'Over/Under 3.5'
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'halftime' && (
            <>
              {/* Double Chance */}
              {match.odds.doubleChance && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                    {t(language, 'doubleChance')}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {renderOddBox(
                      match.odds.doubleChance.homeOrDraw.id,
                      '1X (Home or Draw)',
                      match.odds.doubleChance.homeOrDraw.odd,
                      'Double Chance'
                    )}
                    {renderOddBox(
                      match.odds.doubleChance.homeOrAway.id,
                      '12 (Home or Away)',
                      match.odds.doubleChance.homeOrAway.odd,
                      'Double Chance'
                    )}
                    {renderOddBox(
                      match.odds.doubleChance.drawOrAway.id,
                      'X2 (Draw or Away)',
                      match.odds.doubleChance.drawOrAway.odd,
                      'Double Chance'
                    )}
                  </div>
                </div>
              )}

              {/* Draw No Bet */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 font-mono mb-2">
                  Draw No Bet (DNB)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {renderOddBox(
                    `${match.id}-dnb1`,
                    `1 - ${match.homeTeam.split(' ')[0]}`,
                    1.55,
                    'Draw No Bet'
                  )}
                  {renderOddBox(
                    `${match.id}-dnb2`,
                    `2 - ${match.awayTeam.split(' ')[0]}`,
                    2.30,
                    'Draw No Bet'
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
