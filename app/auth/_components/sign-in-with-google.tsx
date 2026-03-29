'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const SignInWithGoogle = () => {
  const handleGoogleLogin = () => {
    // ← Redireciona o browser diretamente para a API
    // em vez de fazer uma chamada fetch/XHR
    const callbackURL = encodeURIComponent(
      'https://treinos-frontend-gold.vercel.app/',
    );
    window.location.href = `https://treinos-api.vercel.app/api/auth/signin/google?callbackURL=${callbackURL}`;
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
