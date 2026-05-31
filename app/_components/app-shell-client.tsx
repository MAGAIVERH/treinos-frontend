'use client';

import { Suspense } from 'react';
import { useQueryStates, parseAsBoolean } from 'nuqs';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/app/_components/bottom-nav';
import { SidebarNav } from '@/app/_components/sidebar-nav';
import { Chat } from '@/app/_components/chat';
import { TimezoneOffsetCookie } from '@/app/_components/timezone-offset-cookie';

interface AppShellClientProps {
  children: React.ReactNode;
  calendarHref: string | null;
}

export function AppShellClient({
  children,
  calendarHref,
}: AppShellClientProps) {
  const [{ chat_open: chatOpen }] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
  });

  return (
    <div className='min-h-svh bg-background lg:h-svh lg:overflow-hidden'>
      <TimezoneOffsetCookie />
      <SidebarNav calendarHref={calendarHref} />

      <div
        className={cn(
          'flex min-h-svh flex-col pb-nav transition-[padding-right] duration-300 lg:h-full lg:min-h-0 lg:overflow-hidden lg:pl-60 lg:pb-0',
          chatOpen && 'lg:pr-[400px]',
        )}
      >
        <main className='mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col overflow-x-hidden px-5 lg:overflow-hidden lg:px-8'>
          {children}
        </main>
        <BottomNav calendarHref={calendarHref} />
      </div>

      <Suspense>
        <Chat />
      </Suspense>
    </div>
  );
}
