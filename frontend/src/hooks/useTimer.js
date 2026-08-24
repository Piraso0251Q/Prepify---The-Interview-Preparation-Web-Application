import { useState, useEffect, useRef, useCallback } from "react";

export const useTimer = (initialSeconds, onExpire) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((s = initialSeconds) => {
    setIsRunning(false);
    setSeconds(s);
    expiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onExpire]);

  const isWarning = seconds <= 300 && seconds > 0;   // under 5 min
  const isDanger  = seconds <= 60 && seconds > 0;    // under 1 min

  return { seconds, isRunning, isWarning, isDanger, start, pause, reset };
};
