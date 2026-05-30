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
    <div className='flex h-svh flex-col bg-primary lg:grid lg:h-auto lg:min-h-svh lg:grid-cols-2 lg:bg-background'>
      {/* Hero — metade superior no mobile, coluna esquerda no desktop */}
      <div className='relative h-1/2 min-h-0 shrink-0 overflow-hidden lg:h-auto lg:min-h-svh'>
        <Image
          src='/login-bg.png'
          alt=''
          fill
          className='object-cover object-[center_30%]'
          priority
        />
        <div
          className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/45 lg:from-black/85 lg:via-black/20 lg:to-black/50'
          aria-hidden='true'
        />

        <div className='relative z-10 flex h-full flex-col p-5 pt-safe lg:p-12 lg:pb-14'>
          <div className='flex shrink-0 justify-center pt-3 lg:pt-4'>
            <Image
              src='/fit-ai-logo.svg'
              alt='FIT.AI'
              width={85}
              height={38}
              className='shrink-0'
            />
          </div>

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

      {/* Painel de login — metade inferior no mobile, coluna direita no desktop */}
      <div className='relative flex h-1/2 min-h-0 flex-col bg-primary lg:min-h-svh lg:bg-background'>
        {/* Mobile — metade inferior com textos da versão desktop */}
        <div className='flex h-full flex-col justify-between gap-6 px-5 py-8 pb-safe lg:hidden'>
          <div className='flex flex-1 flex-col items-center justify-center text-center'>
            <p className='font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/80'>
              Entrar na plataforma
            </p>

            <h1 className='mt-3 font-heading text-[1.875rem] font-semibold leading-[1.15] text-primary-foreground'>
              Transforme a forma como você treina.
            </h1>

            <p className='mt-4 max-w-[34ch] font-heading text-[15px] leading-[1.65] text-primary-foreground/75'>
              Use sua conta Google para acessar planos personalizados criados
              pela nossa IA.
            </p>

            <div className='mt-8 w-full max-w-sm'>
              <SignInWithGoogle className='w-full' />
            </div>
          </div>

          <p className='text-center font-heading text-xs leading-[1.4] text-primary-foreground/70'>
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>

        {/* Desktop — textos centralizados na coluna branca */}
        <div className='hidden lg:flex lg:min-h-svh lg:flex-col lg:items-center lg:justify-between lg:px-16 lg:py-12 xl:px-24'>
          <div className='flex flex-1 flex-col items-center justify-center text-center'>
            <div className='w-full max-w-[22rem] xl:max-w-[24rem]'>
              <p className='font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-primary'>
                Entrar na plataforma
              </p>

              <h1 className='mt-3 font-heading text-[1.875rem] font-semibold leading-[1.15] text-foreground xl:text-[2rem]'>
                Transforme a forma como você treina.
              </h1>

              <p className='mx-auto mt-4 max-w-[34ch] font-heading text-[15px] leading-[1.65] text-muted-foreground'>
                Use sua conta Google para acessar planos personalizados criados
                pela nossa IA.
              </p>

              <div className='mt-10 flex justify-center'>
                <SignInWithGoogle />
              </div>
            </div>
          </div>

          <p className='text-center font-heading text-[11px] leading-[1.4] text-muted-foreground/80'>
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
