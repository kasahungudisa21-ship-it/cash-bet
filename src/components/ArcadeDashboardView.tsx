import React from 'react';
import { CashRushGame } from './CashRushGame';
import { MegaJackpot } from './MegaJackpot';
import { VirtualLeague } from './VirtualLeague';
import { Currency, Language, Match } from '../types/betting';
import { Sparkles, Trophy, Rocket, Gamepad2 } from 'lucide-react';
import { t } from '../utils/translations';

interface ArcadeDashboardViewProps {
  language: Language;
  currency: Currency;
  balance: number;
  onUpdateCrashBalance: (amt: number, type: 'win' | 'loss', desc: string) => void;
  onPlaceJackpot: (code: string) => void;
  selectedOddIds: string[];
  onSelectOdd: (match: Match, oddId: string, oddName: string, oddVal: number, marketName: string) => void;
}

export const ArcadeDashboardView: React.FC<ArcadeDashboardViewProps> = ({
  language,
  currency,
  balance,
  onUpdateCrashBalance,
  onPlaceJackpot,
  selectedOddIds,
  onSelectOdd,
}) => {
  return (
    <div className="space-y-6 select-none">
      {/* Top Arcade Banner with Ethiopian Banknote Style */}
      <div className="rounded-2xl birr-200-gradient border birr-200-border p-4.5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'am' ? 'የካሽ ቤት ፈጣን ጨዋታዎች እና ጃክፖት' : 'Cash Bet Fast Games & Jackpot'}</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                INSTANT WIN
              </span>
            </h2>
            <p className="text-xs text-purple-200">
              {language === 'am' 
                ? 'የካሽ ረሽ ሮኬት፣ የ500,000 ብር ሜጋ ጃክፖት እና ቨርቹዋል ሊግ በአንድ ቦታ' 
                : 'Cash Rush crash game, 500,000 ETB Mega Jackpot, and Virtual League all in one screen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-400/30 text-amber-300 font-bold">
            💰 {balance.toLocaleString()} {currency === 'ETB' ? 'ብር' : '$'}
          </span>
        </div>
      </div>

      {/* Grid: Cash Rush Rocket + Mega Jackpot */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <CashRushGame
          balance={balance}
          onUpdateBalance={onUpdateCrashBalance}
          currency={currency}
          language={language}
        />

        <MegaJackpot
          language={language}
          currency={currency}
          balance={balance}
          onPlaceJackpot={onPlaceJackpot}
        />
      </div>

      {/* Virtual Football League Section */}
      <div className="mt-4">
        <VirtualLeague
          language={language}
          currency={currency}
          selectedOddIds={selectedOddIds}
          onSelectOdd={onSelectOdd}
        />
      </div>
    </div>
  );
};
