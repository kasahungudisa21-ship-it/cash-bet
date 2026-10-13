import React from 'react';
import { LivePitchTracker } from './LivePitchTracker';
import { MatchCard } from './MatchCard';
import { Match, Language } from '../types/betting';
import { Radio, Flame, Activity, Zap, Trophy } from 'lucide-react';
import { t } from '../utils/translations';

interface LiveStadiumDashboardViewProps {
  liveMatches: Match[];
  language: Language;
  selectedOddIds: string[];
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
  onOpenDetails: (match: Match) => void;
}

export const LiveStadiumDashboardView: React.FC<LiveStadiumDashboardViewProps> = ({
  liveMatches,
  language,
  selectedOddIds,
  onSelectOdd,
  onOpenDetails,
}) => {
  return (
    <div className="space-y-5 select-none">
      {/* Live Stadium Banner with Ethiopian Tricolor & Live Pulse */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl relative overflow-hidden">
        <div className="ethiopia-tricolor-line h-1 w-full absolute top-0 left-0" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                {language === 'am' ? 'የቀጥታ ስታዲየም ማዕከል (Live In-Play Arena)' : 'Live Stadium Command Center'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-black uppercase tracking-wider animate-pulse">
                LIVE NOW
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'am' 
                ? 'በቀጥታ ሜዳ ላይ የሚደረጉ ኳሶችን፣ የማጥቃት እንቅስቃሴዎችን እና ተለዋዋጭ ኦድሶችን ይከታተሉ' 
                : 'Follow real-time ball movement, dangerous attacks, and fluctuating in-play odds'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{liveMatches.length} {language === 'am' ? 'ቀጥታ ጨዋታዎች' : 'Live Matches'}</span>
          </div>
        </div>
      </div>

      {/* Main Pitch Tracker */}
      {liveMatches.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl">
          <LivePitchTracker
            liveMatches={liveMatches}
            language={language}
            onSelectOdd={onSelectOdd}
            selectedOddIds={selectedOddIds}
          />
        </div>
      )}

      {/* Other Live Matches Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm">
              {language === 'am' ? 'ሁሉም የቀጥታ ጨዋታዎች' : 'All In-Play Fixtures'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {liveMatches.length} Fixtures
          </span>
        </div>

        <div className="space-y-3">
          {liveMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              language={language}
              selectedOddIds={selectedOddIds}
              onSelectOdd={onSelectOdd}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
