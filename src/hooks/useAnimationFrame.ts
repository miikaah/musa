import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      callback();
    };

    requestRef.current = requestAnimationFrame(animate);
    // @ts-expect-error it can not be undefined
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};
