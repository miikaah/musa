import { fireEvent, renderHook } from "@testing-library/react";
import { useKeyPress } from "./useKeyPress";

const key = "a";
const mockCallback = vi.fn();

describe("useKeyPress", () => {
  it("calls callback", () => {
    renderHook(() => useKeyPress(key, mockCallback));

    fireEvent.keyDown(window, { key });

    expect(mockCallback).toHaveBeenCalledWith(
      new KeyboardEvent({
        isTrusted: false,
      } as any),
    );
  });

  it("does not call callback when key is not the same as specified", () => {
    renderHook(() => useKeyPress("b", mockCallback));

    fireEvent.keyDown(window, { key });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("does not call callback when target is input", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    renderHook(() => useKeyPress(key, mockCallback));

    fireEvent.keyDown(input, { key });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("does not call callback when target is textarea", () => {
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    renderHook(() => useKeyPress(key, mockCallback));

    fireEvent.keyDown(input, { key });

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
