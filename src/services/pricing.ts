export type RoomRateTier =
  | 'BIG_FAMILY'
  | 'LOFT_FAMILY'
  | 'FAMILY_ROOM'
  | 'FAMILY_ROOM_5PAX'
  | 'SMALL_LOFT'
  | 'STANDARD_ROOM'
  | 'PRIVATE_VILLA';

export interface RateTableRow {
  paxLabel: string;
  minPax: number;
  maxPax: number;
  weekdayRate: number; // Mon to Thu
  weekendRate: number; // Fri to Sun
}

export interface RoomTierConfig {
  name: string;
  maxPax: number;
  description: string;
  rows: RateTableRow[];
  villaExtraWeekday?: number;
  villaExtraWeekend?: number;
}

export const ROOM_TIER_CONFIGS: Record<RoomRateTier, RoomTierConfig> = {
  BIG_FAMILY: {
    name: 'Big Family Room (Room 0, 1, 12)',
    maxPax: 8,
    description: 'Up to 8 pax with spacious sleeping arrangements',
    rows: [
      { paxLabel: '1 - 5 pax', minPax: 1, maxPax: 5, weekdayRate: 2000, weekendRate: 2200 },
      { paxLabel: '6 pax', minPax: 6, maxPax: 6, weekdayRate: 2400, weekendRate: 2550 },
      { paxLabel: '7 pax', minPax: 7, maxPax: 7, weekdayRate: 2550, weekendRate: 2750 },
      { paxLabel: '8 pax', minPax: 8, maxPax: 8, weekdayRate: 2700, weekendRate: 3000 }
    ]
  },
  LOFT_FAMILY: {
    name: 'Loft Type Family (Room 2, 3)',
    maxPax: 10,
    description: 'Up to 10 pax split-level loft layout',
    rows: [
      { paxLabel: '1 - 5 pax', minPax: 1, maxPax: 5, weekdayRate: 2000, weekendRate: 2200 },
      { paxLabel: '6 pax', minPax: 6, maxPax: 6, weekdayRate: 2400, weekendRate: 2550 },
      { paxLabel: '7 pax', minPax: 7, maxPax: 7, weekdayRate: 2550, weekendRate: 2750 },
      { paxLabel: '8 pax', minPax: 8, maxPax: 8, weekdayRate: 2700, weekendRate: 3000 },
      { paxLabel: '9 pax', minPax: 9, maxPax: 9, weekdayRate: 2750, weekendRate: 3150 },
      { paxLabel: '10 pax', minPax: 10, maxPax: 10, weekdayRate: 3000, weekendRate: 3500 }
    ]
  },
  FAMILY_ROOM: {
    name: 'Family Room (Room 4, 5, 6)',
    maxPax: 3,
    description: 'Up to 3 pax comfortable family lodging',
    rows: [
      { paxLabel: '1 - 2 pax', minPax: 1, maxPax: 2, weekdayRate: 900, weekendRate: 1000 },
      { paxLabel: '3 pax', minPax: 3, maxPax: 3, weekdayRate: 1200, weekendRate: 1300 }
    ]
  },
  FAMILY_ROOM_5PAX: {
    name: 'Family Room (Room 14, 15, 16)',
    maxPax: 5,
    description: 'Up to 5 pax family room with custom day & pax rates',
    rows: [
      { paxLabel: '1 - 2 pax', minPax: 1, maxPax: 2, weekdayRate: 1000, weekendRate: 1200 },
      { paxLabel: '3 pax', minPax: 3, maxPax: 3, weekdayRate: 1200, weekendRate: 1300 },
      { paxLabel: '4 pax', minPax: 4, maxPax: 4, weekdayRate: 1400, weekendRate: 1600 },
      { paxLabel: '5 pax', minPax: 5, maxPax: 5, weekdayRate: 1500, weekendRate: 1800 }
    ]
  },
  SMALL_LOFT: {
    name: 'Small Loft Type Family (Room 7)',
    maxPax: 8,
    description: 'Up to 8 pax cozy loft setup',
    rows: [
      { paxLabel: '1 - 5 pax', minPax: 1, maxPax: 5, weekdayRate: 2000, weekendRate: 2200 },
      { paxLabel: '6 pax', minPax: 6, maxPax: 6, weekdayRate: 2400, weekendRate: 2550 },
      { paxLabel: '7 pax', minPax: 7, maxPax: 7, weekdayRate: 2550, weekendRate: 2750 },
      { paxLabel: '8 pax', minPax: 8, maxPax: 8, weekdayRate: 2700, weekendRate: 3000 }
    ]
  },
  STANDARD_ROOM: {
    name: 'Standard Room (Room 8, 9, 10, 11)',
    maxPax: 3,
    description: 'Up to 3 pax air-conditioned standard room',
    rows: [
      { paxLabel: '1 - 2 pax', minPax: 1, maxPax: 2, weekdayRate: 900, weekendRate: 1000 },
      { paxLabel: '3 pax', minPax: 3, maxPax: 3, weekdayRate: 1200, weekendRate: 1300 }
    ]
  },
  PRIVATE_VILLA: {
    name: 'Private Villa',
    maxPax: 20,
    description: 'Up to 20 pax exclusive private villa retreat',
    villaExtraWeekday: 400,
    villaExtraWeekend: 500,
    rows: [
      { paxLabel: 'Base (Up to 10 pax)', minPax: 1, maxPax: 10, weekdayRate: 7000, weekendRate: 8000 },
      { paxLabel: '11 - 20 pax (Extra/pax)', minPax: 11, maxPax: 20, weekdayRate: 7000, weekendRate: 8000 }
    ]
  }
};

