'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DEFAULT_HERO_GRADIENT =
  'linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)';

type AppHeaderHeroProps = {
  variant: 'hero';
  imageSrc: string;
  imageAlt?: string;
  gradient?: string;
  className?: string;
  children: React.ReactNode;
};

type AppHeaderTitleProps = {
  variant: 'title';
  className?: string;
};

type AppHeaderBackProps = {
  variant: 'back';
  title: string;
  className?: string;
};

export type AppHeaderProps =
  | AppHeaderHeroProps
  | AppHeaderTitleProps
  | AppHeaderBackProps;

function HeaderBackButton() {
  const router = useRouter();

  return (
    <Button variant='ghost' size='icon' onClick={() => router.back()}>
      <ChevronLeft className='size-6 text-foreground' />
    </Button>
  );
}

function HeroHeader({
  imageSrc,
  imageAlt = '',
  gradient = DEFAULT_HERO_GRADIENT,
  className,
  children,
}: Omit<AppHeaderHeroProps, 'variant'>) {
  return (
    <div
      className={cn(
        'relative flex aspect-[5/4] w-full max-w-full max-h-[44svh] shrink-0 flex-col overflow-hidden rounded-b-4xl lg:aspect-[21/9] lg:max-h-[28vh] lg:rounded-4xl',
        className,
      )}
    >
      <div className='absolute inset-0' aria-hidden='true'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover'
          priority
        />
        <div
          className='absolute inset-0'
          style={{ backgroundImage: gradient }}
        />
      </div>

      <div className='relative flex flex-1 flex-col items-start justify-between px-5 pb-10 pt-safe'>
        <p className='text-[22px] uppercase leading-[1.15] text-background font-anton'>
          Fit.ai
        </p>
        {children}
      </div>
    </div>
  );
}

function TitleHeader({ className }: Omit<AppHeaderTitleProps, 'variant'>) {
  return (
    <div
      className={cn(
        'flex min-h-14 items-center pt-safe lg:min-h-16',
        className,
      )}
    >
      <p className='text-[22px] uppercase leading-[1.15] text-foreground font-anton'>
        Fit.ai
      </p>
    </div>
  );
}

function BackHeader({
  title,
  className,
}: Omit<AppHeaderBackProps, 'variant'>) {
  return (
    <div className={cn('pt-safe', className)}>
      <div className='flex items-center justify-between py-4 lg:py-5'>
        <HeaderBackButton />
        <h1 className='font-heading text-lg font-semibold text-foreground'>
          {title}
        </h1>
        <div className='size-6' aria-hidden='true' />
      </div>
    </div>
  );
}

export function AppHeader(props: AppHeaderProps) {
  switch (props.variant) {
    case 'hero':
      return <HeroHeader {...props} />;
    case 'title':
      return <TitleHeader {...props} />;
    case 'back':
      return <BackHeader {...props} />;
  }
}
