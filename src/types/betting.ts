export type SportType = 
  | 'football' 
  | 'basketball' 
  | 'tennis' 
  | 'volleyball'
  | 'table_tennis'
  | 'boxing'
  | 'mma'
  | 'cricket'
  | 'handball'
  | 'athletics'
  | 'esports'
  | 'ice_hockey'
  | 'american_football'
  | 'baseball'
  | 'virtual' 
  | 'crash';

export type Language = 'en' | 'am';
export type Currency = 'ETB' | 'USD';

export interface OddItem {
  id: string;
  name: string; // e.g. "Home (1)", "Draw (X)", "Away (2)", "Over 2.5", "Under 2.5"
  odd: number;
  marketName: string; // e.g. "1X2", "Over/Under", "Double Chance", "Both Teams Score"
  trend?: 'up' | 'down' | 'same';
}

export interface Match {
  id: string;
  sport: SportType;
  league: string;
  leagueCountry: string;
  leagueFlag: string;
  isEthiopianLeague?: boolean;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string; // e.g. "72'", "HT", "18:30"
  status: 'live' | 'upcoming' | 'finished';
  period?: string;
  stats?: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    cornersHome: number;
    cornersAway: number;
    redCardsHome: number;
    redCardsAway: number;
    currentAction?: string;
  };
  odds: {
    matchWinner: {
      home: OddItem;
      draw: OddItem;
      away: OddItem;
    };
    overUnder?: {
      over: OddItem;
      under: OddItem;
    };
    bothTeamsScore?: {
      yes: OddItem;
      no: OddItem;
    };
    doubleChance?: {
      homeOrDraw: OddItem;
      homeOrAway: OddItem;
      drawOrAway: OddItem;
    };
  };
}

export interface BetSelection {
  matchId: string;
  matchTitle: string;
  league: string;
  marketName: string;
  selectionName: string;
  odd: number;
  isLive: boolean;
  sport: SportType;
}

export interface PlacedBet {
  id: string;
  code: string;
  date: string;
  type: 'single' | 'accumulator';
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  bonusMultiplier: number;
  potentialPayout: number;
  status: 'active' | 'won' | 'lost' | 'cashed_out';
  cashoutOffer: number;
  currency: Currency;
}

export interface CrashRound {
  id: string;
  multiplier: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet_win' | 'bet_placed' | 'cashout';
  amount: number;
  currency: Currency;
  method: 'Telebirr' | 'CBE Birr' | 'Chapa' | 'Card' | 'Internal';
  date: string;
  status: 'completed' | 'pending';
  reference: string;
}