/**
 * Identifies the room pricing tier based on roomNumber or room title
 */
export const getRoomPricingTier = (room: { roomNumber?: string; title?: string; category?: string }): RoomRateTier => {
  const num = String(room.roomNumber || '').trim();
  const title = (room.title || '').toLowerCase();

  if (num === 'villa' || title.includes('private villa') || title.includes('villa')) {
    return 'PRIVATE_VILLA';
  }
  if (num === '14' || num === '15' || num === '16' || title.includes('room 14') || title.includes('room 15') || title.includes('room 16')) {
    return 'FAMILY_ROOM_5PAX';
  }
  if (num === '0' || num === '1' || num === '12' || title.includes('big family')) {
    return 'BIG_FAMILY';
  }
  if (num === '2' || num === '3' || (title.includes('loft') && !title.includes('small') && (num === '2' || num === '3' || title.includes('10')))) {
    return 'LOFT_FAMILY';
  }
  if (num === '7' || title.includes('small loft')) {
    return 'SMALL_LOFT';
  }
  if (num === '4' || num === '5' || num === '6' || title.includes('family room')) {
    return 'FAMILY_ROOM';
  }
  if (num === '8' || num === '9' || num === '10' || num === '11' || title.includes('standard')) {
    return 'STANDARD_ROOM';
  }

  // Fallback check by maxGuests or title
  if (title.includes('loft')) return 'LOFT_FAMILY';
  if (title.includes('family')) return 'BIG_FAMILY';
  return 'STANDARD_ROOM';
};

/**
 * Checks if a given date string (YYYY-MM-DD) is a weekend (Friday, Saturday, Sunday)
 * In lodging standard: Friday night, Saturday night, and Sunday night are weekend rates.
 * Monday, Tuesday, Wednesday, Thursday nights are weekday rates.
 */
export const isWeekendStayDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  return day === 0 || day === 5 || day === 6;
};

export const getDayName = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Calculates the exact nightly rate for a specific room tier, guest count, and whether the night is weekend
 */
export const getNightlyRateForPax = (tier: RoomRateTier, guests: number, isWeekend: boolean): number => {
  const config = ROOM_TIER_CONFIGS[tier];
  const pax = Math.max(1, Math.min(guests, config.maxPax));

  if (tier === 'PRIVATE_VILLA') {
    const baseRate = isWeekend ? 8000 : 7000;
    const extraRate = isWeekend ? (config.villaExtraWeekend || 500) : (config.villaExtraWeekday || 400);
    if (pax <= 10) {
      return baseRate;
    }
    const extraGuests = pax - 10;
    return baseRate + (extraGuests * extraRate);
  }

  // Search in table rows
  for (const row of config.rows) {
    if (pax >= row.minPax && pax <= row.maxPax) {
      return isWeekend ? row.weekendRate : row.weekdayRate;
    }
  }

  // Fallback to highest row
  const lastRow = config.rows[config.rows.length - 1];
  return isWeekend ? lastRow.weekendRate : lastRow.weekdayRate;
};

export interface NightlyBreakdown {
  date: string;
  dayOfWeek: string;
  isWeekend: boolean;
  rate: number;
}

export interface StayCostResult {
  tier: RoomRateTier;
  nights: number;
  guests: number;
  baseTotal: number;
  cleaningFee: number;
  grandTotal: number;
  averageNightly: number;
  breakdown: NightlyBreakdown[];
}

/**
 * Calculates total stay cost based on dates (day-by-day weekday vs weekend pricing) and guest count
 */
export const calculateCustomStayPrice = (
  room: { roomNumber?: string; title?: string; category?: string; price?: number },
  checkIn: string,
  checkOut: string,
  guests: number
): StayCostResult => {
  const tier = getRoomPricingTier(room);
  const config = ROOM_TIER_CONFIGS[tier];
  const pax = Math.max(1, Math.min(guests || 1, config.maxPax));

  if (!checkIn || !checkOut) {
    const defaultRate = getNightlyRateForPax(tier, pax, false);
    return {
      tier,
      nights: 1,
      guests: pax,
      baseTotal: defaultRate,
      cleaningFee: 0,
      grandTotal: defaultRate,
      averageNightly: defaultRate,
      breakdown: [
        {
          date: checkIn || new Date().toISOString().split('T')[0],
          dayOfWeek: 'Day',
          isWeekend: false,
          rate: defaultRate
        }
      ]
    };
  }

  const startDate = new Date(checkIn + 'T00:00:00');
  const endDate = new Date(checkOut + 'T00:00:00');
  const diffTime = endDate.getTime() - startDate.getTime();
  let numNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (numNights <= 0) numNights = 1;

  const breakdown: NightlyBreakdown[] = [];
  let baseTotal = 0;

  for (let i = 0; i < numNights; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const dateStr = current.toISOString().split('T')[0];
    const isWeekend = isWeekendStayDate(dateStr);
    const dayOfWeek = getDayName(dateStr);
    const rate = getNightlyRateForPax(tier, pax, isWeekend);

    breakdown.push({
      date: dateStr,
      dayOfWeek,
      isWeekend,
      rate
    });

    baseTotal += rate;
  }

  const cleaningFee = 0; // Transparent zero extra fees, included in stay
  const grandTotal = baseTotal + cleaningFee;
  const averageNightly = Math.round(baseTotal / numNights);

  return {
    tier,
    nights: numNights,
    guests: pax,
    baseTotal,
    cleaningFee,
    grandTotal,
    averageNightly,
    breakdown
  };
};
