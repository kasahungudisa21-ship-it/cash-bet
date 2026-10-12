import { Match, PlacedBet, Transaction } from '../types/betting';

export const INITIAL_MATCHES: Match[] = [
  // Ethiopian Premier League Live Sheger Derby
  {
    id: 'eth-101',
    sport: 'football',
    league: 'Ethiopian Premier League',
    leagueCountry: 'Ethiopia',
    leagueFlag: '🇪🇹',
    isEthiopianLeague: true,
    homeTeam: 'Saint George SC (ቅዱስ ጊዮርጊስ)',
    awayTeam: 'Ethiopian Coffee (ኢትዮጵያ ቡና)',
    homeScore: 1,
    awayScore: 1,
    time: "68'",
    status: 'live',
    period: '2nd Half',
    stats: {
      possessionHome: 52,
      possessionAway: 48,
      shotsHome: 9,
      shotsAway: 7,
      cornersHome: 5,
      cornersAway: 3,
      redCardsHome: 0,
      redCardsAway: 0,
      currentAction: '⚡ Dangerous Free Kick for Saint George near penalty box',
    },
    odds: {
      matchWinner: {
        home: { id: 'eth-101-1', name: 'Saint George', odd: 2.15, marketName: '1X2', trend: 'up' },
        draw: { id: 'eth-101-x', name: 'Draw', odd: 2.90, marketName: '1X2', trend: 'same' },
        away: { id: 'eth-101-2', name: 'Ethio Coffee', odd: 3.40, marketName: '1X2', trend: 'down' },
      },
      overUnder: {
        over: { id: 'eth-101-ov', name: 'Over 2.5', odd: 2.10, marketName: 'Over/Under' },
        under: { id: 'eth-101-un', name: 'Under 2.5', odd: 1.68, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'eth-101-btsy', name: 'Yes (GG)', odd: 1.72, marketName: 'Both Teams to Score' },
        no: { id: 'eth-101-btsn', name: 'No (NG)', odd: 2.05, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'eth-101-1x', name: '1X', odd: 1.30, marketName: 'Double Chance' },
        homeOrAway: { id: 'eth-101-12', name: '12', odd: 1.38, marketName: 'Double Chance' },
        drawOrAway: { id: 'eth-101-x2', name: 'X2', odd: 1.65, marketName: 'Double Chance' },
      },
    },
  },

  // English Premier League Live
  {
    id: 'epl-201',
    sport: 'football',
    league: 'Premier League',
    leagueCountry: 'England',
    leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Chelsea FC',
    homeScore: 2,
    awayScore: 0,
    time: "54'",
    status: 'live',
    period: '2nd Half',
    stats: {
      possessionHome: 61,
      possessionAway: 39,
      shotsHome: 12,
      shotsAway: 4,
      cornersHome: 7,
      cornersAway: 2,
      redCardsHome: 0,
      redCardsAway: 0,
      currentAction: '⚽ Corner kick for Arsenal - Saka whipping it in',
    },
    odds: {
      matchWinner: {
        home: { id: 'epl-201-1', name: 'Arsenal', odd: 1.25, marketName: '1X2', trend: 'down' },
        draw: { id: 'epl-201-x', name: 'Draw', odd: 5.80, marketName: '1X2', trend: 'up' },
        away: { id: 'epl-201-2', name: 'Chelsea', odd: 11.5, marketName: '1X2', trend: 'up' },
      },
      overUnder: {
        over: { id: 'epl-201-ov', name: 'Over 2.5', odd: 1.45, marketName: 'Over/Under' },
        under: { id: 'epl-201-un', name: 'Under 2.5', odd: 2.65, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'epl-201-btsy', name: 'Yes (GG)', odd: 1.88, marketName: 'Both Teams to Score' },
        no: { id: 'epl-201-btsn', name: 'No (NG)', odd: 1.82, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'epl-201-1x', name: '1X', odd: 1.05, marketName: 'Double Chance' },
        homeOrAway: { id: 'epl-201-12', name: '12', odd: 1.12, marketName: 'Double Chance' },
        drawOrAway: { id: 'epl-201-x2', name: 'X2', odd: 3.80, marketName: 'Double Chance' },
      },
    },
  },

  // Ethiopian Premier League Upcoming
  {
    id: 'eth-102',
    sport: 'football',
    league: 'Ethiopian Premier League',
    leagueCountry: 'Ethiopia',
    leagueFlag: '🇪🇹',
    isEthiopianLeague: true,
    homeTeam: 'Fasil Kenema (ፋሲል ከነማ)',
    awayTeam: 'Bahir Dar Kenema (ባህር ዳር ከነማ)',
    time: '16:00 Today',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'eth-102-1', name: 'Fasil Kenema', odd: 2.05, marketName: '1X2' },
        draw: { id: 'eth-102-x', name: 'Draw', odd: 3.10, marketName: '1X2' },
        away: { id: 'eth-102-2', name: 'Bahir Dar City', odd: 3.60, marketName: '1X2' },
      },
      overUnder: {
        over: { id: 'eth-102-ov', name: 'Over 2.5', odd: 2.25, marketName: 'Over/Under' },
        under: { id: 'eth-102-un', name: 'Under 2.5', odd: 1.60, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'eth-102-btsy', name: 'Yes (GG)', odd: 1.95, marketName: 'Both Teams to Score' },
        no: { id: 'eth-102-btsn', name: 'No (NG)', odd: 1.78, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'eth-102-1x', name: '1X', odd: 1.28, marketName: 'Double Chance' },
        homeOrAway: { id: 'eth-102-12', name: '12', odd: 1.34, marketName: 'Double Chance' },
        drawOrAway: { id: 'eth-102-x2', name: 'X2', odd: 1.72, marketName: 'Double Chance' },
      },
    },
  },

  // Ethiopian Premier League Hawassa vs Sidama
  {
    id: 'eth-103',
    sport: 'football',
    league: 'Ethiopian Premier League',
    leagueCountry: 'Ethiopia',
    leagueFlag: '🇪🇹',
    isEthiopianLeague: true,
    homeTeam: 'Hawassa City (ሀዋሳ ከተማ)',
    awayTeam: 'Sidama Coffee (ሲዳማ ቡና)',
    time: '19:00 Today',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'eth-103-1', name: 'Hawassa City', odd: 2.45, marketName: '1X2' },
        draw: { id: 'eth-103-x', name: 'Draw', odd: 2.95, marketName: '1X2' },
        away: { id: 'eth-103-2', name: 'Sidama Coffee', odd: 2.90, marketName: '1X2' },
      },
      overUnder: {
        over: { id: 'eth-103-ov', name: 'Over 2.5', odd: 2.30, marketName: 'Over/Under' },
        under: { id: 'eth-103-un', name: 'Under 2.5', odd: 1.55, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'eth-103-btsy', name: 'Yes (GG)', odd: 1.85, marketName: 'Both Teams to Score' },
        no: { id: 'eth-103-btsn', name: 'No (NG)', odd: 1.85, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'eth-103-1x', name: '1X', odd: 1.38, marketName: 'Double Chance' },
        homeOrAway: { id: 'eth-103-12', name: '12', odd: 1.36, marketName: 'Double Chance' },
        drawOrAway: { id: 'eth-103-x2', name: 'X2', odd: 1.50, marketName: 'Double Chance' },
      },
    },
  },

  // UEFA Champions League Upcoming
  {
    id: 'ucl-301',
    sport: 'football',
    league: 'Champions League',
    leagueCountry: 'Europe',
    leagueFlag: '🇪🇺',
    homeTeam: 'Real Madrid',
    awayTeam: 'Bayern Munich',
    time: '21:00 Tomorrow',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'ucl-301-1', name: 'Real Madrid', odd: 2.10, marketName: '1X2' },
        draw: { id: 'ucl-301-x', name: 'Draw', odd: 3.65, marketName: '1X2' },
        away: { id: 'ucl-301-2', name: 'Bayern Munich', odd: 3.25, marketName: '1X2' },
      },
      overUnder: {
        over: { id: 'ucl-301-ov', name: 'Over 2.5', odd: 1.62, marketName: 'Over/Under' },
        under: { id: 'ucl-301-un', name: 'Under 2.5', odd: 2.25, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'ucl-301-btsy', name: 'Yes (GG)', odd: 1.55, marketName: 'Both Teams to Score' },
        no: { id: 'ucl-301-btsn', name: 'No (NG)', odd: 2.35, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'ucl-301-1x', name: '1X', odd: 1.33, marketName: 'Double Chance' },
        homeOrAway: { id: 'ucl-301-12', name: '12', odd: 1.28, marketName: 'Double Chance' },
        drawOrAway: { id: 'ucl-301-x2', name: 'X2', odd: 1.70, marketName: 'Double Chance' },
      },
    },
  },

  // Premier League Liverpool vs Man City
  {
    id: 'epl-202',
    sport: 'football',
    league: 'Premier League',
    leagueCountry: 'England',
    leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Manchester City',
    time: '17:30 Sunday',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'epl-202-1', name: 'Liverpool', odd: 2.55, marketName: '1X2' },
        draw: { id: 'epl-202-x', name: 'Draw', odd: 3.50, marketName: '1X2' },
        away: { id: 'epl-202-2', name: 'Man City', odd: 2.65, marketName: '1X2' },
      },
      overUnder: {
        over: { id: 'epl-202-ov', name: 'Over 2.5', odd: 1.58, marketName: 'Over/Under' },
        under: { id: 'epl-202-un', name: 'Under 2.5', odd: 2.30, marketName: 'Over/Under' },
      },
      bothTeamsScore: {
        yes: { id: 'epl-202-btsy', name: 'Yes (GG)', odd: 1.50, marketName: 'Both Teams to Score' },
        no: { id: 'epl-202-btsn', name: 'No (NG)', odd: 2.45, marketName: 'Both Teams to Score' },
      },
      doubleChance: {
        homeOrDraw: { id: 'epl-202-1x', name: '1X', odd: 1.45, marketName: 'Double Chance' },
        homeOrAway: { id: 'epl-202-12', name: '12', odd: 1.29, marketName: 'Double Chance' },
        drawOrAway: { id: 'epl-202-x2', name: 'X2', odd: 1.50, marketName: 'Double Chance' },
      },
    },
  },

  // Basketball NBA Live
  {
    id: 'nba-401',
    sport: 'basketball',
    league: 'NBA',
    leagueCountry: 'USA',
    leagueFlag: '🇺🇸',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeScore: 84,
    awayScore: 81,
    time: 'Q3 04:12',
    status: 'live',
    period: 'Quarter 3',
    stats: {
      possessionHome: 50,
      possessionAway: 50,
      shotsHome: 32,
      shotsAway: 30,
      cornersHome: 0,
      cornersAway: 0,
      redCardsHome: 0,
      redCardsAway: 0,
      currentAction: '🏀 LeBron James step-back 3-pointer MADE!',
    },
    odds: {
      matchWinner: {
        home: { id: 'nba-401-1', name: 'Lakers', odd: 1.75, marketName: 'Moneyline', trend: 'up' },
        draw: { id: 'nba-401-x', name: 'Overtime', odd: 14.0, marketName: 'Moneyline' },
        away: { id: 'nba-401-2', name: 'Warriors', odd: 2.10, marketName: 'Moneyline', trend: 'down' },
      },
      overUnder: {
        over: { id: 'nba-401-ov', name: 'Over 224.5', odd: 1.90, marketName: 'Total Points' },
        under: { id: 'nba-401-un', name: 'Under 224.5', odd: 1.90, marketName: 'Total Points' },
      },
    },
  },

  // Tennis Grand Slam Live
  {
    id: 'ten-501',
    sport: 'tennis',
    league: 'Wimbledon Championship',
    leagueCountry: 'International',
    leagueFlag: '🎾',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Novak Djokovic',
    homeScore: 2,
    awayScore: 1,
    time: 'Set 4 (3-2)',
    status: 'live',
    period: 'Set 4',
    stats: {
      possessionHome: 55,
      possessionAway: 45,
      shotsHome: 28,
      shotsAway: 24,
      cornersHome: 0,
      cornersAway: 0,
      redCardsHome: 0,
      redCardsAway: 0,
      currentAction: '🎾 Alcaraz 132mph ace serve down the T!',
    },
    odds: {
      matchWinner: {
        home: { id: 'ten-501-1', name: 'Alcaraz', odd: 1.40, marketName: 'Match Winner', trend: 'down' },
        draw: { id: 'ten-501-x', name: 'Tiebreak', odd: 6.50, marketName: 'Match Winner' },
        away: { id: 'ten-501-2', name: 'Djokovic', odd: 2.95, marketName: 'Match Winner', trend: 'up' },
      },
    },
  },

  // Volleyball Live
  {
    id: 'vol-601',
    sport: 'volleyball',
    league: 'Volleyball Nations League',
    leagueCountry: 'International',
    leagueFlag: '🏐',
    homeTeam: 'Poland',
    awayTeam: 'Italy',
    homeScore: 2,
    awayScore: 1,
    time: 'Set 4 (18-16)',
    status: 'live',
    odds: {
      matchWinner: {
        home: { id: 'vol-601-1', name: 'Poland', odd: 1.65, marketName: 'Match Winner' },
        draw: { id: 'vol-601-x', name: 'Set 5 Decider', odd: 3.40, marketName: 'Match Winner' },
        away: { id: 'vol-601-2', name: 'Italy', odd: 2.20, marketName: 'Match Winner' },
      },
    },
  },

  // Table Tennis Live
  {
    id: 'tt-701',
    sport: 'table_tennis',
    league: 'WTT Grand Smash',
    leagueCountry: 'International',
    leagueFlag: '🏓',
    homeTeam: 'Fan Zhendong',
    awayTeam: 'Wang Chuqin',
    homeScore: 3,
    awayScore: 2,
    time: 'Game 6 (9-7)',
    status: 'live',
    odds: {
      matchWinner: {
        home: { id: 'tt-701-1', name: 'Fan Zhendong', odd: 1.55, marketName: 'Match Winner' },
        draw: { id: 'tt-701-x', name: 'Game 7', odd: 2.80, marketName: 'Match Winner' },
        away: { id: 'tt-701-2', name: 'Wang Chuqin', odd: 2.35, marketName: 'Match Winner' },
      },
    },
  },

  // Boxing Upcoming
  {
    id: 'box-801',
    sport: 'boxing',
    league: 'Heavyweight Championship of the World',
    leagueCountry: 'World',
    leagueFlag: '🥊',
    homeTeam: 'Oleksandr Usyk',
    awayTeam: 'Tyson Fury',
    time: '23:00 Saturday',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'box-801-1', name: 'Usyk', odd: 1.82, marketName: 'Fight Winner' },
        draw: { id: 'box-801-x', name: 'Draw', odd: 16.0, marketName: 'Fight Winner' },
        away: { id: 'box-801-2', name: 'Tyson Fury', odd: 2.05, marketName: 'Fight Winner' },
      },
    },
  },

  // MMA / UFC Upcoming
  {
    id: 'mma-901',
    sport: 'mma',
    league: 'UFC Lightweight Championship',
    leagueCountry: 'USA',
    leagueFlag: '🥋',
    homeTeam: 'Islam Makhachev',
    awayTeam: 'Arman Tsarukyan',
    time: '04:00 Sunday',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'mma-901-1', name: 'Makhachev', odd: 1.28, marketName: 'Fight Winner' },
        draw: { id: 'mma-901-x', name: 'No Contest', odd: 25.0, marketName: 'Fight Winner' },
        away: { id: 'mma-901-2', name: 'Tsarukyan', odd: 3.75, marketName: 'Fight Winner' },
      },
    },
  },

  // Athletics / Running (Ethiopian Pride)
  {
    id: 'ath-1001',
    sport: 'athletics',
    league: 'Diamond League 10,000m Men',
    leagueCountry: 'Ethiopia',
    leagueFlag: '🏃',
    isEthiopianLeague: true,
    homeTeam: 'Selemon Barega (ኢትዮጵያ 🇪🇹)',
    awayTeam: 'Yomif Kejelcha (ኢትዮጵያ 🇪🇹)',
    time: '19:45 Friday',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'ath-1001-1', name: 'Selemon Barega', odd: 1.85, marketName: 'Head-to-Head' },
        draw: { id: 'ath-1001-x', name: 'Same Second', odd: 12.0, marketName: 'Head-to-Head' },
        away: { id: 'ath-1001-2', name: 'Yomif Kejelcha', odd: 1.95, marketName: 'Head-to-Head' },
      },
    },
  },

  // Cricket
  {
    id: 'cric-1101',
    sport: 'cricket',
    league: 'T20 International Cup',
    leagueCountry: 'International',
    leagueFlag: '🏏',
    homeTeam: 'India',
    awayTeam: 'Australia',
    time: '14:30 Tomorrow',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'cric-1101-1', name: 'India', odd: 1.70, marketName: 'Match Winner' },
        draw: { id: 'cric-1101-x', name: 'Super Over', odd: 18.0, marketName: 'Match Winner' },
        away: { id: 'cric-1101-2', name: 'Australia', odd: 2.15, marketName: 'Match Winner' },
      },
    },
  },

  // Handball
  {
    id: 'hb-1201',
    sport: 'handball',
    league: 'EHF Champions League',
    leagueCountry: 'Europe',
    leagueFlag: '🤾',
    homeTeam: 'FC Barcelona Handball',
    awayTeam: 'SC Magdeburg',
    time: '20:15 Tomorrow',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'hb-1201-1', name: 'Barcelona', odd: 1.62, marketName: 'Match Winner' },
        draw: { id: 'hb-1201-x', name: 'Draw', odd: 8.50, marketName: 'Match Winner' },
        away: { id: 'hb-1201-2', name: 'Magdeburg', odd: 2.50, marketName: 'Match Winner' },
      },
    },
  },

  // E-Sports
  {
    id: 'esp-1301',
    sport: 'esports',
    league: 'Dota 2 The International & CS2',
    leagueCountry: 'International',
    leagueFlag: '🎮',
    homeTeam: 'Team Spirit',
    awayTeam: 'Gaimin Gladiators',
    time: '18:00 Today',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'esp-1301-1', name: 'Team Spirit', odd: 1.75, marketName: 'Series Winner' },
        draw: { id: 'esp-1301-x', name: 'Decider Map 3', odd: 2.20, marketName: 'Series Winner' },
        away: { id: 'esp-1301-2', name: 'Gladiators', odd: 2.05, marketName: 'Series Winner' },
      },
    },
  },

  // Ice Hockey
  {
    id: 'ih-1401',
    sport: 'ice_hockey',
    league: 'NHL Ice Hockey',
    leagueCountry: 'USA',
    leagueFlag: '🏒',
    homeTeam: 'New York Rangers',
    awayTeam: 'Boston Bruins',
    time: '02:00 Tonight',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'ih-1401-1', name: 'NY Rangers', odd: 2.20, marketName: 'Moneyline' },
        draw: { id: 'ih-1401-x', name: 'Overtime', odd: 4.10, marketName: 'Moneyline' },
        away: { id: 'ih-1401-2', name: 'Boston Bruins', odd: 2.15, marketName: 'Moneyline' },
      },
    },
  },

  // American Football
  {
    id: 'nfl-1501',
    sport: 'american_football',
    league: 'NFL Pro Football',
    leagueCountry: 'USA',
    leagueFlag: '🏈',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'San Francisco 49ers',
    time: '21:15 Sunday',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'nfl-1501-1', name: 'Chiefs', odd: 1.80, marketName: 'Moneyline' },
        draw: { id: 'nfl-1501-x', name: 'OT', odd: 14.0, marketName: 'Moneyline' },
        away: { id: 'nfl-1501-2', name: '49ers', odd: 2.00, marketName: 'Moneyline' },
      },
    },
  },

  // Baseball
  {
    id: 'bb-1601',
    sport: 'baseball',
    league: 'MLB Major League Baseball',
    leagueCountry: 'USA',
    leagueFlag: '⚾',
    homeTeam: 'Los Angeles Dodgers',
    awayTeam: 'New York Yankees',
    time: '03:10 Tomorrow',
    status: 'upcoming',
    odds: {
      matchWinner: {
        home: { id: 'bb-1601-1', name: 'Dodgers', odd: 1.72, marketName: 'Moneyline' },
        draw: { id: 'bb-1601-x', name: 'Extra Innings', odd: 8.00, marketName: 'Moneyline' },
        away: { id: 'bb-1601-2', name: 'Yankees', odd: 2.15, marketName: 'Moneyline' },
      },
    },
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-01',
    type: 'deposit',
    amount: 1500,
    currency: 'ETB',
    method: 'Telebirr',
    date: '12 Oct 2026 10:14',
    status: 'completed',
    reference: 'TB-9281740192',
  },
  {
    id: 'tx-02',
    type: 'deposit',
    amount: 1000,
    currency: 'ETB',
    method: 'CBE Birr',
    date: '11 Oct 2026 18:22',
    status: 'completed',
    reference: 'CBE-7719208311',
  },
  {
    id: 'tx-03',
    type: 'bet_win',
    amount: 840,
    currency: 'ETB',
    method: 'Internal',
    date: '10 Oct 2026 21:45',
    status: 'completed',
    reference: 'WIN-448209',
  },
];

