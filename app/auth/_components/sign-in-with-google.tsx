'use client';

import { authClient } from '@/app/_lib/auth-client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SignInWithGoogleProps {
  className?: string;
}

export const SignInWithGoogle = ({ className }: SignInWithGoogleProps) => {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className={cn(
        'h-11 rounded-full bg-white px-8 text-base text-black shadow-sm hover:bg-white/90 lg:h-12 lg:min-w-72 lg:border lg:border-border lg:shadow-md',
        className,
      )}
    >
      <Image
        src='/google-icon.svg'
        alt=''
        width={16}
        height={16}
        className='shrink-0'
      />
      Sign in with Google
    </Button>
  );
};
