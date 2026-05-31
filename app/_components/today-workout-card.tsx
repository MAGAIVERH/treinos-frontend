'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WorkoutDayCard } from '@/app/_components/workout-day-card';
import type { GetHomeData200TodayWorkoutDay } from '@/app/_lib/api/fetch-generated';

const REST_DAY_MESSAGE =
  'Today is a rest day in your plan. Take time to recover — no workout to start.';

interface TodayWorkoutCardProps {
  workoutDay: GetHomeData200TodayWorkoutDay;
}

export function TodayWorkoutCard({ workoutDay }: TodayWorkoutCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const href = `/workout-plans/${workoutDay.workoutPlanId}/days/${workoutDay.id}`;

  if (workoutDay.isRestDay) {
    return (
      <>
        <button
          type='button'
          onClick={() => dialogRef.current?.showModal()}
          className='block w-full min-w-0 max-w-full cursor-pointer text-left'
        >
          <WorkoutDayCard
            variant='compact'
            name={workoutDay.name}
            weekDay={workoutDay.weekDay}
            estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
            exercisesCount={workoutDay.exercisesCount}
            coverImageUrl={workoutDay.coverImageUrl}
          />
        </button>

        <dialog
          ref={dialogRef}
          className='fixed top-1/2 left-1/2 w-[min(calc(100%-2rem),24rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl backdrop:bg-foreground/30 open:flex open:flex-col open:gap-4'
        >
          <p className='font-heading text-base font-semibold text-foreground'>
            Rest day
          </p>
          <p className='font-heading text-sm leading-relaxed text-muted-foreground'>
            {REST_DAY_MESSAGE}
          </p>
          <Button
            type='button'
            className='self-end rounded-full px-6'
            onClick={() => dialogRef.current?.close()}
          >
            Got it
          </Button>
        </dialog>
      </>
    );
  }

  return (
    <Link href={href} className='block w-full min-w-0 max-w-full'>
      <WorkoutDayCard
        variant='compact'
        name={workoutDay.name}
        weekDay={workoutDay.weekDay}
        estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
        exercisesCount={workoutDay.exercisesCount}
        coverImageUrl={workoutDay.coverImageUrl}
      />
    </Link>
  );
}

interface TodayWorkoutCtaProps {
  workoutDay: GetHomeData200TodayWorkoutDay | undefined;
}

export function TodayWorkoutCta({ workoutDay }: TodayWorkoutCtaProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!workoutDay) {
    return (
      <div className='shrink-0 rounded-full bg-primary px-4 py-2 opacity-60'>
        <span className='font-heading text-sm font-semibold text-primary-foreground'>
          Let&apos;s go!
        </span>
      </div>
    );
  }

  if (workoutDay.isRestDay) {
    return (
      <>
        <button
          type='button'
          onClick={() => dialogRef.current?.showModal()}
          className='shrink-0 rounded-full bg-primary px-4 py-2'
        >
          <span className='font-heading text-sm font-semibold text-primary-foreground'>
            Let&apos;s go!
          </span>
        </button>

        <dialog
          ref={dialogRef}
          className='fixed top-1/2 left-1/2 w-[min(calc(100%-2rem),24rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl backdrop:bg-foreground/30 open:flex open:flex-col open:gap-4'
        >
          <p className='font-heading text-base font-semibold text-foreground'>
            Rest day
          </p>
          <p className='font-heading text-sm leading-relaxed text-muted-foreground'>
            {REST_DAY_MESSAGE}
          </p>
          <Button
            type='button'
            className='self-end rounded-full px-6'
            onClick={() => dialogRef.current?.close()}
          >
            Got it
          </Button>
        </dialog>
      </>
    );
  }

  return (
    <Link
      href={`/workout-plans/${workoutDay.workoutPlanId}/days/${workoutDay.id}`}
      className='shrink-0 rounded-full bg-primary px-4 py-2'
    >
      <span className='font-heading text-sm font-semibold text-primary-foreground'>
        Let&apos;s go!
      </span>
    </Link>
  );
}