export const INITIAL_PLACED_BETS: PlacedBet[] = [
  {
    id: 'bet-101',
    code: 'CB-88219',
    date: 'Today 11:30',
    type: 'accumulator',
    stake: 100,
    totalOdds: 4.85,
    bonusMultiplier: 1.05,
    potentialPayout: 509.25,
    status: 'active',
    cashoutOffer: 165.5,
    currency: 'ETB',
    selections: [
      {
        matchId: 'eth-101',
        matchTitle: 'Saint George vs Ethio Coffee',
        league: 'Ethiopian Premier League',
        marketName: '1X2',
        selectionName: 'Saint George',
        odd: 2.15,
        isLive: true,
        sport: 'football',
      },
      {
        matchId: 'epl-201',
        matchTitle: 'Arsenal vs Chelsea',
        league: 'Premier League',
        marketName: '1X2',
        selectionName: 'Arsenal',
        odd: 1.25,
        isLive: true,
        sport: 'football',
      },
      {
        matchId: 'ucl-301',
        matchTitle: 'Real Madrid vs Bayern Munich',
        league: 'Champions League',
        marketName: 'Over/Under',
        selectionName: 'Over 2.5',
        odd: 1.62,
        isLive: false,
        sport: 'football',
      },
    ],
  },
  {
    id: 'bet-102',
    code: 'CB-33918',
    date: 'Yesterday 20:00',
    type: 'single',
    stake: 200,
    totalOdds: 2.1,
    bonusMultiplier: 1.0,
    potentialPayout: 420,
    status: 'won',
    cashoutOffer: 0,
    currency: 'ETB',
    selections: [
      {
        matchId: 'eth-099',
        matchTitle: 'Mekelle 70 Enderta vs Adama City',
        league: 'Ethiopian Premier League',
        marketName: '1X2',
        selectionName: 'Mekelle 70',
        odd: 2.1,
        isLive: false,
        sport: 'football',
      },
    ],
  },
];
