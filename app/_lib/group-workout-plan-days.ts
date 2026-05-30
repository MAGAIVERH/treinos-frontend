import type { GetWorkoutPlan200WorkoutDaysItem } from '@/app/_lib/api/fetch-generated';
import { WEEKDAY_ORDER } from '@/app/_lib/weekday-labels';

export type WorkoutPlanDayGroup =
  | { type: 'workout'; day: GetWorkoutPlan200WorkoutDaysItem }
  | {
      type: 'rest';
      weekDays: GetWorkoutPlan200WorkoutDaysItem['weekDay'][];
      days: GetWorkoutPlan200WorkoutDaysItem[];
    };

export function groupWorkoutPlanDays(
  days: GetWorkoutPlan200WorkoutDaysItem[],
): WorkoutPlanDayGroup[] {
  const sorted = [...days].sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekDay as (typeof WEEKDAY_ORDER)[number]) -
      WEEKDAY_ORDER.indexOf(b.weekDay as (typeof WEEKDAY_ORDER)[number]),
  );

  const groups: WorkoutPlanDayGroup[] = [];

  for (const day of sorted) {
    if (day.isRest) {
      const last = groups.at(-1);

      if (last?.type === 'rest') {
        last.weekDays.push(day.weekDay);
        last.days.push(day);
      } else {
        groups.push({ type: 'rest', weekDays: [day.weekDay], days: [day] });
      }
    } else {
      groups.push({ type: 'workout', day });
    }
  }

  return groups;
}

export function getDesktopGridClass(itemCount: number): string {
  if (itemCount <= 3) return 'lg:grid-cols-3';
  if (itemCount === 4) return 'lg:grid-cols-4';
  if (itemCount === 5) return 'lg:grid-cols-5';
  if (itemCount === 6) return 'lg:grid-cols-6';
  if (itemCount === 7) return 'lg:grid-cols-4';
  return 'lg:grid-cols-5';
}
