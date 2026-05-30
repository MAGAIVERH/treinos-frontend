import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { ConsistencyTracker } from '../_components/consistency-tracker';
import { WorkoutDayCard } from '../_components/workout-day-card';
import { getHomeData, getUserTrainData } from '../_lib/api/fetch-generated';

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format('YYYY-MM-DD')),
    getUserTrainData(),
  ]);

  if (homeData.status === 401 || trainData.status === 401) {
    redirect('/auth');
  }

  if (homeData.status === 404) {
    redirect('/onboarding');
  }

  if (homeData.status !== 200) {
    throw new Error(`Failed to fetch home data: ${homeData.status}`);
  }

  const needsOnboarding = trainData.status === 200 && !trainData.data;
  if (needsOnboarding) redirect('/onboarding');

  const { todayWorkoutDay, workoutStreak, consistencyByDay, activeWorkoutPlanId } =
    homeData.data;
  const userName = session.data.user.name?.split(' ')[0] ?? '';
  const todayWorkoutHref = todayWorkoutDay
    ? `/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`
    : null;

  return (
    <div className='mx-auto flex w-full min-w-0 max-w-3xl shrink-0 flex-col gap-2 lg:gap-3 lg:pt-5'>
      <div className='relative flex aspect-[5/4] w-full max-w-full max-h-[44svh] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5 lg:aspect-[21/9] lg:max-h-[28vh] lg:rounded-4xl'>
        <div className='absolute inset-0' aria-hidden='true'>
          <Image
            src='/home-banner.jpg'
            alt=''
            fill
            className='object-cover'
            priority
          />
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)',
            }}
          />
        </div>

        <p className='relative text-[22px] uppercase leading-[1.15] text-background font-anton'>
          Fit.ai
        </p>

        <div className='relative flex w-full min-w-0 items-end justify-between gap-3'>
          <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
            <h1 className='truncate font-heading text-2xl font-semibold leading-[1.05] text-background lg:text-3xl'>
              Olá, {userName}
            </h1>
            <p className='font-heading text-sm leading-[1.15] text-background/70'>
              Bora treinar hoje?
            </p>
          </div>
          {todayWorkoutHref ? (
            <Link
              href={todayWorkoutHref}
              className='shrink-0 rounded-full bg-primary px-4 py-2'
            >
              <span className='font-heading text-sm font-semibold text-primary-foreground'>
                Bora!
              </span>
            </Link>
          ) : (
            <div className='shrink-0 rounded-full bg-primary px-4 py-2'>
              <span className='font-heading text-sm font-semibold text-primary-foreground'>
                Bora!
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='flex min-w-0 max-w-full shrink-0 flex-col gap-2'>
        <div className='flex min-w-0 items-center justify-between gap-3'>
          <h2 className='font-heading text-base font-semibold text-foreground'>
            Consistência
          </h2>
          <Link
            href='/stats'
            className='shrink-0 font-heading text-xs text-primary'
          >
            Ver histórico
          </Link>
        </div>

        <div className='flex h-[72px] min-w-0 items-center gap-2'>
          <div className='flex h-full flex-1 items-center rounded-xl border border-border p-3 lg:p-4'>
            <ConsistencyTracker
              consistencyByDay={consistencyByDay}
              today={today}
            />
          </div>
          <div className='flex items-center gap-2 rounded-xl bg-streak px-3 py-2'>
            <Flame className='size-5 text-streak-foreground' />
            <span className='font-heading text-base font-semibold text-foreground'>
              {workoutStreak}
            </span>
          </div>
        </div>
      </div>

      {todayWorkoutDay && (
        <div className='flex min-w-0 max-w-full shrink-0 flex-col gap-2'>
          <div className='flex min-w-0 items-center justify-between gap-3'>
            <h2 className='font-heading text-base font-semibold text-foreground'>
              Treino de Hoje
            </h2>
            <Link
              href={`/workout-plans/${activeWorkoutPlanId}`}
              className='shrink-0 font-heading text-xs text-primary'
            >
              Ver treinos
            </Link>
          </div>

          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
            className='block w-full min-w-0 max-w-full'
          >
            <WorkoutDayCard
              variant='compact'
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
