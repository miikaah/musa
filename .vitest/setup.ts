import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "vitest-dom/extend-expect";

beforeEach(() => {
  vi.clearAllMocks();
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
