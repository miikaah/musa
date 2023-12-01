import { useEffect } from "react";
import { isCtrlDown } from "../util";

export const useKeyPress = (
  key: string,
  callback: (event: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== key) {
        return;
      }
      if (
        ((event?.target as HTMLElement)?.tagName === "INPUT" ||
          (event?.target as HTMLElement)?.tagName === "TEXTAREA") &&
        (!isCtrlDown(event) || !event.shiftKey)
      ) {
        return;
      }

      callback(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback]);
};
