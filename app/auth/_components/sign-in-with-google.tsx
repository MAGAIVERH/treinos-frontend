'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const SignInWithGoogle = () => {
  const handleGoogleLogin = async () => {
    const response = await fetch(
      'https://treinos-api.vercel.app/api/auth/sign-in/social',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          callbackURL: 'https://treinos-frontend-gold.vercel.app/',
        }),
        credentials: 'include', // ← salva os cookies no browser
      },
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // ← redireciona para o Google
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
