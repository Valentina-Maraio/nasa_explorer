import { useCallback, useEffect, useRef } from 'react';

export function useAnimationSequence() {
  const timeoutIdsRef = useRef([]);
  const rafIdsRef = useRef([]);

  const clearSequenceTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
    rafIdsRef.current.forEach((id) => window.cancelAnimationFrame(id));
    rafIdsRef.current = [];
  }, []);

  useEffect(() => () => {
    clearSequenceTimers();
  }, [clearSequenceTimers]);

  return {
    timeoutIdsRef,
    rafIdsRef,
    clearSequenceTimers,
  };
}
