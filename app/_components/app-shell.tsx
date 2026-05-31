import { getHomeData } from '@/app/_lib/api/fetch-generated';
import { AppShellClient } from '@/app/_components/app-shell-client';
import { getServerToday } from '@/app/_lib/server-timezone';

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const { todayKey } = await getServerToday();
  const homeData = await getHomeData(todayKey);

  const calendarHref =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : null;

  return (
    <AppShellClient calendarHref={calendarHref}>{children}</AppShellClient>
  );
}
