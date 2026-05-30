import dayjs from 'dayjs';
import { getHomeData } from '@/app/_lib/api/fetch-generated';
import { AppShellClient } from '@/app/_components/app-shell-client';

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const homeData = await getHomeData(dayjs().format('YYYY-MM-DD'));

  const calendarHref =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : null;

  return (
    <AppShellClient calendarHref={calendarHref}>{children}</AppShellClient>
  );
}
