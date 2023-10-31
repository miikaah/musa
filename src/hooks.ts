import { useState, useEffect, useRef } from "react";
import { isCtrlDown } from "./util";

export const useKeyPress = (
  key: number,
  callback: (event: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode !== key) return;
      if (
        ((event?.target as HTMLElement)?.tagName === "INPUT" ||
          (event?.target as HTMLElement)?.tagName === "TEXTAREA") &&
        (!isCtrlDown(event) || !event.shiftKey)
      )
        return;

      callback(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback]);
};

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

// https://usehooks.com/useDebounce/
export const useDebounce = (value: unknown, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
};

// See: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-expect-error it can not be undefined
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
