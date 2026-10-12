import React, { useState } from 'react';
import { Trophy, Sparkles, Check, Flame, Shuffle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface MegaJackpotProps {
  language: Language;
  currency: Currency;
  balance: number;
  onPlaceJackpot: (ticketCode: string) => void;
}

export const MegaJackpot: React.FC<MegaJackpotProps> = ({
  language,
  currency,
  balance,
  onPlaceJackpot,
}) => {
  const jackpotFixtures = [
    { id: 'jp-1', match: 'Saint George vs Ethiopian Coffee', league: 'Ethio Premier' },
    { id: 'jp-2', match: 'Fasil Kenema vs Bahir Dar Kenema', league: 'Ethio Premier' },
    { id: 'jp-3', match: 'Arsenal vs Chelsea', league: 'Premier League' },
    { id: 'jp-4', match: 'Liverpool vs Manchester City', league: 'Premier League' },
    { id: 'jp-5', match: 'Real Madrid vs Bayern Munich', league: 'Champions League' },
    { id: 'jp-6', match: 'Hawassa City vs Sidama Coffee', league: 'Ethio Premier' },
    { id: 'jp-7', match: 'Barcelona vs Atletico Madrid', league: 'La Liga' },
    { id: 'jp-8', match: 'Inter Milan vs Juventus', league: 'Serie A' },
  ];

  const [predictions, setPredictions] = useState<Record<string, '1' | 'X' | '2'>>({});
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSelect = (matchId: string, pick: '1' | 'X' | '2') => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: pick,
    }));
    sounds.playClick();
  };

  const handleLuckyDip = () => {
    const picks: ('1' | 'X' | '2')[] = ['1', 'X', '2'];
    const autoPicks: Record<string, '1' | 'X' | '2'> = {};
    jackpotFixtures.forEach((f) => {
      autoPicks[f.id] = picks[Math.floor(Math.random() * picks.length)];
    });
    setPredictions(autoPicks);
    sounds.playClick();
  };

  const handleEnterJackpot = () => {
    if (Object.keys(predictions).length < jackpotFixtures.length) {
      alert(language === 'am' ? 'እባክዎ ሁሉንም 8 ጨዋታዎች ይገምቱ!' : 'Please make predictions for all 8 matches!');
      return;
    }
    if (balance < 20) {
      alert(language === 'am' ? 'የጃክፖት መግቢያ 20 ብር ነው! በቂ ሂሳብ የለዎትም።' : 'Jackpot entry fee is 20 ETB! Insufficient balance.');
      return;
    }

    const code = 'JP-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedCode(code);
    onPlaceJackpot(code);
    confetti({ particleCount: 80, spread: 80 });
    sounds.playBetPlaced();
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-emerald-950 p-6 border-b border-amber-500/30 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>CASH BET GRAND POOL</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          500,000 <span className="text-amber-400">{currency === 'ETB' ? 'ETB' : 'USD'}</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
          {language === 'am' 
            ? 'ሁሉንም 8 የኢትዮጵያ እና የአውሮፓ ጨዋታዎች በትክክል ገምተው 500,000 ብር ያሸንፉ!' 
            : 'Predict all 8 Ethiopian & European match outcomes to win the Mega Cashpot!'}
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handleLuckyDip}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Lucky Dip (Auto Pick)</span>
          </button>
        </div>
      </div>

      {submittedCode && (
        <div className="m-4 p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-center space-y-2">
          <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Jackpot Ticket Confirmed!</span>
          </div>
          <div className="text-xs font-mono text-white">
            Ticket ID: <span className="text-amber-400 font-bold">{submittedCode}</span>
          </div>
        </div>
      )}

      {/* Fixtures List */}
      <div className="p-4 space-y-2.5">
        {jackpotFixtures.map((fixture, idx) => {
          const currentPick = predictions[fixture.id];
          return (
            <div
              key={fixture.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">
                    {fixture.league}
                  </div>
                  <div className="text-xs font-bold text-white">
                    {fixture.match}
                  </div>
                </div>
              </div>

              {/* 1X2 Radio Pick buttons */}
              <div className="grid grid-cols-3 gap-2 sm:w-56 shrink-0">
                {(['1', 'X', '2'] as const).map((pick) => {
                  const isSelected = currentPick === pick;
                  return (
                    <button
                      key={pick}
                      onClick={() => handleSelect(fixture.id, pick)}
                      className={`py-2 text-xs font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {pick}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Submit */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs font-mono">
          <span className="text-slate-400">Picks Made: </span>
          <span className="text-emerald-400 font-bold">
            {Object.keys(predictions).length} / 8
          </span>
          <span className="text-slate-500 ml-2">Entry: 20 ETB</span>
        </div>

        <button
          onClick={handleEnterJackpot}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <span>Submit Jackpot Ticket</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
