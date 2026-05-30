import { Calendar, Zap } from 'lucide-react';
import {
  formatRestDayNames,
  formatRestDayShort,
} from '@/app/_lib/weekday-labels';

interface RestDayCardProps {
  weekDays: string[];
}

export function RestDayCard({ weekDays }: RestDayCardProps) {
  const isGrouped = weekDays.length > 1;

  return (
    <div className='flex h-56 w-full min-w-0 flex-col items-start justify-between rounded-xl bg-muted p-5 lg:h-full lg:min-h-0 lg:p-3'>
      <div className='flex min-w-0 flex-col gap-2 lg:gap-1'>
        <div className='inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-foreground/8 px-2 py-1 backdrop-blur-sm'>
          <Calendar className='size-3 shrink-0 text-foreground' />
          <span className='font-heading text-[11px] font-semibold uppercase leading-none text-foreground'>
            {formatRestDayShort(weekDays)}
          </span>
        </div>
        {isGrouped && (
          <p className='line-clamp-2 font-heading text-xs leading-snug text-muted-foreground lg:text-[10px] lg:leading-tight'>
            {formatRestDayNames(weekDays)}
          </p>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <Zap className='size-5 shrink-0 text-foreground lg:size-4' />
        <span className='font-heading text-2xl font-semibold leading-[1.05] text-foreground lg:text-lg'>
          Descanso
        </span>
      </div>
    </div>
  );
}
