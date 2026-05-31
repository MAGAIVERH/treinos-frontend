'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const SUGGESTIONS_WITHOUT_PLAN = ['Build my workout plan'];
const SUGGESTIONS_WITH_PLAN = [
  "Adjust today's workout",
  'Build my workout plan',
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
