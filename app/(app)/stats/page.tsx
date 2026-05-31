import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import {
  getStats,
  getHomeData,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated';
import { getServerToday } from '@/app/_lib/server-timezone';
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

  const { today, todayKey } = await getServerToday();
  const from = today.startOf('year').format('YYYY-MM-DD');
  const to = todayKey;

  const [statsResponse, homeData, trainData] = await Promise.all([
    getStats({ from, to }),
    getHomeData(todayKey),
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
    <div className='flex min-h-0 flex-1 flex-col gap-3 pt-2 lg:h-full lg:min-h-0 lg:overflow-hidden lg:gap-6 lg:pt-5'>
      <AppHeader variant='title' className='lg:hidden' />

      <StreakBanner workoutStreak={workoutStreak} />

      <div className='flex flex-col gap-3 lg:gap-6'>
        <h2 className='font-heading text-lg font-semibold text-foreground'>
          Consistency
        </h2>

        <StatsHeatmap consistencyByDay={consistencyByDay} today={today} />

        <div className='grid grid-cols-3 gap-2 lg:gap-4'>
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
