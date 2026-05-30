'use client';

import { Sparkles } from 'lucide-react';
import { useQueryStates, parseAsBoolean, parseAsString } from 'nuqs';

interface ChatOpenButtonProps {
  variant?: 'fab' | 'sidebar';
}

export function ChatOpenButton({ variant = 'fab' }: ChatOpenButtonProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  if (variant === 'sidebar') {
    return (
      <button
        type='button'
        onClick={() => setChatParams({ chat_open: true })}
        className='flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-2.5'
      >
        <Sparkles className='size-5 text-primary-foreground' />
        <span className='font-heading text-sm font-semibold text-primary-foreground'>
          Coach AI
        </span>
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={() => setChatParams({ chat_open: true })}
      className='rounded-full bg-primary p-4'
    >
      <Sparkles className='size-6 text-primary-foreground' />
    </button>
  );
}
