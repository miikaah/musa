import { renderHook } from "@testing-library/react";
import { useInterval } from "./useInterval";

vi.useFakeTimers();

const mockCallback = vi.fn();
const delay = 10;

describe("useInterval", () => {
  it("calls callback after each interval", () => {
    renderHook(() => useInterval(mockCallback, delay));
    expect(mockCallback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(delay + 1);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(delay / 2);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(delay);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
