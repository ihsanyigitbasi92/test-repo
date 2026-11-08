/**
 * Pure-integer civil calendar (02 §2.1.2). Dates are cosmetic and never read from the device (D-050).
 * Day numbers are "days since 1970-01-01" internally; the life keeps `calendarDay` relative to the 18th birthday.
 */
import type { Season } from '@motto/content-schema';

export interface Civil { y: number; m: number; d: number }

/** Howard Hinnant's days_from_civil (integer only). */
export function daysFromCivil(c: Civil): number {
  const y = c.m <= 2 ? c.y - 1 : c.y;
  const era = Math.floor((y >= 0 ? y : y - 399) / 400);
  const yoe = y - era * 400;
  const mp = (c.m + 9) % 12;
  const doy = Math.floor((153 * mp + 2) / 5) + c.d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function civilFromDays(z0: number): Civil {
  const z = z0 + 719468;
  const era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return { y: m <= 2 ? y + 1 : y, m, d };
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const toISO = (c: Civil): string => `${c.y}-${pad(c.m)}-${pad(c.d)}`;
export function parseISO(s: string): Civil {
  const [y, m, d] = s.split('-').map(Number);
  return { y: y!, m: m!, d: d! };
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Birthday at `age` years after `start` (18th birthday); Feb 29 falls back to Feb 28 in non-leap years. */
export function birthdayAfterYears(start: Civil, years: number): Civil {
  const y = start.y + years;
  const d = start.m === 2 && start.d === 29 && !isLeap(y) ? 28 : start.d;
  return { y, m: start.m, d };
}

export function seasonOf(month: number): Season {
  return month === 12 || month <= 2 ? 'winter' : month <= 5 ? 'spring' : month <= 8 ? 'summer' : 'autumn';
}

/**
 * Count calendar days in (fromDay, toDay] (absolute day numbers) whose day-of-month equals `dom`.
 * Walks months, so it is O(months) rather than O(days) (D-100 applyGap budget).
 */
export function countDueDays(fromDay: number, toDay: number, dom: number): number {
  if (toDay <= fromDay) return 0;
  let n = 0;
  const c = civilFromDays(fromDay + 1);
  let cur: Civil = { y: c.y, m: c.m, d: dom };
  for (;;) {
    const abs = daysFromCivil(cur);
    if (abs > toDay) break;
    if (abs > fromDay && civilFromDays(abs).m === cur.m) n++;
    cur = cur.m === 12 ? { y: cur.y + 1, m: 1, d: dom } : { y: cur.y, m: cur.m + 1, d: dom };
  }
  return n;
}
