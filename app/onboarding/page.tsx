import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import {
  getConversation,
  getHomeData,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated';
import { getServerToday } from '@/app/_lib/server-timezone';
import { Chat } from '@/app/_components/chat';

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/auth');

  const { todayKey } = await getServerToday();
  const [homeData, trainData, conversation] = await Promise.all([
    getHomeData(todayKey),
    getUserTrainData(),
    getConversation(),
  ]);

  if (
    homeData.status === 200 &&
    trainData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    trainData.data
  ) {
    redirect('/');
  }

  const hasHistory =
    conversation.status === 200 && conversation.data.messages.length > 0;

  return (
    <Chat
      embedded
      initialMessage={
        hasHistory ? undefined : 'I want to start improving my health!'
      }
    />
  );
}
