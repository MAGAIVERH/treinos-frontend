'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatOpenButton } from '@/app/_components/chat-open-button';
import { getActiveNavPage } from '@/app/_components/nav-config';

interface BottomNavProps {
  calendarHref: string | null;
}

export function BottomNav({ calendarHref }: BottomNavProps) {
  const pathname = usePathname();
  const activePage = getActiveNavPage(pathname);

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 rounded-t-4xl border border-border bg-background px-4 pt-4 pb-safe lg:hidden'>
      <Link href='/' className='p-3'>
        <House
          className={cn(
            'size-6',
            activePage === 'home' ? 'text-foreground' : 'text-muted-foreground',
          )}
        />
      </Link>
      {calendarHref ? (
        <Link href={calendarHref} className='p-3'>
          <Calendar
            className={cn(
              'size-6',
              activePage === 'calendar'
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          />
        </Link>
      ) : (
        <button type='button' className='p-3' disabled>
          <Calendar
            className={cn(
              'size-6',
              activePage === 'calendar'
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          />
        </button>
      )}
      <ChatOpenButton />
      <Link href='/stats' className='p-3'>
        <ChartNoAxesColumn
          className={cn(
            'size-6',
            activePage === 'stats'
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        />
      </Link>
      <Link href='/profile' className='p-3'>
        <UserRound
          className={cn(
            'size-6',
            activePage === 'profile'
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        />
      </Link>
    </nav>
  );
}
