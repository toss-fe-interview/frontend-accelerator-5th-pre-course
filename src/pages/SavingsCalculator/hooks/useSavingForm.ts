import { useState } from 'react';

export const useSavingForm = () => {
  const [목표금액, set목표금액] = useState<string>('');
  const [월납입액, set월납입액] = useState<string>('');
  const [저축기간, set저축기간] = useState<6 | 12 | 24>(12);

  return {
    values: {
      목표금액,
      월납입액,
      저축기간,
    },
    handlers: {
      set목표금액,
      set월납입액,
      set저축기간,
    },
  };
};
