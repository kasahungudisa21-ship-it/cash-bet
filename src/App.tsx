import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SportsSidebar } from './components/SportsSidebar';
import { LivePitchTracker } from './components/LivePitchTracker';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { BetSlip } from './components/BetSlip';
import { CashRushGame } from './components/CashRushGame';
import { VirtualLeague } from './components/VirtualLeague';
import { MegaJackpot } from './components/MegaJackpot';
import { WalletModal } from './components/WalletModal';
import { TicketCheckModal } from './components/TicketCheckModal';
import { 
  BetSelection, 
  Currency, 
  Language, 
  Match, 
  PlacedBet, 
  SportType, 
  Transaction 
} from './types/betting';
import { 
  INITIAL_MATCHES, 
  INITIAL_PLACED_BETS, 
  INITIAL_TRANSACTIONS 
} from './data/mockData';
import { t } from './utils/translations';
import { sounds } from './utils/audio';
import { Flame, Radio, Zap, Shield, Sparkles } from 'lucide-react';

export default function App() {
  // Localization & Currency
  const [language, setLanguage] = useState<Language>('am'); // Default Amharic for user prompt
  const [currency, setCurrency] = useState<Currency>('ETB');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User State
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('cashbet_balance');
    return saved ? Number(saved) : 2500;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cashbet_tx');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeBets, setActiveBets] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem('cashbet_bets');
    return saved ? JSON.parse(saved) : INITIAL_PLACED_BETS;
  });

  // Matches State with Live Simulation
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedSport, setSelectedSport] = useState<SportType | 'all' | 'ethiopian'>('all');
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavTab, setActiveNavTab] = useState<string>('sports');

  // Bet Slip State
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [mobileSlipOpen, setMobileSlipOpen] = useState(false);

  // Modals
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletInitialTab, setWalletInitialTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [ticketCheckOpen, setTicketCheckOpen] = useState(false);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('cashbet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('cashbet_tx', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cashbet_bets', JSON.stringify(activeBets));
  }, [activeBets]);

  // Periodic Live Match Simulation: tick minutes and randomly shift odds
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.status !== 'live') return m;

          // Slightly fluctuate 1X2 odds to feel alive
          const delta = (Math.random() - 0.5) * 0.08;
          const newHomeOdd = Math.max(1.05, Number((m.odds.matchWinner.home.odd + delta).toFixed(2)));
          const trend: 'up' | 'down' = delta > 0 ? 'up' : 'down';

          return {
            ...m,
            odds: {
              ...m.odds,
              matchWinner: {
                ...m.odds.matchWinner,
                home: {
                  ...m.odds.matchWinner.home,
                  odd: newHomeOdd,
                  trend,
                },
              },
            },
          };
        })
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Handle Odd Click (Add / Toggle from BetSlip)
  const handleSelectOdd = (
    match: Match,
    oddId: string,
    oddName: string,
    oddVal: number,
    marketName: string
  ) => {
    setSelections((prev) => {
      // Check if already in slip for this exact match
      const existingIdx = prev.findIndex((s) => s.matchId === match.id);

      if (existingIdx !== -1) {
        // If clicking same odd again, remove it
        if (prev[existingIdx].selectionName === oddName && prev[existingIdx].marketName === marketName) {
          return prev.filter((_, i) => i !== existingIdx);
        }
        // If picking different market on same match, replace it
        const copy = [...prev];
        copy[existingIdx] = {
          matchId: match.id,
          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          league: match.league,
          marketName,
          selectionName: oddName,
          odd: oddVal,
          isLive: match.status === 'live',
          sport: match.sport,
        };
        return copy;
      }

      // Add new selection
      return [
        ...prev,
        {
          matchId: match.id,
          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          league: match.league,
          marketName,
          selectionName: oddName,
          odd: oddVal,
          isLive: match.status === 'live',
          sport: match.sport,
        },
      ];
    });
  };

  const handleRemoveSelection = (matchId: string) => {
    setSelections((prev) => prev.filter((s) => s.matchId !== matchId));
    sounds.playClick();
  };

  const handleClearSlip = () => {
    setSelections([]);
    sounds.playClick();
  };

  // Place Bet
  const handlePlaceBet = (newBet: PlacedBet): boolean => {
    if (balance < newBet.stake) return false;

    setBalance((prev) => prev - newBet.stake);
    setActiveBets((prev) => [newBet, ...prev]);

    // Record transaction
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'bet_placed',
      amount: newBet.stake,
      currency,
      method: 'Internal',
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: newBet.code,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return true;
  };

  // Cash Out Active Bet
  const handleCashOut = (betId: string, cashoutAmount: number) => {
    setActiveBets((prev) =>
      prev.map((b) => (b.id === betId ? { ...b, status: 'cashed_out', cashoutOffer: 0 } : b))
    );
    setBalance((prev) => prev + cashoutAmount);

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'cashout',
      amount: cashoutAmount,
      currency,
      method: 'Internal',
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: 'CO-' + betId.slice(-5),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Deposit
  const handleDeposit = (amount: number, method: 'Telebirr' | 'CBE Birr' | 'Chapa' | 'Card') => {
    setBalance((prev) => prev + amount);
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'deposit',
      amount,
      currency,
      method,
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: (method === 'Telebirr' ? 'TB-' : 'CBE-') + Math.floor(10000000 + Math.random() * 90000000),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Withdrawal
  const handleWithdraw = (amount: number, method: 'Telebirr' | 'CBE Birr'): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'withdrawal',
      amount,
      currency,
      method,
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: 'WD-' + Math.floor(10000000 + Math.random() * 90000000),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  // Load Booking Code
  const handleLoadBookingCode = (code: string) => {
    // If matching bet exists, load its selections into slip
    const found = activeBets.find((b) => b.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setSelections([...found.selections]);
      sounds.playClick();
      alert(`Loaded ${found.selections.length} selections from code ${code}!`);
    } else {
      // Load sample multi picks for demo
      const sample = [
        {
          matchId: 'eth-101',
          matchTitle: 'Saint George SC vs Ethiopian Coffee',
          league: 'Ethiopian Premier League',
          marketName: '1X2',
          selectionName: 'Saint George',
          odd: 2.15,
          isLive: true,
          sport: 'football' as SportType,
        },
        {
          matchId: 'epl-201',
          matchTitle: 'Arsenal FC vs Chelsea FC',
          league: 'Premier League',
          marketName: '1X2',
          selectionName: 'Arsenal',
          odd: 1.25,
          isLive: true,
          sport: 'football' as SportType,
        },
      ];
      setSelections(sample);
      sounds.playClick();
      alert(`Loaded selections for booking code ${code}!`);
    }
  };

  // Place Jackpot Entry
  const handlePlaceJackpot = (code: string) => {
    setBalance((prev) => prev - 20);
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'bet_placed',
      amount: 20,
      currency,
      method: 'Internal',
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: code,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Update balance from Crash Rush
  const handleUpdateCrashBalance = (amt: number, type: 'win' | 'loss', desc: string) => {
    if (type === 'win') {
      setBalance((prev) => prev + amt);
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'bet_win',
        amount: amt,
        currency,
        method: 'Internal',
        date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        reference: 'CRASH-WIN-' + Math.floor(1000 + Math.random() * 9000),
      };
      setTransactions((prev) => [newTx, ...prev]);
    } else {
      setBalance((prev) => Math.max(0, prev - amt));
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'bet_placed',
        amount: amt,
        currency,
        method: 'Internal',
        date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        reference: 'CRASH-BET-' + Math.floor(1000 + Math.random() * 9000),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  // Filter Matches
  const filteredMatches = matches.filter((m) => {
    // If nav tab is "live", show only live
    if (activeNavTab === 'live' && m.status !== 'live') return false;

    // Filter by sport or Ethiopian league
    if (selectedSport === 'ethiopian' && !m.isEthiopianLeague) return false;
    if (selectedSport !== 'all' && selectedSport !== 'ethiopian' && m.sport !== selectedSport) return false;

    // Filter by selected league
    if (selectedLeague && m.league !== selectedLeague) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.homeTeam} ${m.awayTeam} ${m.league}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const liveMatches = matches.filter((m) => m.status === 'live');
  const selectedOddIds = selections.map((s) => `${s.matchId}-${s.selectionName}`);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        balance={balance}
        openWallet={(tab) => {
          setWalletInitialTab(tab);
          setWalletModalOpen(true);
        }}
        openTicketChecker={() => setTicketCheckOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        openSlipMobile={() => setMobileSlipOpen(true)}
        slipCount={selections.length}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Sports Categories & Leagues) */}
        <SportsSidebar
          language={language}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          selectedLeague={selectedLeague}
          setSelectedLeague={setSelectedLeague}
          liveMatchesCount={liveMatches.length}
          openWallet={(tab) => {
            setWalletInitialTab(tab);
            setWalletModalOpen(true);
          }}
        />

        {/* Center Main Stage */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* View: Aviator / Crash Mini-Game */}
          {activeNavTab === 'crash' && (
            <CashRushGame
              balance={balance}
              onUpdateBalance={handleUpdateCrashBalance}
              currency={currency}
              language={language}
            />
          )}

          {/* View: Virtual League */}
          {activeNavTab === 'virtual' && (
            <VirtualLeague
              language={language}
              currency={currency}
              selectedOddIds={selections.map((s) => s.matchId)}
              onSelectOdd={handleSelectOdd}
            />
          )}

          {/* View: Mega Jackpot */}
          {activeNavTab === 'jackpot' && (
            <MegaJackpot
              language={language}
              currency={currency}
              balance={balance}
              onPlaceJackpot={handlePlaceJackpot}
            />
          )}

          {/* View: Sportsbook & Live Betting */}
          {(activeNavTab === 'sports' || activeNavTab === 'live') && (
            <>
              {/* Live Match Tracker (Sheger Derby & Live games) */}
              {liveMatches.length > 0 && (
                <LivePitchTracker
                  liveMatches={liveMatches}
                  language={language}
                  onSelectOdd={handleSelectOdd}
                  selectedOddIds={selections.map((s) => s.matchId)}
                />
              )}

              {/* Section Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>
                      {selectedSport === 'ethiopian'
                        ? (language === 'am' ? 'የኢትዮጵያ ፕሪሚየር ሊግ ጨዋታዎች' : 'Ethiopian Premier League')
                        : selectedLeague
                        ? selectedLeague
                        : selectedSport !== 'all'
                        ? t(language, selectedSport)
                        : t(language, activeNavTab === 'live' ? 'live' : 'sports')}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">
                      {filteredMatches.length}
                    </span>
                  </h2>
                </div>

                {/* Reset filter shortcut if filtered */}
                {(selectedSport !== 'all' || selectedLeague) && (
                  <button
                    onClick={() => {
                      setSelectedSport('all');
                      setSelectedLeague(null);
                      sounds.playClick();
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    {language === 'am' ? 'ሁሉንም አሳይ' : 'Clear Filters'}
                  </button>
                )}
              </div>

              {/* Matches List */}
              <div className="space-y-3">
                {filteredMatches.length === 0 ? (
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center text-slate-400">
                    <p className="text-sm font-semibold">No matches found for your filter.</p>
                    <button
                      onClick={() => {
                        setSelectedSport('all');
                        setSelectedLeague(null);
                        setSearchQuery('');
                      }}
                      className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      language={language}
                      selectedOddIds={selections.map((s) => s.matchId)}
                      onSelectOdd={handleSelectOdd}
                      onOpenDetails={(m) => setSelectedMatchForDetail(m)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar: Bet Slip */}
        <BetSlip
          selections={selections}
          onRemoveSelection={handleRemoveSelection}
          onClearSlip={handleClearSlip}
          balance={balance}
          currency={currency}
          language={language}
          onPlaceBet={handlePlaceBet}
          activeBets={activeBets}
          onCashOut={handleCashOut}
          isOpenMobile={mobileSlipOpen}
          onCloseMobile={() => setMobileSlipOpen(false)}
          onLoadBookingCode={handleLoadBookingCode}
        />
      </main>

      {/* Match Deep Markets Modal */}
      {selectedMatchForDetail && (
        <MatchDetailModal
          match={selectedMatchForDetail}
          onClose={() => setSelectedMatchForDetail(null)}
          language={language}
          selectedOddIds={selections.map((s) => s.matchId)}
          onSelectOdd={handleSelectOdd}
        />
      )}

      {/* Wallet Deposit & Withdraw Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        initialTab={walletInitialTab}
        balance={balance}
        currency={currency}
        language={language}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        transactions={transactions}
      />

      {/* Ticket Checker Modal */}
      <TicketCheckModal
        isOpen={ticketCheckOpen}
        onClose={() => setTicketCheckOpen(false)}
        language={language}
        currency={currency}
        allBets={activeBets}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-base">
              CASH<span className="text-emerald-400">BET</span>
            </span>
            <span>·</span>
            <span>{language === 'am' ? 'የኢትዮጵያ ስፖርት ውርርድ' : 'Ethiopia Sports Betting & Live Games'}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Telebirr</span>
            <span>·</span>
            <span>CBE Birr</span>
            <span>·</span>
            <span>Chapa</span>
            <span>·</span>
            <span>18+ Play Responsibly</span>
          </div>

          <div className="text-slate-600 font-mono text-[11px]">
            © 2026 Cash Bet Inc. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
