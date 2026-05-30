import Image from 'next/image';
import { Calendar, Timer, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GetHomeData200TodayWorkoutDayWeekDay } from '@/app/_lib/api/fetch-generated';

const WEEKDAY_LABELS: Record<string, string> = {
  Monday: 'SEGUNDA',
  Tuesday: 'TERÇA',
  Wednesday: 'QUARTA',
  Thursday: 'QUINTA',
  Friday: 'SEXTA',
  Saturday: 'SÁBADO',
  Sunday: 'DOMINGO',
};

interface WorkoutDayCardProps {
  name: string;
  weekDay: GetHomeData200TodayWorkoutDayWeekDay;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl?: string;
  variant?: 'default' | 'compact' | 'plan';
}

export function WorkoutDayCard({
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
  variant = 'default',
}: WorkoutDayCardProps) {
  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);
  const isCompact = variant === 'compact';
  const isPlan = variant === 'plan';

  return (
    <div
      className={cn(
        'relative flex w-full min-w-0 flex-col items-start justify-between overflow-hidden rounded-xl',
        isCompact &&
          'aspect-[16/9] max-h-[32svh] p-4 lg:aspect-[21/9] lg:max-h-[28vh] lg:rounded-4xl',
        isPlan && 'h-56 p-4 lg:h-full lg:min-h-0 lg:p-3',
        !isCompact && !isPlan && 'h-56 p-5 lg:h-full lg:min-h-56',
      )}
    >
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          className='pointer-events-none object-cover'
        />
      )}
      <div className='absolute inset-0 bg-foreground/40' />
      <div className={cn('relative min-w-0', isPlan && 'w-full')}>
        <div className='flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm'>
          <Calendar className='size-3.5 shrink-0 text-background' />
          <span className='font-heading text-xs font-semibold uppercase text-background'>
            {WEEKDAY_LABELS[weekDay]}
          </span>
        </div>
      </div>
      <div
        className={cn(
          'relative flex min-w-0 flex-col gap-2',
          isPlan && 'w-full gap-1.5',
        )}
      >
        <h3
          className={cn(
            'font-heading font-semibold text-background',
            isCompact && 'text-xl leading-[1.05]',
            isPlan &&
              'line-clamp-3 text-lg leading-snug lg:text-[13px] lg:leading-[1.15] xl:text-sm',
            !isCompact && !isPlan && 'text-2xl leading-[1.05]',
          )}
        >
          {name}
        </h3>
        <div
          className={cn(
            'flex min-w-0 items-start gap-2',
            isPlan && 'flex-col gap-1',
          )}
        >
          <div className='flex shrink-0 items-center gap-1'>
            <Timer className='size-3.5 shrink-0 text-background/70' />
            <span className='font-heading text-xs text-background/70'>
              {durationInMinutes}min
            </span>
          </div>
          <div className='flex shrink-0 items-center gap-1'>
            <Dumbbell className='size-3.5 shrink-0 text-background/70' />
            <span className='font-heading text-xs text-background/70'>
              {exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
