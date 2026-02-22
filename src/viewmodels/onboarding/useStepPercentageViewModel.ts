// useStepPercentageViewModel.ts
import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 60;
const COMPLETE_DELAY = 900;

export function useStepPercentageViewModel() {
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          timeoutRef.current = setTimeout(() => {
            setCompleted(true);
          }, COMPLETE_DELAY);

          return 100;
        }
        return prev + 1;
      });
    }, INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function getStatusText() {
    if (progress < 20) return "Analizando tu perfil…";
    if (progress < 45) return "Ajustando tus recomendaciones…";
    if (progress < 75) return "Construyendo tu plan diario…";
    return "Todo listo";
  }

  return {
    progress,
    completed,
    getStatusText,
  };
}