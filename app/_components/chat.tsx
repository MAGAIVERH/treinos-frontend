'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useQueryStates, parseAsBoolean, parseAsString } from 'nuqs';
import { ArrowUp, Loader2, Sparkles, X } from 'lucide-react';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useConversationHistory } from '@/app/_hooks/use-conversation-history';
import { useChatSuggestions } from '@/app/_hooks/use-chat-suggestions';

const chatFormSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

interface ChatProps {
  embedded?: boolean;
  initialMessage?: string;
}

interface ChatContentProps {
  embedded?: boolean;
  initialMessage?: string;
  conversationId: string | null;
  initialMessages: UIMessage[];
  onClose: () => void;
}

interface ChatResponsiveShellProps {
  onClose: () => void;
  children: React.ReactNode;
}

function ChatResponsiveShell({ onClose, children }: ChatResponsiveShellProps) {
  return (
    <>
      <button
        type='button'
        aria-label='Fechar chat'
        className='fixed inset-0 z-60 bg-foreground/30 lg:hidden'
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed z-[60] flex flex-col overflow-hidden border border-border bg-background shadow-xl',
          'inset-x-3 top-20 bottom-0 rounded-t-4xl',
          'lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:bottom-0 lg:z-50 lg:w-[400px] lg:rounded-none lg:border-0 lg:border-l',
        )}
      >
        {children}
      </div>
    </>
  );
}

function ChatHeader({
  embedded,
  onClose,
}: {
  embedded?: boolean;
  onClose: () => void;
}) {
  return (
    <div className='flex shrink-0 items-center justify-between border-b border-border p-5'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3'>
          <Sparkles className='size-4.5 text-primary' />
        </div>
        <div className='flex flex-col gap-1.5'>
          <span className='font-heading text-base font-semibold text-foreground'>
            Coach AI
          </span>
          <div className='flex items-center gap-1'>
            <div className='size-2 rounded-full bg-online' />
            <span className='font-heading text-xs text-primary'>Online</span>
          </div>
        </div>
      </div>
      {embedded ? (
        <Button variant='ghost' size='sm' asChild>
          <Link href='/'>Acessar FIT.AI</Link>
        </Button>
      ) : (
        <Button variant='ghost' size='icon' onClick={onClose}>
          <X className='size-6 text-foreground' />
        </Button>
      )}
    </div>
  );
}

function ChatLoadingState({
  embedded,
  onClose,
}: {
  embedded?: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col bg-background',
        embedded && 'h-svh',
      )}
    >
      <ChatHeader embedded={embedded} onClose={onClose} />
      <div className='flex flex-1 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
      </div>
    </div>
  );
}

function ChatContent({
  embedded = false,
  initialMessage,
  conversationId,
  initialMessages,
  onClose,
}: ChatContentProps) {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });
  const suggestedMessages = useChatSuggestions();

  const { messages, sendMessage, status } = useChat({
    id: conversationId ?? 'pending-conversation',
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `/api/ai`,
      credentials: 'include',
    }),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: '' },
  });

  const messageValue = useWatch({
    control: form.control,
    name: 'message',
    defaultValue: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    if (
      embedded &&
      initialMessage &&
      initialMessages.length === 0 &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [embedded, initialMessage, initialMessages.length, sendMessage]);

  useEffect(() => {
    if (
      !embedded &&
      chatParams.chat_open &&
      chatParams.chat_initial_message &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatParams.chat_initial_message });
      setChatParams({ chat_initial_message: null });
    }
  }, [
    embedded,
    chatParams.chat_open,
    chatParams.chat_initial_message,
    sendMessage,
    setChatParams,
  ]);

  useEffect(() => {
    if (!embedded && !chatParams.chat_open) {
      initialMessageSentRef.current = false;
    }
  }, [embedded, chatParams.chat_open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (values: ChatFormValues) => {
    sendMessage({ text: values.message });
    form.reset();
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isStreaming = status === 'streaming';
  const isLoading = status === 'submitted' || isStreaming;

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col bg-background',
        embedded && 'h-svh',
      )}
    >
      <ChatHeader embedded={embedded} onClose={onClose} />

      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'assistant'
                ? 'flex flex-col items-start pl-5 pr-15 pt-5'
                : 'flex flex-col items-end pl-15 pr-5 pt-5'
            }
          >
            <div
              className={
                message.role === 'assistant'
                  ? 'rounded-xl bg-secondary p-3'
                  : 'rounded-xl bg-primary p-3'
              }
            >
              {message.role === 'assistant' ? (
                message.parts.map((part, index) =>
                  part.type === 'text' ? (
                    <Streamdown
                      key={index}
                      isAnimating={
                        isStreaming &&
                        messages[messages.length - 1]?.id === message.id
                      }
                      className='font-heading text-sm leading-relaxed text-foreground'
                    >
                      {part.text}
                    </Streamdown>
                  ) : null,
                )
              ) : (
                <p className='font-heading text-sm leading-relaxed text-primary-foreground'>
                  {message.parts
                    .filter((part) => part.type === 'text')
                    .map(
                      (part) => (part as { type: 'text'; text: string }).text,
                    )
                    .join('')}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='shrink-0 border-t border-border bg-background'>
        {messages.length === 0 && (
          <div className='flex gap-2.5 overflow-x-auto px-5 pt-3'>
            {suggestedMessages.map((suggestion) => (
              <button
                key={suggestion}
                type='button'
                onClick={() => handleSuggestion(suggestion)}
                className='whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 font-heading text-sm text-foreground'
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex items-center gap-2 p-5'
          >
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Digite sua mensagem'
                      className='rounded-full border-border bg-secondary px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={!messageValue.trim() || isLoading}
              size='icon'
              className='size-10.5 shrink-0 rounded-full'
            >
              <ArrowUp className='size-5' />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export function Chat({ embedded = false, initialMessage }: ChatProps) {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });
  const { conversationId, messages: initialMessages, isLoading, unauthorized } =
    useConversationHistory();

  const handleClose = () => {
    setChatParams({ chat_open: false, chat_initial_message: null });
  };

  useEffect(() => {
    if (unauthorized) {
      setChatParams({ chat_open: false, chat_initial_message: null });
    }
  }, [unauthorized, setChatParams]);

  if (!embedded && !chatParams.chat_open) return null;

  const panel = isLoading ? (
    <ChatLoadingState embedded={embedded} onClose={handleClose} />
  ) : (
    <ChatContent
      embedded={embedded}
      initialMessage={initialMessage}
      conversationId={conversationId}
      initialMessages={initialMessages}
      onClose={handleClose}
    />
  );

  if (embedded) return panel;

  return <ChatResponsiveShell onClose={handleClose}>{panel}</ChatResponsiveShell>;
}
