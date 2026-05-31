import dayjs from 'dayjs';

export const TIMEZONE_OFFSET_COOKIE = 'timezone-offset';

/**
 * Converts an instant to the user's calendar date (YYYY-MM-DD).
 * @param timezoneOffsetMinutes Same as `Date.getTimezoneOffset()`.
 */
export function toUserDateKey(
  instant: Date,
  timezoneOffsetMinutes: number,
): string {
  const localMs = instant.getTime() - timezoneOffsetMinutes * 60_000;
  const d = new Date(localMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getUserTodayDateKey(timezoneOffsetMinutes: number): string {
  return toUserDateKey(new Date(), timezoneOffsetMinutes);
}

export function getUserTodayDayjs(timezoneOffsetMinutes: number) {
  return dayjs(getUserTodayDateKey(timezoneOffsetMinutes));
}
