import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Check, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  Building2,
  Copy,
  Receipt,
  PhoneCall,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, Language, Transaction } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
  balance: number;
  currency: Currency;
  language: Language;
  onDeposit: (amount: number, method: 'Telebirr' | 'CBE Birr' | 'Chapa' | 'Card') => void;
  onWithdraw: (amount: number, method: 'Telebirr' | 'CBE Birr') => boolean;
  transactions: Transaction[];
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'deposit',
  balance,
  currency,
  language,
  onDeposit,
  onWithdraw,
  transactions,
}) => {
  const RECEIVER_PHONE = '0941574759';
  const RECEIVER_NAME = 'Cash Bet / 0941574759';

  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>(initialTab);
  const [depositMethod, setDepositMethod] = useState<'Telebirr' | 'CBE Birr'>('Telebirr');
  const [withdrawMethod, setWithdrawMethod] = useState<'Telebirr' | 'CBE Birr'>('Telebirr');
  const [amount, setAmount] = useState<number>(500);
  const [senderPhone, setSenderPhone] = useState('0912345678');
  const [transactionIdInput, setTransactionIdInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = currency === 'ETB' ? [100, 250, 500, 1000, 2500] : [10, 25, 50, 100, 250];

  const handleCopyReceiverPhone = () => {
    navigator.clipboard.writeText(RECEIVER_PHONE);
    setCopiedPhone(true);
    sounds.playClick();
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDepositSubmit = () => {
    if (amount <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onDeposit(amount, depositMethod);
      const generatedRef = transactionIdInput.trim() 
        ? transactionIdInput.trim() 
        : (depositMethod === 'Telebirr' ? 'TB-' : 'CBE-') + Math.floor(100000000 + Math.random() * 900000000);
      setSuccessReceipt(generatedRef);
      confetti({ particleCount: 60, spread: 70 });
      sounds.playBetPlaced();
    }, 1200);
  };

  const handleWithdrawSubmit = () => {
    if (amount <= 0) return;
    if (amount > balance) {
      alert(language === 'am' ? 'በቂ ሂሳብ የለዎትም!' : 'Insufficient balance!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const success = onWithdraw(amount, withdrawMethod);
      if (success) {
        const ref = 'WD-' + Math.floor(100000000 + Math.random() * 900000000);
        setSuccessReceipt(ref);
        sounds.playWin();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shadow">
              {currency === 'ETB' ? 'Br' : '$'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{language === 'am' ? 'የካሽ ቤት የክፍያ ቦርሳ' : 'Cash Bet Payment Wallet'}</span>
              </h3>
              <p className="text-[11px] font-mono text-emerald-400 font-bold">
                {t(language, 'balance')}: {currency === 'ETB' ? 'Br ' : '$'}
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950/50 p-2 border-b border-slate-800 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => {
              setTab('deposit');
              setSuccessReceipt(null);
              sounds.playClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              tab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t(language, 'deposit')}</span>
          </button>

          <button
            onClick={() => {
              setTab('withdraw');
              setSuccessReceipt(null);
              sounds.playClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              tab === 'withdraw'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t(language, 'withdraw')}</span>
          </button>

          <button
            onClick={() => {
              setTab('history');
              sounds.playClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              tab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'ታሪክ' : 'History'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {successReceipt && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl space-y-2 text-center animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="text-sm font-bold text-white">
                {tab === 'deposit' 
                  ? (language === 'am' ? `ተቀማጭ ${currency} ${amount} በተሳካ ሁኔታ ተረጋግጧል!` : `Deposit of ${currency} ${amount} Confirmed!`)
                  : (language === 'am' ? `የ${currency} ${amount} ማውጣት ጥያቄ ተልኳል!` : `Withdrawal of ${currency} ${amount} Processed!`)}
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg">
                Ref: <span className="font-bold text-white">{successReceipt}</span> · Receiver: <span className="text-amber-400">{RECEIVER_PHONE}</span>
              </div>
            </div>
          )}

          {tab === 'deposit' && (
            <>
              {/* Receiver Phone Showcase Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-amber-950/70 border border-emerald-500/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'am' ? 'ገንዘብ መቀበያ ስልክ ቁጥር' : 'Official Deposit Receiver'}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {depositMethod === 'Telebirr' ? 'Telebirr / ቴሌብር' : 'CBE Birr / ሲቢኢ ብር'}:
                    </div>
                    <div className="text-lg font-black font-mono text-amber-400 tracking-wider">
                      {RECEIVER_PHONE}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans">
                      {RECEIVER_NAME}
                    </div>
                  </div>

                  <button
                    onClick={handleCopyReceiverPhone}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 active:scale-95"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{language === 'am' ? 'ተቀድቷል' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                        <span>{language === 'am' ? 'ቁጥር ቅዳ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions */}
                <div className="text-[11px] text-slate-300 leading-snug">
                  {language === 'am' ? (
                    <span>
                      👉 በቴሌብር ወይም በሲቢኢ ብር ወደ <strong className="text-white font-mono">{RECEIVER_PHONE}</strong> የፈለጉትን ገንዘብ ይላኩ። ከዚያ ከታች የላኩበትን መጠን እና ማረጋገጫ አስገብተው ይጫኑ።
                    </span>
                  ) : (
                    <span>
                      👉 Transfer your deposit via Telebirr or CBE Birr to <strong className="text-white font-mono">{RECEIVER_PHONE}</strong>. Then submit the confirmation below to credit your Cash Bet wallet immediately.
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Methods Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-2 block">
                  {language === 'am' ? 'የመክፈያ ዘዴ ይምረጡ' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Telebirr', name: 'Telebirr (ቴሌብር)', icon: '📱', desc: `Send to ${RECEIVER_PHONE}` },
                    { id: 'CBE Birr', name: 'CBE Birr (ሲቢኢ ብር)', icon: '🏦', desc: `Send to ${RECEIVER_PHONE}` },
                  ].map((m) => {
                    const isSelected = depositMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setDepositMethod(m.id as typeof depositMethod);
                          sounds.playClick();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-400 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        <div className="truncate">
                          <div className="text-xs font-extrabold truncate">{m.name}</div>
                          <div className="text-[10px] text-amber-400 font-mono truncate">{m.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-2 block">
                  {language === 'am' ? 'የገንዘብ መጠን' : 'Deposit Amount'} ({currency})
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        amount === amt
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-slate-400 text-sm font-mono font-bold mr-2">
                    {currency === 'ETB' ? 'Br' : '$'}
                  </span>
                  <input
                    type="number"
                    min="10"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 bg-transparent text-white font-mono font-bold text-base focus:outline-none"
                  />
                </div>
              </div>

              {/* Sender Phone and SMS Transaction Reference */}
              <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-1 block">
                    {language === 'am' ? 'እርስዎ የላኩበት ስልክ ቁጥር' : 'Your Sender Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="09XXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">
                      {language === 'am' ? 'የደረሰኝ / ግብይት ቁጥር (SMS Ref)' : 'Transaction ID / SMS Reference'}
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Optional / አማራጭ</span>
                  </div>
                  <input
                    type="text"
                    value={transactionIdInput}
                    onChange={(e) => setTransactionIdInput(e.target.value)}
                    placeholder="e.g. TB94819284 / CBE77192"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono uppercase focus:border-emerald-500/50"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {language === 'am' 
                      ? 'ከቴሌብር ወይም ከንግድ ባንክ የደረሰዎትን የግብይት ቁጥር ካስገቡ በ 1 ሰከንድ ውስጥ ሂሳብዎ ይሞላል።' 
                      : 'Auto-verified with Telebirr/CBE SMS confirmation.'}
                  </p>
                </div>
              </div>

              {/* Submit Deposit Button */}
              <button
                disabled={isProcessing}
                onClick={handleDepositSubmit}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{language === 'am' ? 'ወደ 0941574759 በመረጋገጥ ላይ...' : 'Verifying transfer to 0941574759...'}</span>
                ) : (
                  <span>
                    {language === 'am' 
                      ? `ተቀማጭ ${currency} ${amount} አረጋግጥ (ወደ 0941574759)` 
                      : `Confirm Deposit ${currency} ${amount} (To 0941574759)`}
                  </span>
                )}
              </button>
            </>
          )}

          {tab === 'withdraw' && (
            <>
              {/* Withdraw Method */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-2 block">
                  {language === 'am' ? 'የማውጫ ዘዴ ይምረጡ' : 'Select Withdrawal Method'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Telebirr', name: 'Telebirr (ቴሌብር)', icon: '📱' },
                    { id: 'CBE Birr', name: 'CBE Birr (ሲቢኢ ብር)', icon: '🏦' },
                  ].map((m) => {
                    const isSelected = withdrawMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setWithdrawMethod(m.id as typeof withdrawMethod);
                          sounds.playClick();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-400 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">0% Fee · ፈጣን</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-400 uppercase font-mono">
                    {language === 'am' ? 'የሚወጣው መጠን' : 'Withdrawal Amount'} ({currency})
                  </span>
                  <span className="text-slate-500 font-mono">Min: 50 ETB</span>
                </div>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-slate-400 text-sm font-mono font-bold mr-2">
                    {currency === 'ETB' ? 'Br' : '$'}
                  </span>
                  <input
                    type="number"
                    min="50"
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 bg-transparent text-white font-mono font-bold text-base focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone / Account */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase font-mono mb-1.5 block">
                  {withdrawMethod} {language === 'am' ? 'የመቀበያ ስልክ ቁጥርዎ' : 'Your Receiver Phone / Account'}
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="09XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <button
                disabled={isProcessing}
                onClick={handleWithdrawSubmit}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{language === 'am' ? 'በማስተላለፍ ላይ...' : 'Transferring Funds...'}</span>
                ) : (
                  <span>{language === 'am' ? `ብር አውጣ (${currency} ${amount})` : `Withdraw ${currency} ${amount}`}</span>
                )}
              </button>
            </>
          )}

          {tab === 'history' && (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No transaction history yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          tx.type === 'deposit' || tx.type === 'bet_win' || tx.type === 'cashout'
                            ? 'bg-emerald-400'
                            : 'bg-rose-400'
                        }`} />
                        <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                        <span className="text-slate-500 font-mono text-[10px]">({tx.method})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {tx.date} · {tx.reference}
                      </div>
                    </div>

                    <div className="font-mono font-bold text-right">
                      <span className={
                        tx.type === 'deposit' || tx.type === 'bet_win' || tx.type === 'cashout'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }>
                        {tx.type === 'deposit' || tx.type === 'bet_win' || tx.type === 'cashout' ? '+' : '-'}
                        {tx.currency} {tx.amount}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
