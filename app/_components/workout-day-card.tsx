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
  variant?: 'default' | 'compact';
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

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-start justify-between overflow-hidden rounded-xl',
        isCompact
          ? 'aspect-[16/9] max-h-[32svh] p-4 lg:aspect-[21/9] lg:max-h-[28vh] lg:rounded-4xl'
          : 'h-50 p-5 lg:h-full lg:min-h-56',
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
      <div className='relative'>
        <div className='flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm'>
          <Calendar className='size-3.5 text-background' />
          <span className='font-heading text-xs font-semibold uppercase text-background'>
            {WEEKDAY_LABELS[weekDay]}
          </span>
        </div>
      </div>
      <div className='relative flex flex-col gap-2'>
        <h3
          className={cn(
            'font-heading font-semibold leading-[1.05] text-background',
            isCompact ? 'text-xl' : 'text-2xl',
          )}
        >
          {name}
        </h3>
        <div className='flex items-start gap-2'>
          <div className='flex items-center gap-1'>
            <Timer className='size-3.5 text-background/70' />
            <span className='font-heading text-xs text-background/70'>
              {durationInMinutes}min
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Dumbbell className='size-3.5 text-background/70' />
            <span className='font-heading text-xs text-background/70'>
              {exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
