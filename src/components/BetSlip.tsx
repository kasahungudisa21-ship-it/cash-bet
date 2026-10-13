import React, { useState } from 'react';
import { 
  Trash2, 
  ReceiptText, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  History, 
  DollarSign, 
  ShieldAlert,
  ChevronDown,
  X,
  Printer,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BetSelection, Currency, Language, PlacedBet } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface BetSlipProps {
  selections: BetSelection[];
  onRemoveSelection: (matchId: string) => void;
  onClearSlip: () => void;
  balance: number;
  currency: Currency;
  language: Language;
  onPlaceBet: (newBet: PlacedBet) => boolean;
  activeBets: PlacedBet[];
  onCashOut: (betId: string, cashoutAmount: number) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLoadBookingCode: (code: string) => void;
}

export const BetSlip: React.FC<BetSlipProps> = ({
  selections,
  onRemoveSelection,
  onClearSlip,
  balance,
  currency,
  language,
  onPlaceBet,
  activeBets,
  onCashOut,
  isOpenMobile,
  onCloseMobile,
  onLoadBookingCode,
}) => {
  const [tab, setTab] = useState<'slip' | 'mybets'>('slip');
  const [betType, setBetType] = useState<'accumulator' | 'single'>('accumulator');
  const [stake, setStake] = useState<number>(100);
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [lastPlacedBet, setLastPlacedBet] = useState<PlacedBet | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<PlacedBet | null>(null);

  // Quick Stake options
  const quickStakes = currency === 'ETB' ? [50, 100, 250, 500, 1000] : [5, 10, 25, 50, 100];

  // Calculate total odds
  const totalOdds = selections.reduce((acc, curr) => acc * curr.odd, 1);

  // Calculate Accumulator Bonus multiplier
  let bonusMultiplier = 1.0;
  if (selections.length >= 3 && selections.length < 5) {
    bonusMultiplier = 1.05; // 5% boost
  } else if (selections.length >= 5 && selections.length < 8) {
    bonusMultiplier = 1.15; // 15% boost
  } else if (selections.length >= 8 && selections.length < 12) {
    bonusMultiplier = 1.35; // 35% boost
  } else if (selections.length >= 12) {
    bonusMultiplier = 1.60; // 60% boost
  }

  const bonusAmount = selections.length >= 3 ? ((totalOdds * stake * bonusMultiplier) - (totalOdds * stake)) : 0;
  const potentialPayout = totalOdds * stake * bonusMultiplier;

  // Handle Bet Submission
  const handlePlaceBet = () => {
    if (selections.length === 0) return;
    if (stake <= 0) return;
    if (stake > balance) {
      alert(language === 'am' ? 'በቂ ሂሳብ የለዎትም! እባክዎ በቴሌብር ገንዘብ ያስገቡ።' : 'Insufficient balance! Please deposit via Telebirr or CBE.');
      return;
    }

    const randomCode = 'CB-' + Math.floor(10000 + Math.random() * 90000);
    const newBet: PlacedBet = {
      id: 'bet-' + Date.now(),
      code: randomCode,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: selections.length === 1 ? 'single' : betType,
      selections: [...selections],
      stake,
      totalOdds: Number(totalOdds.toFixed(2)),
      bonusMultiplier,
      potentialPayout: Number(potentialPayout.toFixed(2)),
      status: 'active',
      cashoutOffer: Number((stake * 0.92).toFixed(2)),
      currency,
    };

    const success = onPlaceBet(newBet);
    if (success) {
      sounds.playBetPlaced();
      setLastPlacedBet(newBet);
      onClearSlip();
    }
  };

  const copyBookingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-slate-950 p-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => {
              setTab('slip');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'slip'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>{t(language, 'betSlip')}</span>
            {selections.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                tab === 'slip' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500 text-slate-950'
              }`}>
                {selections.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setTab('mybets');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'mybets'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t(language, 'myBets')}</span>
            {activeBets.filter(b => b.status === 'active').length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                tab === 'mybets' ? 'bg-slate-950 text-emerald-400' : 'bg-amber-500 text-slate-950'
              }`}>
                {activeBets.filter(b => b.status === 'active').length}
              </span>
            )}
          </button>
        </div>

        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {tab === 'slip' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Slip Type Sub-header & Booking Code Load */}
          <div className="bg-slate-950/60 px-3 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBetType('accumulator')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  betType === 'accumulator'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(language, 'multi')}
              </button>
              <button
                onClick={() => setBetType('single')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  betType === 'single'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(language, 'single')}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                {t(language, 'loadCode')}
              </button>
              {selections.length > 0 && (
                <button
                  onClick={onClearSlip}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title={t(language, 'clearAll')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Booking Code Quick Input */}
          {showCodeInput && (
            <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={bookingCodeInput}
                onChange={(e) => setBookingCodeInput(e.target.value)}
                placeholder="e.g. CB-88219"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white uppercase font-mono"
              />
              <button
                onClick={() => {
                  if (bookingCodeInput.trim()) {
                    onLoadBookingCode(bookingCodeInput.trim());
                    setBookingCodeInput('');
                    setShowCodeInput(false);
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
              >
                Load
              </button>
            </div>
          )}

          {/* Success Banner if Bet Just Placed */}
          {lastPlacedBet && (
            <div className="m-3 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {language === 'am' ? 'ውርርድ በተሳካ ሁኔታ ገብቷል!' : 'Bet Placed Successfully!'}
                </span>
                <button 
                  onClick={() => setLastPlacedBet(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-950/80 p-2 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{t(language, 'bookingCode')}:</span>
                <span className="text-amber-400 font-bold">{lastPlacedBet.code}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyBookingCode(lastPlacedBet.code)}
                    className="text-emerald-400 hover:text-white p-1"
                    title="Copy Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setViewingTicket(lastPlacedBet)}
                    className="text-amber-400 hover:text-amber-300 p-1 flex items-center gap-1 font-sans text-[11px] font-bold"
                    title="View Ticket"
                  >
                    <ReceiptText className="w-3.5 h-3.5" />
                    <span>ቲኬት እይ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selections List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {selections.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                <ReceiptText className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
                <div className="text-xs font-bold text-slate-400">
                  {t(language, 'emptySlip')}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                  {t(language, 'emptySlipDesc')}
                </div>
              </div>
            ) : (
              selections.map((sel) => (
                <div
                  key={sel.matchId}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-2.5 relative group hover:border-slate-700 transition-colors"
                >
                  <button
                    onClick={() => onRemoveSelection(sel.matchId)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="pr-5">
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {sel.league}
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {sel.matchTitle}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 mr-1">{sel.marketName}:</span>
                      <span className="font-bold text-amber-400">{sel.selectionName}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {sel.odd.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Calculation & Place Bet Section */}
          {selections.length > 0 && (
            <div className="bg-slate-950 p-3.5 border-t border-slate-800 space-y-3">
              {/* Accumulator Bonus Indicator */}
              {selections.length >= 3 && (
                <div className="bg-gradient-to-r from-amber-950/60 to-emerald-950/60 border border-amber-500/30 rounded-xl p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{Math.round((bonusMultiplier - 1) * 100)}% Multi Bonus</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    +{currency === 'ETB' ? 'Br ' : '$'}{bonusAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Quick Stake Chips */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  {t(language, 'quickStakes')} ({currency})
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {quickStakes.map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setStake(val);
                        sounds.playClick();
                      }}
                      className={`py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                        stake === val
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stake Input */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2">
                <span className="text-xs text-slate-400 font-semibold pl-1">
                  {t(language, 'stake')} ({currency}):
                </span>
                <input
                  type="number"
                  min="5"
                  value={stake}
                  onChange={(e) => setStake(Math.max(1, Number(e.target.value)))}
                  className="w-24 text-right bg-transparent text-sm font-mono font-black text-white focus:outline-none"
                />
              </div>

              {/* Summary Stats */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>{t(language, 'odds')}:</span>
                  <span className="text-white font-bold">{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-sans font-bold">
                    {t(language, 'possibleWin')}:
                  </span>
                  <span className="text-base font-black font-mono text-emerald-400">
                    {currency === 'ETB' ? 'Br ' : '$'}
                    {potentialPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Place Bet Button */}
              <button
                onClick={handlePlaceBet}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t(language, 'placeBet')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* My Bets Tab with Cashout */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeBets.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-500">
              <History className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
              <div className="text-xs font-bold text-slate-400">No placed bets yet</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Your active and completed betting tickets will appear here
              </div>
            </div>
          ) : (
            activeBets.map((bet) => (
              <div
                key={bet.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-amber-400 font-bold">{bet.code}</span>
                    <span className="text-slate-500">· {bet.date}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    bet.status === 'active'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : bet.status === 'won'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : bet.status === 'cashed_out'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {bet.status.toUpperCase()}
                  </span>
                </div>

                {/* Selections in this ticket */}
                <div className="space-y-1.5 border-t border-slate-900 pt-2">
                  {bet.selections.map((sel, sIdx) => (
                    <div key={sIdx} className="text-[11px] flex justify-between text-slate-300">
                      <span className="truncate pr-2">{sel.matchTitle}</span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">
                        {sel.selectionName} @ {sel.odd}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stake & Return */}
                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Stake: </span>
                    <span className="text-white font-bold">{bet.currency} {bet.stake}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{bet.currency} {bet.potentialPayout}</span>
                    <button
                      onClick={() => setViewingTicket(bet)}
                      className="text-amber-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800"
                      title="View Official Ticket"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Cash Out Button if Active */}
                {bet.status === 'active' && bet.cashoutOffer > 0 && (
                  <button
                    onClick={() => {
                      onCashOut(bet.id, bet.cashoutOffer);
                      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 } });
                      sounds.playWin();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{t(language, 'cashOut')} {bet.currency} {bet.cashoutOffer}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed BetSlip on the right */}
      <div className="hidden lg:block w-80 shrink-0 sticky top-20 self-start h-[calc(100vh-6rem)]">
        {content}
      </div>

      {/* Mobile Modal Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="h-[85vh] w-full p-2">
            {content}
          </div>
        </div>
      )}

      {/* Official Ethiopian Printable Betting Ticket Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
            {/* Ticket Header */}
            <div className="bg-slate-950 text-white p-4 text-center space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                NATIONAL LOTTERY ADMINISTRATION (NLA) LICENSED
              </div>
              <h2 className="text-xl font-black tracking-wider text-white">
                CASH<span className="text-emerald-400">BET</span> ETHIOPIA
              </h2>
              <div className="text-[10px] text-slate-400 font-sans">
                የኢትዮጵያ ህጋዊ የስፖርት ውርርድ ደረሰኝ
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-4 space-y-3 bg-slate-50 text-slate-900 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between border-b border-dashed border-slate-400 pb-2">
                <div>
                  <div className="text-[10px] text-slate-500">TICKET NUMBER:</div>
                  <div className="font-black text-sm text-slate-950">{viewingTicket.code}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">DATE & TIME:</div>
                  <div className="font-bold">{viewingTicket.date}</div>
                </div>
              </div>

              {/* Status Stamp */}
              <div className="text-center py-1">
                <span className={`px-3 py-0.5 rounded font-black text-xs ${
                  viewingTicket.status === 'won'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                    : viewingTicket.status === 'cashed_out'
                    ? 'bg-blue-100 text-blue-800 border border-blue-400'
                    : 'bg-amber-100 text-amber-900 border border-amber-400'
                }`}>
                  ● {viewingTicket.status.toUpperCase()}
                </span>
              </div>

              {/* Match Selections */}
              <div className="space-y-2 border-y border-dashed border-slate-400 py-2.5">
                {viewingTicket.selections.map((sel, sIdx) => (
                  <div key={sIdx} className="space-y-0.5 text-[11px]">
                    <div className="font-bold text-slate-950">{sel.matchTitle}</div>
                    <div className="flex justify-between text-slate-700">
                      <span>{sel.marketName}: <strong>{sel.selectionName}</strong></span>
                      <span className="font-black">@{sel.odd.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>TOTAL ODDS:</span>
                  <span className="font-bold text-slate-900">{viewingTicket.totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>STAKE AMOUNT:</span>
                  <span className="font-bold text-slate-900">{viewingTicket.currency} {viewingTicket.stake.toFixed(2)}</span>
                </div>
                {viewingTicket.bonusMultiplier > 1 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>ACCUMULATOR BONUS:</span>
                    <span>+{Math.round((viewingTicket.bonusMultiplier - 1) * 100)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-300">
                  <span>GROSS RETURN:</span>
                  <span className="text-emerald-700 font-mono">
                    {viewingTicket.currency} {viewingTicket.potentialPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="text-center pt-2">
                <div className="tracking-[6px] text-lg font-mono text-slate-800">
                  ||||| ||| |||| || |||||| ||| ||
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  SCAN TO VERIFY AT ANY CASH BET AGENT
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-200 border-t border-slate-300 flex items-center justify-between gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ቲኬት አትም' : 'Print Slip'}</span>
              </button>
              <button
                onClick={() => setViewingTicket(null)}
                className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 font-bold rounded-lg text-xs cursor-pointer"
              >
                {language === 'am' ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
