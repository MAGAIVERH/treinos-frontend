'use client';

import { CircleHelp, Zap } from 'lucide-react';
import { useQueryStates, parseAsBoolean, parseAsString } from 'nuqs';
import { Button } from '@/components/ui/button';
import type { GetWorkoutDay200ExercisesItem } from '@/app/_lib/api/fetch-generated';
import { translateWorkoutLabel } from '@/app/_lib/translate-workout-label';

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const exerciseName = translateWorkoutLabel(exercise.name);

  const handleHelp = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `How do I perform ${exerciseName} correctly?`,
    });
  };

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-border p-5'>
      <div className='flex items-center justify-between'>
        <span className='font-heading text-base font-semibold text-foreground'>
          {exerciseName}
        </span>
        <Button variant='ghost' size='icon' onClick={handleHelp}>
          <CircleHelp className='size-5 text-muted-foreground' />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground'>
          {exercise.sets} sets
        </span>
        <span className='rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground'>
          {exercise.reps} reps
        </span>
        <span className='flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground'>
          <Zap className='size-3.5' />
          {exercise.restTimeInSeconds}s
        </span>
      </div>
    </div>
  );
}
