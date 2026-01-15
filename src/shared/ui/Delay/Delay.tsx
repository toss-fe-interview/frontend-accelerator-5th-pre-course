import { useEffect, useState } from 'react';

type DelayProps = {
  children: React.ReactNode;
  ms?: number;
};

export const Delay = ({ children, ms }: DelayProps) => {
  const delayMs = ms ?? 1000;
  const [isDelay, setIsDelay] = useState(delayMs === 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelay(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return <>{isDelay ? children : null}</>;
};
