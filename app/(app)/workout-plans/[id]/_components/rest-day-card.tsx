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
    <div className='flex h-56 w-full flex-col items-start justify-between rounded-xl bg-muted p-5 lg:h-full lg:min-h-56'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1.5 backdrop-blur-sm'>
          <Calendar className='size-3.5 shrink-0 text-foreground' />
          <span className='font-heading text-xs font-semibold uppercase text-foreground'>
            {formatRestDayShort(weekDays)}
          </span>
        </div>
        {isGrouped && (
          <p className='font-heading text-xs leading-snug text-muted-foreground'>
            {formatRestDayNames(weekDays)}
          </p>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <Zap className='size-5 text-foreground' />
        <span className='font-heading text-2xl font-semibold leading-[1.05] text-foreground'>
          Descanso
        </span>
      </div>
    </div>
  );
}
