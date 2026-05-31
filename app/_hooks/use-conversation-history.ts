'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UIMessage } from 'ai';

type ConversationHistoryState = {
  conversationId: string | null;
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | null;
  unauthorized: boolean;
};

type ConversationApiResponse = {
  conversationId: string | null;
  messages: Array<{
    id: string;
    role: UIMessage['role'];
    parts: UIMessage['parts'];
  }>;
};

function mapToUIMessages(
  messages: ConversationApiResponse['messages'],
): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts,
  }));
}

type UseConversationHistoryOptions = {
  enabled?: boolean;
};

export function useConversationHistory({
  enabled = true,
}: UseConversationHistoryOptions = {}) {
  const [state, setState] = useState<ConversationHistoryState>({
    conversationId: null,
    messages: [],
    isLoading: enabled,
    error: null,
    unauthorized: false,
  });

  const loadConversation = useCallback(async () => {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
      unauthorized: false,
    }));

    try {
      const response = await fetch('/api/ai/conversation', {
        credentials: 'include',
      });

      if (response.status === 401) {
        setState({
          conversationId: null,
          messages: [],
          isLoading: false,
          error: null,
          unauthorized: true,
        });
        return;
      }

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          `Failed to load conversation history (${response.status})${details ? `: ${details.slice(0, 120)}` : ''}`,
        );
      }

      const data = (await response.json()) as ConversationApiResponse;

      setState({
        conversationId: data.conversationId,
        messages: mapToUIMessages(data.messages),
        isLoading: false,
        error: null,
        unauthorized: false,
      });
    } catch (error) {
      setState({
        conversationId: null,
        messages: [],
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        unauthorized: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState({
        conversationId: null,
        messages: [],
        isLoading: false,
        error: null,
        unauthorized: false,
      });
      return;
    }

    loadConversation();
  }, [enabled, loadConversation]);

  return { ...state, refetch: loadConversation };
}
