import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center gap-2 rounded-xl bg-primary/8 p-3 lg:gap-5 lg:p-5',
        className,
      )}
    >
      <div className='rounded-full bg-primary/8 p-2 lg:p-2.5'>
        <Icon className='size-3.5 text-primary lg:size-4' />
      </div>
      <div className='flex w-full min-w-0 flex-col items-center gap-1 lg:gap-1.5'>
        <p className='font-heading text-base font-semibold leading-none text-foreground lg:text-2xl lg:leading-[1.15]'>
          {value}
        </p>
        <p className='text-center font-heading text-[10px] leading-tight text-muted-foreground lg:text-xs'>
          {label}
        </p>
      </div>
    </div>
  );
}
