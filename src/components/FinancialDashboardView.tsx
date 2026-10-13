import React, { useState } from 'react';
import { 
  Wallet, 
  Smartphone, 
  Building2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  Receipt,
  QrCode,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Currency, Language, Transaction } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface FinancialDashboardViewProps {
  language: Language;
  currency: Currency;
  balance: number;
  transactions: Transaction[];
  openWalletModal: (tab: 'deposit' | 'withdraw') => void;
  onQuickDeposit: (amount: number, method: 'Telebirr' | 'CBE Birr') => void;
}

export const FinancialDashboardView: React.FC<FinancialDashboardViewProps> = ({
  language,
  currency,
  balance,
  transactions,
  openWalletModal,
  onQuickDeposit,
}) => {
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(100);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');

  const banknoteAmounts = [
    { amt: 50, label: '50 ብር (ሃምሳ)', noteColor: 'birr-50-gradient text-amber-200 border-amber-500/50' },
    { amt: 100, label: '100 ብር (መቶ)', noteColor: 'birr-100-gradient text-teal-200 border-teal-500/50' },
    { amt: 200, label: '200 ብር (ሁለት መቶ)', noteColor: 'birr-200-gradient text-purple-200 border-purple-500/50' },
    { amt: 500, label: '500 ብር (አምስት መቶ)', noteColor: 'bg-gradient-to-r from-emerald-800 to-teal-800 text-emerald-200 border-emerald-500/50' },
    { amt: 1000, label: '1,000 ብር (አንድ ሺህ)', noteColor: 'bg-gradient-to-r from-amber-700 to-rose-800 text-amber-100 border-amber-400/50' },
  ];

  return (
    <div className="space-y-5 select-none">
      {/* Financial Overview Hero with Ethiopian Birr Theme */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 shadow-2xl relative overflow-hidden ethiopia-banknote-pattern">
        <div className="ethiopia-tricolor-line h-1 w-full absolute top-0 left-0" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span>🇪🇹</span>
                <span>{language === 'am' ? 'የኢትዮጵያ ብሮች ሂሳብ' : 'Ethiopian Birr Account'}</span>
              </span>
              <span className="text-xs text-slate-400">· {language === 'am' ? 'ኦፊሴላዊ የገንዘብ ማዕከል' : 'Official Cashflow Center'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {balance.toLocaleString()} <span className="text-emerald-400 text-xl font-bold">{currency === 'ETB' ? 'ብር (ETB)' : 'USD'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'am'
                ? 'በቴሌብር ወይም በሲቢኢ ብር ተቀማጭ ያድርጉና በደቂቃዎች ውስጥ በቀጥታ ይጫወቱ'
                : 'Deposit instantly via Telebirr or CBE Birr and start wagering immediately'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => openWalletModal('deposit')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{t(language, 'deposit')}</span>
            </button>

            <button
              onClick={() => openWalletModal('withdraw')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{t(language, 'withdraw')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Telebirr & CBE Payment Guide + Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Guide (Invisible Phone Number) */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-sky-400" />
              <h3 className="font-extrabold text-white text-base">
                {language === 'am' ? 'የተቀማጭ ክፍያ መመሪያ' : 'Instant Deposit Channels'}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              24/7 LIVE
            </span>
          </div>

          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActivePaymentMethod('telebirr')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePaymentMethod === 'telebirr'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📱</span>
              <span>Telebirr (ቴሌብር)</span>
            </button>

            <button
              onClick={() => setActivePaymentMethod('cbe')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePaymentMethod === 'cbe'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏦</span>
              <span>CBE Birr (ሲቢኢ ብር)</span>
            </button>
          </div>

          {/* Secure Merchant Gateway Box (Invisible Phone) */}
          <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {language === 'am' ? 'ኦፊሴላዊ የክፍያ ማዕከል:' : 'Official Merchant Account:'}
              </span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'am' ? 'የተረጋገጠ እና የተመሰጠረ' : 'Verified & Encrypted'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-900 border border-emerald-400/40 px-3.5 py-2.5 rounded-xl">
              <div>
                <span className="text-base font-black text-amber-300 tracking-wide">
                  Cash Bet Official Gateway
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Telebirr & CBE Birr Auto-Deposit System
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              {language === 'am'
                ? 'በቴሌብር ወይም በሲቢኢ ብር ተቀማጭ ለማድረግ ከታች የፈለጉትን የብር ኖት መጠን መርጠው "በደቂቃ አስገባ" የሚለውን ይጫኑ። የካሽ ቤት ሂሳብዎ ወዲያውኑ ገቢ ይደረጋል።'
                : 'To deposit via Telebirr or CBE Birr, select your preferred banknote amount below and click "Deposit Instantly". Your account will be credited immediately.'}
            </p>
          </div>

          {/* Quick Banknote Amount Fast Deposit */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">
              {language === 'am' ? 'የኢትዮጵያ ብሮች ፈጣን ምርጫ:' : 'Select Ethiopian Birr Banknote:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {banknoteAmounts.map((n) => (
                <button
                  key={n.amt}
                  onClick={() => setSelectedQuickAmount(n.amt)}
                  className={`p-2 rounded-xl border text-xs font-mono font-bold text-center transition-all cursor-pointer ${
                    n.noteColor
                  } ${selectedQuickAmount === n.amt ? 'ring-2 ring-white scale-105 shadow-lg' : 'opacity-85 hover:opacity-100'}`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onQuickDeposit(selectedQuickAmount, activePaymentMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr');
                sounds.playWin();
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>+ {selectedQuickAmount} {currency} {language === 'am' ? 'በደቂቃ አስገባ' : 'Deposit Instantly'}</span>
            </button>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">
                {language === 'am' ? 'የቅርብ ግብይቶች ታሪክ' : 'Recent Transactions'}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {transactions.length} {language === 'am' ? 'ግብይቶች' : 'Entries'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {transactions.slice(0, 8).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    tx.type === 'deposit'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : tx.type === 'withdrawal'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : tx.type === 'bet_win'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : tx.type === 'bet_win' ? '★' : '•'}
                  </div>

                  <div>
                    <div className="font-bold text-white capitalize">
                      {tx.type.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {tx.method} · {tx.date}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold text-sm ${
                    tx.type === 'deposit' || tx.type === 'bet_win'
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'bet_win' ? '+' : '-'}
                    {tx.amount.toLocaleString()} {tx.currency}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Ref: {tx.reference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
