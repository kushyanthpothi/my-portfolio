import { useEffect } from 'react';

let globalLoadingCount = 0;

export function LoadingIndicator() {
  useEffect(() => {
    globalLoadingCount++;
    return () => {
      globalLoadingCount = Math.max(0, globalLoadingCount - 1);
    };
  }, []);

  return <div className="w-full flex-1 min-h-[50vh]" />;
}
