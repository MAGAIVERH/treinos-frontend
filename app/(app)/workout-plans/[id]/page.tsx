import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import {
  getWorkoutPlan,
  getHomeData,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated';
import { getServerToday } from '@/app/_lib/server-timezone';
import Image from 'next/image';
import Link from 'next/link';
import { Goal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WorkoutDayCard } from '@/app/_components/workout-day-card';
import { RestDayCard } from './_components/rest-day-card';
import {
  getDesktopGridClass,
  groupWorkoutPlanDays,
} from '@/app/_lib/group-workout-plan-days';
import { cn } from '@/lib/utils';
import { translateWorkoutLabel } from '@/app/_lib/translate-workout-label';

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const { id } = await params;
  const { todayKey } = await getServerToday();
  const [workoutPlanData, homeData, trainData] = await Promise.all([
    getWorkoutPlan(id),
    getHomeData(todayKey),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect('/onboarding');

  if (workoutPlanData.status !== 200) redirect('/');

  const { name, workoutDays } = workoutPlanData.data;
  const dayGroups = groupWorkoutPlanDays(workoutDays);
  const desktopGridClass = getDesktopGridClass(dayGroups.length);

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-2 lg:h-full lg:min-h-0 lg:overflow-hidden lg:pt-5'>
      <div className='relative flex aspect-[5/4] w-full max-w-full max-h-[44svh] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5 lg:aspect-[21/9] lg:max-h-[28vh] lg:rounded-4xl'>
        <div className='absolute inset-0' aria-hidden='true'>
          <Image
            src='/workout-plan-banner.png'
            alt=''
            fill
            className='object-cover'
            priority
          />
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
            }}
          />
        </div>

        <p className='relative text-[22px] uppercase leading-[1.15] text-background font-anton'>
          Fit.ai
        </p>

        <div className='relative flex w-full items-end justify-between'>
          <div className='flex flex-col gap-3'>
            <Badge className='gap-1 rounded-full px-2.5 py-1.5 font-heading text-xs font-semibold uppercase'>
              <Goal className='size-4' />
              {translateWorkoutLabel(name)}
            </Badge>
            <h1 className='font-heading text-2xl font-semibold leading-[1.05] text-background lg:text-3xl'>
              Workout Plan
            </h1>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'flex snap-x snap-mandatory gap-3 overflow-x-auto py-5 [-ms-overflow-style:none] [scrollbar-width:none] lg:min-h-0 lg:flex-1 lg:grid lg:items-stretch lg:gap-2 lg:overflow-hidden lg:py-3 [&::-webkit-scrollbar]:hidden',
          desktopGridClass,
        )}
      >
        {dayGroups.map((group) => {
          if (group.type === 'rest') {
            return (
              <div
                key={group.weekDays.join('-')}
                className='h-full w-[min(320px,88vw)] shrink-0 snap-start lg:min-h-0 lg:w-auto'
              >
                <RestDayCard weekDays={group.weekDays} />
              </div>
            );
          }

          const { day } = group;

          return (
            <div
              key={day.id}
              className='h-full w-[min(320px,88vw)] shrink-0 snap-start lg:min-h-0 lg:w-auto'
            >
              <Link
                href={`/workout-plans/${id}/days/${day.id}`}
                className='block h-full min-h-0'
              >
                <WorkoutDayCard
                  variant='plan'
                  name={day.name}
                  weekDay={day.weekDay}
                  estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                  exercisesCount={day.exercisesCount}
                  coverImageUrl={day.coverImageUrl}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
