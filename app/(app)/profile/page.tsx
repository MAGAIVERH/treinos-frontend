import { headers } from 'next/headers';
import { authClient } from '@/app/_lib/auth-client';
import { getUserTrainData, getHomeData } from '@/app/_lib/api/fetch-generated';
import dayjs from 'dayjs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Weight, Ruler, BicepsFlexed, User } from 'lucide-react';
import { LogoutButton } from './_components/logout-button';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/app/_components/app-header';

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const [trainData, homeData] = await Promise.all([
    getUserTrainData(),
    getHomeData(dayjs().format('YYYY-MM-DD')),
  ]);

  if (trainData.status !== 200) {
    throw new Error('Failed to fetch user train data');
  }

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    !trainData.data;
  if (needsOnboarding) redirect('/onboarding');

  const user = session.data.user;
  const data = trainData.data;

  const weightInKg = data ? data.weightInGrams / 1000 : null;
  const heightInCm = data?.heightInCentimeters ?? null;
  const bodyFatPercentage = data?.bodyFatPercentage ?? null;
  const age = data?.age ?? null;

  const stats = [
    { icon: Weight, value: weightInKg ?? '-', label: 'Kg' },
    { icon: Ruler, value: heightInCm ?? '-', label: 'Cm' },
    {
      icon: BicepsFlexed,
      value: bodyFatPercentage != null ? `${bodyFatPercentage}%` : '-',
      label: 'Gc',
    },
    { icon: User, value: age ?? '-', label: 'Anos' },
  ];

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <AppHeader variant='title' className='lg:hidden' />

      <div className='flex min-h-0 flex-1 flex-col gap-5 pt-5 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:pt-6'>
        <div className='flex flex-col items-center gap-5 rounded-4xl border border-border bg-primary/8 p-6 lg:sticky lg:top-6'>
          <Avatar className='size-20 lg:size-24'>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className='text-2xl'>
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-center gap-1.5 text-center'>
            <h1 className='font-heading text-lg font-semibold leading-[1.05] text-foreground lg:text-xl'>
              {user.name}
            </h1>
            <p className='font-heading text-sm leading-[1.15] text-foreground/70'>
              Plano Premium Free
            </p>
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col gap-5'>
          <div className='grid w-full grid-cols-2 gap-3 lg:grid-cols-2'>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className='flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5'
                >
                  <div className='flex items-center rounded-full bg-primary/8 p-2.25'>
                    <Icon className='size-4 text-primary' />
                  </div>
                  <div className='flex flex-col items-center gap-1.5'>
                    <span className='font-heading text-2xl font-semibold leading-[1.15] text-foreground'>
                      {stat.value}
                    </span>
                    <span className='font-heading text-xs uppercase leading-[1.4] text-muted-foreground'>
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-auto border-t border-border pt-5 lg:mt-0'>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
