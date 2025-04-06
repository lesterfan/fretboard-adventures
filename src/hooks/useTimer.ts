import { useState, useEffect, useRef } from "react";

export const useTimer = () => {
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = () => setTimerElapsedSeconds(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimerElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { timerElapsedSeconds, resetTimer };
};
