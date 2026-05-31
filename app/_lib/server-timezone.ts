import { cookies } from 'next/headers';

import {
  getUserTodayDateKey,
  getUserTodayDayjs,
  TIMEZONE_OFFSET_COOKIE,
} from '@/app/_lib/user-calendar';

export async function getServerTimezoneOffset(): Promise<number> {
  const cookieStore = await cookies();
  const value = cookieStore.get(TIMEZONE_OFFSET_COOKIE)?.value;
  const parsed = value ? Number(value) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getServerToday() {
  const offset = await getServerTimezoneOffset();
  return {
    offset,
    today: getUserTodayDayjs(offset),
    todayKey: getUserTodayDateKey(offset),
  };
}
