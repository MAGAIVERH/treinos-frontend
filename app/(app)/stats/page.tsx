import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import {
  getStats,
  getHomeData,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated';
import dayjs from 'dayjs';
import { CircleCheck, CirclePercent, Hourglass } from 'lucide-react';
import { StreakBanner } from './_components/streak-banner';
import { StatsHeatmap } from './_components/stats-heatmap';
import { StatCard } from './_components/stat-card';
import { AppHeader } from '@/app/_components/app-header';

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${minutes.toString().padStart(2, '0')}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const today = dayjs();
  const from = today.subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
  const to = today.endOf('month').format('YYYY-MM-DD');

  const [statsResponse, homeData, trainData] = await Promise.all([
    getStats({ from, to }),
    getHomeData(today.format('YYYY-MM-DD')),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect('/onboarding');

  if (statsResponse.status !== 200) {
    throw new Error('Failed to fetch stats');
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data;

  return (
    <div className='flex min-h-0 flex-1 flex-col lg:h-full lg:min-h-0 lg:overflow-hidden'>
      <AppHeader variant='title' className='lg:hidden' />

      <div className='pb-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pb-4'>
        <StreakBanner workoutStreak={workoutStreak} />
      </div>

      <div className='flex flex-col gap-3 lg:gap-6'>
        <h2 className='font-heading text-lg font-semibold text-foreground'>
          Consistency
        </h2>

        <StatsHeatmap consistencyByDay={consistencyByDay} today={today} />

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4'>
          <StatCard
            icon={CircleCheck}
            value={String(completedWorkoutsCount)}
            label='Workouts Completed'
          />
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(conclusionRate * 100)}%`}
            label='Completion Rate'
          />
          <StatCard
            icon={Hourglass}
            value={formatTotalTime(totalTimeInSeconds)}
            label='Total Time'
          />
        </div>
      </div>
    </div>
  );
}
