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
    <div className='flex min-h-svh flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1'>
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
          className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30 lg:bg-linear-to-r lg:from-black/10 lg:via-transparent lg:to-black/40'
          aria-hidden='true'
        />

        <div className='relative z-10 flex h-full flex-col justify-between p-5 pt-12 lg:p-12 lg:pb-16'>
          <Image
            src='/fit-ai-logo.svg'
            alt='FIT.AI'
            width={85}
            height={38}
            className='lg:hidden'
          />

          <div className='hidden max-w-md lg:block'>
            <p className='font-heading text-sm font-medium uppercase tracking-[0.2em] text-white/70'>
              Personal trainer com IA
            </p>
            <h2 className='mt-4 font-heading text-4xl font-semibold leading-[1.05] text-white xl:text-5xl'>
              Treinos feitos para o seu corpo, não para a massa.
            </h2>
          </div>
        </div>
      </div>

      {/* Painel de login — coluna direita no desktop; card inferior no mobile */}
      <div className='relative z-10 flex flex-1 flex-col lg:justify-center lg:bg-background lg:px-12 lg:py-16 xl:px-20'>
        <div className='flex flex-1 flex-col items-center gap-15 rounded-t-4xl bg-primary px-5 pb-10 pt-12 lg:flex-none lg:gap-10 lg:rounded-none lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0'>
          <div className='hidden lg:block'>
            <Image src='/fit-ai-logo.svg' alt='FIT.AI' width={96} height={43} />
          </div>

          <div className='flex w-full max-w-md flex-col items-center gap-6 lg:items-start lg:gap-8'>
            <h1 className='w-full text-center font-heading text-[32px] font-semibold leading-[1.05] text-primary-foreground lg:text-left lg:text-4xl lg:leading-[1.08] lg:text-foreground xl:text-[2.75rem]'>
              O app que vai transformar a forma como você treina.
            </h1>

            <p className='hidden w-full text-center font-heading text-base leading-relaxed text-muted-foreground lg:block lg:text-left'>
              Entre com sua conta Google e monte um plano personalizado com
              nossa IA em poucos minutos.
            </p>

            <SignInWithGoogle className='w-full lg:w-auto' />
          </div>

          <p className='text-center font-heading text-xs leading-[1.4] text-primary-foreground/70 lg:text-muted-foreground'>
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
