'use client';

import { useEffect } from 'react';
import { TIMEZONE_OFFSET_COOKIE } from '@/app/_lib/user-calendar';

export function TimezoneOffsetCookie() {
  useEffect(() => {
    const offset = new Date().getTimezoneOffset();
    document.cookie = `${TIMEZONE_OFFSET_COOKIE}=${offset}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return null;
}
