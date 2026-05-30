import Image from 'next/image';
import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import { SignInWithGoogle } from './_components/sign-in-with-google';

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect('/');

  return (
    <div className='flex min-h-svh flex-col lg:grid lg:grid-cols-2 lg:grid-rows-1'>
      {/* Hero — coluna esquerda no desktop; topo no mobile */}
      <div className='relative min-h-[42svh] shrink-0 overflow-hidden lg:min-h-svh'>
        <Image
          src='/login-bg.png'
          alt=''
          fill
          className='object-cover object-[center_30%]'
          priority
        />
        <div
          className='absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/40 lg:bg-linear-to-t lg:from-black/90 lg:via-black/20 lg:to-black/50'
          aria-hidden='true'
        />

        <div className='relative z-10 flex h-full flex-col p-5 pt-12 lg:p-12 lg:pb-14'>
          <Image
            src='/fit-ai-logo.svg'
            alt='FIT.AI'
            width={85}
            height={38}
            className='lg:hidden'
          />

          <div className='mt-auto hidden max-w-lg lg:block'>
            <p className='font-heading text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60'>
              Personal trainer com IA
            </p>
            <h2 className='mt-3 font-heading text-[2.125rem] font-semibold leading-[1.12] text-white xl:text-[2.5rem] xl:leading-[1.1]'>
              Treinos feitos para o seu corpo, não para a massa.
            </h2>
          </div>
        </div>
      </div>

      {/* Painel de login */}
      <div className='relative z-10 flex flex-1 flex-col lg:min-h-svh lg:bg-background'>
        {/* Mobile */}
        <div className='flex flex-1 flex-col items-center gap-15 rounded-t-4xl bg-primary px-5 pb-10 pt-12 lg:hidden'>
          <div className='flex w-full max-w-md flex-col items-center gap-6'>
            <h1 className='w-full text-center font-heading text-[32px] font-semibold leading-[1.05] text-primary-foreground'>
              O app que vai transformar a forma como você treina.
            </h1>
            <SignInWithGoogle className='w-full' />
          </div>
          <p className='text-center font-heading text-xs leading-[1.4] text-primary-foreground/70'>
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>

        {/* Desktop */}
        <div className='hidden lg:flex lg:min-h-svh lg:flex-col lg:justify-between lg:px-16 lg:py-12 xl:px-24'>
          <div className='flex flex-1 items-center'>
            <div className='w-full max-w-[22rem] xl:max-w-[24rem]'>
              <p
                className='text-[2rem] leading-none tracking-[0.04em] text-foreground'
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                FIT.AI
              </p>

              <div className='mt-12 border-t border-border pt-10'>
                <p className='font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-primary'>
                  Entrar na plataforma
                </p>

                <h1 className='mt-3 font-heading text-[1.875rem] font-semibold leading-[1.15] text-foreground xl:text-[2rem]'>
                  Transforme a forma como você treina.
                </h1>

                <p className='mt-4 max-w-[34ch] font-heading text-[15px] leading-[1.65] text-muted-foreground'>
                  Use sua conta Google para acessar planos personalizados criados
                  pela nossa IA.
                </p>

                <div className='mt-10'>
                  <SignInWithGoogle />
                </div>
              </div>
            </div>
          </div>

          <p className='font-heading text-[11px] leading-[1.4] text-muted-foreground/80'>
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
