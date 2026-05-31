import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import {
  getWorkoutDay,
  getHomeData,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Calendar, Timer, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ExerciseCard } from './_components/exercise-card';
import { StartWorkoutButton } from './_components/start-workout-button';
import { CompleteWorkoutButton } from './_components/complete-workout-button';
import { BackButton } from './_components/back-button';
import {
  WEEKDAY_LABELS,
  WEEKDAY_TITLE_LABELS,
} from '@/app/_lib/weekday-labels';

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const { id: workoutPlanId, dayId } = await params;
  const [workoutDayData, homeData, trainData] = await Promise.all([
    getWorkoutDay(workoutPlanId, dayId),
    getHomeData(dayjs().format('YYYY-MM-DD')),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect('/onboarding');

  if (workoutDayData.status !== 200) redirect('/');

  const {
    name,
    weekDay,
    estimatedDurationInSeconds,
    exercises,
    sessions,
    coverImageUrl,
  } = workoutDayData.data;

  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);
  const sortedExercises = [...exercises].sort((a, b) => a.order - b.order);

  const inProgressSession = sessions.find((s) => s.startedAt && !s.completedAt);
  const completedSession = sessions.find((s) => s.completedAt);
  const hasInProgressSession = !!inProgressSession;
  const hasCompletedSession = !!completedSession;

  const pageTitle =
    hasInProgressSession || hasCompletedSession
      ? "Today's Workout"
      : WEEKDAY_TITLE_LABELS[weekDay];

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4 pt-2 lg:h-full lg:min-h-0 lg:overflow-hidden lg:gap-6 lg:pt-5'>
      <div className='flex shrink-0 items-center justify-between'>
        <BackButton />
        <h1 className='font-heading text-lg font-semibold text-foreground'>
          {pageTitle}
        </h1>
        <div className='size-6' aria-hidden='true' />
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:min-h-0 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-stretch lg:gap-6 lg:overflow-hidden'>
        <aside className='flex min-h-0 flex-col gap-4 lg:h-full lg:overflow-hidden'>
          <div className='relative flex h-50 w-full min-h-0 flex-col items-start justify-between overflow-hidden rounded-xl p-5 lg:h-auto lg:min-h-0 lg:flex-[3]'>
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
              <div className='inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-background/16 px-2 py-1 backdrop-blur-sm'>
                <Calendar className='size-3 shrink-0 text-background' />
                <span className='font-heading text-[11px] font-semibold uppercase leading-none text-background'>
                  {WEEKDAY_LABELS[weekDay]}
                </span>
              </div>
            </div>

            <div className='relative flex w-full items-end justify-between gap-3'>
              <div className='flex flex-col gap-2'>
                <h2 className='font-heading text-2xl font-semibold leading-[1.05] text-background'>
                  {name}
                </h2>
                <div className='flex flex-wrap items-start gap-2'>
                  <div className='flex items-center gap-1'>
                    <Timer className='size-3.5 text-background/70' />
                    <span className='font-heading text-xs text-background/70'>
                      {durationInMinutes}min
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Dumbbell className='size-3.5 text-background/70' />
                    <span className='font-heading text-xs text-background/70'>
                      {exercises.length} exercises
                    </span>
                  </div>
                </div>
              </div>

              {!hasInProgressSession && !hasCompletedSession && (
                <div className='hidden shrink-0 lg:block'>
                  <StartWorkoutButton
                    workoutPlanId={workoutPlanId}
                    workoutDayId={dayId}
                  />
                </div>
              )}
              {hasCompletedSession && (
                <Button
                  variant='ghost'
                  disabled
                  className='hidden rounded-full px-4 py-2 font-heading text-sm font-semibold text-background/70 hover:bg-transparent hover:text-background/70 lg:inline-flex'
                >
                  Done!
                </Button>
              )}
            </div>
          </div>

          <div className='hidden min-h-0 flex-1 flex-col rounded-xl border border-border bg-primary/8 p-5 lg:flex lg:justify-between'>
            <div>
              <h3 className='font-heading text-sm font-semibold text-foreground'>
                Session summary
              </h3>
              <div className='mt-4 flex flex-col gap-3'>
                <div className='flex items-center justify-between font-heading text-sm'>
                  <span className='text-muted-foreground'>Estimated duration</span>
                  <span className='font-semibold text-foreground'>
                    {durationInMinutes} min
                  </span>
                </div>
                <div className='flex items-center justify-between font-heading text-sm'>
                  <span className='text-muted-foreground'>Exercises</span>
                  <span className='font-semibold text-foreground'>
                    {exercises.length}
                  </span>
                </div>
                <div className='flex items-center justify-between font-heading text-sm'>
                  <span className='text-muted-foreground'>Status</span>
                  <span className='font-semibold text-foreground'>
                    {hasCompletedSession
                      ? 'Completed'
                      : hasInProgressSession
                        ? 'In progress'
                        : 'Not started'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!hasInProgressSession && !hasCompletedSession && (
            <div className='lg:hidden'>
              <StartWorkoutButton
                workoutPlanId={workoutPlanId}
                workoutDayId={dayId}
              />
            </div>
          )}
          {hasCompletedSession && (
            <Button
              variant='ghost'
              disabled
              className='rounded-full px-4 py-2 font-heading text-sm font-semibold text-muted-foreground lg:hidden'
            >
              Done!
            </Button>
          )}

          {hasInProgressSession && inProgressSession && (
            <div className='hidden shrink-0 lg:block'>
              <CompleteWorkoutButton
                workoutPlanId={workoutPlanId}
                workoutDayId={dayId}
                sessionId={inProgressSession.id}
              />
            </div>
          )}
        </aside>

        <div className='flex min-h-0 flex-col gap-4 lg:h-full lg:overflow-hidden'>
          <div className='grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {sortedExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {hasInProgressSession && inProgressSession && (
            <div className='lg:hidden'>
              <CompleteWorkoutButton
                workoutPlanId={workoutPlanId}
                workoutDayId={dayId}
                sessionId={inProgressSession.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
