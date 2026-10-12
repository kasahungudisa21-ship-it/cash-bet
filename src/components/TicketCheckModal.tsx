import React, { useState } from 'react';
import { X, Search, ReceiptText, CheckCircle2, Clock, XCircle, DollarSign } from 'lucide-react';
import { Currency, Language, PlacedBet } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface TicketCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  allBets: PlacedBet[];
}

export const TicketCheckModal: React.FC<TicketCheckModalProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  allBets,
}) => {
  const [ticketInput, setTicketInput] = useState('CB-88219');
  const [searchedBet, setSearchedBet] = useState<PlacedBet | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = () => {
    sounds.playClick();
    const clean = ticketInput.trim().toUpperCase();
    const found = allBets.find((b) => b.code.toUpperCase() === clean || b.id.toUpperCase() === clean);
    setSearchedBet(found || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {t(language, 'checkTicket')} / Verify Slip
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Enter Ticket Code (e.g. CB-88219)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSearch}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Try codes:</span>
            {allBets.slice(0, 3).map((b) => (
              <button
                key={b.code}
                onClick={() => {
                  setTicketInput(b.code);
                  const found = allBets.find((item) => item.code === b.code);
                  setSearchedBet(found || null);
                  setSearched(true);
                  sounds.playClick();
                }}
                className="text-amber-400 hover:underline bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
              >
                {b.code}
              </button>
            ))}
          </div>

          {/* Result view */}
          {searched && (
            <div>
              {searchedBet ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <div className="text-sm font-black font-mono text-white">
                        {searchedBet.code}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Placed on {searchedBet.date}
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                      searchedBet.status === 'won'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : searchedBet.status === 'active'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : searchedBet.status === 'cashed_out'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {searchedBet.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Picks */}
                  <div className="space-y-1.5">
                    {searchedBet.selections.map((sel, idx) => (
                      <div key={idx} className="text-xs bg-slate-900/60 p-2 rounded-lg flex justify-between items-center">
                        <div className="truncate pr-2">
                          <div className="font-semibold text-white truncate">{sel.matchTitle}</div>
                          <div className="text-[10px] text-slate-400">{sel.marketName} · {sel.selectionName}</div>
                        </div>
                        <div className="font-mono font-bold text-emerald-400">
                          {sel.odd.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-500">Stake: </span>
                      <span className="text-white font-bold">{searchedBet.currency} {searchedBet.stake}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Payout: </span>
                      <span className="text-emerald-400 font-bold">{searchedBet.currency} {searchedBet.potentialPayout}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                  Ticket not found. Please double-check the ticket number.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
