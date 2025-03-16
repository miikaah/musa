import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      callback();
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef && requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
};
