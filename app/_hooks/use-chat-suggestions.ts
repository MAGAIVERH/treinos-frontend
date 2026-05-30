'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const SUGGESTIONS_WITHOUT_PLAN = ['Monte meu plano de treino'];
const SUGGESTIONS_WITH_PLAN = [
  'Ajustar treino de hoje',
  'Monte meu plano de treino',
];

type HomeDataResponse = {
  activeWorkoutPlanId?: string;
};

export function useChatSuggestions() {
  const [suggestions, setSuggestions] = useState(SUGGESTIONS_WITHOUT_PLAN);

  useEffect(() => {
    const date = dayjs().format('YYYY-MM-DD');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/home/${date}`;

    fetch(url, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: HomeDataResponse | null) => {
        if (data?.activeWorkoutPlanId) {
          setSuggestions(SUGGESTIONS_WITH_PLAN);
        }
      })
      .catch(() => {});
  }, []);

  return suggestions;
}
