import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  ArrowUpRight, 
  RotateCcw, 
  Users, 
  CheckCircle2, 
  Zap,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, Language } from '../types/betting';
import { t } from '../utils/translations';
import { sounds } from '../utils/audio';

interface CashRushGameProps {
  balance: number;
  onUpdateBalance: (amount: number, type: 'win' | 'loss', desc: string) => void;
  currency: Currency;
  language: Language;
}

export const CashRushGame: React.FC<CashRushGameProps> = ({
  balance,
  onUpdateBalance,
  currency,
  language,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'flying' | 'crashed'>('countdown');
  const [multiplier, setMultiplier] = useState(1.0);
  const [countdown, setCountdown] = useState(4);
  const [stake, setStake] = useState<number>(50);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  
  const [hasBet, setHasBet] = useState(false);
  const [betActiveThisRound, setBetActiveThisRound] = useState(false);
  const [cashedOutThisRound, setCashedOutThisRound] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const [history, setHistory] = useState<number[]>([
    1.84, 3.22, 1.15, 8.40, 1.45, 2.10, 14.65, 1.05, 4.88
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const crashPointRef = useRef<number>(2.5);
  const multiplierRef = useRef<number>(1.0);
  const reqAnimRef = useRef<number | null>(null);

  const quickStakes = currency === 'ETB' ? [20, 50, 100, 250, 500] : [2, 5, 10, 25, 50];

  // Simulated other room players
  const [mockBets, setMockBets] = useState([
    { name: 'Abebe K.', stake: 200, cashedAt: 1.82, status: 'won' },
    { name: 'Tewodros B.', stake: 100, cashedAt: null, status: 'flying' },
    { name: 'Helen G.', stake: 500, cashedAt: 2.45, status: 'won' },
    { name: 'Selamawit', stake: 50, cashedAt: null, status: 'flying' },
  ]);

  // Round loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((c) => c - 1);
        }, 1000);
      } else {
        // Start flight!
        startFlight();
      }
    }

    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  const startFlight = () => {
    // Generate crash point (RTP ~96%)
    const rand = Math.random();
    let target = 1.05;
    if (rand < 0.08) {
      target = 1.02; // Instant shock crash
    } else if (rand < 0.6) {
      target = 1.1 + Math.random() * 2.2; // 1.1x to 3.3x
    } else if (rand < 0.88) {
      target = 3.0 + Math.random() * 5.0; // 3x to 8x
    } else {
      target = 8.0 + Math.random() * 25.0; // Mega flight 8x to 33x!
    }

    crashPointRef.current = Number(target.toFixed(2));
    multiplierRef.current = 1.0;
    setMultiplier(1.0);
    setGameState('flying');

    if (hasBet) {
      setBetActiveThisRound(true);
      setCashedOutThisRound(false);
      setWinAmount(null);
    } else {
      setBetActiveThisRound(false);
    }

    let startTs: number | null = null;

    const animateFlight = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = (ts - startTs) / 1000;

      // Exponential growth curve: mult = e^(0.07 * elapsed * speed)
      const currentMult = Math.min(
        crashPointRef.current,
        Math.max(1.0, Math.exp(0.18 * elapsed))
      );

      multiplierRef.current = currentMult;
      setMultiplier(currentMult);

      // Check Auto-Cashout
      if (
        hasBet &&
        !cashedOutThisRound &&
        autoCashoutEnabled &&
        currentMult >= autoCashout &&
        currentMult < crashPointRef.current
      ) {
        triggerCashout(autoCashout);
      }

      // Check if reached crash point
      if (currentMult >= crashPointRef.current) {
        // CRASH!
        triggerCrash(crashPointRef.current);
        return;
      }

      reqAnimRef.current = requestAnimationFrame(animateFlight);
    };

    reqAnimRef.current = requestAnimationFrame(animateFlight);
  };

  const triggerCrash = (finalVal: number) => {
    if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    setGameState('crashed');
    sounds.playCrash();
    setHistory((prev) => [finalVal, ...prev.slice(0, 8)]);

    if (betActiveThisRound && !cashedOutThisRound) {
      onUpdateBalance(stake, 'loss', `Cash Rush crashed at ${finalVal.toFixed(2)}x`);
    }

    setHasBet(false);
    setBetActiveThisRound(false);

    // Wait 3 seconds then start next countdown
    setTimeout(() => {
      setGameState('countdown');
      setCountdown(4);
      setCashedOutThisRound(false);
      setWinAmount(null);
    }, 3200);
  };

  const triggerCashout = (atMult: number) => {
    if (cashedOutThisRound || !betActiveThisRound || gameState !== 'flying') return;

    const won = Number((stake * atMult).toFixed(2));
    setCashedOutThisRound(true);
    setWinAmount(won);
    sounds.playWin();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    onUpdateBalance(won, 'win', `Cash Rush cashed out @ ${atMult.toFixed(2)}x`);
  };

  // Draw rocket & flight canvas trajectory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 320);

    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (gameState === 'flying' || gameState === 'crashed') {
      const progress = Math.min(1.0, (multiplier - 1.0) / 10.0);
      const startX = 40;
      const startY = height - 40;
      const endX = startX + progress * (width - 120);
      const endY = startY - Math.pow(progress, 0.8) * (height - 100);

      // Trajectory curve
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        (startX + endX) / 2,
        startY,
        endX,
        endY
      );

      // Glow gradient underneath
      const grad = ctx.createLinearGradient(0, endY, 0, height);
      grad.addColorStop(0, gameState === 'crashed' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.strokeStyle = gameState === 'crashed' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 4;
      ctx.shadowColor = gameState === 'crashed' ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Jet / Rocket Icon
      if (gameState === 'flying') {
        ctx.save();
        ctx.translate(endX, endY);
        ctx.rotate(-0.4);

        // Rocket body
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Rocket exhaust fire
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(-10, -3);
        ctx.lineTo(-22, 0);
        ctx.lineTo(-10, 3);
        ctx.fill();

        ctx.restore();
      } else if (gameState === 'crashed') {
        // Explosion circle
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.beginPath();
        ctx.arc(endX, endY, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [gameState, multiplier]);

  const handlePlaceBetForRound = () => {
    if (stake > balance) {
      alert(language === 'am' ? 'በቂ ሂሳብ የለዎትም!' : 'Insufficient balance!');
      return;
    }
    sounds.playClick();
    setHasBet(true);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Bar: Crash Multiplier History Pills */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Rocket className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            {t(language, 'cashRush')}
          </span>
        </div>

        {/* Multipliers History */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {history.map((item, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                item >= 10
                  ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                  : item >= 2
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {item.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Center Multiplier Display */}
        <div className="relative z-20 text-center select-none pointer-events-none">
          {gameState === 'countdown' && (
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-widest">
                {language === 'am' ? 'ቀጣይ በረራ ይጀምራል' : 'NEXT FLIGHT IN'}
              </div>
              <div className="text-5xl font-black font-mono text-amber-400 animate-pulse">
                00:0{countdown}
              </div>
              <div className="w-36 h-1.5 bg-slate-800 mx-auto rounded-full overflow-hidden mt-2">
                <div
                  className="bg-amber-400 h-full transition-all duration-1000"
                  style={{ width: `${((4 - countdown) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {gameState === 'flying' && (
            <div className="space-y-1">
              <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white drop-shadow-[0_4px_20px_rgba(16,185,129,0.5)]">
                {multiplier.toFixed(2)}x
              </div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                {t(language, 'flying')}
              </div>
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="space-y-1 animate-in zoom-in-90 duration-200">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold tracking-widest">
                {t(language, 'crashed')}
              </div>
              <div className="text-5xl sm:text-6xl font-black font-mono text-rose-500 drop-shadow-[0_4px_20px_rgba(239,68,68,0.5)]">
                {crashPointRef.current.toFixed(2)}x
              </div>
              <div className="text-xs text-slate-400 font-mono">
                FLEW AWAY!
              </div>
            </div>
          )}

          {/* Player Cashed out successfully banner in-flight */}
          {cashedOutThisRound && winAmount && (
            <div className="mt-3 bg-emerald-500/90 text-slate-950 font-black px-4 py-1.5 rounded-full text-xs font-mono inline-block shadow-lg">
              CASHED OUT! +{currency} {winAmount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Betting Controls Dashboard */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Stake Controls */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase font-mono">
              {t(language, 'stake')} ({currency})
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCashoutEnabled}
                  onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Auto Cashout</span>
              </label>
              {autoCashoutEnabled && (
                <input
                  type="number"
                  step="0.1"
                  min="1.1"
                  value={autoCashout}
                  onChange={(e) => setAutoCashout(Number(e.target.value))}
                  className="w-16 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs font-mono text-amber-400 text-right"
                />
              )}
            </div>
          </div>

          {/* Quick Stake Chips */}
          <div className="grid grid-cols-5 gap-1.5">
            {quickStakes.map((val) => (
              <button
                key={val}
                onClick={() => {
                  setStake(val);
                  sounds.playClick();
                }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  stake === val
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          {/* Custom Stake Input */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5">
            <button
              onClick={() => setStake(Math.max(10, stake - 50))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm"
            >
              -
            </button>
            <span className="text-lg font-black font-mono text-white">
              {currency} {stake}
            </span>
            <button
              onClick={() => setStake(stake + 50)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Right Big Action Button */}
        <div className="md:col-span-5 flex flex-col justify-end">
          {betActiveThisRound && gameState === 'flying' && !cashedOutThisRound ? (
            /* ACTIVE CASH OUT BUTTON IN-FLIGHT */
            <button
              onClick={() => triggerCashout(multiplier)}
              className="w-full h-full min-h-[70px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl p-3 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-xl shadow-amber-500/30 cursor-pointer animate-pulse"
            >
              <div className="text-xs uppercase tracking-wider font-extrabold flex items-center gap-1">
                <DollarSign className="w-4 h-4 stroke-[3]" />
                <span>{t(language, 'cashOut')}</span>
              </div>
              <div className="text-xl font-mono font-black">
                {currency} {(stake * multiplier).toFixed(2)}
              </div>
              <div className="text-[10px] font-mono text-slate-900">
                (+{Math.round((multiplier - 1) * 100)}% profit)
              </div>
            </button>
          ) : hasBet ? (
            /* WAITING WITH BET PLACED */
            <button
              disabled
              className="w-full h-full min-h-[70px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl p-3 flex flex-col items-center justify-center text-xs"
            >
              <CheckCircle2 className="w-5 h-5 mb-1" />
              <span>BET PLACED: {currency} {stake}</span>
              <span className="text-[10px] text-slate-400">Waiting for next flight...</span>
            </button>
          ) : (
            /* PLACE BET BUTTON */
            <button
              onClick={handlePlaceBetForRound}
              className="w-full h-full min-h-[70px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl p-3 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <div className="text-base uppercase tracking-wider font-black flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                <span>{t(language, 'takeOff')}</span>
              </div>
              <div className="text-xs font-mono font-bold mt-0.5">
                {currency} {stake}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Multiplayer Live Room Strip */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>842 Players In Orbit</span>
        </div>
        <div className="flex items-center gap-3 truncate">
          <span>Abebe K. cashed out 340 ETB</span>
          <span className="text-emerald-400 font-bold">+180 ETB</span>
        </div>
      </div>
    </div>
  );
};
