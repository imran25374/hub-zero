/**
 * Planner dates and times. Imran plans in Pakistan time (UTC+5, no daylight
 * saving); the audience for the US Amazon store is shown in US Eastern time
 * beside it. Weeks run Monday to Sunday in Pakistan time.
 */

const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const PLANNER_ZONE = "Asia/Karachi";
export const AUDIENCE_ZONE = "America/New_York";

/** The wall-clock fields of an instant in Pakistan time. */
function pkt(date: Date) {
  const shifted = new Date(date.getTime() + PKT_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: (shifted.getUTCDay() + 6) % 7, // Monday = 0
  };
}

/** Monday 00:00 Pakistan time of the week containing `date`, as an instant. */
export function weekStart(date: Date): Date {
  const { year, month, day, weekday } = pkt(date);
  return new Date(Date.UTC(year, month, day - weekday) - PKT_OFFSET_MS);
}

/** The seven day starts of a week, Monday first. */
export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * DAY_MS));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** "2026-11-23": the Pakistan-time date of an instant, used in URLs (?week=). */
export function dateKey(date: Date): string {
  const { year, month, day } = pkt(date);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Reads ?week=YYYY-MM-DD; anything else falls back to the current week. */
export function parseWeek(value: string | string[] | undefined, now: Date): Date {
  const text = Array.isArray(value) ? value[0] : value;
  const match = text?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return weekStart(now);
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) - PKT_OFFSET_MS);
  return Number.isNaN(date.getTime()) ? weekStart(now) : weekStart(date);
}

export function sameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

const formatters = {
  weekday: new Intl.DateTimeFormat("en-GB", { timeZone: PLANNER_ZONE, weekday: "long" }),
  dayMonth: new Intl.DateTimeFormat("en-GB", { timeZone: PLANNER_ZONE, day: "numeric", month: "short" }),
  full: new Intl.DateTimeFormat("en-GB", { timeZone: PLANNER_ZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  time: new Intl.DateTimeFormat("en-GB", { timeZone: PLANNER_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  audience: new Intl.DateTimeFormat("en-US", { timeZone: AUDIENCE_ZONE, hour: "numeric", minute: "2-digit" }),
  audienceDay: new Intl.DateTimeFormat("en-US", { timeZone: AUDIENCE_ZONE, weekday: "short" }),
  plannerDay: new Intl.DateTimeFormat("en-US", { timeZone: PLANNER_ZONE, weekday: "short" }),
};

export const formatWeekday = (date: Date) => formatters.weekday.format(date);
export const formatDayMonth = (date: Date) => formatters.dayMonth.format(date);
export const formatFullDate = (date: Date) => formatters.full.format(date);
/** "19:00" in Pakistan time. */
export const formatTime = (date: Date) => formatters.time.format(date);

/** "9:00 AM ET", with the US weekday when it differs from Pakistan's. */
export function formatAudienceTime(date: Date): string {
  const sameWeekday = formatters.audienceDay.format(date) === formatters.plannerDay.format(date);
  const time = formatters.audience.format(date);
  return sameWeekday ? `${time} ET` : `${formatters.audienceDay.format(date)} ${time} ET`;
}

/** Value for <input type="datetime-local">, in Pakistan time. */
export function toLocalInput(iso: string): string {
  const shifted = new Date(new Date(iso).getTime() + PKT_OFFSET_MS);
  return shifted.toISOString().slice(0, 16);
}

/** Reads a datetime-local value as Pakistan time; null if it isn't one. */
export function fromLocalInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+05:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
