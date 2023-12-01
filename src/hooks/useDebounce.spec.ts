import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

vi.useFakeTimers();

const delay = 10;

describe("useDebounce", () => {
  it("debounces updates until passed time is greater than delay", () => {
    const { result, rerender } = renderHook(
      (props = {} as any) => useDebounce(props.value, props.delay),
      {
        initialProps: { value: "f", delay },
      },
    );

    vi.advanceTimersByTime(2);

    // Should not update to foo
    rerender({ value: "foo", delay });
    expect(result.current).toBe("f");

    act(() => {
      vi.advanceTimersByTime(12);
    });

    // Updates
    rerender({ value: "foo", delay });
    expect(result.current).toBe("foo");
  });
});
