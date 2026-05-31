export const WEEKDAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const WEEKDAY_LABELS: Record<string, string> = {
  Monday: 'MONDAY',
  Tuesday: 'TUESDAY',
  Wednesday: 'WEDNESDAY',
  Thursday: 'THURSDAY',
  Friday: 'FRIDAY',
  Saturday: 'SATURDAY',
  Sunday: 'SUNDAY',
};

export const WEEKDAY_TITLE_LABELS: Record<string, string> = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
};

export const WEEKDAY_SHORT: Record<string, string> = {
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
  Sunday: 'SUN',
};

export function formatRestDayNames(weekDays: string[]): string {
  if (weekDays.length === 1) {
    return WEEKDAY_LABELS[weekDays[0]] ?? weekDays[0];
  }

  if (weekDays.length === 2) {
    const [first, second] = weekDays;
    return `${WEEKDAY_TITLE_LABELS[first] ?? first} — ${WEEKDAY_TITLE_LABELS[second] ?? second}`;
  }

  return weekDays
    .map((weekDay) => WEEKDAY_TITLE_LABELS[weekDay] ?? weekDay)
    .join(' · ');
}

export function formatRestDayShort(weekDays: string[]): string {
  return weekDays
    .map((weekDay) => WEEKDAY_SHORT[weekDay] ?? weekDay.slice(0, 3).toUpperCase())
    .join(' · ');
}
