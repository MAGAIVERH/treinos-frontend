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

interface SidebarNavProps {
  calendarHref: string | null;
}

const NAV_LINKS = [
  { page: 'home' as const, href: '/', label: 'Home', icon: House },
  { page: 'calendar' as const, label: 'Calendar', icon: Calendar },
  { page: 'stats' as const, href: '/stats', label: 'Stats', icon: ChartNoAxesColumn },
  { page: 'profile' as const, href: '/profile', label: 'Profile', icon: UserRound },
];

export function SidebarNav({ calendarHref }: SidebarNavProps) {
  const pathname = usePathname();
  const activePage = getActiveNavPage(pathname);

  return (
    <aside className='fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-background lg:flex'>
      <div className='shrink-0 border-b border-border p-5'>
        <p className='text-[22px] uppercase leading-[1.15] text-foreground font-anton'>
          Fit.ai
        </p>
      </div>

      <nav className='flex flex-1 flex-col gap-1 overflow-y-auto p-3'>
        {NAV_LINKS.map((item) => {
          const href = item.page === 'calendar' ? calendarHref : item.href;
          const isActive = activePage === item.page;
          const Icon = item.icon;

          if (item.page === 'calendar' && !href) {
            return (
              <button
                key={item.page}
                type='button'
                disabled
                className='flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm text-muted-foreground'
              >
                <Icon className='size-5' />
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.page}
              href={href!}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm transition-colors',
                isActive
                  ? 'bg-primary/8 text-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className='size-5' />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='shrink-0 border-t border-border p-5'>
        <ChatOpenButton variant='sidebar' />
      </div>
    </aside>
  );
}
