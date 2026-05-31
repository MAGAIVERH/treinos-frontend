'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TIMEZONE_OFFSET_COOKIE } from '@/app/_lib/user-calendar';

function readTimezoneOffsetCookie(): number | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TIMEZONE_OFFSET_COOKIE}=(-?\\d+)`),
  );
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function TimezoneOffsetCookie() {
  const router = useRouter();
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    const offset = new Date().getTimezoneOffset();
    const existingOffset = readTimezoneOffsetCookie();

    if (existingOffset === offset) return;

    document.cookie = `${TIMEZONE_OFFSET_COOKIE}=${offset}; path=/; max-age=31536000; SameSite=Lax`;

    if (!hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      router.refresh();
    }
  }, [router]);

  return null;
}
