'use client';

import { authClient } from '@/app/_lib/auth-client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const SignInWithGoogle = () => {
  const handleGoogleLogin = async () => {
    const response = await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'https://treinos-frontend-gold.vercel.app/',
      // ← isso faz o authClient retornar a URL em vez de redirecionar
      fetchOptions: {
        onSuccess: (ctx) => {
          if (ctx.response.redirected) {
            window.location.href = ctx.response.url;
          }
        },
      },
    });

    if (response.data?.url) {
      window.location.href = response.data.url;
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className='h-9.5 rounded-full bg-white px-6 text-black hover:bg-white/90'
    >
      <Image
        src='/google-icon.svg'
        alt=''
        width={16}
        height={16}
        className='shrink-0'
      />
      Fazer login com Google
    </Button>
  );
};
