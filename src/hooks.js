import { useEffect, useRef } from "react";
import { get } from "lodash-es";

export const useKeyPress = (key, callback) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.keyCode !== key) return;
      if (get(event, "target.tagName") !== "BODY") return;

      callback(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback]);
};

export const useAnimationFrame = callback => {
  const requestRef = useRef();

  useEffect(() => {
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      callback();
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};
