import { renderHook } from "@testing-library/react";
import { useAnimationFrame } from "./useAnimationFrame";

// See: https://stackoverflow.com/questions/61593774/how-do-i-test-code-that-uses-requestanimationframe-in-jest
class RequestAnimationFrameMockSession {
  handleCounter = 0;
  queue = new Map();
  requestAnimationFrame(callback: any) {
    const handle = this.handleCounter++;
    this.queue.set(handle, callback);
    return handle;
  }
  cancelAnimationFrame(handle: any) {
    this.queue.delete(handle);
  }
  triggerNextAnimationFrame(time = performance.now()) {
    const nextEntry = this.queue.entries().next().value;
    if (nextEntry === undefined) return;

    const [nextHandle, nextCallback] = nextEntry;

    nextCallback(time);
    this.queue.delete(nextHandle);
  }
  triggerAllAnimationFrames(time = performance.now()) {
    while (this.queue.size > 0) this.triggerNextAnimationFrame(time);
  }
  reset() {
    this.queue.clear();
    this.handleCounter = 0;
  }
}

export const requestAnimationFrameMock = new RequestAnimationFrameMockSession();

window.requestAnimationFrame =
  requestAnimationFrameMock.requestAnimationFrame.bind(
    requestAnimationFrameMock,
  );
window.cancelAnimationFrame =
  requestAnimationFrameMock.cancelAnimationFrame.bind(
    requestAnimationFrameMock,
  );

const mockCallback = vi.fn();

describe("useAnimationFrame", () => {
  it("calls callback", () => {
    renderHook(() => useAnimationFrame(mockCallback));

    requestAnimationFrameMock.triggerNextAnimationFrame();

    expect(mockCallback).toHaveBeenCalledOnce();
  });
});
